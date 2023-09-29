import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from '@mui/material';
import Chart from 'react-apexcharts';
import { Sex, User } from 'types';
import { useAppSelector } from 'features/store';

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

function SexChart() {
  const [sexSeries, setSexSeries] = useState([0, 0]);
  const { permission } = useAppSelector((state) => state.authentication);
  const { t } = useTranslation();
  const labels = [t('info.male'), t('info.female')];
  const chartOptions = useChartOptions(labels);

  useEffect(() => {
    const getSeries = async () => {
      let males = 0;
      let females = 0;

      const allUsers = await window.electron.getAllUsers(permission);

      if (!Array.isArray(allUsers)) return toast.error('Cant get users !');

      allUsers.forEach((user: User) => {
        // @ts-ignore
        if (user.sex === Sex.Male) {
          males += 1;
        }
        // @ts-ignore
        if (user.sex === Sex.Female) {
          females += 1;
        }
      });
      setSexSeries([males, females]);
      return null;
    };
    getSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
