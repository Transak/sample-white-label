import { expect } from 'chai';
import { validateParams } from '../index.js';

describe('validateParams', function () {
  const apiSpec = {
    query_params: {
      userId: { type: 'string', isRequired: 'true' },
      page: { type: 'number', isRequired: 'false' },
    },
    body: {
      firstName: { type: 'string', isRequired: 'true' },
      lastName: { type: 'string', isRequired: 'false' },
      address: {
        type: 'object',
        isRequired: 'true',
        nestedFields: {
          city: { type: 'string', isRequired: 'true' },
          state: { type: 'string', isRequired: 'true' },
        },
      },
      billingAddress: {
        type: 'object',
        isRequired: 'false',
        nestedFields: {
          addressLine1: { type: 'string', isRequired: 'true' },
          city: { type: 'string', isRequired: 'true' },
          state: { type: 'string', isRequired: 'true' },
        },
      },
    },
  };

  it('should pass validation with correct data', function () {
    const params = { userId: '12345', page: 2 };
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      address: {
        city: 'New York',
        state: 'NY',
      },
    };

    expect(() =>
      validateParams('POST', '/test', data, params, apiSpec)
    ).to.not.throw();
  });

  it('should throw error for missing required query param', function () {
    const params = { page: 2 };
    const data = {
      firstName: 'John',
      address: { city: 'New York', state: 'NY' },
    };

    expect(() =>
      validateParams('POST', '/test', data, params, apiSpec)
    ).to.throw('Missing required query parameter: userId');
  });

  it('should throw error for missing required body field', function () {
    const params = { userId: '12345', page: 2 };
    const data = {
      lastName: 'Doe',
      address: { city: 'New York', state: 'NY' },
    };

    expect(() =>
      validateParams('POST', '/test', data, params, apiSpec)
    ).to.throw('Missing required body field: firstName');
  });

  it('should throw error for invalid type in body field', function () {
    const params = { userId: '12345', page: 2 };
    const data = { firstName: 'John', address: { city: 123, state: 'NY' } };

    expect(() =>
      validateParams('POST', '/test', data, params, apiSpec)
    ).to.throw(
      "Invalid type for nested field 'city' inside 'address'. Expected string, got number"
    );
  });

  it('should throw error for extra field in request body', function () {
    const params = { userId: '12345', page: 2 };
    const data = {
      firstName: 'John',
      address: {
        city: 'New York',
        state: 'NY',
        zipCode: '10001', // Extra field not allowed
      },
    };

    expect(() =>
      validateParams('POST', '/test', data, params, apiSpec)
    ).to.throw(
      "Invalid nested field 'zipCode' inside 'address'. Allowed fields: city, state"
    );
  });

  it('should throw error for extra query parameter', function () {
    const params = { userId: '12345', page: 2, extraParam: 'notAllowed' };
    const data = {
      firstName: 'John',
      address: {
        city: 'New York',
        state: 'NY',
      },
    };

    expect(() =>
      validateParams('POST', '/test', data, params, apiSpec)
    ).to.throw(
      "Unexpected query parameter: 'extraParam'. Allowed parameters: userId, page"
    );
  });

  it('should throw error for extra field in top-level request body', function () {
    const params = { userId: '12345', page: 2 };
    const data = {
      firstName: 'John',
      middleName: 'David', // Extra field not allowed
      address: {
        city: 'New York',
        state: 'NY',
      },
    };

    expect(() =>
      validateParams('POST', '/test', data, params, apiSpec)
    ).to.throw(
      "Invalid field 'middleName' provided. Allowed fields: firstName, lastName, address"
    );
  });

  it('should throw error for missing required fields in billingAddress when it exists', function () {
    const params = { userId: '12345', page: 2 };
    const data = {
      firstName: 'Yeshu',
      address: {
        city: 'New York',
        state: 'NY',
      },
      billingAddress: {
        addressLine1: '123 Street',
        state: 'NY',
      },
    };
    expect(() =>
      validateParams('POST', '/test', data, params, apiSpec)
    ).to.throw("Missing required nested field 'city' inside 'billingAddress'.");
  });

  it('should pass if billingAddress is not provided', function () {
    const params = { userId: '12345', page: 2 };
    const data = {
      firstName: 'John',
      address: {
        city: 'New York',
        state: 'NY',
      },
    };
    expect(() =>
      validateParams('POST', '/test', data, params, apiSpec)
    ).to.not.throw();
  });

  it('should pass if billingAddress is provided with all required fields', function () {
    const params = { userId: '12345', page: 2 };
    const data = {
      firstName: 'John',
      address: {
        city: 'New York',
        state: 'NY',
      },
      billingAddress: {
        addressLine1: '123 Street',
        city: 'Los Angeles',
        state: 'CA',
      },
    };
    expect(() =>
      validateParams('POST', '/test', data, params, apiSpec)
    ).to.not.throw();
  });
});
