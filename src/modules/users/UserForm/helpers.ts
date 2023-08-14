/* eslint-disable import/prefer-default-export */

import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import { Sex } from 'types/user';

export const defaultValues = {
  id: '',
  firstName: '',
  lastName: '',
  sex: Sex.Male,
  phoneNumber: '',
  birthDate: '',
  height: 0,
  weight: 0,
  photo: '',
  registeredAt: '',
  allTimeSessions: 0,
  status: '',
  bloodType: '',
  currentSubscriptions: [
    {
      subscription: {
        name: 'body building',
        monthPrice: 2_000,
        sessionPrice: 300,
        sessionsPerMonth: 16,
      },
      startedAt: '',
      endsAt: '',
      paid: 2_000,
      sessionsAvailable: 0,
      sessionsSpent: 0,
      lastEntryTimestamp: 0,
    },
  ],
};

export const subscriptionOptions = [
  {
    name: 'body building',
    monthPrice: 2_000,
    sessionPrice: 300,
    sessionsPerMonth: 16,
  },
  {
    name: 'cardio',
    monthPrice: 2_000,
    sessionPrice: 300,
    sessionsPerMonth: 16,
  },
  {
    name: 'velo',
    monthPrice: 200,
    sessionPrice: 100,
    sessionsPerMonth: 16,
  },
];

export const photoStyle = {
  height: '120px',
  width: '140px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
};

export const subscriptionOptionStyle = {
  p: 2,
  pt: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  height: '100%',
};

export const cameraModalStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(
  ({ theme }) => ({
    gap: 12,
    '& .MuiToggleButtonGroup-grouped': {
      textTransform: 'none',
      '&:not(:first-of-type)': {
        borderRadius: theme.shape.borderRadius,
      },
      '&:first-of-type': {
        borderRadius: theme.shape.borderRadius,
      },
      '&.Mui-disabled': {
        border: 0,
      },
      border: '1px solid!important',
    },
    '& .Mui-selected': {
      borderColor: `${theme.palette.success.dark}!important`,
    },
  })
);
