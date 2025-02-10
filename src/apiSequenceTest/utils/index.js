import { expect } from 'chai';
import { ApiSpecs } from '../../lib/index.js';
const APIEndpoints = ApiSpecs

async function executeApiTest(endPointId, responseData) {
  const api = APIEndpoints[endPointId];
  if (!api) throw new Error(`API Endpoint '${endPointId}' not found.`);

  describe(api.name, function () {
    it(`should test ${api.name}`, async function () {
      // ✅ Check if response is an array
      if (api.response_type === 'array') {
        expect(responseData).to.be.an('array');
        if (responseData.length > 0) {
          validateFields(api.output_fields, responseData[0]);
        }
      } else {
        validateFields(api.output_fields, responseData);
      }

      if (api.isSaveTheResponseInMemory) {
        process.env[api.id] = JSON.stringify(responseData);
      }
    });
  });
}

function validateFields(outputFields, responseData) {
  Object.keys(outputFields).forEach((key) => {
    const fieldSpec = outputFields[key];
    const { type, isRequired, defaultValue } = fieldSpec;
    let value = responseData[key];
    let isDefaultValue = false;

    if (isRequired && (value === undefined || value === null)) {
      throw new Error(
        `Missing required field: ${key} - Expected: ${JSON.stringify(fieldSpec)}`
      );
    } else if (
      (value === undefined || value === null) &&
      'defaultValue' in fieldSpec
    ) {
      value = defaultValue;
      isDefaultValue = true;
    }

    if (
      value !== undefined &&
      value !== null &&
      typeof value !== type &&
      !(type === 'object' && typeof value === 'object')
    ) {
      throw new Error(
        `Invalid type for field ${key}: expected ${type}, got ${typeof value} - Value: ${JSON.stringify(value)}`
      );
    }

    if (
      type === 'object' &&
      typeof value === 'object' &&
      fieldSpec.nestedFields &&
      !isDefaultValue
    ) {
      validateFields(fieldSpec.nestedFields, value);
    }
  });
}

/**
 * Utility function to get API spec by name
 */

export { executeApiTest };
