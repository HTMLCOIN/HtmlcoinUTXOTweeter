// Load modules and constants
const fs = require("fs");
const fetch = require("node-fetch");
const { TwitterApi } = require("twitter-api-v2");
const BASEDIR = process.cwd();

const minimumWhaleTxnAmount = 1000000; // Minimum transaction value to trigger alert
const decimalDivision = 100000000;
const decimalView = 8;
const messageIcons = ['🚨', '💰']; // Add icons that will be randomized for each tweet. Add more from https://getemoji.com/ .
const blockedReceivingAddresses = ['HtVJqijoMd3PyQvvERZ9fp6snNiPdyhSwz', 'Hcb5R86UD9A7X6NWmy6UpW6uVuieVgdMRR', 'HmMWCqmqFSttE1NMAesEao26Zqm3NAqrCX']; // Add addresses to be blocked into this array.

const client = new TwitterApi({
  appKey: 'INSERTKEY',
  appSecret: 'INSERTKEY',
  accessToken: 'INSERTKEY',
  accessSecret: 'INSERTKEY',
});

// Check if the tracking directory exists and if not, then create it.
if (!fs.existsSync(`${BASEDIR}/tracking/`)) {
  fs.mkdirSync(`${BASEDIR}/tracking/`);
}

// Check if the tweeted hashes json file exists and if not, then create it.
if (!fs.existsSync(`${BASEDIR}/tracking/tweetedHashes.json`)) {
  // Write the tweetedHashes array to the tracking directory
  fs.writeFileSync(
    `${BASEDIR}/tracking/tweetedHashes.json`,
    JSON.stringify([], null, 2)
  );
}

// Main function - called asynchronously
async function main() {
  console.log("Loading tweeted hashes");

  // Load the tweeted hashes json file and parse it as JSON
  const tweetedHashesFile = fs.readFileSync(
    `${BASEDIR}/tracking/tweetedHashes.json`
  );
  const tweetedHashes = JSON.parse(tweetedHashesFile);

  try {
    console.log("Retrieving latest transactions");

    // Setup the API details
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Call the fetchWithRetry function that will perform the API call
    const response = await fetchWithRetry(
      "https://info.htmlcoin.com/api/recent-txs",
      options
    );
    
    console.log("Looping through latest transactions");

    // Loop through the transactions returned from the API call
    for (const transaction of response) {

      let processTweet = true;

      // Check if receiving addresses can be found in the blocked tweet address list
      for (i = 0; i < transaction.outputs.length; i++) {
        if (blockedReceivingAddresses.includes(transaction.outputs[i].address)) {
          processTweet = false;
          break;
        }
      }

      // Only tweet the transaction if none of the addresses are blocked
      if(processTweet) {
        // Check if the transaction hash can be found in the tweeted hashes file and only process it if it is not in the file
        if (!tweetedHashes.includes(transaction.id)) {
          // Format the value and fee fields
          const transactionValue = (
            Math.floor(parseFloat(transaction.inputValue) / decimalDivision)
          );
          
          const transactionFee = (
            parseFloat(transaction.fees) / decimalDivision
          ).toFixed(decimalView);

          // Check if the transaction value is greater than the minimumWhaleTxnAmount amount
          if (transactionValue >= minimumWhaleTxnAmount) {

            console.log(`Processing ${transaction.id}`);

            console.log(
              "--------------------------------------------------------------------------------------------"
            );
            console.log(`Transaction Amount: ${transactionValue} HTML`);
            console.log(`Transaction Fee: ${transactionFee} HTML`);
            console.log(
              `Transaction URL: https://info.htmlcoin.com/tx/${transaction.id}`
            );

            // Build tweet text
            const tweetIcon = messageIcons[Math.floor(Math.random()*messageIcons.length)]
            const tweetText = `${tweetIcon}Whale Transaction Alert${tweetIcon}\r\n\r\nTransaction Amount: ${transactionValue} HTML\r\nTransaction Fee: ${transactionFee} HTML\r\n\r\n\r\nTransaction URL: https://info.htmlcoin.com/tx/${transaction.id}\r\n`;
            
            console.log(`Tweeting ${transaction.id}`);

            // Tweet from account
            await client.v1
              .tweet(tweetText)
              .then((val) => {
                console.log(`Tweet posted for ${transaction.id}`);
              
                // If tweet was successful, then add the transaction hash to the tweeted hashes array
                tweetedHashes.push(transaction.id);
              })
              .catch((err) => {
                console.log(`Attempted to post Tweet for ${transaction.id}`);
                console.log(err);
              });
          }
        }
      }
    }

    console.log(
      "Done with transaction processing and tweets. Writing tweeted hashes to disk."
    );

    // Write the updated tweetedHashes array to the tracking directory
    fs.writeFileSync(
      `${BASEDIR}/tracking/tweetedHashes.json`,
      JSON.stringify(tweetedHashes, null, 2)
    );
  } catch (error) {
    console.log(error);

    // Write the tweetedHashes array to the tracking directory
    fs.writeFileSync(
      `${BASEDIR}/tracking/tweetedHashes.json`,
      JSON.stringify(tweetedHashes, null, 2)
    );
  }
}

// Start the main process.
main();

// fetchWithRetry function - This function is used to perform API calls
function fetchWithRetry(url, options) {
  return new Promise((resolve, reject) => {
    // Set maximum number of retries for the API call
    let numberOfRetries = 1;

    // Constant that will perform an API call and return a resolve or reject
    const fetch_retry = (_url, _options, _numberOfRetries) => {
      // Perform the API call
      return fetch("https://info.htmlcoin.com/api/recent-txs", _options)
        .then(async (res) => {
          // Create a variable that will contain the HTTP Status code
          const status = res.status;

          // Check the status and if 200, then move to the processing part of the object
          if (status === 200) {
            return resolve(res.json());
          } // If the status is not 200, throw an error and move to the catch block
          else {
            throw `ERROR STATUS: ${status}`;
          }
        })
        .catch(async (error) => {
          console.error(`CATCH ERROR: ${error}`);

          // Check if there are any retry attempts left
          if (_numberOfRetries !== 0) {
            console.log(`Retrying api call`);

            fetch_retry(_url, _options, _numberOfRetries - 1);
          } // If the total number of retries have been reached, then respond with a reject and finish the fetch_retry process
          else {
            console.log("All requests were unsuccessful for current item.");
            reject(error);
          }
        });
    };

    // Call the fetch_retry constant. Pass in the meta JSON object and the total number of retries for the API call should it experience any issues.
    return fetch_retry(url, options, numberOfRetries);
  });
}
