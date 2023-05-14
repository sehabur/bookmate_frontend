import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import { blue } from '@mui/material/colors';

const AdvancedSearch = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <Typography sx={{ fontSize: '1rem' }}>
        Can not find the book you need? Try{' '}
        <RouterLink
          to="/findPost"
          sx={{ color: blue[700], fontSize: '1.2rem' }}
        >
          Advanced Search
        </RouterLink>{' '}
        option
      </Typography>
    </Box>
  );
};

export default AdvancedSearch;
