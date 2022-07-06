import { Box, Container, Link, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: grey[400],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1">Read to fill your heart.</Typography>
        <Typography variant="body2" color="text.secondary">
          {'Copyright © '}
          <Link color="inherit" href="https://mui.com/">
            Bookmate.com
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
