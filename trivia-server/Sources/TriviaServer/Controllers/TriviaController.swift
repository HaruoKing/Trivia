import Vapor
import Fluent

struct TriviaController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let trivia = routes.grouped("trivia")
        trivia.post("register", use: registerPlayer)
        trivia.get("questions", use: getQuestions)
        trivia.post("answer", use: submitAnswer)
    }

    func registerPlayer(req: Request) async throws -> Player {
        let input = try req.content.decode(Player.self)
        let player = Player(username: input.username)
        try await player.save(on: req.db)
        return player
    }

    func getQuestions(req: Request) async throws -> [Question] {
        try await Question.query(on: req.db).all()
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
