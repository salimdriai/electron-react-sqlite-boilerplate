import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { User } from 'types';
import { getAge } from 'utils';

function UserInfo({ user }: { user: User }) {
  return (
    <Card variant="outlined">
      <CardHeader sx={{ pt: 2 }} title="User Info" />

      <CardContent sx={{ py: 0 }}>
        <Stack direction="row">
          <Box flex={1}>
            <Typography>age : {getAge(user.birthDate)}</Typography>
            <Typography>phone number : {user.phoneNumber}</Typography>
            <Typography>sex : {user.sex || 'N/A'}</Typography>
            <Typography>weight : {user.weight || 'N/A'} kg</Typography>
          </Box>
          <Box flex={1}>
            <Typography>height : {user.height || 'N/A'} cm</Typography>
            <Typography>blood type : {user.bloodType || 'N/A'}</Typography>
            <Typography>registered at : {user.registeredAt}</Typography>
            <Typography>all time sessions : {user.allTimeSessions}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default UserInfo;
