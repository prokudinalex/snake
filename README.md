# Snake
Node.js powered multiplayer snake game

## Infrastucture
Communication between client and server is based on websockets.
Every XYZ millisecond server will send updated information about snake world to all clients.
Meanwhile clients will draw the snake world upon receiving updated information
