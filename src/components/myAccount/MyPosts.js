import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useSelector } from 'react-redux';
import Spinner from '../shared/Spinner';
import { Box, Grid, Typography } from '@mui/material';
import MyPostsCard from '../shared/MyPostsCard';

const MyPosts = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [posts, setPosts] = useState(null);

  const auth = useSelector((state) => state.auth);

  const getPostsByUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/user/${auth.id}`
      );
      setPosts(response.data.user.posts);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostsByUser();
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
                  <MyPostsCard data={post} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box sx={{ my: 4 }}>
          <Typography textAlign="center" variant="h6">
            No posts to show
          </Typography>
        </Box>
      )}
    </>
  );
};
export default MyPosts;
