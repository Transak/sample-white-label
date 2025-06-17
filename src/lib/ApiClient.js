import axios from 'axios';
import { v4 } from 'uuid';
import APIConfig from './constants/config.js';
import { validateParams, formatResponse } from './utils/index.js';
import APIEndpoints from './constants/apiSpecs/index.js';

class ApiClient {
  constructor(config) {
    if (!config.environment) throw new Error('Environment is required');
    if (!config.partnerApiKey) throw new Error('Partner API Key is required');
    //Check valid environment
    if (!APIConfig.env[config.environment.toLowerCase()])
      throw new Error('Invalid environment');

    //todo Verify Partner API Key with environment
    this.config = {
      partnerApiKey: config.partnerApiKey,
      environment: config.environment,
    };

    this.accessToken = null;
    this.userData = null;

    this.traceId = v4();

    const baseURL = APIConfig.env[config.environment.toLowerCase()];

    this.axiosInstance = axios.create({ baseURL });
  }

  /**
   * Sets the authentication token for authenticated requests
   */
  setAccessToken(token) {
    this.accessToken = token;
    this.axiosInstance.defaults.headers.common['Authorization'] = `${token}`;
  }

  /**
   * Sets the authentication token for authenticated requests
   */
  setUserData(userData) {
    this.userData = userData;
  }

  /**
   * Makes an HTTP request with optional data and query parameters
   */
  async request({ endpointId, data = {}, headers, params = {}, pathParams }) {
    try {
      const apiSpec = APIEndpoints[endpointId];
      if (!apiSpec) throw new Error(`API Endpoint '${endpointId}' not found.`);

      validateParams(apiSpec.method, apiSpec.url, data, params, apiSpec);

      const headerConfig = {
        ...Object.fromEntries(
          Object.entries(apiSpec.headers || {}).filter(
            ([_, value]) => value !== 'string'
          )
        ),
        'Content-Type': 'application/json',
        //Todo: Commented due to cors error
        //'x-trace-id': this.traceId,
      };

      const requestConfig = {
        method: apiSpec.method.toUpperCase(),
        url: apiSpec.url,
        headers: { ...headerConfig },
      };

      if (headers)
        requestConfig.headers = { ...requestConfig.headers, ...headers };

      if (Object.keys(params).length > 0) {
        requestConfig.params = params;
      }

      if (pathParams && Object.keys(pathParams).length > 0) {
        Object.keys(pathParams).forEach((key) => {
          requestConfig.url = requestConfig.url.replace(
            `{${key}}`,
            pathParams[key]
          );
        });
      }

      // ✅ Only add `data` for methods that require a body
      if (
        ['POST', 'PATCH', 'PUT', 'DELETE'].includes(requestConfig.method) &&
        Object.keys(data).length > 0
      ) {
        requestConfig.data = data;
      }

      const response = await this.axiosInstance(requestConfig);
      return formatResponse(response.data, apiSpec);
    } catch (error) {
      console.error('❌ Error Response:', error.response?.data);
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(
          `${error.response.data.error.name}: ${error.response.data.error.message}`
        );
      }
      throw new Error(error.message || 'API request failed');
    }
  }
}

export { ApiClient };
