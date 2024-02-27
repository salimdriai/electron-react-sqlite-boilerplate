import React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Language from './Language';
import Theme from './Theme';
import Currency from './Currency';

const AppSettings = () => {
  return (
    <Card component={Stack} variant="outlined" spacing={3} p={2}>
      <Language />
      <Currency />
      <Theme />
    </Card>
  );
};

export default AppSettings;
