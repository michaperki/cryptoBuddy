document.addEventListener('DOMContentLoaded', function () {
    const chatOutput = document.getElementById('chat-output');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const tokenListView = document.getElementById('token-list-view');
    const tokenDetailsView = document.getElementById('token-details-view');
    const backToListButton = document.getElementById('back-to-list-button');

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

    // Function to fetch JSON data and render token list
    function fetchAndRenderTokenList() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Render token list
                renderTokenList(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to render token list
    function renderTokenList(data) {
        const tokens = data.tokens;
        const container = document.getElementById('token-list-container');
        container.innerHTML = ''; // Clear previous data

        tokens.forEach(token => {
            const tokenElement = document.createElement('button');
            tokenElement.textContent = token.name;
            tokenElement.classList.add('token-link', 'bg-blue-500', 'text-white', 'py-2', 'px-4', 'rounded-md', 'mb-2', 'block', 'w-full', 'text-left'); // Add Tailwind CSS classes
            tokenElement.dataset.token = JSON.stringify(token); // Store token data as a dataset attribute
            container.appendChild(tokenElement);

            // Add click event listener to show token details
            tokenElement.addEventListener('click', function () {
                const tokenData = JSON.parse(this.dataset.token);
                renderTokenDetails(tokenData); // Render token details
            });
        });
    }

    // Function to render token details
    function renderTokenDetails(tokenData) {
        tokenListView.style.display = 'none'; // Hide token list view
        tokenDetailsView.style.display = 'block'; // Show token details view

        const detailsContainer = document.getElementById('token-details-container');
        detailsContainer.innerHTML = ''; // Clear previous data

        // Render token details
        const title = document.createElement('h2');
        title.textContent = tokenData.name;
        detailsContainer.appendChild(title);

        const description = document.createElement('p');
        description.textContent = tokenData.description;
        detailsContainer.appendChild(description);

        // Render other token details similarly
    }

    // Function to handle navigation back to token list
    backToListButton.addEventListener('click', function () {
        tokenListView.style.display = 'block'; // Show token list view
        tokenDetailsView.style.display = 'none'; // Hide token details view
    });

    // Fetch and render token list on page load
    fetchAndRenderTokenList();
});
