import readlineSync from 'readline-sync';
import { TransakAPI } from './../lib/index.js';
import { handleKYCVerificationViaApi } from './kycUtil/index.js';
import { orderApiSequenceTests } from './orderUtil/index.js';
import { sampleData } from './sample_data.js';
import { executeApiTest } from './utils/index.js';
import {authenticateUser} from "./userUtil/index.js";

const transak = new TransakAPI({
  environment: sampleData.env.ENVIRONMENT,
  partnerApiKey: sampleData.env.PARTNER_API_KEY,
});

let accessToken = sampleData.env.ACCESS_TOKEN || null; // Store accessToken
const email = sampleData.env.EMAIL || null; // Store accessToken
let isAccessTokenValid;

describe('Authentication API Tests', function () {
  this.timeout(20000000); // Increase timeout for API calls

  it('should ensure accessToken is valid or fetch a new one', async function () {

    if (!email)
      throw new Error(
        '❌ Email is missing. Please provide a valid email in env.'
      );

    //Verify Access Token
    if (accessToken)
      isAccessTokenValid = await transak.isAccessTokenValid(accessToken);

    //Refresh Access Token if not valid
    if (!isAccessTokenValid) {
      if (accessToken && accessToken.length > 0) {
        try {
          console.log('🔄 Refreshing Access Token ...');
          const res = await transak.user.refreshAccessToken(accessToken)
          console.log(`✅ Refreshed Access Token: ${res?.accessToken}`);

          console.log('🔄 Get User Details with new Access Token');
          isAccessTokenValid = await transak.isAccessTokenValid(res?.accessToken);

        } catch (error) {
          console.log('✅ Refresh Access Token failed.');
        }
      }
    }

    if(!isAccessTokenValid) {
      console.log(
          '⚠️ Access token is invalid or expired. Triggering email verification...'
      );
      await authenticateUser(transak, email);
    } else {
      console.log(
          '✅ Access token is valid. Skipping email verification.'
      );
    }

  });

  it('should fetch user details and validate response fields', async function () {
    // ✅ Validate user response
    await executeApiTest('get_user', transak.client.userData);
    console.log(
      `✅ User Details Validated Successfully for: ${transak.client.userData.email}`
    );
  });

  it('should handle KYC verification', async function () {
    if (!transak.client.accessToken)
      throw new Error(
        '❌ Access Token is missing. Run email verification apiSequenceTest first.'
      );
    await handleKYCVerificationViaApi(transak);
  });

  it('should handle order placement', async function () {
    if (!transak.client.accessToken)
      throw new Error(
        '❌ Access Token is missing. Run email verification apiSequenceTest first.'
      );
      await orderApiSequenceTests(transak);
  });
});
