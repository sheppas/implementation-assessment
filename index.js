require('dotenv').config();
const path = require('path');
const express = require('express');
const { Client, Config, CheckoutAPI } = require('@adyen/api-library');
const { PORT, API_KEY, MERCHANT_ACCOUNT, ENVIRONMENT } = require('./config');

const config = new Config();
// Set your X-API-KEY with the API key from the Customer Area.
config.apiKey = API_KEY;
config.merchantAccount = MERCHANT_ACCOUNT;
const client = new Client({ config });
client.setEnvironment(ENVIRONMENT);
const checkout = new CheckoutAPI(client);

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.use(express.static(__dirname + '/public'));

// debug this endpoint
app.post('/getPaymentMethods', (req, res) => {
  const { merchantAccount, countryCode, shopperLocale, amount } = req.body;
  checkout.paymentMethods({
    merchantAccount,
    countryCode,
    shopperLocale,
    amount: {
      currency: amount.currency,
      value: amount.value
    },
    channel: "Web"
  })
    .then(paymentMethodsResponse => res.json(paymentMethodsResponse))
    .catch(err => res.json({ message: err.message }));
});

// build this endpoint using the example above, along with our dropin documentation -> https://docs.adyen.com/online-payments/drop-in-web#step-3-make-a-payment
app.post('/makePayment', (req, res) => {
  // Your code here
});

// build this endpoint as well, using the documentation -> https://docs.adyen.com/online-payments/drop-in-web#step-4-additional-front-end
app.post('/additionalDetails', async (req, res) => {
  // Your code here
})

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
