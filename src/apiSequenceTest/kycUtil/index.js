let quoteId

import { sampleData } from '../sample_data.js';

/**
 * ✅ Checks KYC status and submits KYC if needed
 */
async function handleKYCVerificationViaApi(transak) {
  const { userData } = transak.client;
  if (!userData || !userData.email)
    throw new Error('❌ User data not found in memory');

  if (userData.kyc?.status !== 'APPROVED') {
    console.log(
        `⚠️ KYC not approved (Current Status: ${userData.kyc?.status}). Initiating KYC submission...`
    );
    await kycApiSequenceTests(transak);
  } else {
    console.log('✅ KYC Approved!');
  }
}

/**
 * ✅ Main KYC API Sequence Test
 */
async function kycApiSequenceTests(transak) {
  console.log('🔄 Starting KYC API Sequence Tests...');

  // ✅ Fetch Quote for KYC
  await fetchQuote(transak);

  if (sampleData.env.IS_KYC_THOUGH_RELIANCE) {

    //✅ Wait for KYC via Reliance Approval
    await pollForKYCRelianceStatus(transak, quoteId, sampleData.kycRelianceDetails.kycShareToken);

  } else {
    // ✅ Fetch & Submit KYC Forms (Excluding `purposeOfUsage` and `idProof`)
    await fetchAndSubmitKYCDetails(transak, quoteId);

    //✅ Wait for KYC Approval
    await pollForKYCApproval(transak);
  }

}

/**
 * ✅ Fetches Quote for KYC
 */
async function fetchQuote(transak) {
  console.log('🔄 Fetching Quote for KYC...');
  const quoteData = await transak.public.getQuote(
      {
        ...sampleData.quoteFields,
        ...(
            sampleData.env.IS_KYC_THOUGH_RELIANCE === true ?
                {
                  kycShareToken: sampleData.kycRelianceDetails.kycShareToken,
                  kycShareTokenProvider: sampleData.kycRelianceDetails.kycShareTokenProvider,
                  apiKey: transak.client.config.partnerApiKey
                } :
                {}
        )
      }
  );

  if (quoteData && quoteData.quoteId) quoteId = quoteData.quoteId;
  console.log(`✅ Quote fetched: ${quoteId}`);
}

/**
 * ✅ Fetches KYC Steps and Submits Data Dynamically
 */
async function fetchAndSubmitKYCDetails(transak, quoteId) {

  console.log('🔄 Fetching KYC Requirement...');

  let kycResponse = await transak.user.getKYCRequirement({ quoteId })

  if (kycResponse && kycResponse.status === 'NOT_SUBMITTED') {

    console.log('🔄 Submitting User Details...');

    await transak.user.patchUserDetails({ personalDetails: sampleData.personalDetails, addressDetails: sampleData.addressDetails });

    await fetchAndSubmitKYCDetails(transak, quoteId);

  } else if (kycResponse && kycResponse.status === 'ADDITIONAL_FORMS_REQUIRED') {
    console.log('🔄 Fetching Additional Requirement...');

    const additionalRequirementsData = await transak.user.getAdditionalKYCRequirements({ quoteId });

    for(const form of additionalRequirementsData.formsRequired) {
      if(form.type === 'PURPOSE_OF_USAGE') {

        await updatePurposeOfUsageForm(transak);

      } else if(form.type === 'IDPROOF') {
        console.log('🔄 Fetching `ONFIDO` kyc url link...');
        let kycUrl = form.metadata.kycUrl;
        console.log(`🔗 ID Proof KYC URL: ${kycUrl}`);
      } else if(form.type === 'US_SSN') {
        await submitSSNForm(transak, quoteId);
      }
    }

    console.log('✅ Submitted All Additional Requirement...');

    console.log('🔄 Checking KYC Status...');

    const kycResponse = await transak.user.getKYCRequirement({ quoteId })

    if( kycResponse && kycResponse.status === 'APPROVED') {
      console.log('✅ KYC Approved!');
    } else {
      console.log('🔄 Polling KYC Status...');
      //call the poll api to check KYC status
      await pollForKYCApproval(transak)
    }
  }
}

/**
 * ✅ Update Purpose of Usage Form
 */
async function updatePurposeOfUsageForm(transak) {
  console.log('🔄 Submitting `purposeOfUsage` Form...');

  await transak.user.updatePurposeOfUsageForm({
    purposeList: sampleData.purposeOfUsage.purposeList,
  });
  console.log('✅ `purposeOfUsage` Form submitted.');
}

/**
 * ✅ Submit SSN form
 */
async function submitSSNForm(transak, quoteId) {
  console.log('🔄 Submitting `SSN` KYC Form...');

  await transak.user.submitSSN({
    ssn: sampleData.usSSN.ssn,
    quoteId
  });

  console.log('✅ `SSN` form submitted.');
}

/**
 * ✅ Polls `GET /api/v2/user/` every 30 seconds until KYC is approved
 */
async function pollForKYCApproval(transak) {
  const maxRetries = 20; // 20 retries max
  let retries = 0;

  while (retries < maxRetries) {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds

    const user = await transak.user.getUser();
    if (user.kyc?.status === 'APPROVED') {
      console.log('✅ KYC Approved!');
      return 'APPROVED';
    }

    console.log(
      `🔄 KYC still pending (Current Status: ${user.kyc?.status})... Retrying (${retries + 1}/${maxRetries})`
    );
    retries++;
  }

  console.warn('⚠️ KYC approval timeout reached.');
}

/**
 * ✅ Polls `GET /api/v2/user/share-token-status` every 10 seconds until KYC is approved
 */
async function pollForKYCRelianceStatus(transak, quoteId, kycShareToken) {
  console.log(`🔄 KYC Share Token processing Starting..`);

  const maxRetries = 20; // 20 retries max
  let retries = 0;

  while (retries < maxRetries) {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds

    const {shareTokenStatus} = await transak.user.getKycRelianceStatus({quoteId, kycShareToken});
    if (shareTokenStatus === 'DONE' || shareTokenStatus === 'IMPORTED' || shareTokenStatus === 'FAILED') {
      console.log(`✅ KYC Share Token Processing complete. Share Token Status: ${shareTokenStatus}`);
      return shareTokenStatus;
    }

    console.log(
      `🔄 KYC Share Token processing (Current Status: ${shareTokenStatus})... Retrying (${retries + 1}/${maxRetries})`
    );
    retries++;
  }

  console.warn('⚠️ KYC share token processing time limit reached.');
}

// ✅ Export KYC Functions
export {
  kycApiSequenceTests,
  handleKYCVerificationViaApi
};
