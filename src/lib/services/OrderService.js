class OrderService {
  constructor(client) {
    this.client = client;
    this.partnerApiKey = client.config.partnerApiKey;
  }

  async getUserLimits({ kycType, isBuyOrSell, fiatCurrency, paymentCategory }) {
    return this.client.request({
      endpointId: 'user_limits',
      data: {},
      params: {
        kycType,
        isBuyOrSell,
        fiatCurrency,
        paymentCategory,
      },
    });
  }

  async createOrder({ quoteId, paymentMethod, walletAddress }) {
    const result = await this.client.request({
      endpointId: 'create_order',
      data: {
        quoteId,
        paymentInstrumentId: paymentMethod,
        walletAddress,
      },
      params: {},
    });
    if (result.errorMessage === 'Order exists') {
      const errorDetails = {
        message: 'Order already exists, please complete or cancel the existing order'
      };
      const error = new Error(errorDetails.message);
      error.details = errorDetails;
      throw error;
    }
    return result;
  }

  async confirmPayment({ orderId, paymentMethod }) {
    return this.client.request({
      endpointId: 'confirm_payment',
      data: {
        orderId,
        paymentMethod,
      },
      params: {},
    });
  }

  async cancelOrder({ orderId, cancelReason }) {
    return this.client.request({
      endpointId: 'cancel_order',
      pathParams: {
        orderId,
        cancelReason,
      },
      params: {},
    });
  }

  async getOrderById({ orderId }) {
    return this.client.request({
      endpointId: 'get_order_by_id',
      data: {},
      params: {},
      pathParams: {
        orderId,
      },
    });
  }
}

export { OrderService };
