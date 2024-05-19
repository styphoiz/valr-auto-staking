const dotenv = require("dotenv");
const crypto = require("crypto");
const fetch = require("node-fetch"); // Require node-fetch for Node.js make sure this is node-fetch@2
dotenv.config();

const apiKey = process.env.VALR_API_KEY_STAKING;
const secret = process.env.VALR_SECRET_STAKING;
const SOLSTAKE = true;
const AVAXSTAKE = true;
const TRXSTAKE = true;

async function getBalance(currency, fixed, roundDown = false) {
  const url = `https://api.valr.com/v1/account/balances?excludeZeroBalances=true`;

  // Get the current timestamp in milliseconds
  const timestamp = Date.now();

  // Create the X-VALR-SIGNATURE header using the signRequest function
  const signature = crypto
    .createHmac("sha512", secret)
    .update(timestamp.toString())
    .update("GET")
    .update(`/v1/account/balances?excludeZeroBalances=true`)
    .digest("hex");

  const headers = new fetch.Headers();
  headers.append("Content-Type", "application/json");
  headers.append("X-VALR-API-KEY", apiKey);
  headers.append("X-VALR-SIGNATURE", signature);
  headers.append("X-VALR-TIMESTAMP", timestamp.toString());

  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`API Error - Status Code: ${response.status}`);
    }
    const result = await response.text();
    const jsonResult = JSON.parse(result).filter((a) => a.currency == currency);
    if (roundDown) {
      return (
        Math.floor(parseFloat(jsonResult[0].available) * Math.pow(10, fixed)) /
        Math.pow(10, fixed)
      );
    } else {
      return parseFloat(jsonResult[0].available).toFixed(fixed);
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function stake(currencySymbol, value) {
  const url = `https://api.valr.com/v1/staking/stake`;
  const amount = value.toString();

  // Get the current timestamp in milliseconds
  const timestamp = Date.now();

  //Create the request body
  const requestBody = JSON.stringify({
    currencySymbol,
    amount,
  });

  // Create the X-VALR-SIGNATURE header using the signRequest function
  const signature = crypto
    .createHmac("sha512", secret)
    .update(timestamp.toString())
    .update("POST")
    .update(`/v1/staking/stake`)
    .update(requestBody)
    .digest("hex");

  const headers = new fetch.Headers();
  headers.append("Content-Type", "application/json");
  headers.append("X-VALR-API-KEY", apiKey);
  headers.append("X-VALR-SIGNATURE", signature);
  headers.append("X-VALR-TIMESTAMP", timestamp.toString());

  const requestOptions = {
    method: "POST",
    headers,
    body: requestBody,
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      console.error(`API Error - Status Code: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Error:", error.message);
    return response;
  }
}
async function runInterval1() {
  try {
    if (SOLSTAKE) {
      const solBal = await getBalance("SOL", 8, true);
      console.log(`[${new Date().toISOString()}] Staking SOL: ${solBal} SOL`);
      const solStakeResponse = await stake("SOL", solBal);
      if (solStakeResponse.ok) {
        console.log(`[${new Date().toISOString()}] SOL staked successfully`);
      } else {
        console.log(`[${new Date().toISOString()}] Failed to stake SOL`);
      }
    }
    if (AVAXSTAKE) {
      const avaxBal = await getBalance("AVAX", 8, true);
      console.log(
        `[${new Date().toISOString()}] Staking AVAX: ${avaxBal} AVAX`
      );
      const avaxStakeResponse = await stake("AVAX", avaxBal);
      if (avaxStakeResponse.ok) {
        console.log(`[${new Date().toISOString()}] AVAX staked successfully`);
      } else {
        console.log(`[${new Date().toISOString()}] Failed to stake AVAX`);
      }
    }
    if (TRXSTAKE) {
      const trxBal = await getBalance("TRX", 6, true);
      console.log(`[${new Date().toISOString()}] Staking TRX: ${trxBal} TRX`);
      const trxStakeResponse = await stake("TRX", trxBal);
      if (trxStakeResponse.ok) {
        console.log(`[${new Date().toISOString()}] TRX staked successfully`);
      } else {
        console.log(`[${new Date().toISOString()}] Failed to stake TRX`);
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    // Handle the error gracefully
  }

  setTimeout(() => {
    runInterval1();
  }, 3600000); // Run every hour
}

// Start the intervals immediately
runInterval1(); // Initial trigger for runInterval1
