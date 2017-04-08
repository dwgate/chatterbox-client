// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages'
};

app.init = function() {
  app.fetch();

  $('#main').find('.username').off().click(function(event) {
    app.handleUsernameClick();
  });

  $('.submit').off().submit(function(event) {
    app.handleSubmit();
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
      console.log('chatterbox: Message sent');
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
      app.populate(data);
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
  // "objectId":"gHL2zQFXS0",
  // "username":"dan",
  // "text":"first",
  // "roomname":"lobby",
  // "createdAt":"2017-02-08T21:42:35.550Z",
  // "updatedAt":"2017-02-08T21:42:35.550Z"

  $('#chats').append(`<div>${message.text}</div>`);
  $('#main').append(`<div class="username">${message.username}</div>`);
};

app.renderRoom = function(room) {
  $('#roomSelect').append(`<span>${room}</span>`);
};

app.handleUsernameClick = function() {
  console.log('handle user name');
  return true;
};

app.handleSubmit = function() {
  console.log('handle submit');
  app.send($('#message').val());
  return true;
};

app.populate = function(messages) {
  messages.results.forEach((message) => {
    app.renderMessage(message);
  });
};

$(document).ready(function() {
  app.init();
});


