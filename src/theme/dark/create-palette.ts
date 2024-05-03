// import { common } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { error, info, neutral, success, warning } from './colors';

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
      default: '#131314',
      paper: '#171d24',
    },
    error,
    info,
    mode: 'dark',
    neutral,
    primary: {
      main: '#FC6736',
    },
    secondary: {
      main: '#2B35Af',
    },
    success,
    text: {
      primary: '#ffffff',
      secondary: '#bbb',
      disabled: '#cccccc',
    },

    warning,
  };
}
