// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  rooms: new Set(),
  users: new Set(),
  messages: new Set(),
  currentRoom: '',
  friends: new Set()
};

app.init = function() {
  app.fetch();
  setInterval(function() {
    app.fetch();
  }, 5000);

  $('#chats').on('click', function(event) {
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
    url: app.server + '?order=-createdAt',
    type: 'GET',
    // order: -createdAt,
    // data: JSON.stringify(message),
    // contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Messages received');
      app.populate(data);
      app.room = $("#roomSelect option:first-child").val();

      // app.renderRooms();
      // set roomselect dropdown to equal lobby
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

var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

var tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');

function removeTags(html) {
  var oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
}

app.renderMessage = function(message) {
  // this.rooms = new Set();
  // "objectId":"gHL2zQFXS0",
  // "username":"dan",
  // "text":"first",
  // "roomname":"lobby",
  // "createdAt":"2017-02-08T21:42:35.550Z",
  // "updatedAt":"2017-02-08T21:42:35.550Z"

  var username = message.username && removeTags(message.username);
  var text = message.text && removeTags(message.text);
  var roomname = message.roomname && removeTags(message.roomname);
  var createdAt = message.createdAt && removeTags(message.createdAt);
  var objectId = message.objectId && removeTags(message.objectId);

  var newMessage = `<div class="message-container" data-room-name="${message.roomname}">
      <p class="username">${username}</p>
      <p class="message">${text}</p>
      <p class="roomname">${roomname}</p>
      <p class="created">${createdAt}</p>
      <p class="created">${objectId}</p>
    </div>`;

  this.users.add(message.username);

  if (!this.rooms.has(message.roomname)) {
    this.rooms.add(message.roomname);
    this.renderRoom(message.roomname)
  }

  if (message.roomname === app.currentRoom) {
    $('#chats').append(newMessage);
  }
};

// var GetURLParameter = function(sParam) {
//   var sPageURL = window.location.search.substring(1);
//   var sURLVariables = sPageURL.split('&');
//   for (var i = 0; i < sURLVariables.length; i++) {
//     var sParameterName = sURLVariables[i].split('=');
//     if (sParameterName[0] === sParam) {
//       return sParameterName[1];
//     }
//   }
// }​;

// app.renderRooms = function() {
//   $('#roomSelect').children().remove();
//   this.rooms.forEach(function (room) {
//       $('#roomSelect').append(`<option value="${room}">${room}</option>`);
//   });
// };

app.renderRoom = function(room) {
  room = room && removeTags(room);
  $('#roomSelect').append(`<option value="${room}">${room}</option>`);
};

app.handleUsernameClick = function() {
  console.log('handle user name');
  return true;
};

app.handleSubmit = function() {
  console.log('handle submit');
  // var username = GetURLParameter('username');
  var message = {
    username: window.location.search.replace('?username=', ''),
    text: $('#message').val(),
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
    if (!app.messages.has(JSON.stringify(message))) {
      app.messages.add(JSON.stringify(message));
      app.renderMessage(message);
    }
  });
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


