import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  Grid,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import MainCard from '../shared/MainCard';
import { blue, yellow } from '@mui/material/colors';

const NearestBooks = ({ isLoggedIn, postsToShow = 6 }) => {
  const theme = useTheme();

  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const posts = useSelector((state) => state.post);

  return (
    <Box>
      {posts?.nearestPosts && posts?.nearestPosts.length > 0 ? (
        <>
          <Box sx={{ ml: 2 }}>
            <Grid container>
              {posts.nearestPosts.slice(0, postsToShow).map((post) => (
                <Grid Item xs={12} sm={6}>
                  <Box sx={{ mr: 2, mb: 2 }}>
                    <MainCard data={post} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ textAlign: 'center', mx: 2 }}>
            <Button
              variant={matchesSmDown ? 'contained' : 'text'}
              fullWidth={matchesSmDown}
              endIcon={<KeyboardArrowRightIcon />}
              component={RouterLink}
              to="/booksFromArea"
            >
              Explore more books near you
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ my: 4, textAlign: 'center', px: 3 }}>
          <ErrorOutlineIcon sx={{ color: yellow[700], fontSize: '2.5rem' }} />
          {isLoggedIn ? (
            <Typography sx={{ color: 'gray', fontSize: '1rem' }}>
              No books found in your area. You can search more books{' '}
              <RouterLink to="/findPost">here</RouterLink>
            </Typography>
          ) : (
            <Typography sx={{ color: 'gray', fontSize: '1rem' }}>
              Please{' '}
              <Typography
                component={RouterLink}
                to="/signin"
                sx={{ color: blue[700], fontSize: '1.2rem' }}
              >
                sign in
              </Typography>{' '}
              and set your "Area" to see your nearest books
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NearestBooks;
