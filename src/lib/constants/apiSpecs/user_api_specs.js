const user_response_fields = {
  required: {
    partnerUserId: 'string',
    email: 'string',
    status: 'string',
    kyc: {
      status: 'string',
      type: ['string', 'null']
    },
  },
  optional: {
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
    }
  }
};

const userOutputFields = {
  partnerUserId: { source: 'partnerUserId', type: 'string', isRequired: true },
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
    isRequired: true,
    nestedFields: {
      status: {
        source: 'status',
        type: 'string',
        isRequired: true,
      },
      type: {
        source: 'type',
        type: 'string',
        isRequired: true,
      }
    }
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
  }
};

const apiSpecs = {
  send_email_otp: {
    name: 'Send Email OTP',
    id: 'send_email_otp',
    url: '/api/v2/auth/login',
    method: 'POST',
    headers: {
      'x-trace-id': 'string',
      accept: 'application/json',
      'content-type': 'application/json',
    },
    expected_status: 200,
    body: {
      email: { type: 'string', isRequired: 'true', value: '' },
      apiKey: { type: 'string', isRequired: 'true', value: '' },
    },
    response_root_field_name: 'data',
    response_required_fields: {
      isTncAccepted: 'boolean',
      stateToken: 'string',
    },
    response_optional_fields: {},
    output_fields: {
      isTncAccepted: {
        source: 'isTncAccepted',
        type: 'boolean',
        isRequired: true,
      },
      stateToken: {
        source: 'stateToken',
        type: 'string',
        isRequired: true,
      }
    },
  },
  verify_email_otp: {
    name: 'Verify Email OTP',
    id: 'verify_email_otp',
    url: '/api/v2/auth/verify',
    method: 'POST',
    headers: {
      'x-trace-id': 'string',
      accept: 'application/json',
      'content-type': 'application/json',
    },
    expected_status: 200,
    body: {
      apiKey: { type: 'string', isRequired: 'true', value: '' },
      email: { type: 'string', isRequired: 'true', value: '' },
      otp: { type: 'string', isRequired: 'true', value: '' },
      stateToken: { type: 'string', isRequired: 'true', value: '' },
    },
    response_root_field_name: 'data',
    response_required_fields: {
      accessToken: 'string',
      ttl: 'number',
      created: 'string'
    },
    response_optional_fields: {},
    output_fields: {
      accessToken: { source: 'accessToken', type: 'string', isRequired: true },
      ttl: { source: 'ttl', type: 'number', isRequired: true },
      created: { source: 'created', type: 'string', isRequired: true }
    },
  },
  get_user: {
    name: 'Fetch Authenticated User Details',
    id: 'get_user',
    url: '/api/v2/user/',
    method: 'GET',
    headers: {
      Authorization: 'string',
      'x-trace-id': 'string',
      accept: 'application/json',
    },
    query_params: {
      apiKey: { type: 'string', isRequired: 'true', value: '' },
    },
    expected_status: 200,
    response_root_field_name: 'data',
    response_required_fields: user_response_fields.required,
    response_optional_fields: user_response_fields.optional,
    output_fields: userOutputFields,
  },
  get_kyc_requirement: {
    name: 'Get KYC Requirement',
    id: 'get_kyc_requirement',
    url: '/api/v2/kyc/requirement',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
      Authorization: 'string',
    },
    query_params: {
      'metadata[quoteId]': { type: 'string', isRequired: 'true', value: '' },
      apiKey: { type: 'string', isRequired: 'true', value: '' },
    },
    expected_status: 200,
    response_root_field_name: 'data',
    response_required_fields: {
      status: { type: 'string', isRequired: 'true' },
      kycType: { type: 'string', isRequired: 'true' },
      isAllowedToPlaceOrder: { type: 'boolean', isRequired: 'true' },
    },
    response_optional_fields: {},
    output_fields: {
      kycType: { source: 'kycType', type: 'string', isRequired: 'true' },
      status: { source: 'status', type: 'string', isRequired: 'true' },
      isAllowedToPlaceOrder: { source: 'isAllowedToPlaceOrder', type: 'boolean', isRequired: 'true' },
    },
  },
  patch_user_details: {
    name: 'Patch User Details',
    id: 'patch_user_details',
    url: '/api/v2/kyc/user',
    method: 'PATCH',
    headers: {
      'x-trace-id': 'string',
      Authorization: 'string',
      'content-type': 'application/json',
    },
    body: {
      addressDetails: {
        source: 'addressDetails',
        type: 'object',
        isRequired: true,
        nestedFields: {
          addressLine1: { type: 'string', isRequired: 'false' },
          addressLine2: { type: 'string', isRequired: 'false' },
          state: { type: 'string', isRequired: 'false' },
          city: { type: 'string', isRequired: 'false' },
          postCode: { type: 'string', isRequired: 'false' },
          countryCode: { type: 'string', isRequired: 'false' },
        }
      },
      personalDetails: {
        source: 'personalDetails',
        type: 'object',
        isRequired: true,
        nestedFields: {
          firstName: { type: 'string', isRequired: 'false', value: '' },
          lastName: { type: 'string', isRequired: 'false', value: '' },
          mobileNumber: { type: 'string', isRequired: 'false', value: '' },
          dob: { type: 'string', isRequired: 'false', value: '' },
        }
      }
    },
    expected_status: 200,
    response_root_field_name: 'data',
    response_required_fields: user_response_fields.required,
    response_optional_fields: user_response_fields.optional,
    output_fields: userOutputFields,
  },
  get_additional_requirements: {
    name: 'Get Additional Requirements',
    id: 'get_additional_requirements',
    url: '/api/v2/kyc/additional-requirements',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
      Authorization: 'string',
    },
    query_params: {
      'metadata[quoteId]': {type: 'string', isRequired: 'true', value: ''}
    },
    expected_status: 200,
    response_root_field_name: 'data',
    response_required_fields: {
      formsRequired: {
        type: 'array',
        isRequired: 'true',
        items: {
          type: { type: 'string', isRequired: 'true'},
        }
      },
      response_optional_fields: {},
      output_fields: {
        formsRequired: {source: 'formsRequired', type: 'array', isRequired: 'true'},
      }
    }
  },
  update_purpose_of_usage: {
    name: 'Update Purpose Of Usage',
    id: 'update_purpose_of_usage',
    url: '/api/v2/kyc/purpose-of-usage',
    method: 'POST',
    headers: {
      'x-trace-id': 'string',
      Authorization: 'string',
      'content-type': 'application/json',
    },
    body: {
      purposeList: { type: 'array', isRequired: 'true', value: [] },
    },
    expected_status: 200,
    response_root_field_name: 'data',
    response_required_fields: {
        status: 'SUBMITTED',
    },
    response_optional_fields: {},
    output_fields: {},
  },
  submit_ssn: {
    name: 'Submit SSN',
    id: 'submit_ssn',
    url: '/api/v2/kyc/ssn',
    method: 'POST',
    headers: {
      'x-trace-id': 'string',
      Authorization: 'string',
      'Content-Type': 'application/json',
    },
    body: {
      ssn: { type: 'string', isRequired: 'true', value: '' },
      quoteId: { type: 'string', isRequired: 'true', value: '' },
    },
    expected_status: 200,
    response_root_field_name: 'data',
    response_required_fields: {
      status: 'SUBMITTED',
    },
    response_optional_fields: {},
    output_fields: {},
  },
  kyc_reliance_status: {
    name: 'Get KYC Reliance Status',
    id: 'kyc_reliance_status',
    url: '/api/v2/user/share-token-status',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
      Authorization: 'string',
    },
    query_params: {
      quoteId: { type: 'string', isRequired: 'true', value: '' },
      kycShareTokenProvider: { type: 'string', isRequired: 'true', value: '' },
      kycShareToken: { type: 'string', isRequired: 'true', value: '' }
    },
    expected_status: 200,
    response_root_field_name: 'data',
    response_required_fields: {
      shareTokenStatus: 'string',
    },
    response_optional_fields: {},
    output_fields: {
      shareTokenStatus: {source: 'shareTokenStatus', type: 'string', isRequired: 'true'},
    }
  },
  request_ott: {
    name: 'Request OTT',
    id: 'request_ott',
    url: '/api/v2/auth/request-ott',
    method: 'POST',
    headers: {
      'x-trace-id': 'string',
      Authorization: 'string',
      'Content-Type': 'application/json',
    },
    body: {
      apiKey: { type: 'string', isRequired: 'true', value: '' },
    },
    expected_status: 200,
    response_root_field_name: 'data',
    response_required_fields: {
      ott: 'string',
    },
    response_optional_fields: {},
    output_fields: {
      ott: { source: 'ott', type: 'string', isRequired: true },
    },
  },
  refresh_access_token: {
    name: 'Refresh Access Token',
    id: 'refresh_access_token',
    url: '/api/v2/auth/refresh',
    method: 'GET',
    headers: {
      'x-trace-id': 'string',
      Authorization: 'string',
    },
    expected_status: 200,
    response_root_field_name: 'data',
    response_required_fields: {
      accessToken: 'string',
    },
    response_optional_fields: {},
    output_fields: {
      accessToken: {
        source: 'accessToken',
        type: 'string',
        isRequired: true,
      }
    },
  }
};


export default apiSpecs;
