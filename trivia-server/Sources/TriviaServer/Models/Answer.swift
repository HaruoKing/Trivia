import Vapor
import Fluent

final class Answer: Model, Content, @unchecked Sendable {
    static let schema = "answers"

    @ID(key: .id)
    var id: UUID?

    @Parent(key: "player_id")
    var player: Player

    @Parent(key: "question_id")
    var question: Question

    @Field(key: "answer")
    var answer: String

    init() {}

    init(playerID: UUID, questionID: UUID, answer: String) {
        self.$player.id = playerID
        self.$question.id = questionID
        self.answer = answer
    }
}
