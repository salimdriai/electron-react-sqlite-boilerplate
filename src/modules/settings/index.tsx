import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import AddIcon from '@mui/icons-material/Add';

import { Themes, Subscription, Settings as SettingsType, Lang } from 'types';
import { useAppDispatch, useAppSelector } from 'features/store';
import { updateSettings } from 'features/settings/reducers';
import { AdminGuard } from 'layout/AdminGuard';

import SubscriptionCard from './SubscriptionCard';
import NewSubscription from './NewSubscription';
import GymInfo from './GymInfo';
import Language from './Language';
import Theme from './Theme';
import DeleteSubscriptionModal from './DeleteSubscriptionModal';

const newSubInitialState = {
  name: 'new subscription',
  monthPrice: 0,
  sessionPrice: 0,
  sessionsPerMonth: 0,
};

function Settings() {
  const { settings } = useAppSelector((state) => state.settings);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [newSettings, setNewSettings] = useState<SettingsType>({ ...settings });
  const [newSub, setNewSub] = useState<Subscription>(newSubInitialState);
  const [showNewSubForm, setShowNewSubForm] = useState<boolean>(false);

  const [subDeletion, setSubDeletion] = useState({
    modalOpen: false,
    subIndex: 0,
  });

  const handleNewSubChange = (e: any) => {
    const { name, value } = e.target;
    setNewSub({ ...newSub, [name]: Number(value) || value });
  };

  const handleDeleteSubscription = () => {
    const data = {
      ...newSettings,
      subscriptions: newSettings.subscriptions.filter(
        (sub, i) => i !== subDeletion.subIndex
      ),
    };
    setNewSettings(data);

    dispatch(updateSettings(data))
      .unwrap()
      .then(() => toast.success('Settings successfuly deleted .'))
      .catch((err) => toast.error(err));

    setSubDeletion({ modalOpen: false, subIndex: 0 });
  };

  const handleSubscriptionFieldChange = (index: number) => (e: any) => {
    const { name, value } = e.target;
    const updatedSubs: any = [...newSettings.subscriptions];

    updatedSubs[index] = {
      ...updatedSubs[index],
      [name]: Number(value) || value,
    };

    setNewSettings({
      ...newSettings,
      subscriptions: updatedSubs,
    });
  };

  const handlehandleSaveChanges = (e: any) => {
    e.preventDefault();

    const data = { ...newSettings };
    if (showNewSubForm) {
      data.subscriptions = [newSub, ...newSettings.subscriptions];
    }
    dispatch(updateSettings(data))
      .unwrap()
      .then(() => {
        toast.success('Settings successfuly updated .');
        window.location.reload();
        return null;
      })
      .catch((err) => toast.error(err));
  };

  const switchTheme = async (e: any) => {
    const isDark = e.target.checked;
    const updatedSettings = { ...settings };
    updatedSettings.theme = isDark ? Themes.Dark : Themes.Light;
    dispatch(updateSettings(updatedSettings));
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Language
          value={newSettings.lang}
          onChange={(e) =>
            setNewSettings({ ...newSettings, lang: e.target.value as Lang })
          }
        />

        <Theme
          checked={settings.theme === Themes.Dark}
          onChange={switchTheme}
        />
        <AdminGuard>
          <GymInfo
            value={newSettings?.gymName}
            onChange={(e) =>
              setNewSettings({ ...newSettings, gymName: e.target.value })
            }
          />
        </AdminGuard>
      </Stack>
      <AdminGuard>
        <Card variant="outlined">
          <CardHeader
            title={t('subscriptions.subscriptions')}
            action={
              <Button
                onClick={() => setShowNewSubForm(!showNewSubForm)}
                variant="outlined"
                size="small"
                endIcon={!showNewSubForm && <AddIcon />}
              >
                {showNewSubForm ? 'Cancel' : 'Add new subscription'}
              </Button>
            }
          />

          {showNewSubForm && (
            <NewSubscription newSub={newSub} onChange={handleNewSubChange} />
          )}

          <CardContent>
            {newSettings?.subscriptions.map((subscription, i) => (
              <SubscriptionCard
                subscription={subscription}
                onChange={handleSubscriptionFieldChange(i)}
                onClickDelete={() =>
                  setSubDeletion({ modalOpen: true, subIndex: i })
                }
              />
            ))}
          </CardContent>
        </Card>
      </AdminGuard>
      <Stack direction="row" justifyContent="end" spacing={2}>
        <Button
          onClick={handlehandleSaveChanges}
          variant="contained"
          size="large"
          color="success"
        >
          {t('actions.save')}
        </Button>
      </Stack>

      <DeleteSubscriptionModal
        open={subDeletion.modalOpen}
        onClose={() => setSubDeletion({ modalOpen: false, subIndex: 0 })}
        onClickDelete={handleDeleteSubscription}
      />
    </Stack>
  );
}

export default Settings;
