import { TransakAPI } from './index.js';

// Create a single instance of TransakAPI
export const partnerApiKey= '0b4a8ff3-0d7e-409b-a6b9-3b82094b0f03'

export const transakSdk = new TransakAPI({
    environment: 'staging',
    partnerApiKey: partnerApiKey,
});
