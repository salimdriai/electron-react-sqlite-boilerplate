import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import Chart from 'react-apexcharts';
import { Sex, User } from 'types';

const useChartOptions = (labels: string[]) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
    },
    colors: [theme.palette.primary.dark, theme.palette.secondary.dark],
    dataLabels: {
      enabled: false,
    },
    labels,
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    states: {
      active: {
        filter: {
          type: 'none',
        },
      },
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      fillSeriesColor: false,
    },
  };
};

const iconMap: any = {
  Male: (
    <SvgIcon>
      <EmojiEmotionsIcon />
    </SvgIcon>
  ),
  Female: (
    <SvgIcon>
      <EmojiEmotionsIcon />
    </SvgIcon>
  ),
};

function SexChart({ users }: { users: User[] }) {
  const [sexSeries, setSexSeries] = useState([0, 0]);
  const { t } = useTranslation();
  const labels = [t('info.male'), t('info.female')];
  const chartOptions = useChartOptions(labels);

  useEffect(() => {
    const getSeries = async () => {
      let males = 0;
      let females = 0;

      if (!Array.isArray(users)) return toast.error('Cant get users !');

      users.forEach((user: User) => {
        // @ts-ignore
        if (user.sex === Sex.Male) {
          males += 1;
        }
        // @ts-ignore
        if (user.sex === Sex.Female) {
          females += 1;
        }
      });

      const malePercentage = ((100 * males) / users.length).toFixed(2);
      const femalePercentage = ((100 * females) / users.length).toFixed(2);

      setSexSeries([
        Number(malePercentage) || 0,
        Number(femalePercentage) || 0,
      ]);
      return null;
    };
    if (users) {
      getSeries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      <CardHeader title={t('info.sex')} />
      <CardContent>
        <Chart
          height="250px"
          options={chartOptions}
          series={sexSeries}
          type="donut"
          width="100%"
        />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          {sexSeries.map((item, index) => {
            const label = labels[index];

            return (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {iconMap[label]}
                <Typography sx={{ my: 1 }} variant="h6">
                  {label}
                </Typography>
                <Typography color="text.secondary" variant="subtitle2">
                  {item}%
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SexChart;
