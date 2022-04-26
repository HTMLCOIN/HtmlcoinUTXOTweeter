# HtmlcoinUTXOTweeter
Node js project to post to twitter when HTMLcoin transactions exceeds a specific transaction value

1. Go to https://dev.to/codesphere/using-the-twitter-api-with-nodejs-4p3c for tutorial if you want to follow it.

2. Go to https://developer.twitter.com/en/apply-for-access and create a developer account. This should be from the account where you want to tweet from.

3. Request elevated rights on your account.

4. Create a new project and also elevate the rights on the oAuth v1 API to read and write. You need to give a callback URL, I simply gave my static website as I won't be using oAuth in that way.

5. Generate access token and secret.

6. Extract zip file and run "npm install" from the root directory of the unzipped folder.
The following dependencies will be installed:
`"node-fetch": "^2.6.7"`, `"twitter-api-v2": "^1.12.0"`

7. Replace the values in the htmlcoinGetLatestTxns.js for appKey, appSecret, accessToken and accessSecret

8. Add new icons if additional icons should be used in tweets. Can be copied from `https://getemoji.com/`.

9. Update blocked address list if needed.

10. Run "node htmlcoinGetLatestTxns.js" from the root directory of the unzipped folder.

## Console Outputs:

### New Tweets
````
HtmlcoinWhalePost roebou$ node htmlcoinGetLatestTxns.js 
Loading tweeted hashes
Retrieving latest transactions
Looping through latest transactions
Processing e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5

Whale Address: HjrqigpoUVPp5cJMyqfqFuru2qsn1vGYZx
Transaction Amount: 500500.76036000
Transaction Fee: 0.00175200
Transaction Hash: e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
Transaction URL: https://explorer.htmlcoin.com/tx/e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
Tweeting e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
Tweet posted for e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
Processing 748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23

Whale Address: HjrqigpoUVPp5cJMyqfqFuru2qsn1vGYZx
Transaction Amount: 500505.76211200
Transaction Fee: 0.00175200
Transaction Hash: 748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
Transaction URL: https://explorer.htmlcoin.com/tx/748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
Tweeting 748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
Tweet posted for 748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
Done with transaction processing and tweets. Writing tweeted hashes to disk.
HtmlcoinWhalePost roebou$ 
````

### Nothing New To Tweet
````
HtmlcoinWhalePost roebou$ node htmlcoinGetLatestTxns.js 
Loading tweeted hashes
Retrieving latest transactions
Looping through latest transactions
Done with transaction processing and tweets. Writing tweeted hashes to disk.
HtmlcoinWhalePost roebou$
````

### Trying to tweet the same thing again (Removed some of the error lines)
````
HtmlcoinWhalePost roebou$ node htmlcoinGetLatestTxns.js 
Loading tweeted hashes
Retrieving latest transactions
Looping through latest transactions
Processing e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5

Whale Address: HjrqigpoUVPp5cJMyqfqFuru2qsn1vGYZx
Transaction Amount: 500500.76036000
Transaction Fee: 0.00175200
Transaction Hash: e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
Transaction URL: https://explorer.htmlcoin.com/tx/e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
Tweeting e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
Attempted to post Tweet for e7384150863a6bb9edc9617e44115c281a663df1e64590dddb7a5454872d57c5
ApiResponseError: Request failed with code 403 - Status is a duplicate. (Twitter code 187)

Whale Address: HjrqigpoUVPp5cJMyqfqFuru2qsn1vGYZx
Transaction Amount: 500505.76211200
Transaction Fee: 0.00175200
Transaction Hash: 748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
Transaction URL: https://explorer.htmlcoin.com/tx/748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
Tweeting 748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
Attempted to post Tweet for 748f74fc46797407e6e9f1b6ff08b449e97dcdc243f0d8935c5aea2354455d23
ApiResponseError: Request failed with code 403 - Status is a duplicate. (Twitter code 187)
HtmlcoinWhalePost roebou$
````
