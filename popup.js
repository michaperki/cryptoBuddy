document.addEventListener('DOMContentLoaded', function () {
    // Constants for DOM elements
    const chatOutput = document.getElementById('chat-output');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const tokenListView = document.getElementById('token-list-view');
    const tokenDetailsView = document.getElementById('token-details-view');
    const backToListButton = document.getElementById('back-to-list-button');
    const themeToggleButton = document.getElementById('theme-toggle-button');

    // Event listeners
    sendButton.addEventListener('click', handleSendMessage);
    backToListButton.addEventListener('click', handleBackToList);
    themeToggleButton.addEventListener('click', toggleTheme);

    // Function to handle sending a message
    function handleSendMessage() {
        const message = userInput.value;
        if (message.trim() !== '') {
            sendMessage(message);
            userInput.value = '';
        }
    }

    // Function to send a message
    async function sendMessage(message) {
        const chatBubble = document.createElement('div');
        chatBubble.classList.add('chat-bubble');
        chatBubble.textContent = 'User: ' + message;
        chatOutput.appendChild(chatBubble);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + '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', // Accessing the API key from environment variables
                },
                body: JSON.stringify({ message: message }),
            });
            const data = await response.json();
            console.log('API Response:', data); // Log the response from the API
            if (response.ok) {
                const chatGPTResponse = data.response; // Assuming your API returns the response under "response" key
                const responseBubble = document.createElement('div');
                responseBubble.classList.add('chat-bubble');
                responseBubble.textContent = 'ChatGPT: ' + chatGPTResponse;
                chatOutput.appendChild(responseBubble);
            } else {
                throw new Error(data.error || 'Failed to get response from ChatGPT');
            }
        } catch (error) {
            console.error('Error sending message to ChatGPT:', error);
            console.error('Error details:', error.message); // Log the error message for debugging
            // Handle error
        }
    }



    // Function to handle navigation back to token list
    function handleBackToList() {
        tokenListView.style.display = 'block'; // Show token list view
        tokenDetailsView.style.display = 'none'; // Hide token details view
    }

    // Function to toggle theme
    function toggleTheme() {
        document.body.classList.toggle('dark');
    }

    // Function to fetch JSON data and render token list
    function fetchAndRenderTokenList() {
        fetch('assets/data.json')
            .then(response => response.json())
            .then(renderTokenList)
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

    // Fetch and render token list on page load
    fetchAndRenderTokenList();

    // Your existing code...
});