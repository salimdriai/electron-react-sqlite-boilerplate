import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from 'features/store';
import { User } from 'types';
import { updateUser } from 'features/users/reducers';

const titles = ['message', 'subscriptionExpired', 'aboutToExpire'];

const Notify = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');

  const { settings } = useAppSelector((s) => s.settings);
  const { t } = useTranslation();
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: { title: '', content: '' },
  });

  const dispatch = useAppDispatch();

  const send = async ({ title, content: body }: any) => {
    const userId = `${settings?.appId ?? 'b-gym'}:${user.id}`;

    if (!url) throw new Error('API URL NOT FOUND !');
    if (!userId) throw new Error('USER ID NOT FOUND !');

    try {
      setIsLoading(true);
      const data = { userId, title, body };
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        toast.success('Message sent !');
        await dispatch(
          updateUser({
            user: { ...user, lastNotified: new Date().toLocaleDateString() },
            id: user.id,
          })
        );

        setIsOpen(false);
      } else {
        toast.warning(t('info.userMustScan'));
      }
      setIsLoading(false);
    } catch (error) {
      toast.error('Somthing went wrong !');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const BASE_URL = await window.electron.getStoreData('apiUrl');
      if (BASE_URL) {
        setUrl(`${BASE_URL}/notifications`);
      }
    })();
  }, []);

  return (
    <>
      <Button
        startIcon={<ForwardToInboxIcon />}
        onClick={() => setIsOpen(true)}
        variant="contained"
      >
        {t('notifications.sendMessage')}
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => !isLoading && setIsOpen(false)}
        component="form"
        onSubmit={handleSubmit(send)}
      >
        <DialogTitle> {t('notifications.sendMessage')}</DialogTitle>
        <DialogContent>
          <Stack minWidth={400} py={1} spacing={2}>
            <Autocomplete
              freeSolo
              options={titles.map(
                (option) => `${t(`notifications.${option}`)}`
              )}
              onSelect={(e) => setValue('title', (e.target as any).value)}
              renderInput={(params) => (
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...params}
                      {...field}
                      label={t('notifications.title')}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="content"
              control={control}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    multiline
                    rows={4}
                    label={t('notifications.content')}
                    placeholder={t('notifications.max')}
                    inputProps={{ maxLength: 200 }}
                  />
                );
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 2 }}>
          <Button disabled={isLoading} onClick={() => setIsOpen(false)}>
            {' '}
            {t('actions.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            endIcon={<SendIcon />}
          >
            {' '}
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              t('notifications.send')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Notify;
