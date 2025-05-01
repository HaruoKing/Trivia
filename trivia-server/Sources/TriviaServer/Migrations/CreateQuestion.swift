import Fluent

struct CreateQuestion: AsyncMigration {
    func prepare(on database: any Database) async throws {
        try await database.schema("questions")
            .id()
            .field("text", .string, .required)
            .field("options", .array(of: .string), .required)
            .field("correctAnswer", .string, .required)
            .create()
    }

    func revert(on database: any Database) async throws {
        try await database.schema("questions").delete()
    }
}
