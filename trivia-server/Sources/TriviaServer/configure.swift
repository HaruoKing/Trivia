import NIOSSL
import Fluent
import FluentSQLiteDriver
import Vapor

public func configure(_ app: Application) async throws {
    app.databases.use(.sqlite(.file("db.sqlite")), as: .sqlite)

    app.migrations.add(CreatePlayer())
    app.migrations.add(CreateQuestion())
    try await app.autoMigrate()

    try app.register(collection: TriviaController())
}
