import Fluent

struct CreateAnswer: AsyncMigration {
    func prepare(on database: Database) async throws {
        try await database.schema("answers")
            .id()
            .field("player_id", .uuid, .required, .references("players", "id"))
            .field("question_id", .uuid, .required, .references("questions", "id"))
            .field("answer", .string, .required)
            .create()
    }

    func revert(on database: Database) async throws {
        try await database.schema("answers").delete()
    }
}
