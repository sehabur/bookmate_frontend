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
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import MainCard from '../shared/MainCard';

const LatestBooks = () => {
  const theme = useTheme();

  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const posts = useSelector((state) => state.post);

  return (
    <Box>
      {posts?.latestPosts && posts?.latestPosts.length > 0 ? (
        <>
          <Box sx={{ ml: 2 }}>
            <Grid container>
              {posts.latestPosts.map((post) => (
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
              to="/findPost"
            >
              Explore more latest books
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ my: 4 }}>
          <Typography textAlign="center" variant="h6">
            No books to show
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LatestBooks;
