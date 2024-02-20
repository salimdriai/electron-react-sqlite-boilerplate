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
import { Subscription, User } from 'types';
import UserSubscription from 'components/Subscription';
import Info from './Info';
import AddSubscriptions from './AddSubscriptions';
import { userDefaultValues } from './helpers';

export interface IForm extends User {
  subscriptions: Subscription[];
}

const UserForm = () => {
  const [openAddSubscription, setOpenAddSubscription] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [deletedSubscriptions, setDeletedSubscriptions] = useState<string[]>(
    []
  );

  const { t } = useTranslation();
  const { state } = useLocation();
  const isEditMode = React.useMemo(() => !!state, [state]);

  const formMethods = useForm<IForm>({
    defaultValues: { ...userDefaultValues },
  });

  const cancelAddsubscription = () => setOpenAddSubscription(false);

  const refetchData = async (updatedSub: any) => {
    const updateSubscriptions = subscriptions.map((sub) =>
      sub.id === updatedSub.id ? updatedSub : sub
    );
    // const data = await window.electron.getOneUser(formMethods.watch('id'));
    setSubscriptions(updateSubscriptions);
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
      return window.electron.createSubscription({ ...sub, userId });
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
      await saveUser(data);
      toast.success('Success');
    } catch (error) {
      toast.error('Something went wrong');
      console.log('ERRRR', error);
    }
  };

  const onError = (err: any) => {
    console.log('ERR', err);
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

  return (
    <Stack
      component="form"
      onSubmit={formMethods.handleSubmit(onSubmit, onError)}
    >
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
          />
        </Dialog>
      </Stack>
    </Stack>
  );
};

export default UserForm;
