import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import InstituteBooks from '../components/homepage/InstituteBooks';
import NearestBooks from '../components/homepage/NearestBooks';

import { Paper, Typography, Box, Divider } from '@mui/material';

import { useSelector } from 'react-redux';

const ExploreNearestBooks = () => {
  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const isLoggedIn = auth ? auth.isLoggedIn : false;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoggedIn) {
      navigate('/signin');
    }
  }, [navigate, isLoggedIn]);

  return (
    <Paper>
      <Box>
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: '1.6rem',
              textAlign: 'center',
              mb: 2,
              px: 2,
              mt: 2,
            }}
          >
            {auth?.currentInstitution
              ? `BOOKS AT "${auth?.currentInstitution?.toUpperCase()}"`
              : 'BOOKS AT YOUR INSTITUTE'}
          </Typography>
          <InstituteBooks isLoggedIn={isLoggedIn} />
        </Box>

        <Box sx={{ pb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: '1.6rem',
              textAlign: 'center',
              mb: 2,
              px: 2,
            }}
          >
            {auth?.area
              ? `BOOKS NEAR "${auth?.area?.toUpperCase()}"`
              : 'BOOKS NEAR YOU'}
          </Typography>
          <NearestBooks isLoggedIn={isLoggedIn} />
        </Box>
      </Box>
    </Paper>
  );
};

export default ExploreNearestBooks;
