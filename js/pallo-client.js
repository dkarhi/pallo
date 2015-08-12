$(function() {
    var header = document.getElementById("header");
    var allUsers = document.getElementById("users");
    var gameWindow = document.getElementById("game-board");
    var lastWinner = document.getElementById("last-winner");
    var circle0 = document.getElementById("circle0");
    var circle1 = document.getElementById("circle1");
    var circle2 = document.getElementById("circle2");
    var circle3 = document.getElementById("circle3");
    var circle4 = document.getElementById("circle4");
    var userId;
    var userName;

    // Set Enter key to click Ok button on Username dialog
    $('#user-name-dialog').on('keyup', function(e){
        if (e.keyCode == 13) {
            $(':button:contains("Ok")').click();
        }
    });
    
    // Initialize the dialog box for inputting the user's name
    $("#user-name-dialog").dialog({
        modal: true,
        autoOpen: false,
        draggable: false,
        resizable: false,
        title: "Username",
        closeOnEscape: false,
        open: function(event, ui) { $(".ui-dialog-titlebar-close", ui.dialog | ui).hide(); },
        buttons: [
            {
                text: "Ok",
                click: function() {
                    var username = $("#username-field").val();
                    var userId = $("#username-id-field").val();  
                    socket.emit ('set user name', userId, username);
                    $( this ).dialog("close");
                }
            }
        ] 
    });

    var socket = io.connect('http://pallo.herokuapp.com', { 
        'sync disconnect on unload': true });
    socket.on('print user names', function (users) {
        allUsers.innerHTML = "<strong>Users:</strong><br>";
        for (i = 0; i < users.length; i++){
            if (users[i].taken) {
                allUsers.innerHTML += users[i].name + "<br>";
            }
        }
    });
    socket.on('set user', function (data) {
        userId = data;
        $("#username-id-field").val(userId);
        $("#user-name-dialog").dialog("open");
    });
    socket.on('update', function (data) {
        switch (data.circle) {
            case 'circle0':
                circle0.style.backgroundColor = data.color
                break;
            case 'circle1':
                circle1.style.backgroundColor = data.color
                break;
            case 'circle2':
                circle2.style.backgroundColor = data.color
                break;
            case 'circle3':
                circle3.style.backgroundColor = data.color
                break;
            case 'circle4':
                circle4.style.backgroundColor = data.color
                break;
        };
    });
    socket.on('win', function (data) {
        lastWinner.innerHTML = data.user + " wins!<br>" + lastWinner.innerHTML;
    });

    circle0.onclick = function() {
        circle = 0;
        socket.emit('circle click', userId, circle);
    };
    circle1.onclick = function() {
        circle = 1;
        socket.emit('circle click', userId, circle);
    };
    circle2.onclick = function() {
        circle = 2;
        socket.emit('circle click', userId, circle);
    };
    circle3.onclick = function() {
        circle = 3;
        socket.emit('circle click', userId, circle);
    };
    circle4.onclick = function() {
        circle = 4;
        socket.emit('circle click', userId, circle);
    };
});
