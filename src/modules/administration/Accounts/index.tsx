import React from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Account } from 'types';

function Accounts({
  accounts,
  setEditAccount,
  setOpenCreateAccount,
}: {
  accounts: Account[];
  setEditAccount: (arg: Account | null) => void;
  setOpenCreateAccount: (arg: boolean) => void;
}) {
  const { t } = useTranslation();

  const handleClickEdit = (account: Account) => () => {
    setEditAccount(account);
    setOpenCreateAccount(true);
  };

  return (
    <Card component={Stack} variant="outlined" spacing={2} p={2}>
      {accounts.length === 0 && (
        <Stack alignItems="center" spacing={2}>
          <Typography align="center">{t('info.noAccountAdded')}</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateAccount(true)}
            variant="outlined"
          >
            {t('account.add')}
          </Button>
        </Stack>
      )}
      {accounts.map((account) => (
        <Card
          key={account.username}
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 4,
          }}
          variant="outlined"
        >
          <Stack flex={3} direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 60, height: 60 }}>
              {account.username.charAt(0).toLocaleUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5">{account.username}</Typography>
              <Typography variant="body2" color="text.secondary">
                {account.role}
              </Typography>
            </Box>
          </Stack>
          <Box>
            <Chip
              sx={{ minWidth: 100 }}
              label={account.permission}
              color="primary"
              variant="outlined"
            />
          </Box>
          <Box>
            <Chip sx={{ minWidth: 100 }} label="active" color="success" />
          </Box>
          <Stack flex={1} direction="row" justifyContent="end" spacing={1}>
            <IconButton onClick={handleClickEdit(account)}>
              <EditIcon color="info" />
            </IconButton>
            <IconButton>
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
        </Card>
      ))}
    </Card>
  );
}
export default Accounts;
