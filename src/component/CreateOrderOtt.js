import React, { useState } from 'react';
import { transakSdk, partnerApiKey } from '../lib/TransakConfig.js';

const CreateOrderOtt = () => {
  const [paymentUrl, setPaymentUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateOrder = async () => {
    try {
      const response = await transakSdk.user.requestOtt();
      const token = response.ott;

      // Generate the payment URL with the OTT token
      const widgetUrl = `https://global-stg.transak.com?ott=${token}&apiKey=${partnerApiKey}&fiatCurrency=EUR&cryptoCurrencyCode=USDC&productsAvailed=BUY&fiatAmount=1000&network=arbitrum&paymentMethod=credit_debit_card&hideExchangeScreen=true&walletAddress=0x3D629A50ec20eb9a2ed23D0fd0EB28DdcA9Fda46&disableWalletAddressForm=true`;

      setPaymentUrl(widgetUrl);
      setMessage('OTT token generated successfully! Click the link below to proceed with payment.');
    } catch (error) {
      setMessage(`Error generating OTT token: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Create Order (Cards)</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={handleCreateOrder}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Click to Generate Payment Link
        </button>
      </div>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
      {paymentUrl && (
        <div style={{ marginTop: '1rem' }}>
          <p>Click the link below to proceed with payment:</p>
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#2196F3',
              textDecoration: 'underline',
              wordBreak: 'break-all'
            }}
          >
            {paymentUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default CreateOrderOtt;
