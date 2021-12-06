require("dotenv").config();
const path = require("path");
const express = require("express");
const { Client, Config, CheckoutAPI } = require("@adyen/api-library");
const { PORT, API_KEY, MERCHANT_ACCOUNT, ENVIRONMENT } = require("./config");
const {v4: uuidv4 } = require('uuid')

// This is the server-side configuration.  It pulls the information supplied in the .env file to create an instance of the checkout API
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
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "index.html"));
});

app.use(express.static(__dirname + "/public"));

// this endpoint is (almost!) working
app.post("/paymentMethods", (req, res) => {
  const { merchantAccount, countryCode, shopperLocale, amount } = req.body;
  checkout
    .paymentMethods({
      merchantAccount,
      countryCode,
      shopperLocale,
      amount: {
        currency: amount.currency,
        value: amount.value
      },
      channel: "Web"
    })
    .then((response) => res.json(response))
    .catch((err) => {
      res.status(err.statusCode);
      res.json({ message: err.message });
    });
});

// build this endpoint using the example above, along with our dropin documentation -> https://docs.adyen.com/online-payments/web-drop-in/integrated-before-5-0-0?tab=codeBlockmethods_request_7#step-3-make-a-payment
app.post("/payments", (req, res) => {
  const {paymentMethod} = req.body.data
  const id = uuidv4()
  checkout
    .payments({
      merchantAccount: config.merchantAccount,
      paymentMethod,
      amount: req.body.amount,
      reference: id,
      returnUrl: `https://checkoutshopper-test.adyen.com/checkoutshopper/checkoutPaymentReturn`,
    })
    .then((response) => {
      res.json(response)})
    .catch((err) => {
      res.status(err.statusCode);
      res.json({ message: err.message });
    });
});

// build this endpoint as well, using the documentation -> https://docs.adyen.com/online-payments/web-drop-in/integrated-before-5-0-0?tab=codeBlockmethods_request_7#step-5-additional-payment-details
app.post("/payments/details", async (req, res) => {
  const {details} = req.body;
  return checkout
    .paymentMethods({
      redirectResult: details.redirectResult
    })
    .then((response) => res.json(response))
    .catch((err) => {
      res.status(err.statusCode);
      res.json({ message: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
