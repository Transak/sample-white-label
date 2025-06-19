import {executeApiTest} from "../utils/index.js";
import {sampleData} from "../sample_data.js";
import readlineSync from "readline-sync";

export async function authenticateUser(transak, email) {
    // Send email OTP
    const sendEmailOtpData = await transak.user.sendEmailOtp({
        email
    });
    // ✅ Validate user response
    await executeApiTest('send_email_otp', sendEmailOtpData);

    const otp =
        sampleData.env.ENVIRONMENT === 'staging'
            ? `${sampleData.env.OTP_CODE}`
            : readlineSync.question('Enter the OTP received on email: ');

    // 4️⃣ Verify email OTP and get new accessToken
    const accessTokenData = await transak.user.verifyEmailOtp({
        email,
        otp,
        stateToken: sendEmailOtpData.stateToken,
    });

    if (!accessTokenData)
        throw new Error('❌ Failed to verify email and obtain access token.');

    await executeApiTest('verify_email_otp', accessTokenData);
    console.log('✅ Email verified successfully.');

    sampleData.env.ACCESS_TOKEN = accessTokenData.accessToken;

    //Fetch user again with the new token
    await transak.user.getUser();

    if (transak.client.userData.partnerUserId)
        console.log(
            `✅ User authenticated successfully. Access token - ${sampleData.env.ACCESS_TOKEN}`
        );
    else throw new Error('❌ User not authenticated.');
}

