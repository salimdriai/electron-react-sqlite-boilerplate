import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FreeSession as FreeSessionType, SubscriptionPlan } from 'types';
import { useAppDispatch, useAppSelector } from 'features/store';
import { fetchUsers } from 'features/users/reducers';

interface Props {
  freeSessionsModalOpen: boolean;
  onFreeSessionModalClose: () => void;
}

function FreeSession({
  freeSessionsModalOpen,
  onFreeSessionModalClose,
}: Props) {
  const [subscriptionsPlans, setSubscriptionsPlans] = useState<
    SubscriptionPlan[]
  >([]);

  const [selected, setSelected] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [fullName, setFullName] = useState({ firstName: '', lastName: '' });
  const [session, setSession] = React.useState<FreeSessionType | null>(null);

  const dispatch = useAppDispatch();
  const { permission } = useAppSelector((state) => state.authentication);

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value);
    const selectedSession = subscriptionsPlans.find(
      (plan) => plan.id === event.target.value
    );

    setSession((prev: any) => ({
      ...prev,
      plansIds: event.target.value,
      totalPaid: selectedSession?.sessionPrice,
      enteredAt: new Date().toISOString(),
      ...fullName,
    }));
  };

  const { t } = useTranslation();

  const handleChangeName = (e: any) => {
    setFullName((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSession = async () => {
    const allFreeSessions = await window.electron.getFreeSessions();
    if (allFreeSessions.length > 4) {
      toast.warning(t('info.trial.version.limit'));
      toast.info(t('info.contact.us'));
      return;
    }

    await window.electron.createFreeSessions(session as FreeSessionType);
    dispatch(fetchUsers(permission));
    toast.success('Success !');
    onFreeSessionModalClose();
  };

  useEffect(() => {
    const getPlans = async () => {
      setIsLoading(true);
      const res = await window.electron.getSubscriptionPlans();
      setSubscriptionsPlans(res);
      setIsLoading(false);
    };
    getPlans();
  }, []);

  return (
    <Modal
      open={freeSessionsModalOpen}
      onClose={onFreeSessionModalClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '80%',
        m: 'auto',
      }}
    >
      <Card sx={{ p: 5 }}>
        <Typography gutterBottom variant="h5">
          {t('common.freeSession')}
        </Typography>
        <Divider />

        <Stack direction="row" spacing={2} my={2}>
          <TextField
            value={fullName.firstName}
            label={t('info.firstname')}
            name="firstName"
            onChange={handleChangeName}
            fullWidth
          />
          <TextField
            value={fullName.lastName}
            label={t('info.lastname')}
            name="lastName"
            onChange={handleChangeName}
            fullWidth
          />
        </Stack>

        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            disabled={isLoading}
            value={selected}
            label="Type"
            onChange={handleChange}
          >
            {subscriptionsPlans.map((plan) => (
              <MenuItem key={plan.id} value={plan.id}>
                {`${plan.name} / ${plan.sessionPrice} DA`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack spacing={2} mt={2}>
          <Card sx={{ p: 1 }} variant="outlined">
            <Typography color="text.secondary" variant="h6" align="center">
              Total :{' '}
              <Typography variant="h5" component="span" color="secondary">
                {session?.totalPaid} DZD
              </Typography>
            </Typography>
          </Card>
          <Button onClick={handleAddSession} variant="contained" size="large">
            {t('actions.confirm')}
          </Button>
        </Stack>
      </Card>
    </Modal>
  );
}

export default FreeSession;
