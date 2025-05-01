import Fluent

struct CreatePlayer: AsyncMigration {
    func prepare(on database: any Database) async throws {
        try await database.schema("players")
            .id()
            .field("username", .string, .required)
            .field("score", .int, .required)
            .create()
    }

    func revert(on database: any Database) async throws {
        try await database.schema("players").delete()
    }
}
