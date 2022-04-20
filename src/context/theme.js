import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    // buttonWhite: {
    //   main: '#FFffff',
    //   light: grey[50],
    //   dark: grey[100],
    //   contrastText: '#FFF',
    // },
    // specialOrange: {
    //   main: '#FF834F',
    //   light: '#FFAE78',
    //   dark: '#ff7043',
    //   contrastText: '#FFF',
    // },
    background: {
      default: grey[200],
    },
  },

  components: {
    MuiTypography: {
      // Changing default props //
      defaultProps: {
        variant: 'body2',
      },
    },
    MuiButton: {
      // Style overrides //
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
