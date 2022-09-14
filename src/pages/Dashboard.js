import React, { useEffect, useState } from 'react';
import {
  Button,
  Paper,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  IconButton,
  Divider,
  Grid,
} from '@mui/material';
import { yellow, blue } from '@mui/material/colors';

import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CreateIcon from '@mui/icons-material/Create';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import MainCard from '../components/shared/MainCard';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { postActions } from '../store';

import Spinner from '../components/shared/Spinner';

const Dashboard = () => {
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
        `${process.env.REACT_APP_BACKEND_URL}/api/posts?user=${userId}&limit=12`
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

      {/* GPS work. will do later */}
      {/* <Paper sx={{ px: 2, py: 1.5, mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Typography sx={{ mr: 1 }}>
            Enable location and then press 'Locate Me' to set your precise
            location
          </Typography>
          <Button variant="contained">
            <Typography>Locate Me!</Typography>
          </Button>
        </Stack>
      </Paper> */}

      <Stack
        direction={matchesSmDown ? 'column' : 'row'}
        justifyContent={matchesSmDown ? 'center' : 'space-between'}
        alignItems="stretch"
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      >
        <Paper
          sx={{
            width: { sm: '32%' },
            p: 3,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            bgcolor: blue[700],
          }}
          component={RouterLink}
          to="/findPost"
        >
          <Box sx={{ textAlign: 'center' }}>
            <ContentPasteSearchIcon
              sx={{ color: yellow[600] }}
              color="primary"
              fontSize="large"
            />
          </Box>
          <Typography sx={{ pl: 2, color: 'white' }}>
            Find books of your interest by category or location
          </Typography>
          <IconButton>
            <ArrowForwardIosIcon sx={{ color: yellow[600] }} />
          </IconButton>
        </Paper>

        <Paper
          sx={{
            width: { sm: '32%' },
            p: 3,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            bgcolor: blue[700],
          }}
          component={RouterLink}
          to="/createPost"
        >
          <Box sx={{ textAlign: 'center' }}>
            <CreateIcon fontSize="large" sx={{ color: yellow[600] }} />
          </Box>

          <Typography sx={{ ml: 2, color: 'white' }}>
            Create a post and start sharing books with friends
          </Typography>
          <IconButton>
            <ArrowForwardIosIcon sx={{ color: yellow[600] }} />
          </IconButton>
        </Paper>

        <Paper
          sx={{
            width: { sm: '32%' },
            p: 3,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            bgcolor: blue[700],
          }}
          component={RouterLink}
          to="/myAccount"
        >
          <Box sx={{ textAlign: 'center' }}>
            <ManageAccountsIcon sx={{ color: yellow[600] }} fontSize="large" />
          </Box>

          <Typography sx={{ ml: 2, color: 'white' }}>
            Manage your account details, favorite books etc.
          </Typography>
          <IconButton>
            <ArrowForwardIosIcon sx={{ color: yellow[600] }} />
          </IconButton>
        </Paper>
      </Stack>

      <Paper sx={{ mt: { sm: 2, xs: 0 }, py: 2 }}>
        <Typography variant="h5" sx={{ px: 2, pb: 1, fontSize: '1.3rem' }}>
          Latest Books
        </Typography>
        <Divider
          variant="middle"
          sx={{ display: { xs: 'none', sm: 'block' }, mb: 2 }}
        />
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
      </Paper>
    </Box>
  );
};

export default Dashboard;
