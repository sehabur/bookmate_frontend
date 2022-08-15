import {
  Avatar,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import Spinner from '../components/shared/Spinner';

const ExploreShops = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [allUserDetails, setAllUserDetails] = useState(null);

  const auth = useSelector((state) => state.auth);

  const userId = auth ? auth.id : '';

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/allUsers`
      );
      setAllUserDetails(
        response.data.users.filter((user) => user._id !== userId)
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Spinner open={isLoading} />
      <Paper sx={{ mt: 2, py: 2 }}>
        <Typography variant="h5" sx={{ px: 2, pb: 1, fontSize: '1.3rem' }}>
          Explore Shops
        </Typography>
        <Divider
          variant="middle"
          sx={{ display: { xs: 'none', sm: 'block' }, mb: 2 }}
        />
        {allUserDetails && allUserDetails.length > 0 ? (
          <Box sx={{ ml: 5 }}>
            <Grid container>
              {allUserDetails.map((user) => (
                <Grid Item xs={12} sm={6}>
                  <Paper sx={{ p: 2, mt: 2.6, mr: 5 }}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item>
                        <Avatar
                          src={`${process.env.REACT_APP_CLOUD_IMAGE_URL}/${user.image}`}
                          sx={{
                            width: 60,
                            height: 60,
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                          {user.shopName}
                        </Typography>

                        <Typography color="text.secondary">
                          {user.posts.length} book(s) uploaded
                        </Typography>

                        <Typography color="text.secondary">
                          {user.exchangedCount} sell/exchange done
                        </Typography>

                        {/* <Rating
                      name="read-only"
                      value={5}
                      readOnly
                      sx={{ my: 1 }}
                    /> */}
                      </Grid>
                    </Grid>
                    <Button
                      variant="outlined"
                      fullWidth
                      component={RouterLink}
                      to={`/allPost/user/${user._id}`}
                    >
                      Explore Books
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ my: 4 }}>
            <Typography textAlign="center" variant="h6">
              No shops to show
            </Typography>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default ExploreShops;
