import { Box, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

const BottomNavCompansator = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  return matches && <Box sx={{ height: '3.5rem' }}></Box>;
};

export default BottomNavCompansator;
