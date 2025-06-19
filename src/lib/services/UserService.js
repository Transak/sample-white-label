class UserService {
  constructor(client) {
    this.client = client;
    this.partnerApiKey = client.config.partnerApiKey;
  }

  async sendEmailOtp({ email }) {
    return this.client.request({
      endpointId: 'send_email_otp',
      data: { email, apiKey: this.partnerApiKey },
      params: {},
    });
  }

  async verifyEmailOtp(data) {
    const response = await this.client.request({
      endpointId: 'verify_email_otp',
      data: { ...data, apiKey: this.partnerApiKey },
    });
    if (response && response.accessToken) await this.client.setAccessToken(response.accessToken);
    return response;
  }

  async requestOtt() {
    return this.client.request({
      endpointId: 'request_ott',
      data: { apiKey: this.partnerApiKey },
      params: {},
      headers: { 'Authorization': `${this.client.accessToken}` },
    });
  }

  async getUser() {
    const response = await this.client.request({
      endpointId: 'get_user',
      data: {},
      params: { apiKey: this.partnerApiKey },
      headers: { 'Authorization': `${this.client.accessToken}` },
    });
    this.client.setUserData(response);
    return response;
  }

  async getKYCRequirement({ quoteId }) {
    return await this.client.request({
      endpointId: 'get_kyc_requirement',
      data: {},
      params: {
        'metadata[quoteId]': quoteId,
        apiKey: this.partnerApiKey,
      },
      headers: { 'Authorization': `${this.client.accessToken}` },
    });
  }

  async patchUserDetails(data) {
    validatePatchUserData(data);
    return this.client.request({
      endpointId: 'patch_user_details',
      data,
      params: { apiKey: this.partnerApiKey },
      headers: { 'Authorization': `${this.client.accessToken}` },
    });
  }

  async getAdditionalKYCRequirements({ quoteId }) {
    return await this.client.request({
      endpointId: 'get_additional_requirements',
      data: {},
      params: {
        'metadata[quoteId]': quoteId,
      },
      headers: { 'Authorization': `${this.client.accessToken}` },
    });
  }

  async updatePurposeOfUsageForm({ purposeList }) {
    validatePurposeOfUsageForm(purposeList);
    const response = await this.client.request({
      endpointId: 'update_purpose_of_usage',
      data: { purposeList },
      params: {},
    });
    if (response.status !== 'SUBMITTED')
      throw new Error('Failed to update purpose of usage form');
    return response;
  }

  async submitSSN({ ssn, quoteId }) {
    return this.client.request({
      endpointId: 'submit_ssn',
      data: { ssn, quoteId },
      params: {},
      headers: { 'Authorization': `${this.client.accessToken}` },
    });
  }
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
  const requiredPersonalDetails = ['firstName', 'lastName', 'mobileNumber', 'dob'];
  const requiredAddressDetails = [
    'addressLine1',
    'addressLine2',
    'state',
    'city',
    'postCode',
    'countryCode',
  ];

  const providedFields = Object.keys(data.personalDetails) + Object.keys(data.addressDetails);

  const hasAllPersonalDetails = requiredPersonalDetails.every((field) =>
    providedFields.includes(field)
  );

  const hasAllAddressDetails = requiredAddressDetails.every((field) =>
    providedFields.includes(field)
  );

  if (!hasAllPersonalDetails || !hasAllAddressDetails) {
    throw new Error(
      `Some fields missing, please check again`
    );
  }

  return true;
}

export {
  UserService,
  validatePatchUserData,
  validatePurposeOfUsageForm,
};
