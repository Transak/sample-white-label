import orderApiSpecs from './order_api_specs.js';
import userApiSpecs from './user_api_specs.js';
import publicApiSpecs from './public_api_specs.js';

// Merge all API Specs
const apiSpecs = { ...orderApiSpecs, ...userApiSpecs, ...publicApiSpecs };

//default export module nodejs
export default apiSpecs;
