import React, { useState, useMemo, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
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

function AccountForm() {
  const { state } = useLocation();
  const { t } = useTranslation();

  const isEditMode = useMemo(() => !!state, [state]);

  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { handleSubmit, control, watch, reset, setValue } = useForm({
    defaultValues: {
      username: '',
      password: '',
      permission: '',
      role: '',
      status: '',
      createdAt: '',
    },
  });

  const createAccount = async (account: Account) => {
    account.createdAt = new Date().toLocaleString();
    await window.electron.createAccount(account);
    toast.success('Account successfuly created');
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
  };

  useEffect(() => {
    if (isEditMode) {
      const updateDefaultValues = async (data: Account) => {
        const decryptedPass = await window.electron.decryptData(data.password);
        setValue('username', data.username);
        setValue('password', decryptedPass);
        setValue('permission', data.permission);
        setValue('role', data.role);
        setValue('status', data.status);
        setValue('createdAt', data.createdAt);
        setPasswordConfirmation(decryptedPass);
      };
      updateDefaultValues(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  return (
    <Card
      sx={{ p: 2, maxWidth: '600px' }}
      component="form"
      onSubmit={handleSubmit(submitAccount)}
    >
      <Typography variant="h5" gutterBottom>
        {t('common.accountInfo')}:
      </Typography>
      <Stack spacing={4}>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              disabled={isEditMode}
              type="text"
              label={t('info.username')}
              {...field}
            />
          )}
        />
        <Stack direction="row" spacing={2}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                type="text"
                label={t('info.password')}
                {...field}
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
                  {Object.keys(Permission).map((key) => (
                    /* @ts-ignore */
                    <MenuItem key={key} value={Permission[key]}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="role"
            control={control}
            rules={{ required: 'Permission is required.' }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>role</InputLabel>
                <Select
                  onChange={(v) => field.onChange(v as any)}
                  value={field.value}
                  label={t('info.role')}
                >
                  {Object.keys(Role).map((key) => (
                    /* @ts-ignore */
                    <MenuItem key={key} value={Role[key]}>
                      {key}
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
