import React, { useState, useMemo, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Controller, UseFormReturn } from 'react-hook-form';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import { Role, Permission, Account } from 'types';

function AccountForm({
  closeDialog,
  editAccount,
  getAccounts,
  formMethods,
}: {
  closeDialog: () => void;
  getAccounts: () => void;
  editAccount: Account | null;
  formMethods: UseFormReturn<any>;
}) {
  const { t } = useTranslation();

  const isEditMode = useMemo(() => !!editAccount, [editAccount]);

  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { handleSubmit, control, watch, reset, setValue } = formMethods;

  const createAccount = async (account: Account) => {
    const allAccounts = await window.electron.getAllAccounts();
    if (allAccounts.length > 2) {
      toast.warning(t('info.trial.version.limit'));
      toast.info(t('info.contact.us'));
      return;
    }

    account.createdAt = new Date().toLocaleString();
    try {
      await window.electron.createAccount(account);
      toast.success('Account successfuly created');
    } catch (error) {
      toast.error('cannot create account !');
    }
  };

  const updateAccount = async (account: Account) => {
    await window.electron.updateAccount(account);
    toast.success('Account updated successfuly');
  };

  const submitAccount = async (data: any) => {
    if (isEditMode) {
      await updateAccount(data);
    } else {
      await createAccount(data);
    }
    setPasswordConfirmation('');
    reset();
    getAccounts();
    closeDialog();
  };

  useEffect(() => {
    if (isEditMode) {
      const updateDefaultValues = async (data: Account) => {
        const decryptedPass = await window.electron.decryptData(data.password);
        setValue('username', data.username);
        setValue('phoneNumber', data.phoneNumber);
        setValue('password', decryptedPass);
        setValue('permission', data.permission);
        setValue('role', data.role);
        setValue('status', data.status);
        setValue('createdAt', data.createdAt);
        setPasswordConfirmation(decryptedPass);
      };
      updateDefaultValues(editAccount as Account);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  return (
    <Card
      sx={{ p: 2, maxWidth: '600px' }}
      component="form"
      onSubmit={handleSubmit(submitAccount)}
    >
      <Stack mt={2} mb={3}>
        <Typography variant="h5" gutterBottom>
          {t('common.accountInfo')}:
        </Typography>
      </Stack>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2}>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={isEditMode}
                type="text"
                label={t('info.username')}
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label={t('info.phoneNumber')}
              />
            )}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="text"
                label={t('info.password')}
              />
            )}
          />
          <TextField
            fullWidth
            type="text"
            label={t('info.passwordConfirm')}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            error={passwordConfirmation !== watch('password')}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Controller
            name="permission"
            control={control}
            rules={{ required: 'Permission is required.' }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>permission</InputLabel>
                <Select
                  onChange={(v) => field.onChange(v as any)}
                  value={field.value}
                  label={t('info.permission')}
                >
                  {Object.entries(Permission).map(([key, value]) => (
                    /* @ts-ignore */
                    <MenuItem key={key} value={value}>
                      {t(`account.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="role"
            control={control}
            rules={{ required: 'Role is required.' }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>role</InputLabel>
                <Select
                  onChange={(v) => field.onChange(v as any)}
                  value={field.value}
                  label={t('info.role')}
                >
                  {Object.entries(Role).map(([key, value]) => (
                    /* @ts-ignore */
                    <MenuItem key={key} value={value}>
                      {t(`account.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Stack>
        <Button variant="contained" type="submit">
          {isEditMode ? t('actions.update') : t('actions.create')}
        </Button>
      </Stack>
    </Card>
  );
}
export default AccountForm;
