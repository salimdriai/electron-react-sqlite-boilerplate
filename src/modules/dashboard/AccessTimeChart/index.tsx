import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { useTheme, alpha } from '@mui/material/styles';
import { User } from 'types';

const generateDateTimeCategory = () => {
  const startDate = new Date(); // Current date and time
  startDate.setHours(6, 0, 0, 0); // Set the time to 5:00 AM

  const endDate = new Date(); // Current date and time
  endDate.setHours(23, 59, 59, 999); // Set the time to 11:59:59 PM

  const dateTimeArray = [];
  const currentDate = startDate;

  while (currentDate <= endDate) {
    dateTimeArray.push(currentDate.toISOString()); // Add the date and time to the array
    currentDate.setMinutes(currentDate.getMinutes() + 90); // Increment by 90 minutes
  }

  return dateTimeArray;
};

const xaxisColors = (color: string) => [...Array(17)].map(() => color);

const useChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      height: 350,
    },
    colors: [
      theme.palette.success.light,
      alpha(theme.palette.success.light, 0.25),
    ],

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories: generateDateTimeCategory(),
      labels: {
        style: {
          colors: xaxisColors(theme.palette.text.primary),
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [theme.palette.text.primary],
        },
      },
    },
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      enabled: false,
    },
  };
};

function AccessTimeChart({
  latestEnteredUsers,
}: {
  latestEnteredUsers: User[];
}) {
  const chartOptions = useChartOptions();
  const { t } = useTranslation();

  const [series, setSeries] = useState<any>([
    {
      name: 'series1',
      data: [],
    },
  ]);

  useEffect(() => {
    const getSeries = async () => {
      const data: Array<number> = [];
      const categories = generateDateTimeCategory();
      const timeStamps = latestEnteredUsers.map(
        ({ lastEntryTimestamp }) => lastEntryTimestamp
      );

      categories.forEach((category, i) => {
        const categoryTimeStamp = new Date(category).getTime();
        const nextCategoryTimeStamp = new Date(categories[i + 1]).getTime();

        data[i] = 0;
        timeStamps.forEach((timeStamp) => {
          if (
            timeStamp >= categoryTimeStamp &&
            timeStamp < nextCategoryTimeStamp
          ) {
            data[i] += 1;
          }
        });
      });

      const newSeries = [{ name: 'series1', data }];
      setSeries(newSeries);
    };

    getSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestEnteredUsers]);

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        flex: 2,
      }}
    >
      <CardHeader title={t('user.entranceTime')} />
      <CardContent>
        <Chart
          height={300}
          options={chartOptions as any}
          series={series}
          type="area"
          width="100%"
        />
      </CardContent>
      <Divider />
    </Card>
  );
}

export default AccessTimeChart;
