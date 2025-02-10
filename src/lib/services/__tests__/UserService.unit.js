import { expect } from 'chai';
import {
  validatePatchUserData,
  validatePurposeOfUsageForm,
} from '../UserService.js';

describe('validatePatchUserData', function () {
  it('should pass when all required personal details fields are provided', function () {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      dob: '1994-11-06',
    };
    expect(() => validatePatchUserData(data)).to.not.throw();
  });

  it('should pass when no required personal details fields are provided', function () {
    const data = { randomField: 'Some Value' };
    expect(() => validatePatchUserData(data)).to.not.throw();
  });

  it('should throw an error when only some required personal details fields are provided', function () {
    const data = {
      firstName: 'John',
      mobileNumber: '1234567890',
    };
    expect(() => validatePatchUserData(data)).to.throw(
      'If any of the following fields are provided: firstName, lastName, mobileNumber, dob, all of them must be provided.'
    );
  });

  it('should throw an error when only one required personal detail field is provided', function () {
    const data = { firstName: 'John' };
    expect(() => validatePatchUserData(data)).to.throw(
      'If any of the following fields are provided: firstName, lastName, mobileNumber, dob, all of them must be provided.'
    );
  });

  it('should pass when all required address fields are provided', function () {
    const data = {
      addressLine1: '123 Street',
      addressLine2: 'Apt 4',
      state: 'NY',
      city: 'New York',
      postCode: '10001',
      countryCode: 'US',
    };
    expect(() => validatePatchUserData(data)).to.not.throw();
  });

  it('should throw an error when only some required address fields are provided', function () {
    const data = {
      addressLine1: '123 Street',
      city: 'New York',
    };
    expect(() => validatePatchUserData(data)).to.throw(
      'If any address fields are provided, all of them must be included: addressLine1, addressLine2, state, city, postCode, countryCode.'
    );
  });

  it('should throw an error when only one required address field is provided', function () {
    const data = { addressLine1: '123 Street' };
    expect(() => validatePatchUserData(data)).to.throw(
      'If any address fields are provided, all of them must be included: addressLine1, addressLine2, state, city, postCode, countryCode.'
    );
  });
});

describe('validatePurposeOfUsageForm', function () {
  it('should pass when a valid purpose is provided', function () {
    const purposeList = ['Buying NFTs'];
    expect(() => validatePurposeOfUsageForm(purposeList)).to.not.throw();
  });

  it('should pass when multiple valid purposes are provided', function () {
    const purposeList = [
      'Buying/selling crypto for investments',
      'Buying NFTs',
    ];
    expect(() => validatePurposeOfUsageForm(purposeList)).to.not.throw();
  });

  it('should throw an error when purposeList is empty', function () {
    const purposeList = [];
    expect(() => validatePurposeOfUsageForm(purposeList)).to.throw(
      'Purpose list must be an array containing at least one valid purpose.'
    );
  });

  it('should throw an error when purposeList contains invalid purposes', function () {
    const purposeList = ['Trading stocks'];
    expect(() => validatePurposeOfUsageForm(purposeList)).to.throw(
      'Invalid purpose(s) found: Trading stocks. Allowed purposes: Buying/selling crypto for investments, Buying NFTs, Buying crypto to use a webs protocol'
    );
  });

  it('should throw an error when purposeList contains both valid and invalid purposes', function () {
    const purposeList = ['Buying NFTs', 'Trading stocks'];
    expect(() => validatePurposeOfUsageForm(purposeList)).to.throw(
      'Invalid purpose(s) found: Trading stocks. Allowed purposes: Buying/selling crypto for investments, Buying NFTs, Buying crypto to use a webs protocol'
    );
  });

  it('should throw an error when purposeList is not an array', function () {
    const purposeList = 'Buying NFTs';
    expect(() => validatePurposeOfUsageForm(purposeList)).to.throw(
      'Purpose list must be an array containing at least one valid purpose.'
    );
  });
});
