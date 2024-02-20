import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Account } from 'types';
import Accounts from './Accounts';
import DataImport from './DataImport';
import AccountForm from './AccountForm';
import SubscriptionPlans from './SubscriptionPlans';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Administration({
  openCreateAccount,
  setOpenCreateAccount,
}: {
  openCreateAccount: boolean;
  setOpenCreateAccount: (arg: boolean) => void;
}) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getAccounts = async () => {
    const res = await window.electron.getAllAccounts();
    setAccounts(res);
  };

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <Stack spacing={4}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label={t('settings.plans.plans')} {...a11yProps(0)} />
        <Tab label={t('administration.accounts')} {...a11yProps(1)} />
        <Tab label={t('administration.dataImport')} {...a11yProps(2)} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <SubscriptionPlans />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Accounts
          accounts={accounts}
          setEditAccount={setEditAccount}
          setOpenCreateAccount={setOpenCreateAccount}
        />
        <Dialog
          open={openCreateAccount}
          onClose={() => setOpenCreateAccount(false)}
        >
          <AccountForm
            closeDialog={() => setOpenCreateAccount(false)}
            editAccount={editAccount}
            getAccounts={getAccounts}
          />
        </Dialog>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <DataImport />
      </CustomTabPanel>
    </Stack>
  );
}
export default Administration;
