const user_response_fields = {
  required: {
    id: 'string',
    email: 'string',
    emailVerified: 'boolean',
    isTncAccepted: 'boolean',
    lastLogin: {
      date: 'string',
      userId: 'string',
    },
    createdAt: 'string',
    status: 'string',
    kyc: {
      l1: {
        status: 'string',
        type: ['string', 'null'],
        highestApprovedKYCType: ['string', 'null'],
        updatedAt: ['string', 'null'],
      },
    },
    ordersMetadata: {
      BUY: { numberOfOrders: 'number' },
      SELL: { numberOfOrders: 'number' },
      NFT_CHECKOUT: { numberOfOrders: 'number' },
      TRANSAK_ONE: { numberOfOrders: 'number' },
    },
  },
  optional: {
    isOauthLogin: 'boolean',
    kyc: {
      l1: {
        status: 'string',
        type: ['string', 'null'],
        highestApprovedKYCType: ['string', 'null'],
        updatedAt: ['string', 'null'],
        kycResult: 'string',
        kycMarkedBy: 'string',
        kycSubmittedAt: 'string',
        workflowRunId: 'string',
        userId: 'string',
        attempts: 'array',
        isREReview: 'boolean',
        isPEPsSanctionsDataExist: 'boolean',
      },
      monitor: {
        started: 'boolean',
        updatedAt: 'string',
        fetchCount: 'number',
        kycFlowType: 'string',
        partnerName: 'string',
        partnerApiKey: 'string',
      },
    },

    //kyc data
    firstName: 'string',
    lastName: 'string',
    mobileNumber: 'string',
    dob: 'string',
    address: {
      addressLine1: 'string',
      addressLine2: 'string',
      state: 'string',
      city: 'string',
      postCode: 'string',
      country: 'string',
      countryCode: 'string',
    },
    tncAcceptedAt: 'string',
    mobileVerified: 'boolean',
    updatedAt: 'string',
    sourceOfFunds: {
      purposeListArray: 'array',
    },

    billingAddress: {
      addressLine1: ['string', 'null'],
      city: ['string', 'null'],
      postCode: ['string', 'null'],
      country: ['string', 'null'],
    },
    //internal risk info
    isManualReview: 'boolean',
    isAllowedToDoKyc: 'boolean',
    isAllowedToPlaceOrder: 'boolean',

    //other data not that much important
    banks: 'array',
    isPANVerified: 'boolean',
    isSSNVerified: 'boolean',
    isQualifiedForDWA: 'boolean',
    isOptedForDWA: 'boolean',
  },
};

const userOutputFields = {
  id: { source: 'id', type: 'string', isRequired: true },
  firstName: {
    source: 'firstName',
    type: 'string',
    isRequired: false,
    defaultValue: null,
  },
  lastName: {
    source: 'lastName',
    type: 'string',
    isRequired: false,
    defaultValue: null,
  },
  email: { source: 'email', type: 'string', isRequired: true },
  mobileNumber: {
    source: 'mobileNumber',
    type: 'string',
    isRequired: false,
    defaultValue: null,
  },
  status: { source: 'status', type: 'string', isRequired: true },
  dob: { source: 'dob', type: 'string', isRequired: false, defaultValue: null },
  kyc: {
    source: 'kyc',
    type: 'object',
    isRequired: true
  },
  address: {
    source: 'address',
    type: 'object',
    defaultValue: null,
    isRequired: false,
    nestedFields: {
      addressLine1: {
        source: 'addressLine1',
        type: 'string',
        isRequired: true,
      },
      addressLine2: {
        source: 'addressLine2',
        type: 'string',
        isRequired: false,
      },
      state: { source: 'state', type: 'string', isRequired: true },
      city: { source: 'city', type: 'string', isRequired: true },
      postCode: { source: 'postCode', type: 'string', isRequired: true },
      country: { source: 'country', type: 'string', isRequired: true },
      countryCode: { source: 'countryCode', type: 'string', isRequired: true },
    },
  },
  createdAt: { source: 'createdAt', type: 'string', isRequired: true },
};

const apiSpecs = {
  send_email_otp: {
    name: 'Send Email OTP',
    id: 'send_email_otp',
    url: '/api/v2/user/email/send',
    method: 'POST',
    headers: {
      'x-trace-id': 'string',
      'frontend-auth': 'string',
      accept: 'application/json',
      'content-type': 'application/json',
    },
    expected_status: 200,
    body: {
      email: { type: 'string', isRequired: 'true', value: '' },
      partnerApiKey: { type: 'string', isRequired: 'true', value: '' },
    },
    response_root_field_name: 'response',
    response_required_fields: {
      isTncAccepted: 'boolean',
    },
    response_optional_fields: {},
    output_fields: {
      isTncAccepted: {
        source: 'isTncAccepted',
        type: 'boolean',
        isRequired: true,
      },
    },
  },
  verify_email_otp: {
    name: 'Verify Email OTP',
    id: 'verify_email_otp',
    url: '/api/v2/user/email/verify',
    method: 'POST',
    headers: {
      'x-trace-id': 'string',
      accept: 'application/json',
      'content-type': 'application/json',
    },
    expected_status: 200,
    body: {
      partnerApiKey: { type: 'string', isRequired: 'true', value: '' },
      email: { type: 'string', isRequired: 'true', value: '' },
      emailVerificationCode: { type: 'string', isRequired: 'true', value: '' },
    },
    response_root_field_name: 'response',
    response_required_fields: {
      id: 'string',
      ttl: 'number',
      created: 'string',
      userId: 'string',
    },
    response_optional_fields: {},
    output_fields: {
      id: { source: 'id', type: 'string', isRequired: true },
      ttl: { source: 'ttl', type: 'number', isRequired: true },
      created: { source: 'created', type: 'string', isRequired: true },
      userId: { source: 'userId', type: 'string', isRequired: true },
    },
  },
  get_user: {
    name: 'Fetch Authenticated User Details',
    id: 'get_user',
    url: '/api/v2/user',
    method: 'GET',
    headers: {
      Authorization: 'string',
      'x-trace-id': 'string',
      accept: 'application/json',
    },
    query_params: {},
    expected_status: 200,
    response_root_field_name: 'response',
    response_required_fields: user_response_fields.required,
    response_optional_fields: user_response_fields.optional,
    output_fields: userOutputFields,
  },
  get_kyc_forms: {
    name: 'Get KYC Forms',
    id: 'get_kyc_forms',
    url: '/api/v2/user/kyc/get-forms',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
      authorization: 'string',
    },
    query_params: {
      onlyFormIds: { type: 'boolean', isRequired: 'true', value: 'true' },
      'metadata[quoteId]': { type: 'string', isRequired: 'true', value: '' },
      'metadata[formType]': {
        type: 'string',
        isRequired: 'true',
        value: 'KYC',
      },
    },
    expected_status: 200,
    response_root_field_name: 'response',
    response_required_fields: {
      forms: {
        type: 'array',
        isRequired: 'true',
        items: {
          id: { type: 'string', isRequired: 'true' },
          active: { type: 'boolean', isRequired: 'false' },
          hideProgress: { type: 'boolean', isRequired: 'false' },
          onSubmit: { type: 'string', isRequired: 'false' },
        },
      },
      onboardingSessionId: { type: 'string', isRequired: 'true' },
      kycType: { type: 'string', isRequired: 'true' },
      kycFlowType: { type: 'string', isRequired: 'true' },
      isAllowedToDoKyc: { type: 'boolean', isRequired: 'true' },
      isAllowedToPlaceOrder: { type: 'boolean', isRequired: 'true' },
    },
    response_optional_fields: {},
    isSaveTheResponseInMemory: false,
    output_fields: {
      kycType: { source: 'kycType', type: 'string', isRequired: 'true' },
      forms: { source: 'forms', type: 'array', isRequired: 'true' },
    },
  },
  get_kyc_forms_by_id: {
    name: 'Fetch Individual KYC Form',
    id: 'get_kyc_forms_by_id',
    url: '/api/v2/user/kyc/get-forms',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
      authorization: 'string',
    },
    query_params: {
      onlyFormIds: { type: 'boolean', isRequired: 'true', value: 'false' },
      'formIds[]': { type: 'string', isRequired: 'true', value: '' },
      'metadata[quoteId]': { type: 'string', isRequired: 'true', value: '' },
      'metadata[formType]': {
        type: 'string',
        isRequired: 'true',
        value: 'KYC',
      },
    },
    expected_status: 200,
    response_root_field_name: 'response',
    response_required_fields: {
      formId: 'string',
      formName: 'string',
      endpoint: {
        path: 'string',
        method: 'string',
      },
      fields: [
        {
          id: 'string',
          name: 'string',
          type: 'string',
          isRequired: 'boolean',
          regex: 'string',
          regexErrorMessage: 'string',
          placeholder: 'string',
          value: 'value',
        },
      ],
    },
    response_optional_fields: {},
    output_fields: {
      formId: { source: 'formId', type: 'string', isRequired: 'true' },
      formName: { source: 'formName', type: 'string', isRequired: 'true' },
      endpoint: {
        source: 'endpoint',
        type: 'object',
        isRequired: true,
        nestedFields: {
          path: { source: 'path', type: 'string', isRequired: 'true' },
          method: { source: 'method', type: 'string', isRequired: 'true' },
        },
      },
      fields: {
        source: 'fields',
        type: 'array',
        isRequired: 'true',
        nestedFields: {
          id: { source: 'id', type: 'string', isRequired: true },
          name: { source: 'name', type: 'string', isRequired: true },
          type: { source: 'type', type: 'string', isRequired: true },
          isRequired: {
            source: 'isRequired',
            type: 'boolean',
            isRequired: true,
          },
          regex: { source: 'regex', type: 'string', isRequired: false },
          placeholder: {
            source: 'placeholder',
            type: 'string',
            isRequired: false,
          },
          value: { source: 'value', type: 'string', isRequired: false },
        },
      },
    },
  },
  get_kyc_forms_idProof: {
    name: 'Fetch ID Proof KYC Form',
    id: 'get_kyc_forms_idProof',
    url: '/api/v2/user/kyc/get-forms',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
      authorization: 'string',
    },
    query_params: {
      onlyFormIds: { type: 'boolean', isRequired: 'true', value: 'false' },
      'formIds[]': { type: 'string', isRequired: 'true', value: '' },
      'metadata[quoteId]': { type: 'string', isRequired: 'true', value: '' },
      'metadata[formType]': {
        type: 'string',
        isRequired: 'true',
        value: 'KYC',
      },
    },
    expected_status: 200,
    response_root_field_name: 'response',
    response_required_fields: {
      formId: 'string',
      formName: 'string',
      id: 'string',
      type: 'string',
      data: {
        sdkToken: 'string',
        workFlowRunId: 'string',
        expiresAt: 'string',
        kycUrl: 'string',
      },
    },
    response_optional_fields: {},
    output_fields: {
      formId: { source: 'formId', type: 'string', isRequired: true },
      formName: { source: 'formName', type: 'string', isRequired: true },
      kycUrl: { source: 'data.kycUrl', type: 'string', isRequired: true },
      expiresAt: { source: 'data.expiresAt', type: 'string', isRequired: true },
    },
  },
  patch_user: {
    name: 'Patch User',
    id: 'patch_user',
    url: '/api/v2/user',

    method: 'PATCH',
    headers: {
      'x-trace-id': 'string',
      authorization: 'string',
      'content-type': 'application/json',
    },
    body: {
      //address fields
      addressLine1: { type: 'string', isRequired: 'false' },
      addressLine2: { type: 'string', isRequired: 'false' },
      state: { type: 'string', isRequired: 'false' },
      city: { type: 'string', isRequired: 'false' },
      postCode: { type: 'string', isRequired: 'false' },
      countryCode: { type: 'string', isRequired: 'false' },
      //personal details fields
      firstName: { type: 'string', isRequired: 'false', value: '' },
      lastName: { type: 'string', isRequired: 'false', value: '' },
      mobileNumber: { type: 'string', isRequired: 'false', value: '' },
      dob: { type: 'string', isRequired: 'false', value: '' },
    },
    expected_status: 200,
    response_root_field_name: 'response',
    response_required_fields: user_response_fields.required,
    response_optional_fields: user_response_fields.optional,
    output_fields: userOutputFields,
  },
  submit_purpose_of_usage: {
    name: 'Submit Purpose Of Usage',
    id: 'submit_purpose_of_usage',
    url: '/api/v2/user/purpose-of-usage',
    method: 'POST',
    headers: {
      'x-trace-id': 'string',
      authorization: 'string',
      'content-type': 'application/json',
    },
    body: {
      purposeList: { type: 'array', isRequired: 'true', value: [] },
    },
    expected_status: 200,
    response_root_field_name: 'result',
    response_required_fields: {
      result: 'ok',
    },
    response_optional_fields: {},
    output_fields: {},
  },
  share_token_status: {
    name: 'Share Token Status',
    id: 'share_token_status',
    url: '/api/v2/user/share-token-status',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
      authorization: 'string',
      'content-type': 'application/json',
    },
    query_params: {
      kycShareToken: { type: 'string', isRequired: 'true', value: '' },
      kycShareTokenProvider: { type: 'string', isRequired: 'false', value: '' },
      quoteId: { type: 'string', isRequired: 'true', value: '' },
    },
    expected_status: 200,
    response_root_field_name: 'response',
    response_required_fields: {},
    response_optional_fields: {},
    output_fields: {},
  },
  request_ott: {
    name: 'Request OTT',
    id: 'request_ott',
    url: '/auth/public/v1/request-ott',
    method: 'POST',
    headers: {
      'x-trace-id': 'string',
      'Authorization': 'string',
      'Content-Type': 'application/json',
    },
    body: {
      partnerApiKey: { type: 'string', isRequired: 'true', value: '' },
    },
    expected_status: 200,
    response_root_field_name: 'response',
    response_required_fields: {
      token: 'string',
    },
    response_optional_fields: {},
    output_fields: {
      token: { source: 'token', type: 'string', isRequired: true },
    },
  },
};

//default export module nodejs
export default apiSpecs;
