import Vapor
import Fluent

final class GameState: Model, Content, @unchecked Sendable {
    static let schema = "game_state"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "started")
    var started: Bool

    init() {}

    init(id: UUID? = nil, started: Bool = false) {
        self.id = id
        self.started = started
    }
}
