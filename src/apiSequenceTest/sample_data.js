export const sampleData = {
  "env":{
    "PARTNER_API_KEY": "0b4a8ff3-0d7e-409b-a6b9-3b82094b0f03",
    "ACCESS_TOKEN": "",
    "EMAIL": "anshul.garg+testapi4@transak.com",
    "OTP_CODE": "3651",
    "ENVIRONMENT": "staging",
    "WIDGET_DOMAIN_STAGING": "https://global-stg.transak.com",
    "WIDGET_DOMAIN_PRODUCTION": "https://global.transak.com",
    "WIDGET_DOMAIN": "",
    "IS_KYC_THOUGH_RELIANCE": false,
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
    "paymentMethod": "sepa_bank_transfer", // credit_debit_card, apple_pay, google_pay, sepa_bank_transfer, pm_ach_push, pm_wire
    "isBuyOrSell": "BUY",
    "fiatAmount": 30,
    "network": "arbitrum",
    "quoteCountryCode": "FR",
    "partnerCustomerId": "1234567890"
  },
  "paymentCategory": "bank_transfer",
  "walletAddress": "0xE99B71B9a035102432e30F47843746e646737b79",
  "addressDetails": {
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
  "usSSN": {
    "ssn": "123-45-6789"
  },
}
