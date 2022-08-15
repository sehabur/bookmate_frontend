import { Avatar, Box, Grid, Paper, Typography } from '@mui/material';
import Spinner from '../components/shared/Spinner';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MainCard from '../components/shared/MainCard';

const AllPostByUser = () => {
  const { id: userId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const [postsByUser, setPostsByUser] = useState(null);

  const getPostsByUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/user/${userId}`
      );
      setPostsByUser(response.data.user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getPostsByUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Spinner open={isLoading} />
      <Paper sx={{ mt: 2, py: 2 }}>
        {postsByUser && (
          <Box sx={{ px: 2, pb: 1, mx: 2, mt: 2 }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item>
                <Avatar
                  src={`${process.env.REACT_APP_CLOUD_IMAGE_URL}/${postsByUser.image}`}
                  sx={{
                    width: 60,
                    height: 60,
                  }}
                />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">
                  {postsByUser.shopName}
                </Typography>

                <Typography color="text.secondary">
                  {postsByUser.posts.length} book(s) uploaded
                </Typography>

                <Typography color="text.secondary">
                  {postsByUser.exchangedCount} sell/exchange done
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        <Typography
          variant="h5"
          sx={{ px: 3, pb: 1, my: 1, fontSize: '1.1rem' }}
        >
          Books from {postsByUser && postsByUser.shopName}
        </Typography>
        {postsByUser && postsByUser.posts.length > 0 ? (
          <Box sx={{ ml: 2 }}>
            <Grid container>
              {postsByUser.posts
                .filter((post) => post.isActive === true)
                .map((post) => (
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
      </Paper>
    </Box>
  );
};

export default AllPostByUser;
