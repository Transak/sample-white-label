## Overview

The **Transak API Client SDK** provides a simple and efficient way to integrate with the **Transak API** for cryptocurrency and fiat transactions. This SDK allows developers to:

- Fetch cryptocurrency & fiat currency data
- Get quotes for transactions
- Manage user authentication (email OTP verification)
- Submit multi-level KYC
- Reserve wallets and create orders
- Fetch order details and transaction statuses

The SDK is structured to follow best practices and provides a clean, modular interface for seamless API integration.

---

## Installation

```bash
npm install 
```

---

## Run Sample UI integration

```bash
npm start 
```

---

## Run API sequence from Terminal/ Backend

```bash
npm run api-sequence-test 
```

---
## Configuration & Setup

### **1️⃣  Import the SDK & Initialize with API Key & Environment**

```jsx

import { TransakAPI } from './lib/index.js';
// Optionally, if TransakAPI needs configuration, pass it here (e.g., your API key, base URL, etc.)
const transakSdk = new TransakAPI({
    environment: 'staging',
    partnerApiKey: '0b4a8ff3-0d7e-409b-a6b9-3b82094b0f03',
});

```

> Note: The SDK supports both Staging and Production environments.
> 

---

## Authentication

**Getting Started**

To use this function, you must first **request a** `partnerApiKey` **Key** from Transak. You can obtain it by reaching out to: **Sales Team:** [sales@transak.com](mailto:sales@transak.com).  Once you receive your **Partner** **API key**, you can pass them in the request along with the **user’s email address**.

**How It Works**

1. The **email OTP request is user-centric**—Transak sends a **one-time password (OTP)** to the user’s email.
2. The user enters the OTP in your application.
3. You verify the OTP using **verifyEmailOtp** to obtain an **access token**.
4. Once authenticated, you can proceed with **further actions like KYC verification, order placement, etc.**.

### **Send Email OTP**

The `sendEmailOtp` function is a **non-authenticated** API method that allows you to initiate user authentication by sending an OTP to the provided email address.

**Example Usage**

```jsx
await transak.user.sendEmailOtp({ email: 'user@example.com' });
```

> Response Output Fields:
> 

```json
{ "isTncAccepted": "boolean",
  "stateToken": "string",
  "email": "string",
  "expiresIn": "integer"
}
```

### **Verify Email OTP**

The `verifyEmailOtp` is a **non-authenticated API** that allows you to **verify a user’s email using an OTP** and retrieve an **access token** in return.

Once you have successfully called `sendEmailOtp`, you need to pass the **otp** & **stateToken** along with the user’s email to **verify the OTP**.

**Access Token Usage**

- This **access token is required** for all **authenticated API calls** (such as placing orders, fetching user details, and submitting KYC).
- This **access token remains valid for 30 days from the time of generation**. Once expired, the user must restart the authentication process by requesting a new OTP.

**Example Usage**

```jsx
const response = await transak.user.verifyEmailOtp({
    email: 'user@example.com',
    otp: '123456',
    stateToken: 'state-token-from-sendEmailOtp-response'
});
console.log(response);
```

> Response Output Fields:
> 

```json
{
  "accessToken": "string", 
  "ttl": "number", 
  "created": "string"
}
```

### **Refresh Access Token**

The `refreshAccessToken` is an **authenticated API** that allows you to **regenerate an access token** when it is about to expire.

This **access token remains valid for 30 days from the time of generation**
- If not expired, you can use this API to refresh the token without requiring the user to re-enter their OTP.
- If expired, the user must restart the authentication process by requesting a new OTP.


**Example Usage**

```jsx
const response = await transak.user.refresh_access_token({ accessToken });
console.log(response);
```

> Response Output Fields:
>

```json
{
  "accessToken": "string"
}
```

---

## Cryptocurrency, Fiat & Quote Data

### **Fetch Crypto Currencies**

`getCryptoCurrencies` helps you fetch the list of supported cryptocurrencies along with high-level data, including the cryptocurrency name, symbol, and whether it is allowed for transactions. This is a **public API endpoint**, so no authentication is required.

**Example Usage**

```jsx
const cryptos = await transak.public.getCryptoCurrencies();
console.log(cryptos);
```

### **Fetch Fiat Currencies**

`getFiatCurrencies` allows you to fetch the list of supported fiat currencies along with their respective **supported countries, payment methods, and transaction limits**. Since different **payment methods** have varying **transaction limits**, this API provides details on the limits applicable for each fiat currency. This is a **public API endpoint**, so no authentication is required.

**Example Usage**

```jsx
const fiats = await transak.public.getFiatCurrencies();
console.log(fiats);
```

### **Fetch Quote**

`getQuote` is a **public API call** that allows you to fetch a **temporary price quote** for a cryptocurrency transaction based on the selected **fiat currency, cryptocurrency, payment method, and transaction amount**. Since cryptocurrency prices are **volatile**, the returned quote is refreshed **every minute** to reflect the latest market price.

After fetching the **supported cryptocurrencies and fiat currencies**, you must call getQuote to get the latest exchange rate. This quote is **critical** for KYC verification and order placement:

**KYC Process:**

- The **quote ID** must be passed when calling `getKYCRequirement()` .
- Based on the **order amount**, the user may be required to complete different KYC tiers (**Simple KYC, Standard KYC**).

**Order Placement:**

- The **quote ID** is also required when calling `createOrder()`
- At the time of payment settlement, Transak sends the **exact amount of cryptocurrency** based on the latest exchange rate at that moment.

Thus, `getQuote` plays a **vital role** in the **entire order flow**, from **KYC verification to order execution**.

**Example Usage**

```jsx
  const quoteData = await transak.public.getQuote({
    "fiatCurrency": "EUR",
    "cryptoCurrency": "USDC",
    "paymentMethod": "sepa_bank_transfer",
    "isBuyOrSell": "BUY",
    "fiatAmount": 30,
    "apiKey": "string",
    "network": "arbitrum",
    "quoteCountryCode": "FR",
    "partnerCustomerId": "12345"
  });
```

> Response Output Fields
> 

```json
{
  "quoteId": "string", // Unique identifier for the quote (UUID)
  "conversionPrice": "number", // Exchange rate at the time of the quote
  "fiatCurrency": "string", // Fiat currency used in the quote (e.g., EUR, USD)
  "cryptoCurrency": "string", // Cryptocurrency involved in the quote (e.g., USDC, BTC)
  "paymentMethod": "string", // Payment method used (e.g., sepa_bank_transfer, credit_debit_card, apple_pay, google_pay, pm_ach_push, pm_wire)
  "fiatAmount": "number", // Fiat amount specified in the quote
  "cryptoAmount": "number", // Equivalent cryptocurrency amount
  "isBuyOrSell": "string", // Type of transaction (BUY or SELL)
  "network": "string", // Blockchain network for the transaction (e.g., arbitrum, ethereum)
  "feeDecimal": "number", // Decimal representation of the total fee percentage
  "totalFee": "number", // Total fee charged in fiat currency
  "feeBreakdown": [
    {
      "name": "string", // Description of the fee (e.g., Transak fee, Network/Exchange fee)
      "value": "number", // Fee amount in fiat currency
      "id": "string", // Unique identifier for the fee type
      "ids": "array" // List of IDs related to the fee breakdown
    }
  ],
  "nonce": "number" // Unique number for ensuring quote validity and preventing replay attacks
}
```

---

## User Auth & KYC

### **Get User Details**

`getUser` is an **authenticated API call** that allows you to fetch the user details of the authenticated user. Since authentication has already been completed, the **access token is automatically stored in the SDK’s session**, so you don’t need to pass it explicitly. Simply calling `getUser()` will return the user details if authenticated; otherwise, it will throw an error indicating that the **access token is not valid or has expired**.

**Example Usage**

```jsx
const user = await transak.user.getUser();
console.log(user);
```

> Response Output Fields & User Schema
> 

```json
{
  "partnerUserId": "string", // User's unique identifier (UUID)
  "firstName": "string | null", // User's first name or null if not submitted
  "lastName": "string | null", // User's last name or null if not submitted
  "email": "string", // User's email address
  "mobileNumber": "string | null", // User's mobile number with country code or null if not submitted
  "status": "string", // User's status (e.g., ACTIVE, INACTIVE)
  "dob": "string | null", // User's date of birth in ISO 8601 format or null if not submitted
  "kyc": {
    "status": "string", // KYC status (NOT_SUBMITTED, SUBMITTED, APPROVED, REJECTED)
    "type": "string | null" // KYC type (e.g., SIMPLE, STANDARD) Learn more here https://transak.com/kyc
  },
  "address": {
    "addressLine1": "string", // First line of the address
    "addressLine2": "string", // Second line of the address
    "state": "string", // State or region
    "city": "string", // City name
    "postCode": "string", // Postal code
    "country": "string", // Full country name
    "countryCode": "string" // ISO country code (e.g., FR for France)
  }
}
```

### **Get KYC Requirement - Fetch Required KYC Data Based on Quote ID**

`getKycRequirement` is an **authenticated API call** that dynamically returns the **KYC data a user needs to complete** based on the **quote ID**. Since Transak supports **multi-level KYC** across different countries, this API helps determine the exact KYC requirements for a user before proceeding with transactions.

The **quote ID** must be passed when calling this API, as it determines the required **KYC level (Simple KYC, Standard KYC, etc.)**. The response includes a list of **required KYC forms**, such as:

- **Personal Details** → Includes firstName, lastName, email, and mobileNumber.
- **Address Details** → User’s residential details.
- **Purpose of Usage** → Required for compliance with Transak’s regulations.
- **ID Proof** → Only required for **Standard KYC**. If the user is under **Simple KYC**, ID proof is not required.
- **US SSN** -> Required if country selected US (United States of America) in Address Details

As per the **quote ID**, the system dynamically returns the appropriate KYC forms for the user to complete.

**Example Usage**

```jsx
const kycRequirement = await transak.user.getKYCRequirement({ quoteId });
```

> Response Output Fields & User Schema
> 

```json
{
  "kycType": "string", // Type of KYC (e.g., SIMPLE, STANDARD)
  "status": "string", // kyc status (e.g., NOT_SUBMITTED, APPROVED, ADDITIONAL_FORMS_REQUIRED)
  "isAllowedToPlaceOrder": "string", // Indicates if the user can place an order (e.g., YES, NO)
}
```

### **Patch User - Update User’s Personal or Address Details**

`patchUserDetails` is an **authenticated API call** that allows updating a user’s **personal details** or **address details**. The response follows the **same schema as** `getUser()`, returning the updated user profile.
This API is the first step to proceed with the **KYC process** when KYC status is NOT_SUBMITTED. It allows users to update their personal and address details, which are essential for KYC verification.

The **fields that can be updated** via patchUserDetails include:

- **Personal Details:** firstName, lastName, mobileNumber, dob
- **Address Details:** Address-related fields fetched via **getKycForms()**

Any modifications to user data must comply with **KYC requirements**, and certain updates may require the user to re-submit verification documents.

```jsx
//Update user's personal details 
await transak.user.patchUserDetails({
    personalDetails: { firstName: 'John',
    lastName: 'Doe',
    mobileNumber: '+971505280689', //User's mobile number with country code
    dob: '1990-01-01' //YYYY-MM-DD
   }, 
  addressDetails: {
    addressLine1: '101 Rue',
    addressLine2: 'Saint-Pierre',
    state: 'Calvados',
    city: 'Caen',
    postCode: '14000',
    countryCode: 'FR' //ISO country code (e.g., FR for France)
  }
});
```

### **Get Additional Requirements - Fetch the additional forms required for KYC**

`getAdditionalRequirements` is an **authenticated API call** that dynamically returns the **KYC forms a user needs to complete** based on the **quote ID**. Since Transak supports **multi-level KYC** across different countries, this API helps determine the additional KYC requirements for a user before proceeding with transactions.
When `getKycRequirement` returns a status of **ADDITIONAL_FORMS_REQUIRED**, it indicates that the user needs to complete more forms to proceed with KYC verification.

The **quote ID** must be passed when calling this API, as it determines the required **KYC level (Simple KYC, Standard KYC, etc.)**. The response includes a list of **required KYC forms**, such as:

```jsx
await transak.user.getAdditionalKYCRequirements({
    quoteId: 'abcd-1234' // The quote ID obtained from getQuote()
});
```

> Response Output Fields & User Schema
>

```json
{
  "formsRequired": [
    {
      "type": "PURPOSE_OF_USAGE"
    },
    {
      "type": "IDPROOF",
      "metadata": {
        "expiresAt": "Tue, 22 Apr 2025 03:33:51 GMT",
        "kycUrl": "https://eu.onfido.app/l/e28138ac-15a9-4427-8dde-33f4ed1b0945",
        "sdkToken": "eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE3NDQwODg2MzEsInBheWxvYWQiOnsiYXBwIjoiMjljZjA3YTctNzJkZi00YjJhLWE5ZGUtODMyMGFjZDRiNDNmIiwiY2xpZW50X3V1aWQiOiIyZjM1MGI4My04ZjQwLTRlZGYtYWMyOC1jMzZkZTBjYWZmOWQiLCJpc19zYW5kYm94Ijp0cnVlLCJpc19zZWxmX3NlcnZpY2VfdHJpYWwiOmZhbHNlLCJpc190cmlhbCI6ZmFsc2UsInJlZiI6IioiLCJzYXJkaW5lX3Nlc3Npb24iOiJjNDliMmNkNC1iYzkzLTRmYmYtOTdiYS03ODJlODA0ZmJhOTIifSwidXVpZCI6InBsYXRmb3JtX3N0YXRpY19hcGlfdG9rZW5fdXVpZCIsImVudGVycHJpc2VfZmVhdHVyZXMiOnsidXNlQ3VzdG9taXplZEFwaVJlcXVlc3RzIjp0cnVlLCJ2YWxpZENyb3NzRGV2aWNlVXJscyI6WyIiXX0sInVybHMiOnsiZGV0ZWN0X2RvY3VtZW50X3VybCI6Imh0dHBzOi8vc2RrLm9uZmlkby5jb20iLCJzeW5jX3VybCI6Imh0dHBzOi8vc3luYy5vbmZpZG8uY29tIiwiaG9zdGVkX3Nka191cmwiOiJodHRwczovL2lkLm9uZmlkby5jb20iLCJhdXRoX3VybCI6Imh0dHBzOi8vYXBpLm9uZmlkby5jb20iLCJvbmZpZG9fYXBpX3VybCI6Imh0dHBzOi8vYXBpLm9uZmlkby5jb20iLCJ0ZWxlcGhvbnlfdXJsIjoiaHR0cHM6Ly9hcGkub25maWRvLmNvbSJ9fQ.MIGIAkIAjTJKuh2TpdbY66DwqZ3jPF9B12rL8ErbqdhZza6l43bgb2__Nxbb6hSwy1LZ4o6AdRZq3AW9qKRKhRp6B03d5BMCQgEGGLfOtjEkCiyrwdd4Vq_aStkCjJ2wJOaB9piY7EqeSYw1uWUHilYEemuOJ1_uR_kVkvCL7z93ivczCBPrJTDkzQ"
      }
    },
    {
      "type": "US_SSN"
    }
  ]
}
```

`IDPROOF` Form already contain the **KYC URL** and **expiry timestamp**.
- **A KYC URL** → This is a unique link generated by **Onfido**, our KYC provider.
- **An Expiry Timestamp (expiresAt)** → The KYC URL is valid for a limited time and must be used before it expires.

This **KYC URL must be provided to the user**, prompting them to complete their ID verification directly on **Onfido’s platform**. Once completed, the KYC status will be updated in Transak’s system.


### **Update Purpose of Usage**

`updatePurposeOfUsageForm` is an **authenticated API call** that is a mandatory step in the **KYC process** for both **Simple KYC and Standard KYC**.

As part of regulatory compliance, users must declare the **purpose of their cryptocurrency transactions**. This API allows you to submit the user’s **intended use case** by passing an array of supported purposes.

**How It Works**

- The purposeList parameter **must be an array** of one or more supported options.
- You can submit **one or multiple purposes** at a time.
- This is a required step **before proceeding with order placement and further transactions**.

**Supported Purposes:**

- "Buying/selling crypto for investments"
- "Buying NFTs"
- "Buying crypto to use a web3 protocol"

```jsx
const PurposeOfUsageFormData = await transak.user.updatePurposeOfUsageForm({
    purposeList: ["Buying/selling crypto for investments"],
  });
console.log(PurposeOfUsageFormData);
```

> Response Output Fields:
> 

```json
{
    "status": "SUBMITTED"
}
```

### **Submit SSN**
`submitSSN` is an **authenticated API call** that is a mandatory step in the **KYC process** when a user selects the **United States of America** as their country in the **Address Details**.

As part of regulatory compliance in the United States, users must provide their **Social Security Number (SSN)** for identity verification. This API allows you to submit the user's SSN securely through the Transak platform.

**How It Works**

- This is a required step for US users **before proceeding with order placement**.

```jsx
const ssnVerificationResult = await transak.user.submitSSN({
    ssn: '123-45-6789', // SSN in the format XXX-XX-XXXX or XXXXXXXXX
    quoteId: 'abcd-1234' // The quote ID obtained from getQuote()
});
console.log(ssnVerificationResult);
```

> Response Output Fields:
> 

```json
{
    "status": "SUBMITTED"
}
```

## Orders

### Get User Limits

`getUserLimits` is an **authenticated API call** that allows you to **fetch the maximum transaction limits** a user can place over different time periods (`1-day, 30-day, 365-day`). These limits are determined by **KYC type**, **payment method**, and **fiat currency,** and provides a detailed overview based on **total**, **spent**, **remaining** and **exceeded limits**.

```jsx
const res = await transak.order.getUserLimits({
    kycType: "SIMPLE", //or STANDARD
    isBuyOrSell: "BUY", 
    fiatCurrency: "EUR",
    paymentCategory: "bank_transfer" 
  });
```

> Response Output Fields:
> 

```json
{
  "limits": {
    "1": "number", // Daily transaction limit
    "30": "number", // Monthly transaction limit
    "365": "number" // Yearly transaction limit
  },
  "spent": {
    "1": "number", // Amount spent in the last 1 day
    "30": "number", // Amount spent in the last 30 days
    "365": "number" // Amount spent in the last 365 days
  },
  "remaining": {
    "1": "number", // Remaining transaction limit for the last 1 day
    "30": "number", // Remaining transaction limit for the last 30 days
    "365": "number" // Remaining transaction limit for the last 365 days
  },
  "exceeded": {
    "1": "boolean", // Indicates if the daily limit is exceeded
    "30": "boolean", // Indicates if the monthly limit is exceeded
    "365": "boolean" // Indicates if the yearly limit is exceeded
  }
}
```

### Create Order

#### 1. Bank Transfer Flow

`createOrder` is an **authenticated API call** that allows you to **create an order** based on the provided **wallet address** and the **quote ID**`.

you need to pass the **quoteId**, **paymentInstrumentId** and **walletAddress** in this API call. Based on the provided information, the order will be generated, and you will receive the **order details** in the response.

```jsx
  const orderData = await transak.order.createOrder({ quoteId, paymentMethod, walletAddress });
  orderId = orderData.orderId;
```

> Response Output Fields:
> 

```json
{
	"orderId": "string", // Unique identifier for the transaction (UUID)
	"partnerUserId": "string", // User's unique identifier (UUID)
	"status": "string", // Transaction status (e.g., COMPLETED, AWAITING_PAYMENT_FROM_USER, PENDING_DELIVERY_FROM_TRANSAK) You can learn more here https://docs.transak.com/docs/tracking-user-kyc-and-order-status
	"isBuyOrSell": "string", // Type of transaction (BUY or SELL)
	"fiatCurrency": "string", // Fiat currency used in the transaction (e.g., EUR, USD). The full list can be fetch using transak.public.getFiatCurrencies() or https://transak.com/global-coverage
	"cryptoCurrency": "string", // Cryptocurrency involved in the transaction (e.g., USDC, BTC). The full list can be fetch using transak.public.getCryptoCurrencies() or https://transak.com/crypto-coverage
	"paymentMethod": "string", // Payment method used (e.g., sepa_bank_transfer)
	"network": "string", // Blockchain network used for the transaction (e.g., arbitrum, ethereum)
	"walletAddress": "string", // Wallet address where the crypto is sent
	"addressAdditionalData": "boolean", // This is the optional field. Indicates if additional address data is required
	"quoteId": "string", // Quote ID associated with the transaction (UUID)
	"fiatAmount": "number", // Fiat amount in the original currency
	"fiatAmountInUsd": "number", // Equivalent fiat amount in USD
	"amountPaid": "number", // Amount actually paid by the user
	"cryptoAmount": "number", // Amount of cryptocurrency received
	"conversionPrice": "number", // Exchange rate between cryptoCurrency / fiat
	"totalFeeInFiat": "number", // Total fees deducted in fiat currency
	"paymentDetails": [
		{
			"fiatCurrency": "string", // Currency of the payment method (e.g., EUR, USD)
			"paymentMethod": "string", // Payment method ID (e.g., sepa_bank_transfer)
			"name": "string", // Payment method name
			"fields": [ { "name": "string", "value": "string"}, { "name": "string", "value": "string"} ] // List of required fields for the payment method
		}
	],
	"txHash": "string || null" // Blockchain transaction hash
	
}
```

#### 2. Card, Apple Pay Flow

The Card, Apple Pay flow enables users to purchase cryptocurrency using existing or new card details, including Apple Pay. This flow uses an OTT (One-Time Token) to initialize a payment widget, enabling a seamless, embedded experience within your application.

##### Step 1: Get an OTT (One-Time Token)

First, retrieve a one-time token from the Transak SDK. This token will be used to securely authenticate the payment widget:

```jsx
// Or using the SDK
const ottResponse = await transak.user.requestOtt();

// Extract the token from the response
const ottToken = ottResponse.ott;
```

> **Token Characteristics:**
> - One-time use only (token becomes invalid after first use)
> - 5-minute expiry (token must be used within 5 minutes of generation)

##### Step 2: Generate the Widget URL

With the OTT token, you can now construct a widget URL with the necessary parameters:

```jsx
const widgetUrl = `https://global-stg.transak.com?ott=${ottToken}&apiKey=YOUR_API_KEY&fiatCurrency=EUR&cryptoCurrencyCode=USDC&productsAvailed=BUY&fiatAmount=1000&network=arbitrum&paymentMethod=credit_debit_card&hideExchangeScreen=true&walletAddress=0x3D629A50ec20eb9a2ed23D0fd0EB28DdcA9Fda46&disableWalletAddressForm=true`;
```

Required URL parameters:
- `ott`: Your one-time token
- `apiKey`: Your partner API key
- `fiatCurrency`: Currency code (e.g., EUR, USD)
- `cryptoCurrencyCode`: Cryptocurrency symbol (e.g., USDC, ETH)
- `productsAvailed`: Transaction type (BUY)
- `fiatAmount`: Amount in fiat currency
- `network`: Blockchain network (e.g., arbitrum, ethereum)
- `paymentMethod`: Payment method (credit_debit_card, apple_pay, google_pay)
- `hideExchangeScreen`: Hide exchange rate screen
- `walletAddress`: User's wallet address
- `disableWalletAddressForm`: Hide wallet address screen

The widget handles all aspects of the payment process, including card entry, Apple Pay validation, and transaction completion. Transak manages all the underlying payment processing and cryptocurrency delivery while maintaining full security and compliance with payment processing regulations.

### **Confirm Payment - Notify System of User Payment**

`confirmPayment` is an **authenticated API call** that allows you to **manually notify Transak that the user has completed the payment**. This step helps improve **conversion rates** and ensures that our system **processes the order efficiently**.

> Note: This step is only required for bank transfer payments and is NOT needed for card payments or Apple Pay transactions, which are automatically confirmed by the payment system.

After the user has initiated the payment, you need to call this API with:

- **orderId** → The order ID of the transaction.
- **paymentMethod** → The selected payment method from getQuote().

**Example Usage**

```jsx
  const res = await transak.order.confirmPayment({
    orderId,
    paymentMethod: "sepa_bank_transfer",
  });
```

### **Cancel Order**

`cancelOrder` is an **authenticated API call** that allows you to **cancel an existing order** that is in a specific status. This API is particularly useful when users need to abort a transaction before it progresses further.

**Order Cancellation Rules:**

- Orders can only be cancelled if they are in the following states:
  - **AWAITING_PAYMENT_FROM_USER** → Initial state when order is created, waiting for payment
  - **PAYMENT_DONE_MARKED_BY_USER** → Payment has been marked as completed by user

- Orders in other states cannot be cancelled.

When calling this API, you need to provide:

- **orderId** → The unique identifier of the order to be cancelled.
- **cancelReason** (optional) → The reason for cancelling the order.

**Example Usage**

```jsx
const result = await transak.order.cancelOrder({
  orderId: 'abcd-5678',
  cancelReason: 'changed_my_mind',
});
console.log(result);
```

### **Fetch Order Details**

`getOrderById` is an **authenticated API call** that allows you to **fetch the details of a specific order** by passing the **order ID** in the request.

This API provides the **same response schema** as the `createOrder` API, returning all the relevant order details, including the transaction status, payment method, crypto amount, and network details.

**Example Usage**

```jsx
const orderDetails = await transak.order.getOrderById({ orderId: 'abcd-5678' });
console.log(orderDetails);
```

## Error Handling

All API calls **return structured responses**. If an API call fails, the SDK throws an **error object**:

```jsx
try {
    const order = await transak.order.getOrderById({ orderId: 'abcd-5678' });
} catch (error) {
    console.error(error.message); // Error Message
    console.error(error.details); // Structured Error Object
}

```

---

## License

This SDK is licensed under the **MIT License**.
