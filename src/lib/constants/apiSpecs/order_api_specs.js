const order_response_fields = {
    required: {
        orderId: 'string',
        partnerUserId: 'string',
        walletAddress: 'string',
        status: 'string',
        fiatCurrency: 'string',
        cryptoCurrency: 'string',
        isBuyOrSell: 'string',
        fiatAmount: 'number',
        fiatAmountInUsd: 'number',
        amountPaid: 'number',
        paymentMethod: 'string',
        quoteId: 'string',
        network: 'string',
        networkId: 'string',
        conversionPrice: 'number',
        cryptoAmount: 'number',
        totalFeeInFiat: 'number',
    },
    optional: {
        addressAdditionalData: 'boolean',
        txHash: 'string',
        walletLink: 'string',
        transactionLink: 'string'
    },
    output_fields: {
        orderId: {source: 'orderId', type: 'string', isRequired: true},
        partnerUserId: {source: 'partnerUserId', type: 'string', isRequired: true},
        walletAddress: {source: 'walletAddress', type: 'string', isRequired: true},
        status: {source: 'status', type: 'string', isRequired: true},
        fiatCurrency: {source: 'fiatCurrency', type: 'string', isRequired: true},
        cryptoCurrency: {source: 'cryptoCurrency', type: 'string', isRequired: true},
        isBuyOrSell: {source: 'isBuyOrSell', type: 'string', isRequired: true},
        fiatAmount: {source: 'fiatAmount', type: 'number', isRequired: true},
        fiatAmountInUsd: {source: 'fiatAmountInUsd', type: 'number', isRequired: true},
        amountPaid: {source: 'amountPaid', type: 'number', isRequired: false, defaultValue: 0},
        paymentMethod: {source: 'paymentMethod', type: 'string', isRequired: true},
        network: {source: 'network', type: 'string', isRequired: true},
        networkId: {source: 'networkId', type: 'string', isRequired: true},
        quoteId: {source: 'quoteId', type: 'string', isRequired: true},
        addressAdditionalData: {source: 'addressAdditionalData', type: 'any', isRequired: false},
        cryptoAmount: {source: 'cryptoAmount', type: 'number', isRequired: true},
        conversionPrice: {source: 'conversionPrice', type: 'number', isRequired: true},
        totalFeeInFiat: {source: 'totalFeeInFiat', type: 'number', isRequired: true},
        txHash: {source: 'txHash', type: 'string', isRequired: false, defaultValue: null},
        walletLink: {source: 'walletLink', type: 'string', isRequired: false, defaultValue: null},
        transactionLink: {source: 'transactionLink', type: 'string', isRequired: false, defaultValue: null},
        paymentDetails: {source: 'paymentDetails', type: 'array', isRequired: false}
    }
};

const apiSpecs = {
    user_limits: {
        name: 'Fetch User Limits',
        id: 'user_limits',
        url: '/api/v2/orders/user-limit',
        method: 'GET',
        headers: {
            'x-trace-id': 'string',
            Authorization: 'string',
        },
        query_params: {
            isBuyOrSell: {type: 'string', isRequired: 'true'},
            paymentCategory: {type: 'string', isRequired: 'true'},
            kycType: {type: 'string', isRequired: 'true'},
            fiatCurrency: {type: 'string', isRequired: 'true'},
        },
        expected_status: 200,
        response_root_field_name: 'data',
        response_required_fields: {
            limits: {
                1: 'number',
                30: 'number',
                365: 'number',
            },
            spent: {
                1: 'number',
                30: 'number',
                365: 'number',
            },
            remaining: {
                1: 'number',
                30: 'number',
                365: 'number',
            },
            exceeded: {
                1: 'boolean',
                30: 'boolean',
                365: 'boolean',
            },
        },
        response_optional_fields: {},
        output_fields: {
            limits: {
                source: 'limits',
                type: 'object',
                isRequired: true,
                nestedFields: {
                    1: {source: '1', type: 'number', isRequired: true},
                    30: {source: '30', type: 'number', isRequired: true},
                    365: {source: '365', type: 'number', isRequired: true}
                }
            },
            spent: {
                source: 'spent',
                type: 'object',
                isRequired: true,
                nestedFields: {
                    1: {source: '1', type: 'number', isRequired: true},
                    30: {source: '30', type: 'number', isRequired: true},
                    365: {source: '365', type: 'number', isRequired: true}
                }
            },
            remaining: {
                source: 'remaining',
                type: 'object',
                isRequired: true,
                nestedFields: {
                    1: {source: '1', type: 'number', isRequired: true},
                    30: {source: '30', type: 'number', isRequired: true},
                    365: {source: '365', type: 'number', isRequired: true}
                }
            },
            exceeded: {
                source: 'exceeded',
                type: 'object',
                isRequired: true,
                nestedFields: {
                    1: {source: '1', type: 'boolean', isRequired: true},
                    30: {source: '30', type: 'boolean', isRequired: true},
                    365: {source: '365', type: 'boolean', isRequired: true}
                }
            }
        },
    },
    create_order: {
        name: 'Create Order',
        id: 'create_order',
        url: '/api/v2/orders',
        method: 'POST',
        headers: {
            'x-trace-id': 'string',
            Authorization: 'string',
            'content-type': 'application/json',
        },
        body: {
            quoteId: {type: 'string', isRequired: 'true'},
            paymentInstrumentId: {type: 'string', isRequired: 'true'},
            walletAddress: {type: 'string', isRequired: 'true'},
        },
        expected_status: 200,
        response_root_field_name: 'data',
        response_required_fields: order_response_fields.required,
        response_optional_fields: order_response_fields.optional,
        output_fields: order_response_fields.output_fields,
    },
    confirm_payment: {
        name: 'Confirm Payment',
        id: 'confirm_payment',
        url: '/api/v2/orders/payment-confirmation',
        method: 'POST',
        headers: {
            'x-trace-id': 'string',
            Authorization: 'string',
            'content-type': 'application/json',
        },
        body: {
            orderId: {type: 'string', isRequired: 'true'},
            paymentMethod: {type: 'string', isRequired: 'true'},
        },
        expected_status: 200,
        response_root_field_name: 'data',
        response_required_fields: order_response_fields.required,
        response_optional_fields: order_response_fields.optional,
        output_fields: order_response_fields.output_fields,
    },
    cancel_order: {
        name: 'Cancel Order',
        id: 'cancel_order',
        url: `/api/v2/orders/{orderId}?cancelReason={cancelReason}`,
        method: 'DELETE',
        headers: {
            'x-trace-id': 'string',
            Authorization: 'string',
            'content-type': 'application/json',
        },
        path_params: {
            orderId: {type: 'string', isRequired: 'true'},
            cancelReason: {type: 'string', isRequired: 'true'},
        },
        expected_status: 200,
        response_root_field_name: 'data',
        response_required_fields: order_response_fields.required,
        response_optional_fields: order_response_fields.optional,
        output_fields: order_response_fields.output_fields,
    },
    get_order_by_id: {
        name: 'Get Order By ID',
        id: 'get_order_by_id',
        url: '/api/v2/orders/{orderId}',
        method: 'GET',
        headers: {
            'x-trace-id': 'string',
            Authorization: 'string',
        },
        path_params: {
            orderId: {type: 'string', isRequired: 'true'},
        },
        expected_status: 200,
        response_root_field_name: 'data',
        response_required_fields: order_response_fields.required,
        response_optional_fields: order_response_fields.optional,
        output_fields: order_response_fields.output_fields,
    },
};

//default export module nodejs
export default apiSpecs;
