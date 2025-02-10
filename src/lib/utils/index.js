function checkType(variable) {
    if (Array.isArray(variable)) {
        return 'array';
    } else if (variable === null) {
        return 'null';
    } else if (typeof variable === 'object') {
        return 'object';
    } else if (typeof variable === 'string') {
        return 'string';
    } else if (typeof variable === 'number') {
        return 'number';
    } else if (typeof variable === 'boolean') {
        return 'boolean';
    } else if (typeof variable === 'undefined') {
        return 'undefined';
    } else {
        return 'unknown';
    }
}

function validateParams(method, url, data, params, apiSpec) {
    if (!method || !url) {
        throw new Error('Method and URL are required');
    }
    if (apiSpec.query_params) {
        Object.keys(params).forEach((param) => {
            if (!apiSpec.query_params[param]) {
                throw new Error(
                    `Unexpected query parameter: '${param}'. Allowed parameters: ${Object.keys(apiSpec.query_params).join(', ')}`
                );
            }
        });
    }

    if (apiSpec.query_params) {
        Object.keys(apiSpec.query_params).forEach((param) => {
            const spec = apiSpec.query_params[param];
            const value = params[param];

            if (spec.isRequired === true && (value === undefined || value === '')) {
                throw new Error(`Missing required query parameter: ${param}`);
            }
            if (value !== undefined && checkType(value) !== spec.type) {
                throw new Error(
                    `Invalid type for query parameter ${param}: expected ${spec.type}, got ${checkType(value)}`
                );
            }
        });
    }

    if (['POST', 'PATCH', 'DELETE'].includes(method) && apiSpec.body) {
        const allowedFields = Object.keys(apiSpec.body);
        const providedFields = Object.keys(data);

        providedFields.forEach((field) => {
            if (
                !allowedFields.includes(field) &&
                !Object.keys(apiSpec.body).some(
                    (f) =>
                        apiSpec.body[f].type === 'object' &&
                        apiSpec.body[f].nestedFields &&
                        field in apiSpec.body[f].nestedFields
                )
            ) {
                throw new Error(
                    `Invalid field '${field}' provided. Allowed fields: ${allowedFields.join(', ')}`
                );
            }
        });

        Object.keys(apiSpec.body).forEach((field) => {
            const spec = apiSpec.body[field];
            const value = data[field];

            if (spec.isRequired === true && (value === undefined || value === '')) {
                throw new Error(`Missing required body field: ${field}`);
            }
            if (
                value !== undefined &&
                checkType(value) !== spec.type &&
                !(spec.type === 'object' && checkType(value) === 'object')
            ) {
                throw new Error(
                    `Invalid type for body field '${field}': expected ${spec.type}, got ${checkType(value)}`
                );
            }

            if (
                spec.type === 'object' &&
                checkType(value) === 'object' &&
                spec.nestedFields
            ) {
                validateNestedFields(spec.nestedFields, value, field);
            }
        });
    }
}

function validateNestedFields(nestedSpec, nestedData, parentField) {
    const allowedNestedFields = Object.keys(nestedSpec);
    const providedNestedFields = Object.keys(nestedData);

    providedNestedFields.forEach((nestedField) => {
        if (!allowedNestedFields.includes(nestedField)) {
            throw new Error(
                `Invalid nested field '${nestedField}' inside '${parentField}'. Allowed fields: ${allowedNestedFields.join(', ')}`
            );
        }
    });

    allowedNestedFields.forEach((nestedField) => {
        const nestedFieldSpec = nestedSpec[nestedField];
        const expectedType = nestedFieldSpec.type;
        const nestedValue = nestedData[nestedField];

        if (
            nestedFieldSpec.isRequired === true &&
            (nestedValue === undefined || nestedValue === '')
        ) {
            throw new Error(
                `Missing required nested field '${nestedField}' inside '${parentField}'.`
            );
        }

        if (nestedValue !== undefined && checkType(nestedValue) !== expectedType) {
            throw new Error(
                `Invalid type for nested field '${nestedField}' inside '${parentField}'. Expected ${expectedType}, got ${checkType(nestedValue)}`
            );
        }
    });
}

function handleAlreadyExistOrderCase(result) {
    if (result.errorMessage === 'Order exists' && result.data && result.data.id) {
        const errorDetails = {
            message:
                'Order already exists, please complete or cancel the existing order',
            orderId: result.data.id,
            status: result.data.status,
            createdAt: result.data.createdAt,
        };
        const error = new Error(errorDetails.message);
        error.details = errorDetails;
        throw error;
    }
}


function formatResponse(responseData, apiSpec) {
    const responseRoot = responseData[apiSpec.response_root_field_name];
    if (!responseRoot) {
        throw new Error(
            `Missing expected response root field: ${apiSpec.response_root_field_name}`
        );
    }

    //handle already exist order case
    handleAlreadyExistOrderCase(responseRoot)

    // If output_fields is an empty object, return the original response
    if (
        !apiSpec.output_fields ||
        Object.keys(apiSpec.output_fields).length === 0
    ) {
        return responseRoot;
    }

    // Handle array response
    if (Array.isArray(responseRoot)) {
        return responseRoot.map((item) =>
            processOutputFields(item, apiSpec.output_fields)
        );
    }

    // Handle object response
    return processOutputFields(responseRoot, apiSpec.output_fields);
}

function processOutputFields(responseItem, outputFields) {
    const formattedResponse = {};

    Object.keys(outputFields).forEach((key) => {
        const fieldSpec = outputFields[key];
        const {source, type, isRequired, defaultValue} = fieldSpec;
        let value = getNestedValue(responseItem, source);
        let isDefaultValue = false;

        if (isRequired && (value === undefined || value === null)) {
            throw new Error(
                `Missing required field: ${key} ${JSON.stringify(fieldSpec)}`
            );
        } else if (
            (value === undefined || value === null) &&
            'defaultValue' in fieldSpec
        ) {
            value = defaultValue;
            isDefaultValue = true;
        }

        if (value !== undefined && value !== null && checkType(value) !== type && type !== 'any') {
            throw new Error(
                `Invalid type for field ${key}: expected ${type}, got ${checkType(value)} ${value}`
            );
        }

        if (
            type === 'object' &&
            checkType(value) === 'object' &&
            fieldSpec.nestedFields &&
            !isDefaultValue
        ) {
            formattedResponse[key] = processOutputFields(
                value,
                fieldSpec.nestedFields || {}
            );
        } else if (
            type === 'array' &&
            checkType(value) === 'array' &&
            fieldSpec.nestedFields
        ) {
            formattedResponse[key] = value.map((item) =>
                processOutputFields(item, fieldSpec.nestedFields)
            );
        } else {
            formattedResponse[key] = value;
        }
    });

    return formattedResponse;
}

function getNestedValue(obj, path) {
    return path
        .split('.')
        .reduce(
            (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
            obj
        );
}
export {validateParams, formatResponse};
