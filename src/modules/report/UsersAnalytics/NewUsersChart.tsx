import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { toast } from 'react-toastify';
import { alpha, useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import { User } from 'types';

const useChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
    },
    colors: [
      theme.palette.secondary.main,
      alpha(theme.palette.secondary.main, 0.25),
    ],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      type: 'solid',
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '40px',
      },
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) =>
          value > 0 ? `${value} members` : `${value}`,
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
};

function NewUsersChart({ users }: { users: User[] }) {
  const chartOptions = useChartOptions();
  const { t } = useTranslation();
  const [series, setSeries] = useState<any>({
    currentYearSeries: new Array(12).fill(0),
    lastYearSeries: new Array(12).fill(0),
  });

  useEffect(() => {
    const getSeries = async () => {
      const currentYearSubs = new Array(12).fill(0);
      const lastYearSubs = new Array(12).fill(0);

      const currentYear = new Date().getFullYear();
      const lastYear = currentYear - 1;

      if (!Array.isArray(users)) return toast.error('somthing went wrong !');

      users.forEach((user: User) => {
        const registrationYear = new Date(user.registeredAt).getFullYear();
        const registrationMonth = new Date(user.registeredAt).getMonth();

        if (registrationYear === currentYear) {
          currentYearSubs[registrationMonth] += 1;
        }
        if (registrationYear === lastYear) {
          lastYearSubs[registrationMonth] += 1;
        }
      });
      setSeries({
        currentYearSeries: currentYearSubs,
        lastYearSeries: lastYearSubs,
      });
      return null;
    };

    getSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 2 }}>
      <CardHeader title={t('subscriptions.new')} />
      <CardContent>
        <Chart
          height={300}
          options={chartOptions}
          series={[
            {
              name: 'This year',
              data: series.currentYearSeries,
            },
            {
              name: 'Last year',
              data: series.lastYearSeries,
            },
          ]}
          type="bar"
          width="100%"
        />
      </CardContent>
      <Divider />
    </Card>
  );
}

export default NewUsersChart;
