import { kycApiSequenceTests } from '../kycUtil/index.js'; // ✅ Import KYC API sequence
import { sampleData } from '../sample_data.js'; // ✅ Load Sample Data
import Pusher from 'pusher-js';
/**
 * ✅ Generates a random ID for partner order tracking
 */
function generateRandomId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

let quoteId, orderId, formData;

/**
 * ✅ Main Order API Sequence Test
 */
async function orderApiSequenceTests(transak) {
  console.log('🔄 Starting Order API Sequence Tests...');

  // ✅ 1. Fetch Quote
  const quoteData = await transak.public.getQuote(sampleData.quoteFields);
  if (quoteData && quoteData.quoteId) quoteId = quoteData.quoteId;
  console.log(`✅ Quote fetched: ${quoteId}`);

  // ✅ 2. Fetch KYC Forms & Check if KYC is Required
  const requiresKYC = await checkKYCStatus(transak, quoteId);
  if (requiresKYC) {
    console.log('⚠️ KYC Required! Running KYC Checks...');
    await kycApiSequenceTests(transak);
  }

  // ✅ 3. Check Order Limits
  await checkOrderLimits(transak);

  // ✅ Reserve Wallet
  const walletReserveData = await transak.order.walletReserve({
    quoteId,
    walletAddress: sampleData.walletAddress,
  });

  // ✅ Create Order
  if(sampleData.quoteFields.paymentMethod === 'credit_debit_card' || sampleData.quoteFields.paymentMethod === 'apple_pay' || sampleData.quoteFields.paymentMethod === 'google_pay') {
    orderId = await createCardPaymentOrder(transak, quoteId);
  } else {
    orderId = await createBankTransferOrder(transak, quoteId);
  }

  // ✅ Confirm Payment
  await confirmPayment(transak, orderId);

  // ✅ Poll Order Status Until Completion
  await waitForOrderCompletion(transak, orderId);
}

/**
 * ✅ Fetches KYC Forms to Check If KYC is Required
 */
async function checkKYCStatus(transak, quoteId) {
  console.log('🔄 Checking KYC Forms...');
  const res = await transak.user.getKycForms({ quoteId });
  formData = res;
  const forms = res.forms;
  console.log('✅ KYC Forms Fetched.');
  return forms.length > 0; // If forms exist, KYC is required
}

/**
 * ✅ Checks Order Limits Before Placing Order
 */
async function checkOrderLimits(transak) {
  console.log('🔄 Checking Order Limits...');

  const res = await transak.order.getOrderLimit({
    kycType: formData.kycType,
    isBuyOrSell: sampleData.quoteFields.isBuyOrSell,
    fiatCurrency: sampleData.quoteFields.fiatCurrency,
  });

  const remainingLimits = res.remaining;
  const fiatAmount = sampleData.quoteFields.fiatAmount; // Get fiat amount from quote

  // ✅ Ensure quote does not exceed daily, monthly, or yearly limits
  if (fiatAmount > remainingLimits['1']) {
    throw new Error(
      `❌ Order exceeds daily limit! Max allowed: ${remainingLimits['1']}, Quote: ${fiatAmount}`
    );
  }
  if (fiatAmount > remainingLimits['30']) {
    throw new Error(
      `❌ Order exceeds monthly limit! Max allowed: ${remainingLimits['30']}, Quote: ${fiatAmount}`
    );
  }
  if (fiatAmount > remainingLimits['365']) {
    throw new Error(
      `❌ Order exceeds yearly limit! Max allowed: ${remainingLimits['365']}, Quote: ${fiatAmount}`
    );
  }

  console.log('✅ Order is within limits.');
}

/**
 * ✅ Generates a card payment URL with the given parameters
 */
function generateCardPaymentUrl({
  ott,
  apiKey,
  environment,
  fiatCurrency,
  cryptoCurrency,
  isBuyOrSell,
  fiatAmount,
  network,
  paymentMethod,
  walletAddress,
  partnerOrderId
}) {
  return `https://${environment === 'staging' ? 'global-stg' : 'global'}.transak.com?` +
    `ott=${ott}&` +
    `apiKey=${apiKey}&` +
    `fiatCurrency=${fiatCurrency}&` +
    `cryptoCurrencyCode=${cryptoCurrency}&` +
    `productsAvailed=${isBuyOrSell}&` +
    `fiatAmount=${fiatAmount}&` +
    `network=${network}&` +
    `paymentMethod=${paymentMethod}&` +
    `hideExchangeScreen=true&` +
    `walletAddress=${walletAddress}&` +
    `partnerOrderId=${partnerOrderId}&` +
    `disableWalletAddressForm=true`;
}

/**
 * ✅ Creates Order Using `walletReserveId`
 */
async function createCardPaymentOrder(transak) {
  console.log('Requesting OTT...');
  const ottResponse = await transak.user.requestOtt();
  console.log('✅ OTT retrieved successfully.');
  
  const partnerOrderId = generateRandomId();
  const cardPaymentUrl = generateCardPaymentUrl({
    ott: ottResponse.token,
    apiKey: sampleData.env.PARTNER_API_KEY,
    environment: sampleData.env.ENVIRONMENT,
    fiatCurrency: sampleData.quoteFields.fiatCurrency,
    cryptoCurrency: sampleData.quoteFields.cryptoCurrency,
    isBuyOrSell: sampleData.quoteFields.isBuyOrSell,
    fiatAmount: sampleData.quoteFields.fiatAmount,
    network: sampleData.quoteFields.network,
    paymentMethod: sampleData.quoteFields.paymentMethod,
    walletAddress: sampleData.walletAddress,
    partnerOrderId
  });

  console.log(`Complete card payment order using the following link: ${cardPaymentUrl}`);
  return partnerOrderId;
}

async function createBankTransferOrder(transak, quoteId) {
  console.log('🔄 Creating Order...');

  const orderData = await transak.order.createOrder({ quoteId });
  orderId = orderData.id;

  console.log(`✅ Order Created: ${orderId}`);
  console.log(`🔗 Wallet Address: ${orderData.walletAddress}`);
  console.log(
    `💰 Fiat Amount: ${orderData.fiatAmount} ${orderData.fiatCurrency}`
  );
  console.log(
    `💱 Crypto Amount: ${orderData.cryptoAmount} ${orderData.cryptoCurrency}`
  );
  console.log(`📍 Order Status: ${orderData.status}`);

  // ✅ Extract and log bank details
  const paymentOptions = orderData?.paymentOptions
  if (paymentOptions && paymentOptions.length > 0) {
    console.log('🏦 **Bank Transfer Details:**');
    const paymentOption = paymentOptions[0];

    paymentOption.fields.forEach((field) => {
      console.log(`   - ${field.name}: ${field.value}`);
    });
  } else {
    console.warn('⚠️ No bank details found in the response.');
  }

  return orderId;
}

/**
 * ✅ Confirms Payment for Order
 */
async function confirmPayment(transak, orderId) {
  if(sampleData.quoteFields.paymentMethod === 'credit_debit_card' || sampleData.quoteFields.paymentMethod === 'apple_pay' || sampleData.quoteFields.paymentMethod === 'google_pay') {
    console.log('🔄 Payment Marked as Paid not required for this payment method.');
  } else {
    console.log('🔄 Confirming Payment...');
    const res = await transak.order.confirmPayment({
      orderId,
      paymentMethod: sampleData.quoteFields.paymentMethod,
    });
    console.log('✅ Payment Marked as Paid.');
  }
}

async function getOrderById(transak, orderId, isSkipTest) {
  const res = await transak.order.getOrderById({ orderId });
  // if(!isSkipTest) await executeApiTest(apiData, res);
  return res;
}

/**
 * ✅ Polls `GET /api/v2/orders/{orderId}` Every 30 Seconds Until Order is Completed
 */
async function waitForOrderCompletion(transak, orderId) {
  if(sampleData.quoteFields.paymentMethod === 'credit_debit_card' || sampleData.quoteFields.paymentMethod === 'apple_pay' || sampleData.quoteFields.paymentMethod === 'google_pay') {
    await waitForCardPaymentOrderCompletion(transak, orderId);
  }else{
    await waitForBankTransferOrderCompletion(transak, orderId);
  }
}

async function waitForCardPaymentOrderCompletion(transak, partnerOrderId) {
  // implement Transak pusher logic here  
  
  let pusher = new Pusher('1d9ffac87de599c61283', {cluster: 'ap2'});
  let channelName = `${transak.client.config.partnerApiKey }_${partnerOrderId}`
  let channel = pusher.subscribe(channelName);

  //receive updates of all the events
  channel.bind_global((eventId, orderData) => {
    console.log(`Listening to ${eventId}`)
    if( eventId === 'ORDER_CREATED' ) {
      console.log(`Order Created ${partnerOrderId}`)
    }
    if( eventId === 'ORDER_COMPLETED' ) {
      console.log(`ORDER_COMPLETED ${partnerOrderId}`)
    }
  });
}
async function waitForBankTransferOrderCompletion(transak, orderId) {
  const maxRetries = 20; // 10 minutes max wait time
  let retries = 0;

  while (retries < maxRetries) {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 30 seconds

    const orderData = await getOrderById(transak, orderId, retries > 0);
    const orderStatus = orderData.status;
    console.log(
      `🔄 Order Status: ${orderStatus} (Retry ${retries + 1}/${maxRetries})`
    );

    if (orderStatus === 'COMPLETED') {
      console.log('✅ Order Completed!');
      return;
    }

    retries++;
  }

  console.warn('⚠️ Order completion timeout reached.');
}

// ✅ Export Order Functions
export {
  orderApiSequenceTests,
};
