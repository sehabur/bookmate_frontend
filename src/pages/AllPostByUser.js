import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import Spinner from '../components/shared/Spinner';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import MainCard from '../components/shared/MainCard';
import CallIcon from '@mui/icons-material/Call';
import MessageIcon from '@mui/icons-material/Message';
import InfoIcon from '@mui/icons-material/Info';
import { useSelector } from 'react-redux';
import ToastMessage from '../components/shared/ToastMessage';

const AllPostByUser = () => {
  const { id: userId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const [postsByUser, setPostsByUser] = useState(null);

  const auth = useSelector((state) => state.auth);

  const [toastOpen, setToastOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState({
    severity: null,
    message: null,
  });

  const navigate = useNavigate();

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

  const handleToastColse = () => {
    setToastOpen(false);
  };

  const handleSendMessage = async () => {
    if (auth) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/orders/createNewConversation`,
          {
            senderId: auth.id,
            receiverId: postsByUser._id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth && auth.token}`,
            },
          }
        );
        if (response.status === 201) {
          navigate('/messages');
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    } else {
      setToastOpen(true);
      setToastMessage({
        severity: 'error',
        message: 'Please login to send message.',
      });
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
          <Box sx={{ px: 2, pb: 1, mx: 2, mt: 2, mb: 4 }}>
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

                {postsByUser.phoneNo && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CallIcon
                      color="primary"
                      sx={{ fontSize: '16px', mr: 1 }}
                    />
                    <Typography>{postsByUser.phoneNo}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Button
              variant="outlined"
              startIcon={<MessageIcon />}
              onClick={handleSendMessage}
            >
              Send message via BoiExchange
            </Button>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            pb: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontSize: '1.1rem', pr: 3 }}>
            Books from {postsByUser && postsByUser.shopName}
          </Typography>

          {auth && userId === auth.id && (
            <Tooltip
              sx={{}}
              title={
                <Box sx={{ fontSize: '.8rem' }}>
                  You can copy URL of this page and share it with your friends
                  as your Shop's link
                </Box>
              }
              arrow
            >
              <Button variant="text" startIcon={<InfoIcon />}>
                Share Link of your Shop
              </Button>
            </Tooltip>
          )}
        </Box>

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

      <ToastMessage
        open={toastOpen}
        severity={toastMessage.severity}
        message={toastMessage.message}
        onClose={handleToastColse}
      />
    </Box>
  );
};

export default AllPostByUser;
