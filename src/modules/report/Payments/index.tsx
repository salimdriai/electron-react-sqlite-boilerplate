import React from 'react';
import Stack from '@mui/material/Stack';
import { Payment } from 'types';
import PaymentsTable from './PaymentsTable';
import PaymentStats from './Stats';

const Payments = () => {
  const [payments, setPayments] = React.useState<Payment[]>([]);
  React.useEffect(() => {
    const getPayments = async () => {
      const res = await window.electron.getAllPayments();
      setPayments(res);
    };
    getPayments();
  }, []);

  return (
    <Stack direction="row" spacing={4}>
      <PaymentsTable payments={payments} />
      <PaymentStats payments={payments} />
    </Stack>
  );
};

export default Payments;
