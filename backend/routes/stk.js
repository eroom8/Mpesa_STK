const express = require('express');
const axios = require('axios');
require('dotenv').config();
const moment = require('moment');
const fs = require('fs');
const router = express.Router();

// Define your Safaricom API credentials as environment variables
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.SECRET_KEY;

let token;

const generateToken = (req, res, next) => {
  const auth = Buffer.from(consumerKey + ":" + consumerSecret).toString("base64");

  axios
    .get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${auth}`,
      }
    })
    .then(response => {
      if (response.data.error) {
        console.error("Error generating token:", response.data.error);
        return res.status(500).json({ error: "Token generation failed" });
      }
      token = response.data.access_token;

      // Log the access token to the console
      console.log("Access Token:", token);

      next();
    })
    .catch(error => {
      console.error("Error generating token:", error);
      res.status(500).json({ error: "Token generation failed" });
    });
};

const handleStkPush = (req, res) => {
  const phone = req.body.phone;
  const amount = req.body.amount;
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = Buffer.from(process.env.SHORT_CODE + process.env.PASSKEY + timestamp).toString('base64');

  axios
    .post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      BusinessShortCode: '174379',
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: `254${phone}`,
      PartyB: '174379',
      PhoneNumber: `254${phone}`,
      CallBackURL: 'https://7a92-102-217-157-222.ngrok-free.app',
      AccountReference: 'DEV Eroom test',
      TransactionDesc: 'Eroom backend',
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      console.log("STK Push Request Response Status Code:", response.status);
      console.log("STK Push Request Response Body:", response.data);

      if (response.data.error) {
        console.error("Error initiating STK push:", response.data.error);
        res.status(500).json({ error: "Internal server error" });
      } else if (response.data.ResponseCode === '0') {
        // Save the successful response to a JSON file
        const responseFileName = `stk_response_${Date.now()}.json`;
        fs.writeFile(responseFileName, JSON.stringify(response.data, null, 2), (err) => {
          if (err) {
            console.error("Error saving STK response:", err);
          } else {
            console.log("STK response saved as", responseFileName);
          }
        });

        res.status(200).json(response.data);
      } else {
        console.error("Safaricom API Error. Response:", response.data);
        res.status(500).json({ error: "M-PESA API error" });
      }
    })
    .catch(error => {
      console.error("Error initiating STK push:", error);
      res.status(500).json({ error: "Internal server error" });
    });
};


router.post('/stk', generateToken, handleStkPush);

module.exports = router;
