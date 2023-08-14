import React, { useState, useEffect } from 'react';
import Dashbaord from '../../modules/dashboard';
import PageToolbar from '../../components/Toolbar';
import PageSection from '../../layout/PageSection';

export default function DashboardPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  return (
    <>
      <PageToolbar
        title={`${new Date().toLocaleDateString()} - ${hours}:${minutes}:${seconds}`}
      />
      <PageSection>
        <Dashbaord />
      </PageSection>
    </>
  );
}
