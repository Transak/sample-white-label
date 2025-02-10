import { expect } from 'chai';
import { formatResponse } from '../index.js';

describe('formatResponse', function () {
  const apiSpec = {
    response_root_field_name: 'response',
    output_fields: {
      simpleString: {
        source: 'simpleString',
        type: 'string',
        isRequired: true,
      },
      optionalString: {
        source: 'optionalString',
        type: 'string',
        isRequired: false,
        defaultValue: 'Default Value',
      },
      nestedObject: {
        source: 'nested',
        type: 'object',
        isRequired: true,
        nestedFields: {
          deepString: {
            source: 'deepString',
            type: 'string',
            isRequired: true,
          },
          deepStringNested: {
            source: 'deepStringNested.anotherString',
            type: 'string',
            isRequired: false,
            defaultValue: 'undefined',
          },
          deepOptional: {
            source: 'deepOptional',
            type: 'string',
            isRequired: false,
            defaultValue: 'Default Nested Value',
          },
        },
      },
      nestedArray: {
        source: 'items',
        type: 'array',
        isRequired: true,
        nestedFields: {
          id: { source: 'id', type: 'string', isRequired: true },
          value: {
            source: 'value',
            type: 'number',
            isRequired: false,
            defaultValue: 0,
          },
        },
      },
      nestedObjectOptional: {
        source: 'nestedOptional',
        type: 'object',
        isRequired: false,
        defaultValue: null,
        nestedFields: {
          deepString: {
            source: 'deepString',
            type: 'string',
            isRequired: true,
          },
          deepOptional: {
            source: 'deepOptional',
            type: 'string',
            isRequired: false,
          },
        },
      },
      nestedArrayOptional: {
        source: 'itemsOptional',
        type: 'array',
        isRequired: false,
        defaultValue: null,
        nestedFields: {
          id: { source: 'id', type: 'string', isRequired: true },
          value: { source: 'value', type: 'number', isRequired: false },
        },
      },
    },
  };

  it('should throw error for missing required root-level field', function () {
    const responseData = { response: {} };
    expect(() => formatResponse(responseData, apiSpec)).to.throw(
      'Missing required field: simpleString'
    );
  });

  it('should correctly process optional fields with default values', function () {
    const responseData = {
      response: {
        simpleString: 'Test String',
        nested: {
          deepString: 'Nested String',
        },
        items: [{ id: '123' }, { id: '456' }],
      },
    };
    expect(() => formatResponse(responseData, apiSpec)).to.not.throw();
    expect(formatResponse(responseData, apiSpec)).to.deep.equal({
      simpleString: 'Test String',
      optionalString: 'Default Value',
      nestedObjectOptional: null,
      nestedObject: {
        deepString: 'Nested String',
        deepStringNested: 'undefined',
        deepOptional: 'Default Nested Value',
      },
      nestedArrayOptional: null,
      nestedArray: [
        { id: '123', value: 0 },
        { id: '456', value: 0 },
      ],
    });
  });

  it('should throw error for missing required nested object or array', function () {
    const responseData = {
      response: { simpleString: 'Test String' },
    };
    expect(() => formatResponse(responseData, apiSpec)).to.throw(
      'Missing required field: nestedObject'
    );
  });

  it('should correctly process nested objects', function () {
    const responseData = {
      response: {
        simpleString: 'Test String',
        nested: {
          deepString: 'Nested String',
        },
      },
    };
    expect(() => formatResponse(responseData, apiSpec)).to.throw(
      'Missing required field: nestedArray'
    );
  });

  it('should correctly process nested arrays', function () {
    const responseData = {
      response: {
        simpleString: 'Test String',
        nested: {
          deepString: 'Nested String',
          deepStringNested: 'Default Nested Value',
        },
        items: [{ id: '123', value: 10 }, { id: '456' }],
      },
    };
    expect(() => formatResponse(responseData, apiSpec)).to.not.throw();
    expect(formatResponse(responseData, apiSpec)).to.deep.equal({
      simpleString: 'Test String',
      optionalString: 'Default Value',
      nestedObject: {
        deepString: 'Nested String',
        deepOptional: 'Default Nested Value',
        deepStringNested: 'undefined',
      },
      nestedObjectOptional: null,
      nestedArrayOptional: null,
      nestedArray: [
        { id: '123', value: 10 },
        { id: '456', value: 0 },
      ],
    });
  });

  it('should throw error for missing required field in nested array item', function () {
    const responseData = {
      response: {
        simpleString: 'Test String',
        nested: {
          deepString: 'Nested String',
        },
        items: [{ value: 10 }],
      },
    };
    expect(() => formatResponse(responseData, apiSpec)).to.throw(
      'Missing required field: id'
    );
  });

  it('should correctly process optional fields with default values', function () {
    const responseData = {
      response: {
        simpleString: 'Test String',
        nestedObjectOptional: null,
        nested: {
          deepString: 'Nested String',
        },
        items: [{ id: '123' }, { id: '456' }],
      },
    };
    expect(() => formatResponse(responseData, apiSpec)).to.not.throw();
    expect(formatResponse(responseData, apiSpec)).to.deep.equal({
      simpleString: 'Test String',
      optionalString: 'Default Value',
      nestedObjectOptional: null,
      nestedObject: {
        deepString: 'Nested String',
        deepStringNested: 'undefined',
        deepOptional: 'Default Nested Value',
      },
      nestedArray: [
        { id: '123', value: 0 },
        { id: '456', value: 0 },
      ],
      nestedArrayOptional: null,
    });
  });

  it('should throw error if optional nested object is present but missing required nested field', function () {
    const responseData = {
      response: {
        simpleString: 'Test String',
        nested: {
          deepString: 'Nested String',
        },
        items: [{ id: '123' }, { id: '456' }],
        nestedOptional: {
          deepOptional: 'Optional Value',
        },
      },
    };
    expect(() => formatResponse(responseData, apiSpec)).to.throw(
      'Missing required field: deepString'
    );
  });

  it('should correctly process optional nested object with all required and optional fields', function () {
    const responseData = {
      response: {
        simpleString: 'Test String',
        nested: {
          deepString: 'Nested String',
        },
        items: [{ id: '123' }, { id: '456' }],
        nestedOptional: {
          deepString: 'Nested Required Value',
          deepOptional: 'Nested Optional Value',
        },
      },
    };
    expect(() => formatResponse(responseData, apiSpec)).to.not.throw();
    expect(formatResponse(responseData, apiSpec)).to.deep.equal({
      simpleString: 'Test String',
      optionalString: 'Default Value',
      nestedObject: {
        deepString: 'Nested String',
        deepStringNested: 'undefined',
        deepOptional: 'Default Nested Value',
      },
      nestedArray: [
        { id: '123', value: 0 },
        { id: '456', value: 0 },
      ],
      nestedArrayOptional: null,
      nestedObjectOptional: {
        deepString: 'Nested Required Value',
        deepOptional: 'Nested Optional Value',
      },
    });
  });

  it('should correctly apply default value to optional nested field if not provided', function () {
    const responseData = {
      response: {
        simpleString: 'Test String',
        nested: {
          deepString: 'Nested String',
        },
        items: [{ id: '123' }, { id: '456' }],
        nestedOptional: {
          deepString: 'Nested Required Value',
        },
      },
    };
    expect(() => formatResponse(responseData, apiSpec)).to.not.throw();
    expect(formatResponse(responseData, apiSpec)).to.deep.equal({
      simpleString: 'Test String',
      optionalString: 'Default Value',
      nestedObject: {
        deepString: 'Nested String',
        deepStringNested: 'undefined',
        deepOptional: 'Default Nested Value',
      },
      nestedArray: [
        { id: '123', value: 0 },
        { id: '456', value: 0 },
      ],
      nestedArrayOptional: null,
      nestedObjectOptional: {
        deepString: 'Nested Required Value',
        deepOptional: undefined,
      },
    });
  });

  it('should throw error if optional nested array is present but missing required nested field', function () {
    const responseData = {
      response: {
        simpleString: 'Test String',
        nested: {
          deepString: 'Nested String',
        },
        items: [{ id: '123' }, { id: '456' }],
        itemsOptional: [{ value: 20 }],
        nestedOptional: {
          deepString: 'Nested Required Value',
        },
      },
    };

    expect(() => formatResponse(responseData, apiSpec)).to.throw(
      'Missing required field: id {"source":"id","type":"string","isRequired":true}'
    );
  });

  it('should not throw error if optional nested array is not present but required nested field passed', function () {
    const responseData = {
      response: {
        simpleString: 'Test String',
        nested: {
          deepString: 'Nested String',
        },
        items: [{ id: '123' }, { id: '456' }],
        itemsOptional: [{ id: '324234' }],
        nestedOptional: {
          deepString: 'Nested Required Value',
        },
      },
    };

    const expectedResponse = {
      simpleString: 'Test String',
      optionalString: 'Default Value',
      nestedObject: {
        deepString: 'Nested String',
        deepStringNested: 'undefined',
        deepOptional: 'Default Nested Value',
      },
      nestedArray: [
        { id: '123', value: 0 },
        { id: '456', value: 0 },
      ],
      nestedObjectOptional: {
        deepString: 'Nested Required Value',
        deepOptional: undefined,
      },
      nestedArrayOptional: [{ id: '324234', value: undefined }],
    };

    expect(formatResponse(responseData, apiSpec)).to.deep.equal(
      expectedResponse
    );
  });
});
