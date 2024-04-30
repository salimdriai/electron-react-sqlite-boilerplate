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
import { LicenseData } from 'types';
import { useAppDispatch } from 'features/store';
import { setAppId, updateActivationData } from 'features/settings';
import logo from '../../assets/icon.png';

export default function ActivationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      key: '',
      hddsn: '',
      clientName: '',
      phoneNumber: '',
      isActive: false,
    },
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const activate = async (licenseData: LicenseData) => {
    setIsLoading(true);
    try {
      if (!url) throw new Error('API URL NOT FOUND! ');

      const res: any = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(licenseData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (res.status === 200) {
        setValue('isActive', true);

        const isActivated = await window.electron.activateApp({
          ...licenseData,
          isActive: true,
        });

        if (isActivated.success) {
          const appId = `${licenseData.clientName
            .replace(' ', '-')
            .toLocaleLowerCase()}-${licenseData.phoneNumber}`;

          dispatch(setAppId(appId));
          dispatch(updateActivationData({ ...licenseData, isActive: true }));

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
      const hddSerialNumber = await window.electron.getHddSerialNumber();
      setValue('hddsn', hddSerialNumber);

      const BASE_URL = await window.electron.getStoreData('apiUrl');
      if (BASE_URL) {
        console.log('BASE_URL', BASE_URL);

        setUrl(`${BASE_URL}/api/v1/activate`);
      }
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
