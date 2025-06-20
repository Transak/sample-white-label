const apiSpecs = {
  crypto_currencies_list: {
    name: 'Crypto Currencies API',
    id: 'crypto_currencies_list',
    url: '/api/v2/lookup/currencies/crypto-currencies',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
    },
    expected_status: 200,
    response_root_field_name: 'data',
    response_required_fields: {
      cryptoCurrencies: [
          {
            isAllowed: 'boolean',
            isStable: 'boolean',
            name: 'string',
            symbol: 'string',
            uniqueId: 'string',
            isSellAllowed: 'boolean',
            network: {
              name: 'string'
            },
            roundOff: 'number',
            image: {
              large: 'string',
              small: 'string',
              thumb: 'string',
            },
            kycCountriesNotSupported: ['array', 'boolean'],
          }
      ]
    },
    response_optional_fields: {},
    output_fields: {},
  },
  fiat_currencies_list: {
    name: 'Fiat Currencies API',
    id: 'fiat_currencies_list',
    url: '/api/v2/lookup/currencies/fiat-currencies',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
    },
    query_params: {
      apiKey: { type: 'string', isRequired: 'true', value: '' }
    },
    expected_status: 200,
    response_root_field_name: 'data',
    response_required_fields: {
      fiatCurrencies: [
        {
          symbol: 'string',
          name: 'string',
          icon: 'string',
          isAllowed: 'boolean',
          isSellAllowed: 'boolean',
          roundOff: 'number',
          paymentOptions: [
            {
              name: 'string',
              id: 'string',
              processingTime: 'string',
              icon: 'string',
              isActive: 'boolean',
              minAmount: 'number',
              maxAmount: 'number',
              isBuyAllowed: 'boolean',
              isSellAllowed: 'boolean',
              isNftAllowed: 'boolean',
              defaultAmount: 'number',
              defaultAmountForSell: 'number',
              minAmountForSell: 'number',
              maxAmountForSell: 'number',
              limitCurrency: 'string',
            },
          ]
        }
      ]
    },
    response_optional_fields: {},
    output_fields: {},
  },
  quote: {
    name: `Get Quote`,
    id: 'quote',
    url: '/api/v2/lookup/quotes',
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
      apiKey: { type: 'string', isRequired: 'true', value: '' },
      network: { type: 'string', isRequired: 'true', value: '' },
      quoteCountryCode: { type: 'string', isRequired: 'true', value: '' },
      partnerCustomerId: { type: 'string', isRequired: 'true', value: '' },
      kycShareToken: { type: 'string', isRequired: 'false', value: '' },
      kycShareTokenProvider: { type: 'string', isRequired: 'false', value: '' },
    },
    expected_status: 200,
    response_root_field_name: 'data',
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

export default apiSpecs;
