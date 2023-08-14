import React from 'react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SyncIcon from '@mui/icons-material/Sync';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
  Button,
} from '@mui/material';
import Chart from 'react-apexcharts';

const useChartOptions = (labels: string[]) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ],
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
  Desktop: (
    <SvgIcon>
      <EmojiEmotionsIcon />
    </SvgIcon>
  ),
  Tablet: (
    <SvgIcon>
      <EmojiEmotionsIcon />
    </SvgIcon>
  ),
  Phone: (
    <SvgIcon>
      <EmojiEmotionsIcon />
    </SvgIcon>
  ),
};

function OverviewTraffic() {
  const labels = ['Desktop', 'Tablet', 'Phone'];
  const chartOptions = useChartOptions(labels);

  return (
    <Card sx={{ height: '100%', flex: 1 }}>
      <CardHeader
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={
              <SvgIcon fontSize="small">
                <SyncIcon />
              </SvgIcon>
            }
          >
            Sync
          </Button>
        }
        title="Sales"
      />
      <CardContent>
        <Chart
          height={230}
          options={chartOptions}
          series={[63, 15, 22]}
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
          {[63, 15, 22].map((item, index) => {
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

export default OverviewTraffic;
