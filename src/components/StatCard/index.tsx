import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { StatCardProps } from '../../types';

export default function StatCard(
  props: Partial<StatCardProps> & { valueTag?: string }
) {
  const {
    difference,
    positive = false,
    value,
    label,
    icon,
    color,
    img,
    maxWidth = '300px',
    valueTag = 'h3',
  } = props;

  return (
    <Card
      sx={{
        height: '100%',
        flex: 1,
        maxWidth,
        backgroundImage: `url(${img})`, // Set the background image correctly
        backgroundSize: 'cover', // Optional: Set the background size as needed
      }}
    >
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {label}
            </Typography>
            <Typography variant={valueTag as any} fontWeight={800}>
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: color,
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon sx={{ color: '#fff' }}>{icon}</SvgIcon>
          </Avatar>
        </Stack>
        {difference && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon color={positive ? 'success' : 'error'} fontSize="small">
                {positive ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </SvgIcon>
              <Typography
                color={positive ? 'success.main' : 'error.main'}
                variant="body2"
              >
                {difference}%
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              Since last month
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
