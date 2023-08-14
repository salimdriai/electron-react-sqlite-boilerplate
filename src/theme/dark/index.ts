import { createTheme as createMuiTheme } from '@mui/material/styles';
import createPalette from './create-palette';
import createComponents from './create-components';
import createTypography from './create-typography';
import createShadows from './create-shadows';

export default function createTheme() {
  const palette = createPalette() as any;
  const components = createComponents({ palette }) as any;
  const shadows = createShadows() as any;
  const typography = createTypography() as any;

  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440,
      },
    },
    components,
    palette,
    shadows,
    shape: {
      borderRadius: 8,
    },
    typography,
  });
}
