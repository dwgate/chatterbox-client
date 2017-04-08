// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  rooms: new Set(),
  users: new Set(),
  messages: new Set(),
  currentRoom: 'ParseAPI'
};

app.init = function() {
  app.fetch();

  setInterval(function() {
    app.fetch();
  }, 1000);

  $('#main').find('.username').off().click(function(event) {
    app.handleUsernameClick();
  });

  $('.submit').off().on('click', function(event) {
    app.handleSubmit();
  });

  $('#roomSelect').off().on('change', function(event) {
    app.currentRoom = event.currentTarget.value;
    app.changeRoom();
  });
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent' + JSON.stringify(data));
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    // data: JSON.stringify(message),
    // contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Messages received');
      console.log(data.results.length);
      app.populate(data);
      app.renderRoom();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch messages', data);
    }
  });  
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(message) {
  // this.rooms = new Set();
  // "objectId":"gHL2zQFXS0",
  // "username":"dan",
  // "text":"first",
  // "roomname":"lobby",
  // "createdAt":"2017-02-08T21:42:35.550Z",
  // "updatedAt":"2017-02-08T21:42:35.550Z"

  var newMessage = `<div class="message-container" data-room-name="${message.roomname}">
      <p class="username">${message.username}</p>
      <p class="message">${message.text}</p>
      <p class="roomname">${message.roomname}</p>
      <p class="created">${message.createdAt}</p>
      <p class="created">${message.objectId}</p>
    </div>`;

  this.users.add(message.username);
  this.rooms.add(message.roomname);

  if (message.roomname === app.currentRoom) {
    $('#chats').append(newMessage);
  }
};

app.renderRoom = function() {
  this.rooms.forEach(function (room) {
    $('#roomSelect').append(`<option value="${room}">${room}</option>`);
  });
};

app.handleUsernameClick = function() {
  console.log('handle user name');
  return true;
};

app.handleSubmit = function() {
  console.log('handle submit');
  var message = {
    username: 'johnanded',
    text: 'trololotrololotrololotrololotrololotrololotrololotrololo',
    roomname: app.currentRoom
  };

  // message.username = $('#username').val();
  // message.message = $('#message').val();
  // message.roomname = 'testRoom';

  console.log (message);
  app.send(message);
};

app.populate = function(messages) {
  messages.results.forEach(message => {
    // console.log (message);
    // console.log (this.messages);
    if (!app.messages.has(JSON.stringify(message))) {
      console.log('adding...');
      app.messages.add(JSON.stringify(message));
      app.renderMessage(message);
    } else {
      // console.log ("DUPLICATE ITEM");
    }
  });
  console.log (this.messages.length);
};

app.changeRoom = function() {
  app.clearMessages();
  app.messages.forEach(message => {
      app.renderMessage(JSON.parse(message));    
  });
}

$(document).ready(function() {
  app.init();
});


