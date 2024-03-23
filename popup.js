document.addEventListener('DOMContentLoaded', function () {
    const chatOutput = document.getElementById('chat-output');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
  
    sendButton.addEventListener('click', function () {
      const message = userInput.value;
      if (message.trim() !== '') {
        sendMessage(message);
        userInput.value = '';
      }
    });
  
    function sendMessage(message) {
      const chatBubble = document.createElement('div');
      chatBubble.classList.add('chat-bubble');
      chatBubble.textContent = 'User: ' + message;
      chatOutput.appendChild(chatBubble);
      // Here you would send the message to ChatGPT and handle the response
      // For simplicity, we're just echoing back the user's message
      const response = 'ChatGPT: ' + message + ' (echo)';
      const responseBubble = document.createElement('div');
      responseBubble.classList.add('chat-bubble');
      responseBubble.textContent = response;
      chatOutput.appendChild(responseBubble);
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs[0]) {
          const currentUrl = tabs[0].url;
          displayCurrentUrl(currentUrl);
        }
      });
    
      // Function to display current URL
      function displayCurrentUrl(url) {
        const urlDisplay = document.getElementById('current-url');
        if (urlDisplay) {
          urlDisplay.textContent = url;
        }
      }
  });
  
  