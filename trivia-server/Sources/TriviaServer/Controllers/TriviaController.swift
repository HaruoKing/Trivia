import Vapor
import Fluent

struct TriviaController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let trivia = routes.grouped("trivia")
        trivia.post("register", use: registerPlayer)
        trivia.get("questions", use: getQuestions)
        trivia.post("answer", use: submitAnswer)
        trivia.get("player", ":id", use: getPlayer)
        trivia.get("players", use: getAllPlayers)
        trivia.post("seed", use: seedTrivia)
        trivia.get("game-state", use: getGameState)
        trivia.post("start", use: startGame)
        trivia.get("players/finished", use: checkAllPlayersFinished)
        trivia.get("players/active", use: getActivePlayers)
        // FIX: Wait on questionID, NOT questionNumber/index!
        trivia.get("waiting", ":questionID", use: getWaitingPlayers)
    }
    
    func registerPlayer(req: Request) async throws -> Player {
        let input = try req.content.decode(PlayerCreateDTO.self)
        let player = Player(username: input.username, score: 0)
        try await player.save(on: req.db)
        return player
    }
    
    /// Fix: Check with questionID, not index!
    func getWaitingPlayers(req: Request) async throws -> [String] {
        guard let questionID = req.parameters.get("questionID", as: UUID.self) else {
            throw Abort(.badRequest, reason: "Missing question ID")
        }
        // Find question
        guard let question = try await Question.find(questionID, on: req.db) else {
            throw Abort(.notFound, reason: "No such question")
        }
        print("🔍 [Waiting] DB Question ID: \(question.id!.uuidString)")
        
        // Get all players
        let players = try await Player.query(on: req.db).all()
        // Get all answers for this question (get playerIDs)
        let answeredPlayerIDs = try await Answer.query(on: req.db)
            .filter(\.$question.$id == questionID)
            .all()
            .map { $0.$player.id }
        print("✅ [Answered IDs]: \(answeredPlayerIDs.map { $0.uuidString })")
        
        // Find which players haven't answered
       let unansweredNames: [String] = players.compactMap { player in
    guard let id = player.id, !answeredPlayerIDs.contains(id) else {
        return nil
    }
    return player.username
}
        print("❌ [Unanswered]: \(unansweredNames)")
        return unansweredNames
    }
    
    func getActivePlayers(req: Request) async throws -> [Player] {
        try await Player.query(on: req.db)
            .filter(\.$finished == false)
            .all()
    }
    
    func checkAllPlayersFinished(req: Request) async throws -> Bool {
        let players = try await Player.query(on: req.db).all()
        return players.allSatisfy { $0.finished }
    }
    
    func getQuestions(req: Request) async throws -> [Question] {
        // Return questions with their IDs!
        try await Question.query(on: req.db).all()
    }
    
    func getPlayer(req: Request) async throws -> Player {
        guard let id = req.parameters.get("id", as: UUID.self),
                let player = try await Player.find(id, on: req.db) else {
            throw Abort(.notFound)
        }
        return player
    }
    
    func getAllPlayers(req: Request) async throws -> [Player] {
        try await Player.query(on: req.db)
            .sort(\.$score, .descending)
            .all()
    }
    
    func seedTrivia(req: Request) async throws -> HTTPStatus {
        try await TriviaSeeder.seed(on: req.db)
        return .ok
    }
    
    func getGameState(req: Request) async throws -> GameState {
        guard let state = try await GameState.query(on: req.db).first() else {
            throw Abort(.notFound)
        }
        return state
    }
    
    func startGame(req: Request) async throws -> HTTPStatus {
        struct AdminStartPayload: Content { let password: String }
        let payload = try req.content.decode(AdminStartPayload.self)
        guard payload.password == "helloworld" else {
            throw Abort(.unauthorized, reason: "Invalid admin password.")
        }
        guard let state = try await GameState.query(on: req.db).first() else {
            throw Abort(.notFound)
        }
        state.started = true
        try await state.save(on: req.db)
        return .ok
    }

    struct AnswerSubmission: Content {
        let playerID: UUID
        let questionID: UUID
        let answer: String
    }

    func submitAnswer(req: Request) async throws -> HTTPStatus {
        let submission = try req.content.decode(AnswerSubmission.self)
        guard let player = try await Player.find(submission.playerID, on: req.db),
              let question = try await Question.find(submission.questionID, on: req.db)
        else {
            throw Abort(.notFound)
        }
        print("📝 [Submit] Player: \(player.username) (\(player.id!.uuidString))")
        print("📝 [Submit] Question: \(question.id!.uuidString)")
        
        // Prevent duplicate answers
        let alreadyAnswered = try await Answer.query(on: req.db)
            .filter(\.$player.$id == player.id!)
            .filter(\.$question.$id == question.id!)
            .first()
        if alreadyAnswered != nil {
            print("⚠️ [Duplicate] Player already answered")
            return .ok
        }
        
        // Save answer
        let answer = Answer(playerID: player.id!, questionID: question.id!, answer: submission.answer)
        try await answer.save(on: req.db)
        print("✅ [Saved] Answer ID: \(answer.id?.uuidString ?? "unknown")")
        
        // Score check
        if submission.answer.lowercased().trimmingCharacters(in: .whitespacesAndNewlines) ==
            question.correctAnswer.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        {
            player.score += 5
            print("🏆 [Score] Correct! \(player.username)'s new score: \(player.score)")
        } else {
            print("❌ [Score] Incorrect by \(player.username)")
        }
        // Last question logic (optional, stays as is)
        let totalQuestions = try await Question.query(on: req.db).count()
        let playerAnswersTotal = try await Answer.query(on: req.db).filter(\.$player.$id == player.id!).count()
        if playerAnswersTotal == totalQuestions {
            player.finished = true
            print("✅ [Finish] \(player.username) completed all questions.")
        }
        try await player.save(on: req.db)
        return .ok
    }
}