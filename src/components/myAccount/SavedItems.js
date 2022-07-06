import { SignalWifiStatusbarNullOutlined } from '@mui/icons-material';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MainCard from '../shared/MainCard';
import Spinner from '../shared/Spinner';

const SavedItems = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [posts, setPosts] = useState();

  // const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const userId = auth ? auth.id : '';

  const getSavedPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/saved/user/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setPosts(response.data.posts.savedItems);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getSavedPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Spinner open={isLoading} />
      {posts && posts.length > 0 ? (
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
      ) : (
        <Box sx={{ my: 4 }}>
          <Typography textAlign="center" variant="h6">
            No books to show
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SavedItems;
