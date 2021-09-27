const config = {
  clientKey: 'test_CTOT7ZHBDVAHBHIABJ63CUQW7QMVDQFD',
  merchantAccount: 'MikeOssig',
  countryCode: "NL",
  shopperLocale: "en_US",
  amount: { currency: "EUR", value: 1000, }
};

const postRequest = async (url, payload) => {
  try {
    const response = await fetch(url, {
      url,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(payload),
      json: true
    });

    return response.json();
  } catch (err) {
    console.error(err.message);
  };
};

const successPage = (`
  <div id="success">
    <h1 id="success-message">
      Success!
    </h1>
  </div>
`)

const showFinalResult = () => {
  const container = document.getElementById("container");
  console.log(container);
  container.innerHTML = successPage;
}

const createDropinConfig = paymentMethodsResponse => {
  return {
    paymentMethodsResponse,
    clientKey: config.clientKey,
    merchantAccount: config.merchantAccount,
    locale: config.shopperLocale,
    removePaymentMethods: ["paypal", "sepadirectdebit", "alipay", "unionpay"],
    environment: "test",
    onSubmit: async (state, dropin) => {
      console.log('called')
      const response = await postRequest('/makePayment', state.data);
      if (response.action) {
        dropin.handleAction(response.action);
      } else {
        console.log(response);
        showFinalResult()
      };
    },
    onAdditionalDetails: async (state, dropin) => {
      const response = await postRequest('/additionalDetails', state.data);
      if (response.action) {
        dropin.handleAction(response.action);
      } else {
        console.log(response);
        // showFInalResult(response)
      };
    }
  };
};

window.addEventListener('load', async e => {
  const paymentMethodsResponse = await postRequest('/getPaymentMethods', {
    merchantAccount: config.merchantAccount,
    countryCode: config.countryCode,
    shopperLocale: config.shopperLocale,
    amount: config.amount
  });

  const checkout = new AdyenCheckout(createDropinConfig(paymentMethodsResponse));

  checkout.create('dropin').mount('#dropin-container')
});