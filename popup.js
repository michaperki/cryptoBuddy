

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
    themeToggleButton.addEventListener('click', toggleTheme);
    showHawkSummaryButton.addEventListener('click', showHawkSummary);
    backToTokenDetailsButton.addEventListener('click', backToTokenDetails);

    // Function to toggle theme
    function toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark');
        // Store theme preference in localStorage
        localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
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
        hawkScore.textContent = tokenData.hawkScore;

        const hawkSummaryMarketData = document.getElementById('hawk-summary-market-data');
        hawkSummaryMarketData.textContent = tokenData.hawkSummary.marketData;

        const hawkSummaryFundamentals = document.getElementById('hawk-summary-fundamentals');
        hawkSummaryFundamentals.textContent = tokenData.hawkSummary.fundamentals;

        const hawkSummaryMomentum = document.getElementById('hawk-summary-momentum');
        hawkSummaryMomentum.textContent = tokenData.hawkSummary.momentum;

        const hawkSummarySocial = document.getElementById('hawk-summary-social');
        hawkSummarySocial.textContent = tokenData.hawkSummary.social;

        const hawkSummaryTradingBehavior = document.getElementById('hawk-summary-trading-behavior');
        hawkSummaryTradingBehavior.textContent = tokenData.hawkSummary.tradingBehavior;

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

    // Function to show Hawk Summary and hide Token Details
    function showHawkSummary() {
        tokenDetailsView.style.display = 'none';
        hawkSummaryView.style.display = 'block';
    }

    // Function to go back to Token Details view from Hawk Summary
    function backToTokenDetails() {
        hawkSummaryView.style.display = 'none';
        tokenDetailsView.style.display = 'block';
    }


    // Update current URL when the DOM content is loaded
    updateCurrentUrl();
});
