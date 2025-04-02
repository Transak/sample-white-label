class UserService {
  constructor(client) {
    this.client = client;
    this.partnerApiKey = client.config.partnerApiKey;
  }

  async sendEmailOtp({ email, frontendAuth }) {
    if (!frontendAuth) throw new Error('Frontend Auth is required');
    return this.client.request({
      endpointId: 'send_email_otp',
      data: { email, partnerApiKey: this.partnerApiKey },
      params: {},
      headers: { 'frontend-auth': frontendAuth },
    });
  }

  async requestOtt({ accessToken }) {
    if (!accessToken) throw new Error('Access Token is required');
    return this.client.request({
      endpointId: 'request_ott',
      data: { partnerApiKey: this.partnerApiKey },
      params: {},
      headers: { 'Authorization': accessToken },
    });
  }

  async verifyEmailOtp(data) {
    const response = await this.client.request({
      endpointId: 'verify_email_otp',
      data: { ...data, partnerApiKey: this.partnerApiKey },
    });
    if (response && response.id) await this.client.setAccessToken(response.id);
    return response;
  }

  async getUser(data) {
    let accessToken;
    if (data && data.accessToken) accessToken = data.accessToken;

    const requestConfig = {
      endpointId: 'get_user',
      data: {},
      params: {},
      headers: {},
    };
    if (accessToken) requestConfig.headers['authorization'] = accessToken;
    const userData = await this.client.request(requestConfig);
    if (userData && userData.id) {
      this.client.setUserData(userData);
      if (accessToken) this.client.setAccessToken(accessToken);
    }
    return userData;
  }

  async getKycForms({ quoteId }) {
    const kycFormData = await this.client.request({
      endpointId: 'get_kyc_forms',
      data: {},
      params: {
        'metadata[quoteId]': quoteId,
        onlyFormIds: true,
        'metadata[formType]': 'KYC',
      },
    });
    return kycFormData;
    // return transformGetKYCForms(kycFormData);
  }

  async getKycFormById({ formId, quoteId }) {
    return this.client.request({
      endpointId: 'get_kyc_forms_by_id',
      data: {},
      params: {
        'formIds[]': formId,
        'metadata[quoteId]': quoteId,
        onlyFormIds: false,
        'metadata[formType]': 'KYC',
      },
    });
  }

  async getKycFormIdProof({ formId, quoteId }) {
    return this.client.request({
      endpointId: 'get_kyc_forms_idProof',
      data: {},
      params: {
        'formIds[]': formId,
        'metadata[quoteId]': quoteId,
        onlyFormIds: false,
        'metadata[formType]': 'KYC',
      },
    });
  }

  async patchUser(data) {
    validatePatchUserData(data);
    return this.client.request({
      endpointId: 'patch_user',
      data,
      params: {},
    });
  }

  async submitPurposeOfUsageForm({ purposeList }) {
    validatePurposeOfUsageForm(purposeList);
    const response = await this.client.request({
      endpointId: 'submit_purpose_of_usage',
      data: { purposeList },
      params: {},
    });
    if (response !== 'ok')
      throw new Error('Failed to submit purpose of usage form.');
    return response;
  }

  async shareTokenStatus(params) {
    return this.client.request({
      endpointId: 'share_token_status',
      data: null,
      params
    });
  }
}

function transformGetKYCForms(input) {
  return {
    kycType: input.kycType,
    formIds: input.forms.map((form) => form.id),
  };
}

function validatePurposeOfUsageForm(purposeList) {
  const allowedPurposes = [
    'Buying/selling crypto for investments',
    'Buying NFTs',
    'Buying crypto to use a web3 protocol',
  ];

  if (!Array.isArray(purposeList) || purposeList.length === 0) {
    throw new Error(
      'Purpose list must be an array containing at least one valid purpose.'
    );
  }

  const invalidPurposes = purposeList.filter(
    (purpose) => !allowedPurposes.includes(purpose)
  );
  if (invalidPurposes.length > 0) {
    throw new Error(
      `Invalid purpose(s) found: ${invalidPurposes.join(', ')}. Allowed purposes: ${allowedPurposes.join(', ')}`
    );
  }
  return true;
}

function validatePatchUserData(data) {
  const requiredGroupFields = ['firstName', 'lastName', 'mobileNumber', 'dob'];
  const addressFields = [
    'addressLine1',
    'addressLine2',
    'state',
    'city',
    'postCode',
    'countryCode',
  ];

  const providedFields = Object.keys(data);

  const hasAnyRequiredField = requiredGroupFields.some((field) =>
    providedFields.includes(field)
  );
  const hasAllRequiredFields = requiredGroupFields.every((field) =>
    providedFields.includes(field)
  );

  if (hasAnyRequiredField && !hasAllRequiredFields) {
    throw new Error(
      `If any of the following fields are provided: ${requiredGroupFields.join(', ')}, all of them must be provided.`
    );
  }

  const hasAnyAddressField = addressFields.some((field) =>
    providedFields.includes(field)
  );
  const hasAllAddressFields = addressFields.every((field) =>
    providedFields.includes(field)
  );

  if (hasAnyAddressField && !hasAllAddressFields) {
    throw new Error(
      `If any address fields are provided, all of them must be included: ${addressFields.join(', ')}.`
    );
  }

  return true;
}

export {
  UserService,
  validatePatchUserData,
  validatePurposeOfUsageForm,
};
