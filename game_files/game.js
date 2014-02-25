var PlayersManager    = require('./playersManager'),
    PipeManager       = require('./pipeManager'),
    CollisionEngine   = require('./collisionEngine'),
    enums             = require('./enums'),
    Const             = require('../sharedConstants').constant;

var _playersManager,
    _pipeManager,
    io,
    _gameState,
    _timeStartGame,
    _lastTime = null;


function playerLog (socket, nick) {
  // Retreive PlayerInstance
  socket.get('PlayerInstance', function (error, player) {

    if (error)
      console.error(error);
    else {

      // Bind new client events
      socket.on('change_ready_state', function (readyState) {
        _playersManager.changeLobbyState(player, readyState);
        socket.broadcast.emit('player_ready_state', player.getPlayerObject());
      });
      socket.on('player_jump', function () {
        player.jump();
      });

      // Set player's nickname
      player.setNick(nick);

      // Notify new client about other players AND notify other about the new one ;)
      socket.emit('player_list', _playersManager.getPlayerList());
      socket.broadcast.emit('new_player', player.getPlayerObject());
    }
  });
}

function updateGameState (newState, notifyClients) {
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

  // If requested, inform clients qbout the chsnge
  if (notifyClients)
    io.sockets.emit('update_game_state', _gameState);
}

function createNewGame () {
  // Flush pipe list
  _pipeManager.flushPipeList();

  // Reset players state

  // Notify players of the new game state
  updateGameState(enums.ServerState.WaitingForPlayers, true);
};

function gameOver() {
  // Stop game loop
  clearInterval(_timer);
  _lastTime = null;

  // Change server state
  updateGameState(enums.ServerState.Ranking, true);

  // TODO: Send players score

  // After 5s, create a new game
  setTimeout(createNewGame, 5000);
};

function startGameLoop () {
  // Change server state
  updateGameState(enums.ServerState.OnGame, true);

  // Create the first pipe
  _pipeManager.newPipe();

  // Start timer
  _timer = setInterval(function() {
    var now = new Date().getTime(),
        ellapsedTime = 0;

    // get time difference between the last call and now
    if (_lastTime) {
      ellapsedTime = now - _lastTime;
    }
    else {
      _timeStartGame = now;
    }

    _lastTime = now;

    // Update players position
    _playersManager.updatePlayers(ellapsedTime);

    // Update pipes
    _pipeManager.updatePipes(ellapsedTime);

    // Check collisions
    /*if (CollisionEngine.checkCollision(_pipeManager.getPotentialPipeHit(), _playersManager.getPlayerList(enums.PlayerState.Playing)) == true) {
      if (_playersManager.arePlayersStillAlive() == false) {
        gameOver();
      }
    }*/

    // Notify players
    io.sockets.emit('game_loop_update', { players: _playersManager.getPlayerList(), pipes: _pipeManager.getPipeList()});

    /* DEBUG, TO REMOVE */
    if ((now - _timeStartGame) > 10000) {
      clearInterval(_timer);
      updateGameState(enums.ServerState.Ranking, true);
      _lastTime = null;
    }
    /* END DEBUG */


  }, 1000 / 60);
}


exports.startServer = function () {
  io = require('socket.io').listen(Const.SOCKET_PORT);

  _gameState = enums.ServerState.WaitingForPlayers;
  
  // Create playersManager instance and register events
  _playersManager = new PlayersManager();
  _playersManager.on('players-ready', function () {
    startGameLoop();
  });

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