const { ApolloClient, InMemoryCache, HttpLink, gql } = require('@apollo/client');
const React = require('react');
module.exports = { getHawkData };



const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://vkt772nlw4.execute-api.us-east-1.amazonaws.com/', 
    headers: {
      Authorization: "c7ad1d91-9963-4541-adf7-e4368ea4de70",
    }
  }),
  cache: new InMemoryCache()
});

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
        const response = await client.query({
          query: GET_DATA,
          variables: { name: tokenName } // Pass the tokenName as a variable
        });
        console.log(response.data);
        return response.data; // Return the data
    } catch (error) {
        console.error(error);
        return error; // Handle the error
    }
}

// To handle async correctly outside of an async function, use then/catch or an IIFE
getHawkData("ethereum").then(data => console.log(data)).catch(error => console.error(error));
