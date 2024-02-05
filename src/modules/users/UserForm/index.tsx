import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
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

  const { t } = useTranslation();
  const { state } = useLocation();
  const isEditMode = React.useMemo(() => !!state, [state]);

  const formMethods = useForm<IForm>({
    defaultValues: { ...userDefaultValues },
  });

  const saveSubscriptions = async (subs: Subscription[]) => {
    const userId = formMethods.watch('id');
    console.log('eubs', subscriptions);
    const promises = subs.map((sub) =>
      window.electron.createSubscription({ ...sub, userId })
    );
    await Promise.all(promises);
  };

  const saveUser = async (data: User) => {
    try {
      await window.electron.insertUser(data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const onSubmit = async (data: IForm) => {
    // await saveUser(data);
    await saveSubscriptions(subscriptions);
  };

  const onError = (err: any) => {
    console.log('ERR', err);
  };

  return (
    <Stack
      component="form"
      onSubmit={formMethods.handleSubmit(onSubmit, onError)}
    >
      <Stack direction="row" spacing={2} mb={2}>
        <Info isEditMode={isEditMode} formMethods={formMethods} />
        <Subscriptions
          formMethods={formMethods}
          subscriptions={subscriptions}
          setSubscriptions={setSubscriptions}
        />
      </Stack>
      <Button type="submit" size="large" variant="contained">
        {isEditMode ? t('actions.update') : t('actions.register')}
      </Button>
    </Stack>
  );
};

export default UserForm;
