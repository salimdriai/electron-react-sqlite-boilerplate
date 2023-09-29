/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';

import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useAppDispatch } from '../../features/store';
import { logAccount } from '../../features/authentication/reducers';
import logo from '../../../assets/icon.png';

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const onSubmit = ({ username, password }: any) => {
    dispatch(logAccount({ username, password }));
  };

  const navigateToActivation = () => {
    navigate('/activation');
  };

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
          <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
            <Typography variant="h2">{t('actions.login')}</Typography>
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <TextField {...field} label={t('info.username')} />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('info.password')}
                  type={isPasswordVisible ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                          edge="end"
                        >
                          {isPasswordVisible ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Button size="large" variant="contained" type="submit">
              {t('actions.submit')}
            </Button>
          </Stack>
          <Stack mt={2}>
            <Typography>
              {t('common.notActivated')}{' '}
              <Link component="button" onClick={navigateToActivation}>
                {t('actions.activate')}
              </Link>
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}
