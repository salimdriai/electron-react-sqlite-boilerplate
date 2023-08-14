/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';

import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useAppDispatch } from '../../features/store';
import { logAccount } from '../../features/authentication/reducers';

export default function Login() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = ({ username, password }: any) => {
    dispatch(logAccount({ username, password }));
  };

  const navigateToActivation = () => {
    navigate('/activation');
  };

  return (
    <Container maxWidth="sm">
      <Card elevation={10} sx={{ mt: '30%', p: 5 }}>
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
          <Typography variant="h2">Login</Typography>
          <Controller
            control={control}
            name="username"
            render={({ field }) => <TextField {...field} label="username" />}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => <TextField {...field} label="password" />}
          />
          <Button size="large" variant="contained" type="submit">
            Submit
          </Button>
        </Stack>
        <Stack mt={2}>
          <Typography>
            your app not active yet ?{' '}
            <Link component="button" onClick={navigateToActivation}>
              Activate
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Container>
  );
}
