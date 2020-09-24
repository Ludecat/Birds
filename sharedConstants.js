const runLocal = false; // do not commit while true!!!

// Define all constants usefull by the server and the client
var constant = {

    SERVER_PORT: runLocal ? 3000 : 10011,
    SOCKET_PORT: runLocal ? 3001 : 10012,
    SOCKET_PORT_PUBLIC: runLocal ? 3001 : 443,
    SOCKET_ADDR: runLocal ? 'http://localhost' : 'https://games.ludecat.io',
    SOCKET_PATH: runLocal ? '' : '/flappybird',
    LOCALHOST: runLocal,
    BOT_DEBUG: true,

    SCREEN_WIDTH: 900,
    SCREEN_HEIGHT: 768,
    FLOOR_POS_Y: 672,
    LEVEL_SPEED: 0.3,
    FLOOR_SPEED: 0.6,
    TIME_BETWEEN_GAMES: 10 * 1000,
    TIME_TO_START_NEW_GAME: 5 * 1000,
    TICK_PER_SECONDS: 45,

    NIGHT_CICLE: 15,
    SMOOTH_DAY_NIGHT_TRANSITION_DURATION: 3000,

    BIRD_WIDTH: 42,
    BIRD_HEIGHT: 30,
    BIRD_ALPHA: 0.4,
    
    // Pipe constants
    PIPE_WIDTH: 100,
    DISTANCE_BETWEEN_PIPES: 380,
    MIN_PIPE_HEIGHT: 60,
    MAX_PIPE_HEIGHT: 630,
    HEIGHT_BETWEEN_PIPES: 600, // 250
    MIN_HEIGHT_BETWEEN_PIPES: 150, // 150
    MIN_HEIGHT_AFTER_MILLISECONDS: 60 * 1000,
    
    SPREADSHEET_SYNC_ENABLED: !runLocal,
};

// To be use by the server part, we have to provide the object with exports
if (typeof exports != 'undefined') {
    exports.constant = constant;
}
// Else provide the const object to require.js with define()
else {
    define(constant);
}
