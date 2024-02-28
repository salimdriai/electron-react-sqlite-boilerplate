/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Controller, UseFormReturn } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DatePicker from 'react-datepicker';

import QrCode from 'components/Qrcode';
import { Sex, BloodType, Subscription, User } from 'types';
import { photoStyle, cameraModalStyle } from './helpers';
import TakePhoto from './TakePhoto';

interface IForm extends User {
  subscriptions: Subscription[];
}

interface IInfo {
  formMethods: UseFormReturn<IForm>;
  isEditMode: boolean;
}

const Info = ({ formMethods, isEditMode }: IInfo) => {
  const { state } = useLocation();
  const [isKeyLost, setIsKeyLost] = useState(false);

  const [camera, setCamera] = useState<{
    open: boolean;
    photo: undefined | string | Buffer;
  }>({
    open: false,
    photo: state?.photo || undefined,
  });

  const {
    control,
    watch,
    formState: { errors },
  } = formMethods;

  const { t } = useTranslation();

  const handleOpenCamera = () => {
    setCamera({ ...camera, open: true });

    (navigator as any).getUserMedia(
      { video: true, audio: false },
      (localMediaStream: any) => {
        const video: any = document.getElementById('video');
        video.srcObject = localMediaStream;
        video.autoplay = true;
      },
      () => {}
    );
  };

  const removePhoto = () => {
    setCamera({ ...camera, photo: undefined });
  };

  useEffect(() => {
    formMethods.setValue('photo', camera.photo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera]);

  return (
    <Stack flex={2} spacing={1.5} component={Card} variant="outlined" p={2}>
      <Typography gutterBottom variant="h6">
        Info
      </Typography>

      <Modal
        open={camera.open}
        onClose={() => setCamera({ ...camera, open: false })}
        sx={cameraModalStyle}
      >
        <TakePhoto setCamera={setCamera} />
      </Modal>

      <Stack direction="row" spacing={2}>
        <Card elevation={4} sx={photoStyle} onClick={handleOpenCamera}>
          {camera.photo ? (
            <img
              src={
                typeof camera.photo === 'string'
                  ? camera.photo
                  : URL.createObjectURL(new Blob([camera.photo]))
              }
              width="100%"
              height="100%"
              alt="user"
            />
          ) : (
            <PhotoCameraIcon />
          )}
        </Card>
        <QrCode value={watch('id')} />
      </Stack>
      <Box height={30}>
        {camera.photo && (
          // @ts-ignore
          <Link
            component="button"
            size="small"
            color="error"
            onClick={removePhoto}
          >
            {t('actions.delete')}
          </Link>
        )}
      </Box>

      {/*
          //
          //
          //
          // ------------- ID ------------------
          //
          //
          //
          */}

      <Box display="flex" gap={2}>
        <Controller
          name="id"
          control={control}
          rules={{
            pattern: {
              value: /^[A-Za-z0-9]*$/,
              message: 'Only letters and numbers are allowed.',
            },
            required: 'ID is required.', // You can remove this if not needed
          }}
          render={({ field }) => (
            <TextField
              disabled={!isKeyLost && isEditMode}
              type="text"
              fullWidth
              {...field}
              onChange={(e) =>
                field.onChange(e.target.value.replace(/^0+/, '').trim())
              }
              label="id"
              error={!!errors.id}
              helperText={<> {errors.id?.message || ''} </>}
              InputProps={{
                ...(isEditMode && {
                  endAdornment: (
                    <Button
                      onClick={() => setIsKeyLost(!isKeyLost)}
                      size="small"
                    >
                      {t('info.keyLost')}
                    </Button>
                  ),
                }),
              }}
            />
          )}
        />

        {/*
            //
            //
            //
            // ------------- SEX ------------------
            //
            //
            //
            */}

        <Controller
          name="sex"
          control={control}
          rules={{ required: 'Sex is required.' }}
          render={({ field }) => (
            <FormControl sx={{ width: 180 }}>
              <InputLabel>sex</InputLabel>
              <Select
                onChange={(v) => field.onChange(v as any)}
                value={field.value}
                label={t('info.sex')}
              >
                <MenuItem value={Sex.Male}>{t('user.Male')}</MenuItem>
                <MenuItem value={Sex.Female}>{t('user.Female')}</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      {/*
          //
          //
          //
          // ------------- FIRST NAME ------------------
          //
          //
          //
          */}

      <Box display="flex" gap={2}>
        <Controller
          name="firstName"
          control={control}
          rules={{
            pattern: {
              value: /^[A-Za-z\s]*$/,
              message: 'Only letters are allowed.',
            },
            required: 'first name is required.',
          }}
          render={({ field }) => (
            <TextField
              fullWidth
              {...field}
              label={t('info.firstname')}
              error={!!errors.firstName}
              helperText={<> {errors.firstName?.message || ''} </>}
            />
          )}
        />

        {/*
            //
            //
            //
            // ------------- LAST NAME ------------------
            //
            //
            //
            */}

        <Controller
          name="lastName"
          control={control}
          rules={{
            pattern: {
              value: /^[A-Za-z\s]*$/,
              message: 'Only letters are allowed.',
            },
            required: 'last name is required.',
          }}
          render={({ field }) => (
            <TextField
              type="text"
              fullWidth
              {...field}
              label={t('info.lastname')}
              error={!!errors.lastName}
              helperText={<> {errors.lastName?.message || ''}</>}
            />
          )}
        />
      </Box>

      {/*
          //
          //
          //
          // ------------- PHONE NUMBER ------------------
          //
          //
          //
          */}

      <Box display="flex" gap={2}>
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

        {/*
          //
          //
          //
          // ------------- BIRTH DATE ------------------
          //
          //
          //
          */}

        <Controller
          name="birthDate"
          control={control}
          rules={{
            required: 'Birth date is required.',
          }}
          render={({ field }) => (
            <Box
              width="100%"
              sx={{ '& .react-datepicker-wrapper': { width: '100%' } }}
            >
              <DatePicker
                fixedHeight
                dateFormat="dd-MM-yyyy"
                selected={
                  watch('birthDate') ? new Date(watch('birthDate')) : null
                }
                onChange={(d) => field.onChange(d?.toDateString())}
                customInput={
                  <TextField fullWidth label={t('info.birthDate')} />
                }
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </Box>
          )}
        />
      </Box>

      {/*
          //
          //
          //
          // ------------- HEIGHT / WEIGHT / BLOOD ------------------
          //
          //
          //
          */}

      <Box display="flex" gap={2}>
        <Controller
          name="height"
          control={control}
          rules={{
            pattern: {
              value: /^[0-9]*$/,
              message: 'Only numbers are allowed.',
            },
          }}
          render={({ field }) => (
            <TextField
              type="number"
              fullWidth
              {...field}
              label={t('info.height')}
            />
          )}
        />

        <Controller
          name="weight"
          control={control}
          rules={{
            pattern: {
              value: /^[0-9]*$/,
              message: 'Only numbers are allowed.',
            },
          }}
          render={({ field }) => (
            <TextField
              type="number"
              fullWidth
              {...field}
              label={t('info.weight')}
            />
          )}
        />

        <Controller
          name="bloodType"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>{t('info.bloodType')}</InputLabel>
              <Select
                onChange={(v) => field.onChange(v as any)}
                value={field.value}
                label={t('info.bloodType')}
              >
                <MenuItem value="">none</MenuItem>
                {Object.values(BloodType).map((type: string) => (
                  <MenuItem value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Controller
        name="notes"
        control={control}
        render={({ field }) => <TextField {...field} label={t('info.notes')} />}
      />
      <Button type="submit" size="large" variant="contained" color="secondary">
        {isEditMode ? t('actions.update') : t('actions.register')}
      </Button>
    </Stack>
  );
};

export default Info;
