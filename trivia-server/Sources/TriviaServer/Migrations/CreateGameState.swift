import Fluent

struct CreateGameState: AsyncMigration {
    func prepare(on database: Database) async throws {
        try await database.schema("game_state")
            .id()
            .field("started", .bool, .required)
            .create()

        // Insert default state
        let state = GameState(started: false)
        try await state.create(on: database)
    }

    func revert(on database: Database) async throws {
        try await database.schema("game_state").delete()
    }
}
