import NIOSSL
import Fluent
import FluentSQLiteDriver
import Vapor

public func configure(_ app: Application) async throws {
    app.databases.use(.sqlite(.file("db.sqlite")), as: .sqlite)

    app.migrations.add(CreatePlayer())
    app.migrations.add(CreateQuestion())
    try await app.autoMigrate()

let corsConfig = CORSMiddleware.Configuration(
        allowedOrigin: .all,
        allowedMethods: [.GET, .POST, .PUT, .OPTIONS, .DELETE, .PATCH],
        allowedHeaders: [.accept, .authorization, .contentType, .origin, .xRequestedWith]
    )
    let cors = CORSMiddleware(configuration: corsConfig)
    app.middleware.use(cors)
    
    // ✅ Auto seed questions if none exist
    try await TriviaSeeder.seed(on: app.db)

    try app.register(collection: TriviaController())
}
