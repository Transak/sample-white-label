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
    partnerApiKey: 'a2374be4-c59a-400e-809b-72c226c74b8f',
});

```

> Note: The SDK supports both Staging and Production environments.
> 

---

## Authentication

**Getting Started**

To use this function, you must first **request a** `frontendAuth` &  ****`partnerApiKey` **Key** from Transak. You can obtain it by reaching out to: **Sales Team:** [sales@transak.com](mailto:sales@transak.com).  Once you receive your **Partner** **API key** and **Frontend Auth token**, you can pass them in the request along with the **user’s email address**.

**How It Works**

1. The **email OTP request is user-centric**—Transak sends a **one-time password (OTP)** to the user’s email.
2. The user enters the OTP in your application.
3. You verify the OTP using **verifyEmailOtp** to obtain an **access token**.
4. Once authenticated, you can proceed with **further actions like KYC verification, order placement, etc.**.

### **Send Email OTP**

The `sendEmailOtp` function is a **non-authenticated** API method that allows you to initiate user authentication by sending an OTP to the provided email address.

**Example Usage**

```jsx
await transak.user.sendEmailOtp({ email: 'user@example.com', frontendAuth: 'your-frontend-auth' });
```

> Response Output Fields:
> 

```json
{ "isTncAccepted": "boolean" }
```

### **Verify Email OTP**

The `verifyEmailOtp` is a **non-authenticated API** that allows you to **verify a user’s email using an OTP** and retrieve an **access token** in return.

Once you have successfully called `sendEmailOtp`, you need to pass the **email verification code** along with the user’s email to **verify the OTP**.

**Access Token Usage**

- This **access token is required** for all **authenticated API calls** (such as placing orders, fetching user details, and submitting KYC).
- This **access token remains valid for 30 days from the time of generation**. Once expired, the user must restart the authentication process by requesting a new OTP.

**Example Usage**

```jsx
const response = await transak.user.verifyEmailOtp({
    email: 'user@example.com',
    emailVerificationCode: '123456'
});
console.log(response);
```

> Response Output Fields:
> 

```json
{
  "id": "string", // ID is equal to the user's access token
  "ttl": "number", // TTL is generally the TTL of the access token; access token expiry is generally 30 days from generation
  "created": "string", // Date created means date-time
  "userId": "string"
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

- The **quote ID** must be passed when calling `getKycForms()` .
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
    "partnerApiKey": "string",
    "network": "arbitrum",
    "quoteCountryCode": "FR"
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
  "id": "string", // User's unique identifier (UUID)
  "firstName": "string | null", // User's first name or null if not submitted
  "lastName": "string | null", // User's last name or null if not submitted
  "email": "string", // User's email address
  "mobileNumber": "string | null", // User's mobile number with country code or null if not submitted
  "status": "string", // User's status (e.g., ACTIVE, INACTIVE)
  "dob": "string | null", // User's date of birth in ISO 8601 format or null if not submitted
  "kyc.l1": {
    "status": "string", // KYC status (NOT_SUBMITTED, SUBMITTED, APPROVED, REJECTED)
    "type": "string | null", // KYC type (e.g., SIMPLE, STANDARD) Learn more here https://transak.com/kyc
    "updatedAt": "string", // Last update timestamp in ISO 8601 format
    "kycSubmittedAt": "string | null" // KYC submission timestamp or null if not submitted
  },
  "address": {
    "addressLine1": "string", // First line of the address
    "addressLine2": "string", // Second line of the address
    "state": "string", // State or region
    "city": "string", // City name
    "postCode": "string", // Postal code
    "country": "string", // Full country name
    "countryCode": "string" // ISO country code (e.g., FR for France)
  } // If submitted then it will return with above address object or null if not submitted 
  "createdAt": "string" // Account creation timestamp in ISO 8601 format
}
```

### **Get KYC Forms - Fetch Required KYC Forms Based on Quote ID**

`getKycForms` is an **authenticated API call** that dynamically returns the **KYC forms a user needs to complete** based on the **quote ID**. Since Transak supports **multi-level KYC** across different countries, this API helps determine the exact KYC requirements for a user before proceeding with transactions.

The **quote ID** must be passed when calling this API, as it determines the required **KYC level (Simple KYC, Standard KYC, etc.)**. The response includes a list of **required KYC forms**, such as:

- **Personal Details** → Includes firstName, lastName, email, and mobileNumber.
- **Address Details** → User’s residential details.
- **Purpose of Usage** → Required for compliance with Transak’s regulations.
- **ID Proof** → Only required for **Standard KYC**. If the user is under **Simple KYC**, ID proof is not required.

As per the **quote ID**, the system dynamically returns the appropriate KYC forms for the user to complete.

**Example Usage**

```jsx
const kycForms = await transak.user.getKycForms({ quoteId });
```

> Response Output Fields & User Schema
> 

```json
{
  "kycType": "string", // Type of KYC (e.g., SIMPLE, STANDARD)
  "forms": [
    {
      "id": "string", // Unique identifier for the form (e.g., personalDetails, address, purposeOfUsage)
      "active": "boolean | null", // Indicates if the form is currently active (optional)
      "onSubmit": "string | null", // Action to be triggered on form submission (e.g., updateUserData) (optional)
      "hideProgress": "boolean" // Indicates whether the progress bar should be hidden
    }
  ]
}
```

### **Fetch Personal Details & Address Form**

`getKycFormsById` is an **authenticated API** that helps you retrieve the **specific KYC form details** required for user verification. This API should be called **after fetching** `getKycForms`, where you obtain the **form ID**.

In this API call, you **pass the form Id** (retrieved from `getKycForms`) and receive a response containing:

- **The list of required fields** → These fields need to be collected from the user.
- **The endpoint to submit the data** → The response includes the relevant `patchUser` **API endpoint** to submit personal or address details.

This API primarily supports fetching **Personal Details** and **Address Details** as part of the **KYC process.** 

```jsx
const personalDetailsForm = await transak.user.getKycFormById({ formId: 'personalDetails', quoteId: 'abcd-1234' });
console.log(personalDetailsForm);
```

> Response Output Fields & User Schema
> 

```json
{
  "formId": "string", // Unique identifier for the form (e.g., personalDetails)
  "formName": "string", // Name of the form (e.g., Personal Details)
  "endpoint": {
    "path": "string", // API endpoint path for form submission (e.g., /user)
    "method": "string" // HTTP method for submission (e.g., PATCH, POST)
  },
  "fields": [
    {
      "id": "string", // Unique identifier for the field (e.g., firstName, lastName, mobileNumber)
      "name": "string", // Display name of the field (e.g., First Name, Last Name)
      "type": "string", // Type of input field (e.g., text, date, number)
      "isRequired": "boolean", // Whether the field is mandatory
      "regex": "string", // Regular expression for validation
      "placeholder": "string", // Placeholder text for the field
      "value": "string" // Default or user-entered value
    }
  ]
}
```

### **Patch User - Update User’s Personal or Address Details**

`patchUser` is an **authenticated API call** that allows updating a user’s **personal details** or **address details**. The response follows the **same schema as** `getUser()`, returning the updated user profile.

The **fields that can be updated** via patchUser include:

- **Personal Details:** firstName, lastName, mobileNumber, dob
- **Address Details:** Address-related fields fetched via **getKycForms()**

Any modifications to user data must comply with **KYC requirements**, and certain updates may require the user to re-submit verification documents.

```jsx
//Update user's personal details 
await transak.user.patchUser({
    firstName: 'John',
    lastName: 'Doe',
    mobileNumber: '+971505280689', //User's mobile number with country code
    dob: '1990-01-01' //YYYY-MM-DD
});

//Update user's address
await transak.user.patchUser({
  addressLine1: '101 Rue',
  addressLine2: 'Saint-Pierre',
  state: 'Calvados',
  city: 'Caen',
  postCode: '14000',
  countryCode: 'FR' //ISO country code (e.g., FR for France)
});
```

### **Submit Purpose of Usage**

`submitPurposeOfUsageForm` is an **authenticated API call** that is a mandatory step in the **KYC process** for both **Simple KYC and Standard KYC**.

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
const PurposeOfUsageFormData = await transak.user.submitPurposeOfUsageForm({
    purposeList: ["Buying/selling crypto for investments"],
  });
console.log(PurposeOfUsageFormData);
```

> Response Output Fields:
> 

```json
{
    "result": "ok"
}
```

### **Fetch ID Proof KYC Form**

`getKycFormIdProof` is an **authenticated API** that is a mandatory step in the **KYC process** for only **Standard KYC (not Simple KYC).** This allows you to fetch the **ID Proof KYC form** required for user verification. Similar to how `getKycFormsById` is used for fetching **Personal Details** and **Address Details**, this API is used specifically for **ID Proof verification**.

When calling this API, you need to pass the **formId: 'idProof'** along with the **quote ID**, and the response will include:

- **A KYC URL** → This is a unique link generated by **Onfido**, our KYC provider.
- **An Expiry Timestamp (expiresAt)** → The KYC URL is valid for a limited time and must be used before it expires.

This **KYC URL must be provided to the user**, prompting them to complete their ID verification directly on **Onfido’s platform**. Once completed, the KYC status will be updated in Transak’s system.

```jsx
const idProofForm = await transak.user.getKycFormIdProof({ formId: 'idProof', quoteId: 'abcd-1234' });
console.log(idProofForm);
```

> Response Output Fields:
> 

```json
{
    "formId": { "type": "string", "isRequired": true },
    "formName": { "type": "string", "isRequired": true },
    "kycUrl": { "type": "string", "isRequired": true },
    "expiresAt": { "type": "string", "isRequired": true }
}
```

## Orders

### Get Order Limits

`getOrderLimits` is an **authenticated API call** that allows you to **fetch the maximum transaction limits** a user can place over different time periods (`1-day, 30-day, 365-day`). These limits are determined by **KYC type**, **payment method**, and **fiat currency,** and provides a detailed overview based on **total**, **spent**, **remaining** and **exceeded limits**.

```jsx
const res = await transak.order.getOrderLimit({
    kycType: "SIMPLE", //or STANDARD
    isBuyOrSell: "BUY", 
    fiatCurrency: "EUR"
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

### **Wallet Reserve - Link Wallet Address with Quote ID**

`walletReserve` is an **authenticated API call** used to **link a user’s wallet address with a quote ID**. This step is required before **creating an order**, as the reserved wallet address is later sent to the **`createOrder` API** for transaction processing.

When calling this API, you need to provide:

- **quoteId** → The quote ID retrieved from getQuote().
- **walletAddress** → The cryptocurrency wallet address where the funds will be received.

Once the wallet is reserved, this information will be **automatically used** when placing an order.

```jsx
const res = await transak.order.walletReserve({
    quoteId,
    walletAddress: "0x.....",
 });
```

### Create Order

#### 1. Bank Transfer Flow

`createOrder` is an **authenticated API call** that allows you to **create an order** based on the reserved **wallet address** and the **quote ID** obtained from `walletReserve()`.

After successfully reserving a wallet, you need to pass the **quoteId** in this API call. Based on the provided quote, the order will be generated, and you will receive the **order details** in the response.

```jsx
  const orderData = await transak.order.createOrder({ quoteId });
  orderId = orderData.id;
```

> Response Output Fields:
> 

```json
{
	"id": "string", // Unique identifier for the transaction (UUID)
	"userId": "string", // User's unique identifier (UUID)
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
	"paymentOptions": [
		{
			"currency": "string", // Currency of the payment method (e.g., EUR, USD)
			"id": "string", // Payment method ID (e.g., sepa_bank_transfer)
			"name": "string", // Payment method name
			"fields": [ { "name": "string", "value": "string"}, { "name": "string", "value": "string"} ] // List of required fields for the payment method
		}
	],
	"transactionHash": "string", // Blockchain transaction hash
	"createdAt": "string", // Timestamp when the transaction was created (ISO 8601 format)
	"updatedAt": "string", // Timestamp of the last update (ISO 8601 format)
	"completedAt": "string", // Timestamp when the transaction was completed (ISO 8601 format)
	"statusHistories": [
		{
			"status": "string", // Status of the transaction at a specific time
			"createdAt": "string" // Timestamp when the status was updated (ISO 8601 format)
		}
	]
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
const ottToken = ottResponse.token;
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