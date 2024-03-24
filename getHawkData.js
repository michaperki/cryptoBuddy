const { ApolloClient, InMemoryCache, HttpLink, gql } = require('@apollo/client');

// Exporting the getHawkData function
module.exports = { getHawkData };

// Creating a new ApolloClient instance
const client = new ApolloClient({
    link: new HttpLink({
        uri: 'https://vkt772nlw4.execute-api.us-east-1.amazonaws.com/',
        headers: {
            Authorization: "c7ad1d91-9963-4541-adf7-e4368ea4de70",
        }
    }),
    cache: new InMemoryCache()
});

// Defining the getHawkData function
async function getHawkData(tokenName) {
    const GET_DATA = gql`
        query Coin($name: String!) {
            coin(name: $name) {
                name
                symbol
                image
                scores {
                    hawkscore
                    hawkscore_fundamental
                    hawkscore_market_data
                    hawkscore_momentum
                    hawkscore_social
                    hawkscore_trading_behavior
                }
                trend
                market_cap
                vol_mcap
                circulating_supply
                max_supply
                messari {
                    profile {
                        general {
                            overview {
                                project_details
                            }
                        }
                    }
                }
                momentum {
                    VOLATILITY_1D
                }
            }
        }`;

    try {
        // Sending the query to the Apollo client
        const response = await client.query({
            query: GET_DATA,
            variables: { name: tokenName } // Pass the tokenName as a variable
        });
        // Logging the response data
        console.log("Data received:", response.data);
        // Returning the data
        return response.data;
    } catch (error) {
        // Handling errors
        console.error("An error occurred while fetching data:", error.message);
        return error; // Returning the error
    }
}

// Invoking the getHawkData function with a token name
getHawkData("ethereum")
    .then(data => console.log("Data successfully retrieved:", data))
    .catch(error => console.error("Error fetching data:", error));
