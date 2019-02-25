// Uses ES5 Syntax to support IE9+
document.addEventListener('DOMContentLoaded', function main() {
  var url = 'http://185.13.90.140:8081/';
  var socket = io(url);

  var chatForm = document.getElementById('chat-form');
  var messageContainer = document.getElementById('message-container');
  var usernameInput = document.getElementById('username');
  var messageInput = document.getElementById('message');

  var lastUser;
  var lastBlock;

  function addMessage(user, message, own) {
    if (lastUser === user && lastBlock) {
      var userContainer = lastBlock.getElementsByClassName('user-container')[0];
      if (userContainer) {
        lastBlock.removeChild(userContainer);
        lastBlock.appendChild(createMessageElement(message));
        lastBlock.appendChild(userContainer);
        messageContainer.scrollTop = messageContainer.scrollHeight;
        return;
      }
    }
    lastBlock = createMessageBlock(user, message, own);
    lastUser = user;
    messageContainer.appendChild(lastBlock);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  socket.on('message', function handleIncomingMessage(message) {
    addMessage(message.user, message.message, false);
  });

  chatForm.addEventListener('submit', function handleFormSubmit(event) {
    event.preventDefault();
    var user = usernameInput.value;
    var message = messageInput.value;
    if (user && message) {
      socket.emit('message', {
        user: user,
        message: message,
      });
      addMessage(user, message, true);
      messageInput.value = '';
      messageInput.focus();
    }
  });
});

function createDiv(className) {
  var element = document.createElement('div');
  element.setAttribute('class', className);
  return element;
}

function createMessageBlock(user, message, own) {
  var block = createDiv('message-block');
  var containerClassName = 'user-container' + (own ? ' align-right' : '');
  var userContainer = createDiv(containerClassName);
  userContainer.innerText = user;
  block.appendChild(createMessageElement(message));
  block.appendChild(userContainer);
  return block;
}

function createMessageElement(message) {
  var element = createDiv('message');
  element.innerText = message;
  return element;
}
