import Vapor

struct PlayerCreateDTO: Content {
    let username: String
    // No need to include `score` — we'll set it in the controller
}
