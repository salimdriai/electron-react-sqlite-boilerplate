/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import Divider from '@mui/material/Divider';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Sex, BloodType, Status, UserSubscription } from 'types/user';
import { Subscription } from 'types/settings';
import {
  defaultValues,
  subscriptionOptions,
  photoStyle,
  subscriptionOptionStyle,
  cameraModalStyle,
  StyledToggleButtonGroup,
} from './helpers';

import TakePhoto from './TakePhoto';

function UserForm() {
  const { state } = useLocation();
  const isEditMode = React.useMemo(() => !!state, [state]);

  const [camera, setCamera] = useState<{ open: boolean; photo: null | string }>(
    { open: false, photo: state?.photo || null }
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: isEditMode ? state : defaultValues,
  });

  const dateDefaultValue = (name: string, date: string) => {
    const subOption: any =
      watch('currentSubscriptions').find(
        ({ subscription }: UserSubscription) => subscription.name === name
      ) || null;
    return subOption?.[date] ? new Date(subOption[date]) : null;
  };

  const isCardFieldsDisabled = (name: string) => {
    const isSubAdded = watch('currentSubscriptions').find(
      ({ subscription }: UserSubscription) => subscription.name === name
    );
    return !isSubAdded;
  };

  const [quickAddSubscription, setQuickAddSubscription] = React.useState<any>(
    subscriptionOptions.map((sub) => ({
      name: sub.name,
      amount: 0,
    }))
  );

  const onSubscriptionDateChange =
    (subName: string, targetDate: string) => (value: any) => {
      const currentSubscriptions = watch('currentSubscriptions');
      // eslint-disable-next-line array-callback-return
      currentSubscriptions.map((sub: any) => {
        if (sub.subscription.name === subName) {
          sub[targetDate] = value.toDateString();
        }
      });

      setValue('currentSubscriptions', currentSubscriptions);
    };

  const handleChangeQuickAddSubs =
    (targetName: string) =>
    (event: React.MouseEvent<HTMLElement>, value: string) => {
      if (value === null) {
        setQuickAddSubscription((prev: any) =>
          prev.map((p: any) => {
            if (p.name === targetName) {
              return { ...p, amount: 0 };
            }
            return p;
          })
        );
        return;
      }

      const [name, amount] = value.split('.');
      setQuickAddSubscription((prev: any) =>
        prev.map((p: any) => {
          if (p.name === name) {
            return { ...p, amount: Number(amount) };
          }
          return p;
        })
      );
      const thirtyDays = 2_592_000_000;
      const monthsAdded = thirtyDays * Number(amount);
      const startDate = new Date().getTime();
      const endDate = startDate + monthsAdded;

      const currentSubscriptions = watch('currentSubscriptions');
      // eslint-disable-next-line array-callback-return
      currentSubscriptions.map((sub: any) => {
        if (sub.subscription.name === name) {
          const subSessionsPerMonth = subscriptionOptions.find(
            (s) => s.name === name
          )?.sessionsPerMonth as number;

          sub.startedAt = new Date(startDate).toDateString();
          sub.endsAt = new Date(endDate).toDateString();
          sub.sessionsAvailable = Number(amount) * subSessionsPerMonth;
        }
      });

      setValue('currentSubscriptions', currentSubscriptions);
    };

  const handleChangeSubscriptions = (event: any) => {
    const { name, checked } = event.target;
    let currentSubscriptions = watch('currentSubscriptions');

    const subscription = subscriptionOptions.find(
      (subscriptionOption) => subscriptionOption.name === name
    ) as Subscription;

    const newSub = {
      subscription,
      startedAt: '',
      endsAt: '',
      paid: 0,
      sessionsAvailable: 0,
      sessionsSpent: 0,
    };

    if (checked) {
      currentSubscriptions = [...currentSubscriptions, newSub];
    } else {
      currentSubscriptions = currentSubscriptions.filter(
        (sub: UserSubscription) => sub.subscription.name !== name
      );
    }

    setValue('currentSubscriptions', currentSubscriptions);
  };

  const addUser = async (data: any) => {
    window.electron
      .insertUser(data)
      .then(() => {
        reset();
        setCamera({ ...camera, photo: null });
        toast.success('User succesfully added !');
        return null;
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const updateUser = async (data: any) => {
    window.electron
      .updateUser(data)
      .then(() => {
        reset();
        setCamera({ ...camera, photo: null });
        toast.success('User succesfully updated !');
        return null;
      })
      .catch((err) => toast.error(err));
  };

  const isSubscriptionFieldsValid = (subscriptions: any) => {
    let isValid = true;
    subscriptions.forEach((sub: any) => {
      if (!sub.startedAt || !sub.endsAt || !sub.sessionsAvailable) {
        isValid = false;
      }
    });
    return isValid;
  };

  const submitUser = (formData: any) => {
    const data = {
      ...formData,
      registeredAt: new Date().toDateString(),
      photo: camera.photo || '',
    };

    if (!isSubscriptionFieldsValid(data.currentSubscriptions)) {
      toast.error('Incorrect subscription fields!');
      return;
    }

    data.firstName = data.firstName.toLowerCase();
    data.lastName = data.lastName.toLowerCase();
    data.currentSubscriptions = JSON.stringify(data.currentSubscriptions);
    data.height = parseInt(data.height) || null;
    data.weight = parseInt(data.weight) || null;
    data.status = data.currentSubscriptions.length ? Status.Active : Status.New;

    if (isEditMode) {
      updateUser(data);
    } else {
      addUser(data);
    }
  };

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
    setCamera({ ...camera, photo: null });
  };

  const handleChangeSessionsNumber = (name: string) => (e: any) => {
    const { value } = e.target;
    const currentSubscriptions = watch('currentSubscriptions');

    currentSubscriptions.forEach((sub: any) => {
      if (name === sub.subscription.name) {
        sub.sessionsAvailable = Number(value);
      }
    });

    setValue('currentSubscriptions', currentSubscriptions);
  };

  return (
    <form onSubmit={handleSubmit(submitUser)}>
      <Box display="flex" gap={10}>
        <Stack flex={1} spacing={1.5}>
          <Modal
            open={camera.open}
            onClose={() => setCamera({ ...camera, open: false })}
            sx={cameraModalStyle}
          >
            <TakePhoto setCamera={setCamera} />
          </Modal>

          <Card elevation={4} sx={photoStyle} onClick={handleOpenCamera}>
            {camera.photo ? (
              <img src={camera.photo} width="100%" height="100%" alt="user" />
            ) : (
              <PhotoCameraIcon />
            )}
          </Card>

          <Box height={40}>
            {camera.photo && (
              <Button size="small" color="error" onClick={removePhoto}>
                remove
              </Button>
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
                  disabled={isEditMode}
                  type="text"
                  fullWidth
                  {...field}
                  label="id"
                  error={!!errors.id}
                  helperText={<> {errors.id?.message || ''} </>}
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
                <FormControl sx={{ width: 140 }}>
                  <InputLabel>sex</InputLabel>
                  <Select
                    onChange={(v) => field.onChange(v as any)}
                    value={field.value}
                    label="sex"
                  >
                    <MenuItem value={Sex.Male}>Male</MenuItem>
                    <MenuItem value={Sex.Female}>Female</MenuItem>
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
                  value: /^[A-Za-z]*$/,
                  message: 'Only letters are allowed.',
                },
                required: 'first name is required.',
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  {...field}
                  label="first name"
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
                  value: /^[A-Za-z]*$/,
                  message: 'Only letters are allowed.',
                },
                required: 'last name is required.',
              }}
              render={({ field }) => (
                <TextField
                  type="text"
                  fullWidth
                  {...field}
                  label="last name"
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
                  if (value.length !== 10) {
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
                  label="phone number"
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
                    customInput={<TextField fullWidth label="birth date" />}
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
                <TextField type="number" {...field} label="height" />
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
                <TextField type="number" {...field} label="weight" />
              )}
            />

            <Controller
              name="bloodType"
              control={control}
              render={({ field }) => (
                <FormControl sx={{ width: 140 }}>
                  <InputLabel>blood type</InputLabel>
                  <Select
                    onChange={(v) => field.onChange(v as any)}
                    value={field.value}
                    label="sex"
                  >
                    {Object.values(BloodType).map((type: string) => (
                      <MenuItem value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </Stack>

        {/*
        //
        //
        //
        // ------------- SUBSCRIPTION ------------------
        //
        //
        //
        */}

        <Stack flex={1} spacing={2}>
          <Stack spacing={1} height="100%">
            {subscriptionOptions.map(({ name }: { name: string }, i) => (
              <Card sx={subscriptionOptionStyle}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <FormControlLabel
                    value={name}
                    control={
                      <Checkbox
                        checked={!isCardFieldsDisabled(name)}
                        onChange={handleChangeSubscriptions}
                        name={name}
                      />
                    }
                    label={name}
                    labelPlacement="end"
                  />
                  <StyledToggleButtonGroup
                    size="small"
                    value={`${quickAddSubscription[i].name}.${quickAddSubscription[i].amount}`}
                    exclusive
                    onChange={handleChangeQuickAddSubs(name)}
                  >
                    <ToggleButton
                      disabled={isCardFieldsDisabled(name)}
                      value={`${name}.1`}
                      // sx={{ backgroundColor: 'red' }}
                    >
                      +1 Month
                    </ToggleButton>
                    <ToggleButton
                      disabled={isCardFieldsDisabled(name)}
                      value={`${name}.2`}
                    >
                      +2 Months
                    </ToggleButton>
                    <ToggleButton
                      disabled={isCardFieldsDisabled(name)}
                      value={`${name}.3`}
                    >
                      +3 Months
                    </ToggleButton>
                  </StyledToggleButtonGroup>
                </Stack>
                <Divider />
                <Stack direction="row" spacing={1}>
                  <DatePicker
                    name="startedAt"
                    dateFormat="dd-MM-yyyy"
                    disabled={isCardFieldsDisabled(name)}
                    selected={dateDefaultValue(name, 'startedAt')}
                    onChange={onSubscriptionDateChange(name, 'startedAt')}
                    customInput={<TextField fullWidth label="starts at" />}
                  />
                  <DatePicker
                    name="endsAt"
                    dateFormat="dd-MM-yyyy"
                    disabled={isCardFieldsDisabled(name)}
                    selected={dateDefaultValue(name, 'endsAt')}
                    onChange={onSubscriptionDateChange(name, 'endsAt')}
                    customInput={<TextField fullWidth label="ends at" />}
                  />
                  <TextField
                    label="sessions"
                    defaultValue={0}
                    onChange={handleChangeSessionsNumber(name)}
                    value={
                      watch('currentSubscriptions').find(
                        (sub: any) => sub.subscription.name === name
                      )?.sessionsAvailable
                    }
                  />
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Box>

      <Box display="flex" justifyContent="end" mt={4}>
        <Button
          type="submit"
          sx={{ width: '300px' }}
          size="large"
          variant="contained"
        >
          {isEditMode ? 'Update' : 'Register'}
        </Button>
      </Box>
    </form>
  );
}

export default UserForm;
