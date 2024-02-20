import React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Language from './Language';
import Theme from './Theme';

const AppSettings = () => {
  return (
    <Card
      component={Stack}
      variant="outlined"
      direction="row"
      spacing={2}
      p={2}
    >
      <Language />
      <Theme />
    </Card>
  );
};

export default AppSettings;
