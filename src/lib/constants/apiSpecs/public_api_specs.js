const apiSpecs = {
  crypto_currencies_list: {
    name: 'Crypto Currencies API',
    id: 'crypto_currencies_list',

    url: '/api/v2/currencies/crypto-currencies',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
    },
    expected_status: 200,
    response_type: 'array',
    response_root_field_name: 'response',
    response_required_fields: [
      {
        _id: 'string',
        coinId: 'string',
        symbol: 'string',
        name: 'string',
        isAllowed: 'boolean',
        isPopular: 'boolean',
        isStable: 'boolean',
        image: {
          large: 'string',
          small: 'string',
          thumb: 'string',
        },
        network: {
          name: 'string',
          chainId: ['string', 'null', 'undefined'],
          fiatCurrenciesNotSupported: ['array', 'boolean'],
        },
        address: ['string', 'null'],
        addressAdditionalData: ['object', 'boolean'],
        roundOff: 'number',
        kycCountriesNotSupported: ['array', 'boolean'],
        uniqueId: ['string', 'null'],
        tokenType: 'string',
        tokenIdentifier: ['null', 'string'],
        isPayInAllowed: 'boolean',
        minAmountForPayIn: ['null', 'number'],
        maxAmountForPayIn: ['null', 'number'],
        createdAt: ['string', 'boolean', 'null', 'undefined'],
      },
    ],
    response_optional_fields: [
      {
        isIgnorePriceVerification: 'boolean',
        decimals: 'number',
        image_bk: {
          large: 'string',
          small: 'string',
          thumb: 'string',
        },
      },
    ],
    output_fields: {},
  },
  fiat_currencies_list: {
    name: 'Fiat Currencies API',
    id: 'fiat_currencies_list',

    url: '/fiat/public/v1/currencies/fiat-currencies',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
    },
    expected_status: 200,
    response_type: 'array',
    response_root_field_name: 'response',
    response_required_fields: [
      {
        symbol: 'string',
        name: 'string',

        isAllowed: 'boolean',
        paymentOptions: [
          {
            name: 'string',
            id: 'string',
            processingTime: 'string',
            isActive: 'boolean',
            minAmount: 'number',
            maxAmount: 'number',
          },
        ],
      },
    ],
    response_optional_fields: [
      {
        isPopular: 'boolean',
      },
    ],
    output_fields: {},
  },
  quote: {
    name: `Get Quote`,
    id: 'quote',
    url: '/api/v1/pricing/public/widget/quotes',

    method: 'GET',
    headers: {
      'x-trace-id': 'string',
    },
    query_params: {
      fiatCurrency: { type: 'string', isRequired: 'true', value: '' },
      cryptoCurrency: { type: 'string', isRequired: 'true', value: '' },
      paymentMethod: { type: 'string', isRequired: 'true', value: '' },
      isBuyOrSell: { type: 'string', isRequired: 'true', value: '' },
      fiatAmount: { type: 'number', isRequired: 'true', value: '' },
      partnerApiKey: { type: 'string', isRequired: 'true', value: '' },
      network: { type: 'string', isRequired: 'true', value: '' },
      quoteCountryCode: { type: 'string', isRequired: 'true', value: '' },
      kycShareToken: { type: 'string', isRequired: 'false', value: '' },
      kycShareTokenProvider: { type: 'string', isRequired: 'false', value: '' },
      partnerApiKey: { type: 'string', isRequired: 'true', value: '' },
    },
    expected_status: 200,
    response_root_field_name: 'response',
    response_required_fields: {
      quoteId: 'string',
      conversionPrice: 'number',
      cryptoAmount: 'number',
    },
    response_optional_fields: {},
    output_fields: {
      quoteId: { source: 'quoteId', type: 'string', isRequired: true },
      conversionPrice: {
        source: 'conversionPrice',
        type: 'number',
        isRequired: true,
      },
      fiatCurrency: {
        source: 'fiatCurrency',
        type: 'string',
        isRequired: true,
      },
      cryptoCurrency: {
        source: 'cryptoCurrency',
        type: 'string',
        isRequired: true,
      },
      paymentMethod: {
        source: 'paymentMethod',
        type: 'string',
        isRequired: true,
      },
      fiatAmount: { source: 'fiatAmount', type: 'number', isRequired: true },
      cryptoAmount: {
        source: 'cryptoAmount',
        type: 'number',
        isRequired: true,
      },
      isBuyOrSell: { source: 'isBuyOrSell', type: 'string', isRequired: true },
      network: { source: 'network', type: 'string', isRequired: true },
      feeDecimal: { source: 'feeDecimal', type: 'number', isRequired: true },
      totalFee: { source: 'totalFee', type: 'number', isRequired: true },
      feeBreakdown: { source: 'feeBreakdown', type: 'array', isRequired: true },
      nonce: { source: 'nonce', type: 'number', isRequired: true },
    },
  },
};
//default export module nodejs
export default apiSpecs;
