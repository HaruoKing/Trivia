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

    }

    func registerPlayer(req: Request) async throws -> Player {
    let input = try req.content.decode(PlayerCreateDTO.self)

    let player = Player(username: input.username, score: 0)
    try await player.save(on: req.db)

    return player
}


    func getQuestions(req: Request) async throws -> [Question] {
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
    struct AdminStartPayload: Content {
        let password: String
    }

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
              let question = try await Question.find(submission.questionID, on: req.db) else {
            throw Abort(.notFound)
        }

        if submission.answer.lowercased().trimmingCharacters(in: .whitespacesAndNewlines) ==
            question.correctAnswer.lowercased().trimmingCharacters(in: .whitespacesAndNewlines) {
            player.score += 5
            try await player.save(on: req.db)
        }

        return .ok
    }
}
