var handler = function(req, res) {
  fs.readFile('./pallo.html', function (err, data) {
    if(err) throw err;
    res.writeHead(200);
    res.end(data);
  });

};

var server = require('http').createServer(handler);
var io = require('socket.io').listen(server);
var fs = require('fs');
var port = 8080;

server.listen(port);

io.sockets.on('connection', function (socket) {
//  var user = addUser();
//  updateBoard();
//  socket.emit("Welcome", user);
//  socket.on('disconnect', function () {
//    removeUser(user);
//  });
  socket.on("click", function() {
    setGamePiece();
  });
  socket.on("circleclick", function(user_id, circle) {
    updateColor(circle, user_id);
  });
});

var updateColor = function(circle, user_id) {
  io.sockets.emit("update", { color: "red" });
}
