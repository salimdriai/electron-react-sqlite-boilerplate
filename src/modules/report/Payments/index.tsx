import React from 'react';
import Stack from '@mui/material/Stack';
import { FreeSession, Payment } from 'types';
import PaymentsTable from './PaymentsTable';
import PaymentStats from './Stats';
import PaymentDetails from './PaymentDetails';

const Payments = () => {
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [freeSessions, setFreeSessions] = React.useState<FreeSession[]>([]);
  React.useEffect(() => {
    const getPayments = async () => {
      const paymentsRes = await window.electron.getAllPayments();
      const freeSessionsRes = await window.electron.getFreeSessions();
      setPayments(paymentsRes);
      setFreeSessions(freeSessionsRes);
    };
    getPayments();
  }, []);

  return (
    <Stack spacing={4}>
      <PaymentStats payments={payments} freeSessions={freeSessions} />
      <Stack direction="row" spacing={2} alignItems="start">
        <PaymentsTable payments={payments} />
        <PaymentDetails payments={payments} freeSessions={freeSessions} />
      </Stack>
    </Stack>
  );
};

export default Payments;
