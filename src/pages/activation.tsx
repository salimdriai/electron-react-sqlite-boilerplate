/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyIcon from '@mui/icons-material/Key';
import { ActivationData } from 'types';
import { useAppDispatch } from 'features/store';
import { updateActivationData } from 'features/settings';
import logo from '../../assets/icon.png';

const BASE_URL = 'https://keyguard.vercel.app/api/verify';
// const BASE_URL = 'http://localhost:3000/api/verify';

export default function ActivationPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      key: '',
      mac: '',
      clientName: '',
      phoneNumber: '',
      isActive: false,
    },
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const activate = async (activationData: ActivationData) => {
    setIsLoading(true);
    try {
      const res: any = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(activationData),
      });

      const data = await res.json();
      if (res.status === 200) {
        setValue('isActive', true);
        const isActivated = await window.electron.activateApp({
          ...activationData,
          isActive: true,
        });
        if (isActivated.success) {
          dispatch(updateActivationData({ ...activationData, isActive: true }));
          toast.success(data.message);
          navigate('/');
        }
      } else {
        toast.error(data.message);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  useEffect(() => {
    (async () => {
      const mac = await window.electron.getMac();
      setValue('mac', mac);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction="row" height="100vh">
      <Stack
        height="100%"
        flex={1}
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: 'background.default' }}
      >
        <img src={logo} width={250} alt="logo" />
      </Stack>
      <Stack height="100%" flex={2} justifyContent="center" alignItems="center">
        <Card variant="outlined" sx={{ p: 5 }}>
          <Stack spacing={2} component="form" onSubmit={handleSubmit(activate)}>
            <Typography gutterBottom variant="h5">
              Activation
            </Typography>
            <Controller
              name="clientName"
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Za-z\s]*$/,
                  message: 'Only letters are allowed.',
                },
                required: t('common.required'),
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('user.name')}
                  error={!!errors.key}
                  helperText={<> {errors.clientName?.message}</>}
                />
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                pattern: {
                  value: /^[0-9]*$/,
                  message: 'Only numbers are allowed.',
                },
                validate: (value) => {
                  if (value?.length !== 10) {
                    return 'Phone number must be exactly 10 digits.';
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <TextField
                  type="number"
                  fullWidth
                  {...field}
                  label={t('info.phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={<> {errors.phoneNumber?.message || ''} </>}
                />
              )}
            />

            <Controller
              name="key"
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Za-z0-9]*$/,
                  message: 'Only letters and numbers are allowed.',
                },
                required: t('common.keyRequired'),
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('common.activationKey')}
                  error={!!errors.key}
                  helperText={<> {errors.key?.message}</>}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="success"
              startIcon={
                isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <KeyIcon />
                )
              }
              disabled={isLoading}
            >
              {t('actions.activate')}
            </Button>
            <Button
              type="submit"
              variant="outlined"
              fullWidth
              onClick={() => navigate('/')}
              startIcon={<ArrowBackIcon />}
              disabled={isLoading}
            >
              {t('actions.cancel')}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}
