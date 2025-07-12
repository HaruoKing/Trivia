import Fluent
import Vapor


final class Player: Model, Content, @unchecked Sendable {
    static let schema = "players"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "username")
    var username: String

    @Field(key: "score")
    var score: Int

    @Field(key: "finished")
    var finished: Bool

    init() {}

    init(id: UUID? = nil, username: String, score: Int = 0, finished: Bool = false) {
    self.id = id
    self.username = username
    self.score = score
    self.finished = finished
}
}
