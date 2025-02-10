class OrderService {
  constructor(client) {
    this.client = client;
    this.partnerApiKey = client.config.partnerApiKey;
  }

  async getOrderLimit({ kycType, isBuyOrSell, fiatCurrency }) {
    return this.client.request({
      endpointId: 'order_limit',
      data: {},
      params: {
        kycType,
        isBuyOrSell,
        fiatCurrency,
        paymentCategory: 'bank_transfer',
      },
    });
  }

  async walletReserve({ quoteId, walletAddress }) {
    return this.client.request({
      endpointId: 'wallet_reserve',
      data: {
        quoteId,
        walletAddress,
      },
      params: {},
    });
  }

  async createOrder({ quoteId }) {
    const result = await this.client.request({
      endpointId: 'create_order',
      data: {
        reservationId: quoteId,
      },
      params: {},
    });
    if (result.errorMessage === 'Order exists' && result.data) {
      const errorDetails = {
        message:
          'Order already exists, please complete or cancel the existing order',
        orderId: result.data.id,
        status: result.data.status,
        createdAt: result.data.createdAt,
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
        paymentOptionId: paymentMethod,
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
