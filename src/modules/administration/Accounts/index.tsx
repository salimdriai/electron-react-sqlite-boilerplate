import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Account, Permission } from 'types';
import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Administration() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const navigate = useNavigate();

  const handleClickEdit = (account: Account) => () => {
    navigate('/administration/add-account', { state: account });
  };

  useEffect(() => {
    const getAccounts = async () => {
      const res = await window.electron.getAllAccounts();
      setAccounts(res);
    };
    getAccounts();
  }, []);

  return (
    <Stack spacing={2}>
      {accounts.map((account) => (
        <Card
          key={account.username}
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          variant="outlined"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 60, height: 60 }}>
              {account.username.charAt(0).toLocaleUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5">{account.username}</Typography>
              <Typography variant="body2" color="text.secondary">
                {account.permission === Permission.Admin ? 'admin' : 'user'}
              </Typography>
            </Box>
          </Stack>
          <Box>
            <Chip label="active" color="success" />
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={handleClickEdit(account)}>
              <EditIcon color="info" />
            </IconButton>
            <IconButton>
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
export default Administration;
