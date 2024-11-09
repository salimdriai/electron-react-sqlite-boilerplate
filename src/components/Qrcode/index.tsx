import React from 'react';
import QRCode from 'react-qr-code';
import Card from '@mui/material/Card';

const QrCode = ({
  value,
  blurQrCode,
}: {
  value: string;
  blurQrCode?: boolean;
}) => {
  return (
    <Card
      sx={{
        p: 1,
        backgroundColor: 'white',
        filter: !blurQrCode ? 'blur(0px)' : 'blur(4px)',
      }}
    >
      <div
        style={{
          height: 180,
          maxWidth: 180,
          width: '100%',
        }}
      >
        <QRCode
          size={256}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={value}
          viewBox="0 0 256 256"
        />
      </div>
    </Card>
  );
};

export default QrCode;
