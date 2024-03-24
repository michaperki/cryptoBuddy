document.addEventListener('DOMContentLoaded', function () {
    // Constants for DOM elements
    const tokenDetailsView = document.getElementById('token-details-view');
    const hawkSummaryView = document.getElementById('hawk-summary-view');
    const showHawkSummaryButton = document.getElementById('show-hawk-summary');
    const backToTokenDetailsButton = document.getElementById('back-to-token-details');
    const themeToggleButton = document.getElementById('theme-toggle-button');


    // Retrieve theme preference from localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark');
    }

    // Event listeners
    showHawkSummaryButton.addEventListener('click', toggleHawkSummary);
    themeToggleButton.addEventListener('click', toggleTheme);
    backToTokenDetailsButton.addEventListener('click', function () {
        tokenDetailsView.style.display = 'block'; // Show token details view
        hawkSummaryView.style.display = 'none'; // Hide Hawk Summary view
    });

    // Function to toggle theme
    function toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark');
        // Store theme preference in localStorage
        localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
    }
    // Function to toggle Hawk Summary view
    function toggleHawkSummary() {
        tokenDetailsView.style.display = 'none'; // Hide token details view
        hawkSummaryView.style.display = 'block'; // Show Hawk Summary view
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

            // Update the placeholder with the extracted cryptocurrency name
            const cryptoNamePlaceholder = document.getElementById('crypto-name-placeholder');
            cryptoNamePlaceholder.textContent = coin;
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

    function renderTokenDetails(tokenData) {
        if (!tokenData) {
            console.error('Token data is missing.');
            return;
        }

        tokenDetailsView.style.display = 'block'; // Show token details view

        const detailsContainer = document.getElementById('token-details-container');
        detailsContainer.innerHTML = ''; // Clear previous data

        const coin = document.getElementById('coin-name');
        const prompt = "What does Hawk Finance think about " + tokenData.name + "?";
        coin.textContent = prompt;

        const hawkScore = document.getElementById('hawk-score');
        hawkScore.textContent = tokenData.scores.hawkscore;

        const hawkSummaryMarketData = document.getElementById('hawk-summary-market-data');
        hawkSummaryMarketData.textContent = tokenData.scores.hawkscore_market_data;

        const hawkSummaryFundamentals = document.getElementById('hawk-summary-fundamentals');
        hawkSummaryFundamentals.textContent = tokenData.scores.hawkscore_fundamental;

        const hawkSummaryMomentum = document.getElementById('hawk-summary-momentum');
        hawkSummaryMomentum.textContent = tokenData.scores.hawkscore_momentum;

        const hawkSummarySocial = document.getElementById('hawk-summary-social');
        hawkSummarySocial.textContent = tokenData.scores.hawkscore_social;

        const hawkSummaryTradingBehavior = document.getElementById('hawk-summary-trading-behavior');
        hawkSummaryTradingBehavior.textContent = tokenData.scores.hawkscore_trading_behavior;

        const price = document.getElementById('coin-price');
        price.textContent = tokenData.price;

        // Render token details
        const title = document.createElement('h2');
        title.textContent = tokenData.name;
        detailsContainer.appendChild(title);

        const description = document.createElement('p');
        description.textContent = tokenData.description;
        detailsContainer.appendChild(description);

        // Update current URL to get the latest data
        updateCurrentUrl();
    }

    // Update current URL when the DOM content is loaded
    updateCurrentUrl();
});

// Function to calculate color based on the score value
function calculateColor(score) {
    // Assuming score ranges from 0 to 100
    const hue = ((100 - score) * 120) / 100;
    const backgroundColor = `hsl(${hue}, 100%, 50%)`;

    // Calculate brightness of the background color
    const rgb = hexToRgb(backgroundColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

    // Determine text color based on brightness
    const textColor = brightness > 125 ? '#333' : '#fff';

    return { backgroundColor, textColor };
}

// Function to convert hex color to RGB
function hexToRgb(hex) {
    // Remove "#" if present
    hex = hex.replace(/^#/, '');

    // Convert shorthand hex color to full hex
    if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }

    // Parse hex to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}