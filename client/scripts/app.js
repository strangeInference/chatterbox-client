// YOUR CODE HERE:
$(document).ready(function(){
  var rooms = {};
  var currentRoom = "default";
  var getMessages = function(){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      success: function (data) {
        console.log(data);
        for(var i = 0; i < data.results.length; i++){
          var item = data.results[i];

          rooms[item.roomname] = item.roomname;
          
          var $post = $('<div></div>');
          $post.addClass('post');
          
          var $username = $('<span></span>');
          $username.text(item.username);
          $username.addClass('username');
          $username.appendTo($post);
          
          var $time = $('<span></span>');
          $time.text(item.createdAt); 
          $time.addClass('time');
          $time.appendTo($post);
          
          var $message = $("<p></p>");
          $message.addClass('message');
          $message.text(item.text);
          $message.appendTo($post);
          
          $post.appendTo($("#chats"));
        }

        // remove rooms from datalist
        $('.room').remove();

        // add rooms to datalist
        for(var room in rooms){
          var $option = $('<option>');
          $option.attr('value', room);
          $option.addClass('room');
          $option.appendTo($('datalist#roomList'));
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  };
  $('#new').on('click', function(){
    // select all posts and remove them
    $('.post').remove();
    getMessages();
  });

  $('#myRoom').on('input',function(e){
    currentRoom = $(this).val();
    // remove rooms from datalist
    console.log(currentRoom);
    $('.room').remove();

    // add rooms to datalist
    for(var room in rooms){
      var $option = $('<option>');
      $option.attr('value', room);
      $option.addClass('room');
      $option.appendTo($('datalist#roomList'));
    }
  });

  var postMessage = function(message){
    var ourPost = {
      username: window.location.search.slice(10),
      text: message,
      room: currentRoom,
    }

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(ourPost),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  }
  $('#messageBox').keypress(function(event){
    // if enter key is pressed
    if (event.keyCode === 13){
      // post message
      postMessage($('#messageBox').val());
    }
  });

  getMessages();
});