import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Subscription, User } from 'types';
import Info from './info';
import Subscriptions from './subscriptions';
import { userDefaultValues } from './helpers';

export interface IForm extends User {
  subscriptions: Subscription[];
}

const UserForm = () => {
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

  const saveSubscriptions = async (subs: Subscription[]) => {
    const userId = formMethods.watch('id');
    const promises = subs.map((sub) => {
      if (sub.id) {
        return window.electron.updateSubscription({ ...sub, userId });
      }
      return window.electron.createSubscription({ ...sub, userId });
    });

    const deletedSubsPromises = deletedSubscriptions.map((id) => {
      return window.electron.deleteSubscription(id);
    });

    await Promise.all([...promises, ...deletedSubsPromises]);
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
      await saveSubscriptions(subscriptions);
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
      <Stack direction="row" spacing={2} mb={2}>
        <Info isEditMode={isEditMode} formMethods={formMethods} />
        <Subscriptions
          subscriptions={subscriptions}
          setSubscriptions={setSubscriptions}
          setDeletedSubscriptions={setDeletedSubscriptions}
        />
      </Stack>
      <Button type="submit" size="large" variant="contained">
        {isEditMode ? t('actions.update') : t('actions.register')}
      </Button>
    </Stack>
  );
};

export default UserForm;
