import { kycApiSequenceTests } from '../kycUtil/index.js'; // ✅ Import KYC API sequence
import { sampleData } from '../sample_data.js'; // ✅ Load Sample Data

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
  orderId = await createOrder(transak, quoteId);

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
 * ✅ Creates Order Using `walletReserveId`
 */
async function createOrder(transak, quoteId) {
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
  console.log('🔄 Confirming Payment...');
  const res = await transak.order.confirmPayment({
    orderId,
    paymentMethod: sampleData.quoteFields.paymentMethod,
  });
  console.log('✅ Payment Confirmed.');
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
