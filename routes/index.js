var Const = require('../sharedConstants').constant;

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.birds = function(req, res){
    if(Const.RUN_LOCAL) {
        res.render('birds', {
            title: 'Birds.js',
            wsAddress: Const.SOCKET_ADDR + ':' + Const.SOCKET_PORT
        });
    }
    else {
        res.render('birds', {
            title: 'Birds.js',
            wsAddress: Const.SOCKET_ADDR + ':' + Const.SOCKET_PORT_PUBLIC + Const.SOCKET_PATH
        });
    }
};
