import React from 'react';

import Stack from '@mui/material/Stack';

import Language from './Language';
import Theme from './Theme';
import ImportUsers from './ImportUsers';

import SubscriptionPlans from './SubscriptionPlans';

function Settings() {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Language />
        <Theme />
      </Stack>

      <SubscriptionPlans />

      <Stack direction="row" spacing={2}>
        <ImportUsers />
      </Stack>
    </Stack>
  );
}

export default Settings;
