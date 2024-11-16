import React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Language from './Language';
import Theme from './Theme';
import Currency from './Currency';
import AccessInput from './AccessInput';
import RemoveZerosFromId from './RemoveZerosFromId';
// import AccessType from './AccessType';

const AppSettings = () => {
  return (
    <Card component={Stack} variant="outlined" spacing={4} p={2}>
      <Language />
      <Currency />
      <Theme />
      <AccessInput />
      <RemoveZerosFromId />
      {/* <AccessType /> */}
    </Card>
  );
};

export default AppSettings;
