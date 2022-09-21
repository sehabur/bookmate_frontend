import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
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
import { postActions } from '../../store';
import Spinner from '../shared/Spinner';

const LatestBooks = () => {
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();

  const posts = useSelector((state) => state.post);

  const auth = useSelector((state) => state.auth);

  const userId = auth ? auth.id : '627bb5ef35ffb019b973d811'; // some random fake id //

  const getRecentPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts?type=latest&user=${userId}&limit=12`
      );

      dispatch(postActions.loadPosts(response.data.posts));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getRecentPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Spinner open={isLoading} />

      {posts && posts.length > 0 ? (
        <>
          <Box sx={{ ml: 2 }}>
            <Grid container>
              {posts.map((post) => (
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
              See more books
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
