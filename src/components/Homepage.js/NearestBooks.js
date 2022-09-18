import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
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

import Spinner from '../shared/Spinner';
import MainCard from '../shared/MainCard';

const NearestBooks = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [posts, setPosts] = useState(null);

  const auth = useSelector((state) => state.auth);

  const userId = auth ? auth.id : null; // some random fake id //

  const theme = useTheme();

  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const getNeaestPosts = async () => {
    try {
      if (userId) {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/posts?type=nearest&user=${userId}&limit=18`
        );

        setPosts(response.data.posts);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getNeaestPosts();
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
        <Box sx={{ my: 4, textAlign: 'center', px: 3 }}>
          <ErrorOutlineIcon sx={{ color: 'gray', fontSize: '2.5rem' }} />
          <Typography sx={{ color: 'gray', fontSize: '1rem' }}>
            Please login and set your address from "My Account" section to see
            your nearest books
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NearestBooks;
