import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Permission, Subscription, User, Payment } from 'types';
import UserSubscription from 'components/Subscription';
import { useAppDispatch, useAppSelector } from 'features/store';
import { fetchUsers } from 'features/users/reducers';
import { createPayment } from 'features/payments/reducers';
import AddSubscriptions from './AddSubscriptions';
import { userDefaultValues } from './helpers';
import Info from './Info';

export interface IForm extends User {
  subscriptions: Subscription[];
}

const UserForm = () => {
  const [openAddSubscription, setOpenAddSubscription] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [deletedSubscriptions, setDeletedSubscriptions] = useState<string[]>(
    []
  );

  const [payment, setPayment] = useState<{
    paid: null | number;
    remaining: null | number;
  }>({
    paid: null,
    remaining: null,
  });

  const { t } = useTranslation();
  const { state } = useLocation();
  const isEditMode = React.useMemo(() => !!state, [state]);
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((s) => s.users);

  const formMethods = useForm<IForm>({
    defaultValues: { ...userDefaultValues },
  });

  const cancelAddsubscription = async () => {
    const userId = formMethods.watch('id');
    if (userId) {
      const subs = await window.electron.getUsersubscriptions(userId);
      setSubscriptions(subs);
    } else {
      setSubscriptions([]);
    }
    setOpenAddSubscription(false);
  };

  const savePayment = async (sub: Subscription) => {
    const user = formMethods.watch();
    const paymentData: Payment = {
      subscriptionId: sub.id as string,
      userId: sub.userId,
      username: `${user.firstName} ${user.lastName}`,
      amount: payment.paid,
      remaining: payment.remaining,
      paidAt: new Date().toDateString(),
      startedAt: sub.startedAt,
      endsAt: sub.endsAt,
    };
    dispatch(createPayment(paymentData));
  };

  const refetchData = async (updatedSub: any) => {
    const updateSubscriptions = subscriptions.map((sub) =>
      sub.id === updatedSub.id ? updatedSub : sub
    );
    // const data = await window.electron.getOneUser(formMethods.watch('id'));
    setSubscriptions(updateSubscriptions);
  };

  const createSubscription = async (sub: Subscription) => {
    const subId = await window.electron.createSubscription(sub);
    await savePayment({ ...sub, id: subId });
  };

  const saveSubscriptions = async () => {
    const userId = formMethods.watch('id');
    if (!userId) {
      toast.error('user ID missing !');
      return;
    }

    const promises = subscriptions.map((sub) => {
      if (sub.id) {
        return window.electron.updateSubscription({ ...sub, userId });
      }
      return createSubscription({ ...sub, userId });
    });

    const deletedSubsPromises = deletedSubscriptions.map((id) => {
      return window.electron.deleteSubscription(id);
    });

    await Promise.all([...promises, ...deletedSubsPromises]);
    toast.success('Success');
    cancelAddsubscription();
  };

  const saveUser = async (data: User) => {
    if (isEditMode) {
      await window.electron.updateUser(data);
    } else {
      await window.electron.createUser({
        ...data,
        registeredAt: new Date().toDateString(),
      });
    }
  };

  const onSubmit = async (data: IForm) => {
    try {
      const ids = users.map(({ id }) => id);
      const userId = formMethods.watch('id');
      if (ids.includes(userId) && !isEditMode) {
        toast.error('ID Exist !');
        return;
      }
      await saveUser(data);
      toast.success('Success');
    } catch (error) {
      toast.error('Something went wrong');
      console.log('ERRRR', error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const data: User = await window.electron.getOneUser(state.id);
      formMethods.reset(data);
      setSubscriptions(data.subscriptions || []);
    };
    if (state?.id) {
      getUser();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    dispatch(fetchUsers(Permission.All));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
      <Stack direction="row" spacing={4} mb={2}>
        <Info isEditMode={isEditMode} formMethods={formMethods} />

        <Stack flex={3} spacing={2} component={Card} variant="outlined" p={2}>
          <Typography variant="h6" gutterBottom>
            {t('subscriptions.subscriptions')}
          </Typography>

          {subscriptions.length === 0 ? (
            <Card variant="outlined">
              <Typography align="center" sx={{ py: 4 }}>
                user have no subscriptions
              </Typography>
            </Card>
          ) : (
            subscriptions.map((sub) => (
              <UserSubscription
                key={sub.id}
                subscription={sub}
                user={formMethods.watch()}
                refetchData={refetchData}
              />
            ))
          )}

          <Button
            onClick={() => setOpenAddSubscription(true)}
            variant="outlined"
            color="secondary"
            startIcon={subscriptions.length ? <EditIcon /> : <AddIcon />}
          >
            {subscriptions.length
              ? t('subscriptions.edit')
              : t('subscriptions.add')}
          </Button>
        </Stack>
        <Dialog
          sx={{
            '& .MuiPaper-root': {
              maxWidth: 'unset',
              minWidth: '800px',
              overflow: 'visible',
            },
          }}
          open={openAddSubscription}
          onClose={cancelAddsubscription}
        >
          <AddSubscriptions
            saveSubscriptions={saveSubscriptions}
            subscriptions={subscriptions}
            setSubscriptions={setSubscriptions}
            setDeletedSubscriptions={setDeletedSubscriptions}
            cancelAddsubscription={cancelAddsubscription}
            payment={payment}
            setPayment={setPayment}
          />
        </Dialog>
      </Stack>
    </Stack>
  );
};

export default UserForm;
