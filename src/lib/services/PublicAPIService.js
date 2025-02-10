class PublicAPIService {
  constructor(client) {
    this.client = client;
    this.partnerApiKey = client.config.partnerApiKey;
  }

  async getQuote(params) {
    return this.client.request({
      endpointId: 'quote',
      data: null,
      params: { ...params, partnerApiKey: this.partnerApiKey },
    });
  }

  async getCryptoCurrencies() {
    return this.client.request({
      endpointId: 'crypto_currencies_list',
      data: null,
      params: null,
    });
  }

  async getFiatCurrencies() {
    return this.client.request({
      endpointId: 'fiat_currencies_list',
      data: null,
      params: null,
    });
  }
}

export { PublicAPIService };
