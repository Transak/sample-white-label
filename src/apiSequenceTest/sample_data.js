export const sampleData = {
  "env":{
    "PARTNER_API_KEY": "0b4a8ff3-0d7e-409b-a6b9-3b82094b0f03",
    "ACCESS_TOKEN": "",
    "EMAIL": "anshul.garg@transak.com",
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
    "firstName": "Doe",
    "lastName": "Jane",
    "mobileNumber": "+33791112345",
    "dob": "06-11-1994"
  },
  "quoteFields": {
    "fiatCurrency": "EUR",
    "cryptoCurrency": "ETH",
    "paymentMethod": "sepa_bank_transfer", // credit_debit_card, apple_pay, google_pay, sepa_bank_transfer, pm_ach_push, pm_wire, pm_open_banking
    "isBuyOrSell": "BUY",
    "fiatAmount": 30,
    "network": "ethereum",
    "quoteCountryCode": "FR",
    "partnerCustomerId": "1234567890"
  },
  "paymentCategory": "bank_transfer",
  "walletAddress": "0xE99B71B9a035102432e30F47843746e646737b79",
  "addressDetails": {
    "addressLine1": "170 Rue du Faubourg Saint-Denis, Paris",
    "addressLine2": "",
    "state": "Paris",
    "city": "Paris",
    "postCode": "75010",
    "countryCode": "FR"
  },
  "purposeOfUsage": {
    "purposeList": ["Buying/selling crypto for investments"]
  },
  "usSSN": {
    "ssn": "123-45-6789"
  },
}
