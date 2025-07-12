import Fluent

struct CreateQuestion: AsyncMigration {
    func prepare(on database: Database) async throws {
        try await database.schema("questions")
            .id()
            .field("text", .string, .required)
            .field("options", .array(of: .string), .required)
            .field("correctAnswer", .string, .required)
            .field("type", .string, .required)
            .field("hint", .string)
            .create()
    }

    func revert(on database: Database) async throws {
        try await database.schema("questions").delete()
    }
}
