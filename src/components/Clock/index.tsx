import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import './index.css';

function Clock() {
  const [time, setTime] = useState('');
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      let hr: string | number = date.getHours();
      let min: string | number = date.getMinutes();
      let sec: string | number = date.getSeconds();
      let session = 'AM';

      hr = hr === 0 ? 12 : hr;
      if (hr > 12) {
        hr -= 12;
        session = 'PM';
      }
      hr = hr < 10 ? `0${hr}` : hr;
      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;

      const currentTime = `${hr}:${min}:${sec} ${session}`;
      setTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      sx={{
        width: 540,
        p: 1,
        px: 3,
        backgroundColor: '#000',
        border: '1px solid #5ceea7',
      }}
      component={Stack}
      justifyContent="center"
    >
      <div id="clock">{time === '' ? '00:00:00 PM' : time}</div>
      <div id="date">{today}</div>
    </Card>
  );
}

export default Clock;
