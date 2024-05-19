# Valr Staking Automation Script

This script automates the staking of SOL and AVAX on the Valr platform at one-hour intervals.

## Getting Started

### Prerequisites:

Node.js and npm (or yarn) installed.  
A Valr account with API credentials.  


### Installation:

Clone this repository or download the script.

Install dependencies:

Bash  
```
npm install dotenv crypto node-fetch@2
```
Use code with caution.  

### Configuration:  
Rename .env_sample to .env  

##Set up your API keys with the following configs:  
View access, Trade, Internal Transfer

Update the following environment variables, replacing placeholders with your Valr API credentials:
VALR_API_KEY_STAKING=your_api_key  
VALR_SECRET_STAKING=your_api_secret  

Update the below as needed for the specified product staking:  
SOLSTAKE=true  
AVAXSTAKE=true  
TRXSTAKE=true  

## Running the Script:

### Start the script:

Bash
```
node staking.js
```
Use code with caution.
## Script Functionality:

API Authentication: Uses HMAC SHA512 to sign API requests for security.  
Balance Retrieval: Employs getBalance function to fetch available balances for specified currencies.  
Staking: Utilizes stake function to initiate staking for SOL and AVAX (configurable using SOLSTAKE and AVAXSTAKE flags).  
Interval Execution: Runs cyclically with a one-hour interval for continuous staking.  
Logging: Provides informative messages for successful staking or failure alerts.  
## Important Notes:

Educational Purposes Only: Not intended for production environments without thorough testing and error handling.  
Inherent Risks: Staking cryptocurrency involves risks. Understand potential risks before usage.  
Staking Entire Balance: Currently stakes the entire available balance for specified currencies. Modify as needed for partial staking.  
For further details, refer to the in-code comments and documentation.  

## Tips

If you found this script helpful, you can show your appreciation by sending a tip to Mohammed using Valr Pay at 6SXBAT989R8HDV3DAU3Z.
