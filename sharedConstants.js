const runLocal = true; // do not commit while true!!!

// Define all constants usefull by the server and the client
var constant = {

    SERVER_PORT: 10011,
    SOCKET_PORT: 10012,
    SOCKET_PORT_PUBLIC: 443,
    SOCKET_ADDR: 'https://io-games.lude.cat',
    SOCKET_PATH: '/flappybird',
    RUN_LOCAL: false,

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

var localConstants = {

    SERVER_PORT: 3000,
    SOCKET_PORT: 3001,
    SOCKET_PORT_PUBLIC: 3001,
    SOCKET_ADDR: 'http://localhost',
    SOCKET_PATH: '',
    RUN_LOCAL: true,

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
    exports.constant = runLocal ? localConstants : constant;
}
// Else provide the const object to require.js with define()
else {
    if (runLocal) define(localConstants)
    else define(constant);
}
