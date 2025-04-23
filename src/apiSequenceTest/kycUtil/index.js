let quoteId

import { sampleData } from '../sample_data.js';

/**
 * ✅ Main KYC API Sequence Test
 */
async function kycApiSequenceTests(transak) {
  console.log('🔄 Starting KYC API Sequence Tests...');

  // ✅ Fetch Quote
  const quoteData = await transak.public.getQuote(
    {
      ...sampleData.quoteFields, 
      ...(
        sampleData.env.IS_KYC_THOUGH_RELIANCE === true ? 
        { 
          kycShareToken: sampleData.kycRelianceDetails.kycShareToken, 
          kycShareTokenProvider: sampleData.kycRelianceDetails.kycShareTokenProvider,
          partnerApiKey: transak.client.config.partnerApiKey 
        } :
        {}
      ) 
    }
  );
  if (quoteData && quoteData.quoteId) quoteId = quoteData.quoteId;
  console.log(`✅ Quote fetched: ${quoteId}`);

  // ✅ Fetch & Submit KYC Forms (Excluding `purposeOfUsage` and `idProof`)
  await fetchAndSubmitKYCForms(transak, quoteId);

  //✅ Wait for KYC Approval
  await waitForKYCApproval(transak);
}

/**
 * ✅ Fetches KYC Forms and Submits Data Dynamically
 */
async function fetchAndSubmitKYCForms(transak, quoteId) {
  let kycForms = await transak.user.getKycForms({ quoteId });
  console.log("*******", kycForms);

  console.log(`✅ KYC forms fetched.`);
  
  const hasKycRelianceWaitForm = kycForms.forms.some(form => form.id === "kycReliance");
  if (hasKycRelianceWaitForm) {
    await waitForkycShareTokenToReachTerminalState(transak, sampleData.kycRelianceDetails.kycShareToken, sampleData.kycRelianceDetails.kycShareTokenProvider, quoteId)
    
    // Get a fresh list of KYC forms to check if any remaining data needs to be submitted, which we were not able to get from the KYC Share Token
    console.log(`✅ Check after the KYC Share Token is processed if any form needs to be submitted.`);
    kycForms = await transak.user.getKycForms({ quoteId });
    console.log("New list of KYC forms needs to be submitted", kycForms);
  }

  const hasPurposeOfUsage = kycForms.forms.some(form => form.id === "purposeOfUsage");
  const hasIdProof = kycForms.forms.some(form => form.id === "idProof");

  // ✅ Filter out `purposeOfUsage` and `idProof`
  const filteredForms = kycForms.forms.filter(form => !["purposeOfUsage", "idProof", "kycReliance"].includes(form.id));
  await submitKYCForms({ transak, quoteId, forms: filteredForms });

  if (hasPurposeOfUsage) await submitPurposeOfUsageForm(transak);
  if (hasIdProof) await fetchAndShowIdProofLink(transak, quoteId);
}
/**
 * ✅ Validates KYC Forms But Does NOT Submit `purposeOfUsage` or `idProof`
 */
async function submitKYCForms({ transak, forms, quoteId }) {
  let index = 0;
  
  while (index < forms.length) {
    const form = forms[index];
    const formId = form.id;
    console.log(`🔄 Fetching fields for KYC form: ${formId}`);

    const formRes = await transak.user.getKycFormById({ formId, quoteId });
    const formFields = formRes.fields.map((field) => field.id);

    // ✅ Validate fields exist in sample data
    if (!sampleData[formId]) {
      throw new Error(`❌ Missing required KYC data for form: ${formId}`);
    }

    let formDataToSubmit;
    if (formId === 'usSSN') {
      formDataToSubmit = sampleData.usSSN();
    } else {
      formDataToSubmit = sampleData[formId];
    }
    formFields.forEach((field) => {
      if (!(field in formDataToSubmit)) {
        throw new Error(
          `❌ Missing field: ${field} in sample_data.json for ${formId}`
        );
      }
    });

    console.log(`📤 Submitting ${formId}:`, formDataToSubmit);

    let patchUserResponse;
    if (formId === 'usSSN') {
      // ✅ Submit US SSN
      patchUserResponse = await transak.user.verifySSN(formDataToSubmit);
    } else {
      // ✅ Submit Personal and Address details
      patchUserResponse = await transak.user.patchUser(formDataToSubmit);
    }

    console.log(
      `✅ Successfully submitted KYC form: ${formId} ${patchUserResponse.email}`
    );

    let {forms: newForms} = await transak.user.getKycForms({ quoteId });
    newForms = newForms.filter(form => !["purposeOfUsage", "idProof", "kycReliance"].includes(form.id));
    // Compare forms in kycForms with current forms array and add missing forms
    const currentFormIds = forms.map(form => form.id);
    newForms = newForms.filter(form => !currentFormIds.includes(form.id));
    
    if (newForms.length > 0) {
      console.log(`🔄 Adding ${newForms.length} new forms that weren't in the original forms array`);
      forms.push(...newForms);
      console.log(`📋 Updated forms length: ${forms.length}`);
    }
    
    // Move to the next form
    index++;
  }
}

/**
 * ✅ Submit Purpose of Usage Form
 */
async function submitPurposeOfUsageForm(transak) {
  console.log('🔄 Submitting `purposeOfUsage` KYC Form...');

  const res = await transak.user.submitPurposeOfUsageForm({
    purposeList: sampleData.purposeOfUsage.purposeList,
  });
  console.log('✅ `purposeOfUsage` form submitted.');
}

async function fetchAndShowIdProofLink(transak, quoteId) {
  console.log('🔄 Fetching ID Proof KYC Form...');

  const formRes = await transak.user.getKycFormIdProof({
    formId: 'idProof',
    quoteId,
  });

  if (formRes.kycUrl && formRes.formId === 'idProof') {
    // ✅ Open Onfido KYC URL
    console.log(`🔗 ID Proof KYC URL: ${formRes.kycUrl}`);
    return formRes.kycUrl;
  }
}

/**
 * ✅ Checks KYC status and submits KYC if needed
 */
async function handleKYCVerificationViaApi(transak) {
  const { userData } = transak.client;
  if (!userData || !userData.email)
    throw new Error('❌ User data not found in memory');

  if (userData.kyc?.l1?.status !== 'APPROVED') {
    console.log(
      `⚠️ KYC not approved (Current Status: ${userData.kyc?.status}). Initiating KYC submission...`
    );
    await kycApiSequenceTests(transak);
  } else {
    console.log('✅ KYC Approved!');
  }
}

/**
 * ✅ Polls `GET /api/v2/user` every 30 seconds until KYC is approved
 */
async function waitForKYCApproval(transak) {
  const maxRetries = 20; // 20 retries max
  let retries = 0;

  while (retries < maxRetries) {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
    const kycFormsRes = await transak.user.getKycForms({ quoteId });
    console.log('📌 **KYC forms length:**', kycFormsRes?.forms?.length);

    const user = await transak.user.getUser();
    if (user.kyc?.l1?.status === 'APPROVED') {
      console.log('✅ KYC Approved!');
      return 'APPROVED';
    }

    console.log(
      `🔄 KYC still pending (Current Status: ${user.kyc?.l1?.status})... Retrying (${retries + 1}/${maxRetries})`
    );
    retries++;
  }

  console.warn('⚠️ KYC approval timeout reached.');
}

/**
 * ✅ Polls `GET /api/v2/user/shareTokenStatus` every 10 seconds until KYC is approved
 */
async function waitForkycShareTokenToReachTerminalState(transak, kycShareToken, kycShareTokenProvider, quoteId) {
  const maxRetries = 20; // 20 retries max
  let retries = 0;

  while (retries < maxRetries) {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds

    const {shareTokenStatus} = await transak.user.shareTokenStatus({kycShareToken, kycShareTokenProvider, quoteId});
    if (shareTokenStatus === 'DONE' || shareTokenStatus === 'FAILED') {
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
