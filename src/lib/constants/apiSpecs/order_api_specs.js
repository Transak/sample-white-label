const order_response_fields = {
    required: {
        id: 'string', //done
        walletAddress: 'string', //done
        createdAt: 'string', //done
        status: 'string', //done
        fiatCurrency: 'string', //done
        userId: 'string', //done
        cryptoCurrency: 'string', //done
        isBuyOrSell: 'string', //done
        fiatAmount: 'number', //done
        amountPaid: 'number', //done
        paymentOptionId: 'string', //done
        quoteId: 'string',
        addressAdditionalData: 'boolean', //done
        network: 'string', //done

        //quote data
        conversionPrice: 'number', //done
        cryptoAmount: 'number', //done
        totalFeeInFiat: 'number', //done
        fiatAmountInUsd: 'number', //done

        //payment details
        tokenContractAddress: 'string',
        userKycType: 'string',
        cardPaymentData: {
            orderId: 'string',
            paymentId: 'string',
            pgData: {
                liquidityProvider: 'string',
                status: 'string',
                beneficiaryName: 'string',
                paymentOptions: [
                    {
                        currency: 'string',
                        id: 'string',
                        name: 'string',
                        fields: [
                            {
                                name: 'string',
                                value: 'string',
                            },
                        ],
                    },
                ],
            },
            liquidityProvider: 'string',
            updatedAt: 'string',
        },
        statusHistories: [
            {
                status: 'string',
                createdAt: 'string',
                message: 'string',
                isEmailSentToUser: 'boolean',
                partnerEventId: 'string',
            },
        ],
    },
    optional: {
        ipAddress: 'string',
        walletLink: 'string',
        orderProcessingType: 'string',
        countryCode: 'string',
        campaignAmount: 'number',
        campaignAmountInUsd: 'number',
        tfPerOff: 'number',
        aTtlFees: 'number',
        aTskFees: 'number',
        stateCode: 'string',
        orderChannelType: 'string',
        isOpenPaydPopup: 'boolean',
        lastNotifiedAt: 'string',
        autoExpiresAt: 'string',
        // "paymentOptions": [
        //     {
        //         "currency": "string",
        //         "id": "string",
        //         "name": "string",
        //         "fields": [
        //             {
        //                 "name": "string",
        //                 "value": "string"
        //             }
        //         ]
        //     }
        // ],

        // below fields comes after processing of the order
        isFirstOrder: 'boolean',
        updatedAt: 'string',
        transactionHash: 'string',
        transactionLink: 'string',
        completedAt: 'string',
        transakFeeAmount: 'number',
    },
    output_fields: {
        id: {source: 'id', type: 'string', isRequired: true},
        userId: {source: 'userId', type: 'string', isRequired: true},
        status: {source: 'status', type: 'string', isRequired: true},
        isBuyOrSell: {source: 'isBuyOrSell', type: 'string', isRequired: true},
        fiatCurrency: {source: 'fiatCurrency', type: 'string', isRequired: true},
        cryptoCurrency: {source: 'cryptoCurrency', type: 'string', isRequired: true},
        paymentOptionId: {source: 'paymentOptionId', type: 'string', isRequired: true},
        network: {source: 'network', type: 'string', isRequired: true},
        walletAddress: {source: 'walletAddress', type: 'string', isRequired: true},
        addressAdditionalData: {source: 'addressAdditionalData', type: 'any', isRequired: false},
        //quote related
        quoteId: {source: 'quoteId', type: 'string', isRequired: true},
        fiatAmount: {source: 'fiatAmount', type: 'number', isRequired: true},
        fiatAmountInUsd: {source: 'fiatAmountInUsd', type: 'number', isRequired: true},
        amountPaid: {source: 'amountPaid', type: 'number', isRequired: false, defaultValue: 0},
        cryptoAmount: {source: 'cryptoAmount', type: 'number', isRequired: true},
        conversionPrice: {source: 'conversionPrice', type: 'number', isRequired: true},
        totalFeeInFiat: {source: 'totalFeeInFiat', type: 'number', isRequired: true},
        paymentOptions: {
            source: 'cardPaymentData.pgData.paymentOptions',
            type: 'array',
            isRequired: true,
            nestedFields: {
                currency: {source: 'currency', type: 'string', isRequired: true},
                id: {source: 'id', type: 'string', isRequired: true},
                name: {source: 'name', type: 'string', isRequired: true},
                fields: {
                    source: 'fields', type: 'array', isRequired: true,
                    nestedFields: {
                        name: {source: 'name', type: 'string', isRequired: true},
                        value: {source: 'value', type: 'string', isRequired: true},
                    }
                }
            }
        },
        transactionHash: {source: 'transactionHash', type: 'string', isRequired: false, defaultValue: null},
        createdAt: {source: 'createdAt', type: 'string', isRequired: true},
        updatedAt: {source: 'updatedAt', type: 'string', isRequired: false, defaultValue: null},
        completedAt: {source: 'completedAt', type: 'string', isRequired: false, defaultValue: null},
        statusHistories: {
            source: 'statusHistories',
            type: 'array',
            isRequired: true,
            nestedFields: {
                status: {source: 'status', type: 'string', isRequired: true},
                createdAt: {source: 'createdAt', type: 'string', isRequired: true}
            }
        },
    }
};

const apiSpecs = {
    wallet_reserve: {
        name: 'Wallet Reserve',
        id: 'wallet_reserve',
        url: '/api/v2/orders/wallet-reserve',
        method: 'POST',
        headers: {
            'x-trace-id': 'string',
            authorization: 'string',
            'content-type': 'application/json',
        },
        body: {
            quoteId: {type: 'string', isRequired: 'true'},
            walletAddress: {type: 'string', isRequired: 'true'},
        },
        expected_status: 200,
        response_root_field_name: 'response',
        response_required_fields: {
            id: 'string',
        },
        response_optional_fields: {},
        output_fields: {
            id: {source: 'id', type: 'string', isRequired: true}
        },
    },
    order_limit: {
        name: 'Fetch Order Limits',
        id: 'order_limit',
        url: '/api/v2/orders/order-limit',
        method: 'GET',
        headers: {
            'x-trace-id': 'string',
            authorization: 'string',
        },
        query_params: {
            isBuyOrSell: {type: 'string', isRequired: 'true'},
            paymentCategory: {
                type: 'string',
                isRequired: 'true',
                value: 'bank_transfer',
            },
            kycType: {type: 'string', isRequired: 'true'},
            fiatCurrency: {type: 'string', isRequired: 'true'},
        },
        expected_status: 200,
        response_root_field_name: 'response',
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
            authorization: 'string',
            'content-type': 'application/json',
        },
        body: {
            reservationId: {type: 'string', isRequired: 'true'},
        },
        expected_status: 200,
        response_root_field_name: 'response',
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
            authorization: 'string',
            'content-type': 'application/json',
        },
        body: {
            orderId: {type: 'string', isRequired: 'true'},
            paymentOptionId: {type: 'string', isRequired: 'true'},
        },
        expected_status: 200,
        response_root_field_name: 'response',
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
            authorization: 'string',
            'content-type': 'application/json',
        },
        path_params: {
            orderId: {type: 'string', isRequired: 'true'},
            cancelReason: {type: 'string', isRequired: 'true'},
        },
        expected_status: 200,
        response_root_field_name: 'response',
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
            authorization: 'string',
        },
        path_params: {
            orderId: {type: 'string', isRequired: 'true'},
        },
        expected_status: 200,
        response_root_field_name: 'response',
        response_required_fields: order_response_fields.required,
        response_optional_fields: order_response_fields.optional,
        output_fields: order_response_fields.output_fields,
    },
};

//default export module nodejs
export default apiSpecs;
