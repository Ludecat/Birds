var PlayersManager = require('./playersManager'),
    PipeManager = require('./pipeManager'),
    CollisionEngine = require('./collisionEngine'),
    enums = require('./enums'),
    Const = require('../sharedConstants').constant;
var msgpack = require('@ygoe/msgpack');

var _playersManager,
    _pipeManager,
    io,
    _gameState,
    _timeStartGame,
    _lastTime = null,
    _firstFrame = true;


var performanceNow = require("performance-now");

function playerLog(socket, nick) {
    // Retreive PlayerInstance
    socket.get('PlayerInstance', function (error, player) {

        if (error)
            console.error(error);
        else {

            // Bind new client events
            socket.on('change_ready_state', function (readyState) {

                // If the server is currently waiting for players, update ready state
                if (_gameState == enums.ServerState.WaitingForPlayers) {
                    _playersManager.changeLobbyState(player, readyState);
                    socket.broadcast.emit('player_ready_state', player.getPlayerObject());
                }
            });
            socket.on('player_jump', function () {
                player.jump();
            });
            socket.on('force_start_game', function () {
              if (_gameStartTimeout == null) {
                _gameStartTimeout = setTimeout(forceStartGame, Const.TIME_TO_START_NEW_GAME);
                io.sockets.emit('game_will_start');
              }
            });
            socket.on('force_reset_score', function () {
              _playersManager.resetPlayerScores();
              console.info("Scores reset");
            });

            // Set player's nickname and prepare him for the next game
            _playersManager.prepareNewPlayer(player, nick);

            // Notify new client about other players AND notify other about the new one ;)
            socket.emit('player_list', _playersManager.getPlayerList());
            socket.broadcast.emit('new_player', player.getPlayerObject());
        }
    });
}

function forceStartGame() {
    _playersManager.readyAllPlayers();
    startGameLoop();
}

function updateGameState(newState, notifyClients) {
    var log = '\t[SERVER] Game state changed ! Server is now ';

    _gameState = newState;
    switch (_gameState) {
        case enums.ServerState.WaitingForPlayers:
            log += 'in lobby waiting for players'
            break;
        case enums.ServerState.OnGame:
            log += 'in game !'
            break;
        case enums.ServerState.Ranking:
            log += 'displaying ranking'
            break;
        default:
            log += 'dead :p'
    }
    console.info(log);

    // If requested, inform clients about the change
    if (notifyClients)
        io.sockets.emit('update_game_state', _gameState);
}

function createNewGame() {
    var players,
        i;

    // Flush pipe list
    _pipeManager.flushPipeList();

    // Reset players state and send it
    players = _playersManager.resetPlayersForNewGame();
    for (i = 0; i < players.length; i++) {
        io.sockets.emit('player_ready_state', players[i]);
    };

    // Notify players of the new game state
    updateGameState(enums.ServerState.WaitingForPlayers, true);
    _firstFrame = true;
};

function gameOver() {
    var players,
        i;

    // Stop game loop
    clearInterval(_timer);
    _lastTime = null;

    // Change server state
    updateGameState(enums.ServerState.Ranking, true);

    // Send players score
    _playersManager.sendPlayerScore();

    // After 5s, create a new game
    setTimeout(createNewGame, Const.TIME_BETWEEN_GAMES);
};

function startGameLoop() {
    _gameStartTimeout = null;

    // Change server state
    updateGameState(enums.ServerState.OnGame, true);

    // Create the first pipe
    _pipeManager.newPipe();
    
    // Start timer
    _timer = setInterval(function () {
        var now = new Date().getTime(),
            ellapsedTime = 0,
            plList;

        // get time difference between the last call and now
        if (_lastTime) {
            ellapsedTime = now - _lastTime;
        } else {
            _timeStartGame = now;
        }

        _lastTime = now;

        // If everyone has quit the game, exit it
        if (_playersManager.getNumberOfPlayers() == 0) {
            gameOver();
        }

        // Update players position
        _playersManager.updatePlayers(ellapsedTime);

        // Update pipes
        _pipeManager.updatePipes(ellapsedTime);

        // Check collisions
        if (CollisionEngine.checkCollision(_pipeManager.getPotentialPipeHit(), _playersManager.getPlayerList(enums.PlayerState.Playing)) === true) {
            if (_playersManager.arePlayersStillAlive() === false) {
                gameOver();
            }
        }

        //var start2 = performanceNow();

        const updateData = {
            players: _playersManager.getOnGamePlayerList(_firstFrame),
            highestScore: _playersManager.getHighestRoundScore(),
            ellapsedTime,
            pipes: _pipeManager.getPipeList()
        };
        
        const binaryData = msgpack.serialize(updateData);

        //var end2 = performanceNow();
        //console.log("msgpack:" + (end2 - start2).toFixed(3));
        //var start = performanceNow();

        // Notify players
        io.sockets.emit('game_loop_update', {buffer : new Buffer(binaryData)});
        
        //var end = performanceNow();
        //console.log("sockets.emit:" + (end - start).toFixed(3));

        _firstFrame = false;
        
    }, 1000 / Const.TICK_PER_SECONDS);
}


exports.startServer = function () {
    io = require('socket.io').listen(Const.SOCKET_PORT);
    io.configure(function () {
        io.set('log level', 2);
    });

    _gameState = enums.ServerState.WaitingForPlayers;
    _gameStartTimeout = null;

    // Create playersManager instance and register events
    _playersManager = new PlayersManager();


    // Create pipe manager and bind event
    _pipeManager = new PipeManager();
    _pipeManager.on('need_new_pipe', function () {
        // Create a pipe and send it to clients
        var pipe = _pipeManager.newPipe();
    });

    // On new client connection
    io.sockets.on('connection', function (socket) {

        // Add new player
        var player = _playersManager.addNewPlayer(socket, socket.id);

        // Register to socket events
        socket.on('disconnect', function () {
            socket.get('PlayerInstance', function (error, player) {
                _playersManager.removePlayer(player);
                socket.broadcast.emit('player_disconnect', player.getPlayerObject());
                player = null;
            });
        });
        socket.on('say_hi', function (nick, fn) {
            fn(_gameState, player.getID());
            playerLog(socket, nick);
        });

        // Remember PlayerInstance and push it to the player list
        socket.set('PlayerInstance', player);
    });


    console.log('Game started and waiting for players on port ' + Const.SOCKET_PORT);
};
