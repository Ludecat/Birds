var Const = require('../sharedConstants').constant;

function Pipe (lastPipePosX, firstTime) {
  const time = new Date().getTime();
  
  const maxTime = firstTime + Const.MIN_HEIGHT_AFTER_MILLISECONDS
  const heightBetween = Const.HEIGHT_BETWEEN_PIPES + (Const.MIN_HEIGHT_BETWEEN_PIPES - Const.HEIGHT_BETWEEN_PIPES) * (time - firstTime) / (maxTime - firstTime);

  this._pipeTinyObject = {
    id:   time,
    posX: (lastPipePosX + Const.DISTANCE_BETWEEN_PIPES),
    posY: Math.floor(Math.random() * ((Const.MAX_PIPE_HEIGHT - heightBetween)- Const.MIN_PIPE_HEIGHT + 1) + Const.MIN_PIPE_HEIGHT),
    heightBetween
  };
};
 
Pipe.prototype.update = function (timeLapse) {
  this._pipeTinyObject.posX -= Math.floor(timeLapse * Const.LEVEL_SPEED);
};

Pipe.prototype.canBeDroped = function () {
  if (this._pipeTinyObject.posX + Const.PIPE_WIDTH < 0)
    return (true);
  return (false);
};

Pipe.prototype.getPipeObject = function () {
  return (this._pipeTinyObject);
};

module.exports = Pipe;