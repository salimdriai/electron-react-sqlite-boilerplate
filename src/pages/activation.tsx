/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { toast } from 'react-toastify';
import { Account } from 'types';

export default function ActivationPage() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: { key: '' } });

  const [account, setAccount] = React.useState<Account | null>(null);
  const [isAppActivated, setIsAppActivated] = React.useState(false);
  const navigate = useNavigate();

  const activate = async (data: { key: string }) => {
    const res = await window.electron.activateApp(data.key);
    if (res === undefined) {
      toast.error('Please insert a correct key !');
      setError('key', { type: 'custom', message: 'wrong key provided !' });
      return;
    }
    setAccount(res);
  };

  React.useEffect(() => {
    const checkAppStatus = async () => {
      const res = await window.electron.isAppActivated();
      console.log('RES');

      setIsAppActivated(!!res[0]['COUNT(*)']);
    };
    checkAppStatus();
  }, []);

  if (account) {
    return (
      <Container maxWidth="sm">
        <Card elevation={10} sx={{ p: 5, mt: '30%' }}>
          <Typography variant="h5">Your credentials :</Typography>
          <Typography variant="body2" color="text.secondary">
            please make sure to save a copy of your credentials .
          </Typography>
          <Card variant="outlined" sx={{ p: 2, my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              username :
            </Typography>
            <Typography gutterBottom variant="h6">
              {account?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              password :
            </Typography>
            <Typography gutterBottom variant="h6">
              {account?.password}
            </Typography>
          </Card>
          <Stack>
            <Button variant="contained" onClick={() => navigate('/')}>
              Go to login
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }
  return (
    <Container maxWidth="sm">
      <Card elevation={10} sx={{ p: 5, mt: '30%' }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit(activate)}>
          <Typography gutterBottom variant="h5">
            {isAppActivated ? 'Your app is already activated' : 'Activation'}
          </Typography>
          <Controller
            name="key"
            control={control}
            rules={{
              pattern: {
                value: /^[A-Za-z0-9]*$/,
                message: 'Only letters and numbers are allowed.',
              },
              required: 'Activation key is required.',
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="activation key"
                error={!!errors.key}
                helperText={<> {errors.key?.message}</>}
                disabled={isAppActivated}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isAppActivated}
          >
            Activate
          </Button>
          <Typography>
            Already activated the app ?{' '}
            <Link component="button" onClick={() => navigate('/')}>
              Login
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Container>
  );
}
