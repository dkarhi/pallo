var handler = function(req, res) {
    var mime = require('mime');
    var uri = require('url').parse(req.url).pathname;
    var filename = require('path').join(process.cwd(), uri);
    if (uri == '/') {
        filename = "./pallo.html"
    } 
    fs.readFile(filename, function (err, data) {
        if(err) {        
            if (err.code == 'ENOENT') {
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.write("404 Not Found\n")
            }
            else {
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.write(err + "\n");
            }
            res.end();
            return;
        }
        res.setHeader("Content-Type", mime.lookup(filename));
        res.writeHead(200);
        res.end(data);
    });
};

gameBoard = [ 0, 0, 0, 0, 0 ];

users = [
    {color: "white", count: 0, taken: true, name: ""},
    {color: "red", count: 0, taken: false, name: ""},
    {color: "blue", count: 0, taken: false, name: ""},
    {color: "yellow", count: 0, taken: false, name: ""},
    {color: "green", count: 0, taken: false, name: ""}
];


var server = require('http').createServer(handler);
var io = require('socket.io').listen(server);
var fs = require('fs');
var port = process.env.PORT || 80;

server.listen(port);

io.sockets.on('connection', function (socket) {
    // Find the first available color
    var userId;
    for (i = 1; i < users.length; i++) {
        if (!users[i].taken) {
            users[i].taken = true;
            userId = i;
            break;
        }
    }

    socket.emit("set user", userId);
    socket.emit("update", { circle: 'circle0', color: users[gameBoard[0]].color });
    socket.emit("update", { circle: 'circle1', color: users[gameBoard[1]].color });
    socket.emit("update", { circle: 'circle2', color: users[gameBoard[2]].color });
    socket.emit("update", { circle: 'circle3', color: users[gameBoard[3]].color });
    socket.emit("update", { circle: 'circle4', color: users[gameBoard[4]].color });

    socket.on("circle click", function(userId, circle) {
        updateColor(circle, userId);
    });
    socket.on("disconnect", function() {
        removeUser(userId);
        io.sockets.emit("print user names", users);
    });
    socket.on("get users", function() {
        socket.emit("update users", { users: users });
    });
    socket.on("set user name", function(userId, userName) {
        if (userName === "") {
            userName = "User" + userId
        }
        users[userId].name = userName;
        io.sockets.emit("print user names", users);
    });
});

var updateColor = function(circle, userId) {
    circleID = "circle" + circle;
    var newColor = userId;

    if (gameBoard[circle] == 0) {
        users[userId].count++
    }
    else if ( gameBoard[circle] != userId) {
        newColor = 0;
        users[gameBoard[circle]].count--
    }

    io.sockets.emit("update", { circle: circleID, color: users[newColor].color });
    gameBoard[circle] = newColor;
        if (users[userId].count === 3) {
        io.sockets.emit("win", { user: users[userId].name });
        clearBoard();
    }
}

var clearBoard = function() {
    for (i = 0; i < gameBoard.length; i++) {
        gameBoard[i] = 0;
    }
    for (i = 0; i < users.length; i++) {
        users[i].count = 0;
    }
    io.sockets.emit("update", { circle: 'circle0', color: users[gameBoard[0]].color });
    io.sockets.emit("update", { circle: 'circle1', color: users[gameBoard[1]].color });
    io.sockets.emit("update", { circle: 'circle2', color: users[gameBoard[2]].color });
    io.sockets.emit("update", { circle: 'circle3', color: users[gameBoard[3]].color });
    io.sockets.emit("update", { circle: 'circle4', color: users[gameBoard[4]].color });
}

var removeUser = function (userId) {
    users[userId].taken = false;
    users[userId].name = "";
}
