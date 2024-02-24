import * as React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme, value = 0 }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor:
      value < 100 ? theme.palette.success.dark : theme.palette.error.main,
  },
}));

const ProgressBar = ({ progress }: { progress: number }) => {
  return <BorderLinearProgress variant="determinate" value={progress} />;
};

export default ProgressBar;
