// src/App.js
import React, { useState } from 'react';
import EmailVerification from './component/EmailVerification.js';
import CreateOrderOtt from './component/CreateOrderOtt.js';

function App() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerificationComplete = (status) => {
    setIsVerified(status);
  };

  return (
    <div className="App">
      <EmailVerification onVerificationComplete={handleVerificationComplete} />
      {isVerified && <CreateOrderOtt />}
    </div>
  );
}

export default App;
