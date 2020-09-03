const runLocal = false; // do not commit while true!!!

// Define all constants usefull by the server and the client
var constant = {

    SERVER_PORT: runLocal ? 3000 : 10011,
    SOCKET_PORT: runLocal ? 3001 : 10012,
    SOCKET_PORT_PUBLIC: runLocal ? 3001 : 443,
    SOCKET_ADDR: runLocal ? 'http://localhost' : 'https://io-games.lude.cat',
    SOCKET_PATH: runLocal ? '' : '/flappybird',

    SCREEN_WIDTH: 900,
    SCREEN_HEIGHT: 768,
    FLOOR_POS_Y: 672,
    LEVEL_SPEED: 0.3,
    TIME_BETWEEN_GAMES: 5000,
    TIME_TO_START_NEW_GAME: 15000,

    BIRD_WIDTH: 42,
    BIRD_HEIGHT: 30,

    // Pipe constants
    PIPE_WIDTH: 100,
    DISTANCE_BETWEEN_PIPES: 380,
    MIN_PIPE_HEIGHT: 60,
    MAX_PIPE_HEIGHT: 630,
    HEIGHT_BETWEEN_PIPES: 200 // 150
};

// To be use by the server part, we have to provide the object with exports
if (typeof exports != 'undefined') {
    exports.constant = constant;
}
// Else provide the const object to require.js with define()
else {
    define(constant);
}
