import * as React from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { SubscriptionPlan } from 'types';

const newSubInitialState: SubscriptionPlan = {
  name: 'new subscription',
  monthPrice: undefined as any,
  sessionPrice: undefined as any,
  sessionsPerMonth: undefined as any,
};

function NewPlan({
  setShowNewPlanForm,
}: {
  setShowNewPlanForm: (open: boolean) => void;
}) {
  const [newPlan, setNewplan] = React.useState(newSubInitialState);
  const { t } = useTranslation();

  const onChange = (e: any) => {
    const { name, value } = e.target;
    setNewplan((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value),
    }));
  };

  const savePlan = async () => {
    const isValidData = !Object.values(newPlan).some(
      (v) => v === '' || v === undefined
    );

    if (!isValidData) {
      toast.error('invalid data !');
      return;
    }

    try {
      await window.electron.createSubscriptionPlan(newPlan);
      setShowNewPlanForm(false);
    } catch (error) {
      console.log('ERR', error);
    }
  };

  return (
    <CardContent>
      <Card sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" spacing={2} mt={2}>
          {Object.entries(newPlan).map(
            ([key, value]) =>
              key !== 'id' && (
                <TextField
                  key={key}
                  type={key === 'name' ? 'text' : 'number'}
                  name={key}
                  onChange={onChange}
                  label={t(`settings.plans.${key}`)}
                  value={value}
                  InputProps={{
                    ...(key !== 'name' && { endAdornment: <span>DA</span> }),
                  }}
                />
              )
          )}
          <Button variant="contained" onClick={savePlan}>
            {t('actions.save')}
          </Button>
        </Stack>
      </Card>
    </CardContent>
  );
}

export default NewPlan;
