import React from 'react';
import Chip from '@mui/material/Chip/Chip';
import { Status } from 'types/user';

function UserStatus({ status }: { status: string }) {
  return (
    <Chip
      size="small"
      label={status || 'uknown'}
      color={
        status === Status.Active
          ? 'success'
          : status === Status.Expired
          ? 'error'
          : status === Status.New
          ? 'info'
          : 'warning'
      }
    />
  );
}

export default UserStatus;
