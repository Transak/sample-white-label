export const sampleData = {
  "env":{
    "PARTNER_API_KEY": "a9d9cc56-a524-4dd7-8008-59f36bd6fa97",
    "ACCESS_TOKEN": "",
    "EMAIL": "shashank+7222339273@transak.com",
    "OTP_CODE": "3651",
    "ENVIRONMENT": "staging",
    "frontend-auth": "9TRUtEM_RLns4Tp7h34wtvA2h*yc2ty2EhChtWtAdRko!EpVrpvH26xf_YJPM_qqiEG4LsL7TJiB6wg79BjtLGHdaKu6gHsceDHQ",
    "WIDGET_DOMAIN_STAGING": "https://global-stg.transak.com",
    "WIDGET_DOMAIN_PRODUCTION": "https://global.transak.com",
    "WIDGET_DOMAIN": "",
    "IS_KYC_THOUGH_RELIANCE": true,
  },
  "kycRelianceDetails":{ // This details needs to be filled if IS_KYC_THOUGH_RELIANCE is set as True 
    "kycShareToken": "_act-sbx-jwt-eyJhbGciOiJub25lIn0.eyJqdGkiOiJfYWN0LXNieC1lYWU2ZDY0NC1lZmZkLTQ0YTMtYWFmYi00OWYwOWEwNDc4ZWEiLCJ1cmwiOiJodHRwczovL2FwaS5zdW1zdWIuY29tIn0.",
    "kycShareTokenProvider": "SUMSUB",
  },
  "personalDetails": {
    "firstName": "John",
    "lastName": "Carry",
    "mobileNumber": "+971505242171",
    "dob": "06-11-1994"
  },
  "quoteFields": {
    "fiatCurrency": "EUR",
    "cryptoCurrency": "USDC",
    "paymentMethod": "credit_debit_card", // credit_debit_card, apple_pay, google_pay, sepa_bank_transfer, pm_ach_push, pm_wire
    "isBuyOrSell": "BUY",
    "fiatAmount": 1000,
    "partnerApiKey": "string",
    "network": "arbitrum",
    "quoteCountryCode": "FR"
  },
  "walletAddress": "0x3D629A50ec20eb9a2ed23D0fd0EB28DdcA9Fda46",
  "address": {
    "addressLine1": "101 Rue",
    "addressLine2": "Saint-Pierre",
    "state": "Calvados",
    "city": "Caen",
    "postCode": "14000",
    "countryCode": "FR"
  },
  "purposeOfUsage": {
    "purposeList": ["Buying/selling crypto for investments"]
  },
  "idProof": {},
  "usSSN": () => {
    // Generate a random SSN in the format 000-00-0000
    const area = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const group = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const serial = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const ssn = `${area}-${group}-${serial}`;
    return { ssn }
  }
}
