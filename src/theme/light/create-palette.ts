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
      default: '#dddddd',
      paper: '#eeeeee',
    },

    divider: '#cccccc',
    error,
    info,
    mode: 'light',
    neutral,
    primary: indigo,
    secondary: {
      main: '#FC6736',
    },
    success,
    text: {
      primary: neutral[900],
      secondary: neutral[500],
      disabled: alpha(neutral[900], 0.38),
    },
    warning,
  };
}
