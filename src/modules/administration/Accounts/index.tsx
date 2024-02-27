import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Account } from 'types';
import { useAppSelector } from 'features/store';

function Accounts({
  accounts,
  setEditAccount,
  setOpenCreateAccount,
  setAccounts,
}: {
  accounts: Account[];
  setEditAccount: (arg: Account | null) => void;
  setOpenCreateAccount: (arg: boolean) => void;
  setAccounts: (arg: any) => void;
}) {
  const [deleteAccount, setDeleteAccount] = useState<Account | null>(null);

  const { t } = useTranslation();
  const { username } = useAppSelector(({ authentication }) => authentication);

  const handleClickEdit = (account: Account) => () => {
    setEditAccount(account);
    setOpenCreateAccount(true);
  };
  const handleClickDelete = (account: Account) => () => {
    setDeleteAccount(account);
  };

  const confirmDeleteAccount = async () => {
    if (username === deleteAccount?.username) {
      toast.error(t('info.accountInUse'));
      return;
    }
    await window.electron.removeAccount(deleteAccount?.username!);
    setDeleteAccount(null);
    const res = await window.electron.getAllAccounts();
    setAccounts(res);
    toast.success('success');
  };

  return (
    <Card component={Stack} variant="outlined" spacing={2} p={2}>
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
            <IconButton onClick={handleClickDelete(account)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
        </Card>
      ))}
      <Stack alignItems="center" spacing={2}>
        {accounts.length === 0 && (
          <Typography align="center">{t('info.noAccountAdded')}</Typography>
        )}
        <Button
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateAccount(true)}
          variant="outlined"
        >
          {t('account.add')}
        </Button>
      </Stack>
      <Dialog open={!!deleteAccount} onClose={() => setDeleteAccount(null)}>
        <DialogTitle>{t('user.delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('user.confirmDelete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccount(null)}>
            {t('actions.cancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDeleteAccount}
            autoFocus
          >
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
export default Accounts;
