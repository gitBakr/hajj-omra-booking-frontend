import React from 'react';

const QRCode = () => {
  const siteUrl = "https://hajj-omra-booking-frontend.onrender.com/";
  const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(siteUrl)}&chs=200x200&choe=UTF-8&chld=L|2`;

  return (
    <div className="qr-code-container">
      <h3>Scannez pour accéder au site</h3>
      <img 
        src={qrCodeUrl} 
        alt="QR Code pour accéder au site"
        style={{
          display: 'block',
          margin: '20px auto',
          padding: '10px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
};

export default QRCode; 