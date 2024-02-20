import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '@mui/material/Chip';
import { formatDate } from 'utils';

const oneDayMs = 86_400_000;

const RemainigDays = ({
  date,
  size = 'small',
}: {
  date: string;
  size?: 'small' | 'medium';
}) => {
  const [result, setResult] = useState({
    label: '+ 7 days remaining',
    color: 'success',
  });

  const { t } = useTranslation();
  useEffect(() => {
    const calcutateDays = (d: any) => {
      const endsAt = new Date(d).getTime();
      const now = new Date().getTime();
      const gap = endsAt - now;
      if (gap < 0) {
        setResult({
          label: `${t('subscriptions.expiredAt')} ${formatDate(d)}`,
          color: 'error',
        });
      } else if (gap < oneDayMs) {
        setResult({ label: t('subscriptions.expireIn1Day'), color: 'warning' });
      } else if (gap < oneDayMs * 3) {
        setResult({
          label: t('subscriptions.expireIn3Days'),
          color: 'warning',
        });
      } else if (gap < oneDayMs * 7) {
        setResult({ label: t('subscriptions.expireIn7Days'), color: 'info' });
      }
    };
    calcutateDays(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <Chip
      size={size}
      component="span"
      label={result.label}
      // @ts-ignore
      color={result.color}
      sx={{ mr: 0.5 }}
    />
  );
};

export default RemainigDays;
