import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import AddIcon from '@mui/icons-material/Add';

import { SubscriptionPlan } from 'types';
import { AdminGuard } from 'layout/AdminGuard';

import NewPlan from './NewPlan';
import PlanCard from './PlanCard';

const SubscriptionPlans = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);

  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);

  const [showNewPlanForm, setShowNewPlanForm] = useState<boolean>(false);
  const { t } = useTranslation();

  const getSubscriptionPlans = async () => {
    try {
      const plans = await window.electron.getSubscriptionPlans();
      setSubscriptionPlans(plans || []);
    } catch (error) {
      console.log('ERR', error);
    }
  };

  const updatePlan = async () => {
    await window.electron.updateSubscriptionPlan(editPlan as SubscriptionPlan);
    setEditPlan(null);
    getSubscriptionPlans();
  };

  useEffect(() => {
    getSubscriptionPlans();
  }, [showNewPlanForm]);

  return (
    <AdminGuard>
      <Card variant="outlined">
        <CardHeader
          title={t('subscriptions.subscriptions')}
          action={
            <Button
              onClick={() => setShowNewPlanForm(!showNewPlanForm)}
              variant="outlined"
              endIcon={!showNewPlanForm && <AddIcon />}
            >
              {showNewPlanForm ? t('actions.cancel') : t('settings.plans.add')}
            </Button>
          }
        />

        {showNewPlanForm && <NewPlan setShowNewPlanForm={setShowNewPlanForm} />}

        <CardContent>
          <Grid container spacing={2}>
            {subscriptionPlans.map((subscriptionPlan) => (
              <Grid item xs={6} key={subscriptionPlan.id}>
                <PlanCard
                  updatePlan={updatePlan}
                  editPlan={editPlan}
                  setEditPlan={setEditPlan}
                  subscriptionPlan={subscriptionPlan}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </AdminGuard>
  );
};

export default SubscriptionPlans;
