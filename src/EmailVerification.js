// src/EmailVerification.js
import React, { useState } from 'react';
import { TransakAPI } from './lib/index.js';
// Optionally, if TransakAPI needs configuration, pass it here (e.g., your API key, base URL, etc.)
const transakSdk = new TransakAPI({
    environment: 'staging',
    partnerApiKey: '0b4a8ff3-0d7e-409b-a6b9-3b82094b0f03',
});

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [stateToken, setStateToken] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  // Function to call the API to send a verification email
  const handleSendEmail = async () => {
    try {
      // Replace with the actual method provided by the Transak API client.
      const response = await transakSdk.user.sendEmailOtp({ email });
      console.log(response)
      setStateToken(response.stateToken)
      setMessage(`Verification email sent to ${email}. Please check your inbox.`);
    } catch (error) {
      setMessage(`Error sending verification email: ${error.message}`);
    }
  };

  // Function to call the API to verify the email using a token
  const handleVerifyEmail = async () => {
    try {
      const response = await transakSdk.user.verifyEmailOtp({
        email: email,
        otp: token,
        stateToken: stateToken
      });
      if (response.created) {
        setVerificationStatus('Email verified successfully!');
      } else {
        setVerificationStatus('Verification failed. Please try again.');
      }
    } catch (error) {
      setVerificationStatus(`Error verifying email: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Email Verification</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">Email: </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{ marginLeft: '1rem', padding: '0.5rem' }}
        />
        <button onClick={handleSendEmail} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Send Verification Email
        </button>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="token">Verification Token: </label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter verification token"
          style={{ marginLeft: '1rem', padding: '0.5rem' }}
        />
        <button onClick={handleVerifyEmail} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Verify Email
        </button>
      </div>
      {message && <p>{message}</p>}
      {verificationStatus && <p>{verificationStatus}</p>}
    </div>
  );
};

export default EmailVerification;
