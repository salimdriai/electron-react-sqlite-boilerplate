// import { common } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { error, indigo, info, neutral, success, warning } from './colors';

export default function createPalette() {
  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[900], 0.38),
      disabledBackground: alpha(neutral[900], 0.12),
      focus: alpha(neutral[900], 0.16),
      hover: alpha(neutral[900], 0.04),
      selected: alpha(neutral[900], 0.12),
    },
    background: {
      default: '#1d232a',
      paper: '#2a323c',
    },
    // divider: '#F2F4F7',
    error,
    info,
    mode: 'dark',
    neutral,
    primary: indigo,
    success,
    text: {
      primary: '#ffffff',
      secondary: '#f3f4f7',
      disabled: '#cccccc',
    },

    warning,
  };
}
