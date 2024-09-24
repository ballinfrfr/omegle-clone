const socket = new WebSocket('ws://localhost:3030');

// DOM elements for chat and user interaction
const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const stopButton = document.getElementById('stopButton');
const nextButton = document.getElementById('nextButton');

// Display message in chat window
function displayMessage(message, isOwnMessage = false) {
    const messageElement = document.createElement('div');
    messageElement.className = isOwnMessage ? 'ownMessage' : 'otherMessage';
    messageElement.innerText = message;
    chatWindow.appendChild(messageElement);
}

// Sending messages
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim()) {
        socket.send(message); // Send message as plain text
        displayMessage(message, true); // Display own message in chat
        messageInput.value = ''; // Clear the input field
    }
});

// Receiving messages from the server
socket.onmessage = function(event) {
    const message = event.data;

    // Handle Blob or plain text
    if (message instanceof Blob) {
        message.text().then((text) => {
            displayMessage(text); // Display message when it's a Blob
        });
    } else {
        displayMessage(message); // Display plain text message
    }
};

// Handle stop button (disconnect the user)
stopButton.addEventListener('click', () => {
    socket.close(); // Close the WebSocket connection
    displayMessage('You have disconnected from the chat.');
});

// Handle next button (reload the page)
nextButton.addEventListener('click', () => {
    location.reload(); // Reload the current page to reset the chat
});
