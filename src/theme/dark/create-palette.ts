// import { common } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { error, indigo, info, neutral, success, warning } from './colors';

export default function createPalette() {
  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[600], 0.58),
      disabledBackground: alpha(neutral[900], 0.12),
      focus: alpha(neutral[900], 0.16),
      hover: alpha(neutral[900], 0.04),
      selected: alpha(neutral[900], 0.12),
    },
    background: {
      default: '#141627',
      paper: '#1C1F36',
    },
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
