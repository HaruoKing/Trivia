import Fluent
import Vapor

final class Question: Model, Content, @unchecked Sendable {
    static let schema = "questions"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "text")
    var text: String

    @Field(key: "options")
    var options: [String]

    @Field(key: "correctAnswer")
    var correctAnswer: String

    init() {}

    init(id: UUID? = nil, text: String, options: [String], correctAnswer: String) {
        self.id = id
        self.text = text
        self.options = options
        self.correctAnswer = correctAnswer
    }
}
