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
  monthPrice: 0,
  sessionPrice: 0,
  sessionsPerMonth: 0,
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
      (v) => v === '' || v === 0
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
          {Object.keys(newPlan).map(
            (key) =>
              key !== 'id' && (
                <TextField
                  type={key === 'name' ? 'text' : 'number'}
                  name={key}
                  onChange={onChange}
                  // @ts-ignore
                  defaultValue={newPlan[key]}
                  label={t(key)}
                  // @ts-ignore
                  value={newPlan[key]}
                />
              )
          )}
          <Button variant="contained" onClick={savePlan}>
            Save
          </Button>
        </Stack>
      </Card>
    </CardContent>
  );
}

export default NewPlan;
