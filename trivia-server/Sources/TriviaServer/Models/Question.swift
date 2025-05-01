import Fluent
import Vapor

enum TriviaQuestionType: String, Codable {
    case multipleChoice
    case text
}

final class Question: Model, Content, @unchecked Sendable{
    static let schema = "questions"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "text")
    var text: String

    @Field(key: "options")
    var options: [String]

    @Field(key: "correctAnswer")
    var correctAnswer: String

    @Enum(key: "type")
    var type: TriviaQuestionType

    @OptionalField(key: "hint")
    var hint: String?

    init() {}

    init(id: UUID? = nil, text: String, options: [String], correctAnswer: String, type: TriviaQuestionType, hint: String? = nil) {
        self.id = id
        self.text = text
        self.options = options
        self.correctAnswer = correctAnswer
        self.type = type
        self.hint = hint
    }
}
