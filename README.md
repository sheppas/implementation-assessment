# Implementation Engineer Assessment

## Objective

This assessment will test your ability to follow documentation to debug and finish a working integraton with Adyen.  You will:

1. Complete the `/makePayment` endpoint
2. Complete the `/additionalDetails` endpoint
3. Have an integration that accepts [Credit Cards](https://docs.adyen.com/payment-methods/cards/web-drop-in), [SEPA](https://docs.adyen.com/payment-methods/sepa-direct-debit/web-drop-in), and [iDeal](https://docs.adyen.com/payment-methods/ideal/web-drop-in).
4. Debug any errors that may occur during your testing.

## Instructions

In `index.js`, you will find an (almost!) working `/getPaymentMethods` endpoint that is built following the instructions found in our [drop-in documentation](https://docs.adyen.com/online-payments/drop-in-web#step-1-get-available-payment-methods).  Utilizing this, as well as our documentation, finish the `/makePayment` and `/additionalDetails` endpoints.

Once these endpoints are complete, test to ensure that the integration is working as expected, with only Credit Cards, SEPA, and iDeal being accepted.  You can find test payment information [here](https://docs.adyen.com/development-resources/test-cards/test-card-numbers).

After you have completed each payment, take the pspReference of the successful transaction and put it in the `pspRefs.txt` file.

_Hint: There may be some lingering bugs on the front end (`/public`) that require your attention!_

## Installation

Clone this repo, install dependencies and start the server

In your command prompt, run

    ```
      $ git clone
      $ cd
      $ npm install
    ```

## Usage

For this to be tested local, there are a few items you must have:

1. A machine with [Node.js](https://nodejs.org/en/download/) installed

2. Adyen API key with correct permissions: you can find information on that [here](https://docs.adyen.com/development-resources/api-credentials#generate-api-key)

3. Client Key: you can find out how to create them [here](https://docs.adyen.com/development-resources/client-side-authentication#how-it-works)

Once you have these items, create a file in the root directory called `.env`. Use the template in `env_example` to create the keys and add the appropriate values.

_Note: the format should be `KEY=VALUE` with **NO SPACES** between the `=` and the values._

Now that these items are ready, you can start the application with

```
$ npm run start
```
