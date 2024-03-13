import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import { Account } from 'types';
import AccountsTable from './AccountsTable';
import AccountForm from './AccountForm';

const defaultValues = {
  username: '',
  password: '',
  permission: '',
  phoneNumber: '',
  role: '',
  status: '',
  createdAt: '',
};

function Accounts() {
  const [openCreateAccount, setOpenCreateAccount] = React.useState(false);
  const [editAccount, setEditAccount] = React.useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const formMethods = useForm({
    defaultValues,
  });

  const getAccounts = async () => {
    const res = await window.electron.getAllAccounts();
    setAccounts(res);
  };

  React.useEffect(() => {
    getAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!openCreateAccount) {
      setEditAccount(null);
      formMethods.reset(defaultValues);
    }
  }, [openCreateAccount]);

  return (
    <>
      <AccountsTable
        accounts={accounts}
        getAccounts={getAccounts}
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
          formMethods={formMethods}
        />
      </Dialog>
    </>
  );
}
export default Accounts;
