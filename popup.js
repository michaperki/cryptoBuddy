

document.addEventListener('DOMContentLoaded', function () {
    // Constants for DOM elements
    const tokenDetailsView = document.getElementById('token-details-view');
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const currentUrlElement = document.getElementById('current-url'); // Define currentUrlElement

    // Event listeners
    themeToggleButton.addEventListener('click', toggleTheme);

    // Function to toggle theme
    function toggleTheme() {
        document.body.classList.toggle('dark');
    }

    // Function to update current URL
    function updateCurrentUrl() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs[0] && tabs[0].url) {
                getCryptoNameFromURL(tabs[0].url); // Pass the URL to getCryptoNameFromURL
            } else {
                console.error('Failed to get current URL.');
                // Handle error: Failed to get current URL
            }
        });
    }

    // Function to extract cryptocurrency name from URL
    function getCryptoNameFromURL(url) {
        const coinMarketCapDomain = 'coinmarketcap.com';

        // Check if the URL contains the CoinMarketCap domain
        if (url.includes(coinMarketCapDomain)) {
            // Extract the path from the URL
            const urlParts = url.split('/');
            console.log('URL parts:', urlParts);
            const coin = urlParts[urlParts.length - 2]; // Get the last part of the URL
            console.log('Coin:', coin);
            searchCryptoData(coin); // Pass the extracted cryptocurrency name to searchCryptoData
        } else {
            console.error('Not on CoinMarketCap. Extension will not work on this site.');
            // Handle error: Not on CoinMarketCap
        }
    }

    // Function to search data for cryptocurrency details
    function searchCryptoData(cryptoName) {
        fetch('assets/data.json')
            .then(response => response.json())
            .then(data => {
                const tokens = data.tokens;
                const matchingToken = tokens.find(token => token.name.toLowerCase() === cryptoName.toLowerCase());
                if (matchingToken) {
                    renderTokenDetails(matchingToken);
                } else {
                    console.error('Cryptocurrency not found in data:', cryptoName);
                    // Handle error: Cryptocurrency not found
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to render token details
    function renderTokenDetails(tokenData) {
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

    // Update current URL when the DOM content is loaded
    updateCurrentUrl();
});
