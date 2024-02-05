import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
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

  const [showNewPlanForm, setShowNewPlanForm] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const getSubscriptionPlans = async () => {
      try {
        const plans = await window.electron.getSubscriptionPlans();
        setSubscriptionPlans(plans || []);
      } catch (error) {
        console.log('ERR', error);
      }
    };
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
              size="small"
              endIcon={!showNewPlanForm && <AddIcon />}
            >
              {showNewPlanForm ? 'Cancel' : 'Add new subscription'}
            </Button>
          }
        />

        {showNewPlanForm && <NewPlan setShowNewPlanForm={setShowNewPlanForm} />}

        <CardContent>
          {subscriptionPlans.map((subscriptionPlan) => (
            <PlanCard subscriptionPlan={subscriptionPlan} />
          ))}
        </CardContent>
      </Card>
    </AdminGuard>
  );
};

export default SubscriptionPlans;
