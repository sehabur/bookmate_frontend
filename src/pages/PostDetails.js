import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';

import { Carousel } from 'react-carousel-minimal';

import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import SellIcon from '@mui/icons-material/Sell';
import EditIcon from '@mui/icons-material/Edit';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';

import Spinner from '../components/shared/Spinner';
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago';
import { useSelector } from 'react-redux';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import ToastMessage from '../components/shared/ToastMessage';

import { bdtSign } from '../data/constants';

const PostDetails = () => {
  const { id: postId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const [isPostFromUser, setIsPostFromUser] = useState(false);

  const [postDetails, setPostDetails] = useState(null);

  const [isSaved, setIsSaved] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const auth = useSelector((state) => state.auth);

  const [toastOpen, setToastOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState({
    severity: null,
    message: null,
  });

  const theme = useTheme();

  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [isBuyReqPlaced, setIsBuyReqPlaced] = useState(false);

  const [isExchangeReqPlaced, setIsExchangeReqPlaced] = useState(false);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth && auth.token}`,
    },
  };

  let images = [];
  if (postDetails) {
    if (postDetails.image1) {
      images.push({
        image: `${process.env.REACT_APP_BACKEND_URL}/images/${postDetails.image1}`,
      });
    }
    if (postDetails.image2) {
      images.push({
        image: `${process.env.REACT_APP_BACKEND_URL}/images/${postDetails.image2}`,
      });
    }
    if (postDetails.image3) {
      images.push({
        image: `${process.env.REACT_APP_BACKEND_URL}/images/${postDetails.image3}`,
      });
    }
  }

  const handleToastColse = () => {
    setToastOpen(false);
  };

  const getPostDetails = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`
      );
      setPostDetails(response.data.post);

      const userResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile/${
          auth && auth.id
        }`,
        config
      );
      const isSavedForLater = userResponse.data.user.savedItems.some(
        (item) => item.toString() === postId
      );
      setIsPostFromUser(response.data.post.user._id === auth.id ? true : false);
      setIsSaved(isSavedForLater);

      const orderResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/isOrderPlaced/${postId}`,
        config
      );
      orderResponse.data.order.forEach((order) => {
        if (order.offerType === 'exchange') {
          setIsExchangeReqPlaced(true);
        } else if (order.offerType === 'buy') {
          setIsBuyReqPlaced(true);
        }
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleSaveItem = async () => {
    try {
      setIsLoading(true);

      const action = isSaved ? 'delete' : 'save';
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/savePost/${postId}?action=${action}`,
        {},
        config
      );
      setIsSaved(!isSaved);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handlePlaceOrder = async (e, offerType) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/request`,
        {
          requestedTo: postDetails.user._id,
          orderItem: postId,
          offerType,
          price: postDetails.price,
          bookTitle: postDetails.title,
          requestTime: new Date(),
        },
        config
      );

      if (response.status === 201) {
        setToastOpen(true);
        setToastMessage({
          severity: 'success',
          message: `Your ${offerType} request placed successfully. Go to History to see all requests.`,
        });
        if (offerType === 'exchange') {
          setIsExchangeReqPlaced(true);
        } else if (offerType === 'buy') {
          setIsBuyReqPlaced(true);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setToastOpen(true);
      setToastMessage({
        severity: 'error',
        message: `Your ${offerType} request placement failed. Please try again.`,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
      }}
    >
      <Spinner open={isLoading} />
      {postDetails ? (
        <>
          <Grid container justifyContent="center">
            <Grid item>
              <Typography
                sx={{ pb: 1, fontSize: '1.3rem', color: 'info.dark' }}
              >
                {postDetails.title}
              </Typography>

              <Typography sx={{ fontSize: '.8rem', ml: 0.3 }}>
                posted{' '}
                <ReactTimeAgo
                  date={postDetails.createdAt}
                  locale="en-US"
                  timeStyle="round-minute"
                />
              </Typography>
            </Grid>
            <Box sx={{ flexGrow: 1 }} />
            <Grid item>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="text" startIcon={<ShareIcon />}>
                  Share
                </Button>
                {!isPostFromUser ? (
                  <>
                    {isSaved ? (
                      <Button
                        variant="text"
                        startIcon={<BookmarkAddedIcon />}
                        sx={{ ml: 3 }}
                        onClick={handleSaveItem}
                      >
                        Saved
                      </Button>
                    ) : (
                      <Button
                        variant="text"
                        startIcon={<BookmarkBorderIcon />}
                        sx={{ ml: 3 }}
                        onClick={handleSaveItem}
                      >
                        Save for later
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    variant="text"
                    startIcon={<EditIcon />}
                    sx={{ ml: 3 }}
                    component={RouterLink}
                    to={`/editPost/${postId}`}
                  >
                    Edit post
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Carousel
                data={images}
                automatic={false}
                width="100%"
                height="500px"
                radius="8px"
                slideNumber={true}
                dots={true}
                slideBackgroundColor="#f5f5f5"
                slideImageFit="contain"
                thumbnails={true}
                thumbnailWidth="100px"
                style={{
                  textAlign: 'center',
                  margin: '20px auto',
                }}
              />
              <Grid container alignItems="center" sx={{ mb: 2 }}>
                <Grid item>
                  {postDetails.enableSellOffer && (
                    <Chip
                      label="Sell Offer"
                      color="success"
                      size="small"
                      icon={<SellIcon fontSize="small" />}
                      sx={{
                        fontSize: '.8rem',
                        borderRadius: 1.2,
                        mr: 1,
                      }}
                    />
                  )}

                  {postDetails.enableExchangeOffer && (
                    <Chip
                      label="Exchange Offer"
                      color="info"
                      size="small"
                      icon={<SwapCallsIcon fontSize="small" />}
                      sx={{
                        fontSize: '.8rem',
                        borderRadius: 1.2,
                        mr: 1,
                      }}
                    />
                  )}
                </Grid>
              </Grid>

              {postDetails.enableSellOffer && (
                <Typography
                  sx={{ mb: 0.5, color: 'green', fontSize: '1.2rem' }}
                >
                  Price: {bdtSign} {postDetails.price}
                </Typography>
              )}

              <Typography sx={{ mb: 0.5 }}>
                Location: {postDetails.area}, {postDetails.district}
              </Typography>
              <Typography sx={{ mb: 0.5 }}>
                Category: {postDetails.category}
              </Typography>

              {!isPostFromUser ? (
                <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
                  {isBuyReqPlaced ? (
                    <Stack direction="row" alignItems="center">
                      <CheckCircleOutlineIcon />
                      <Typography sx={{ ml: 1 }}>Buy Request Placed</Typography>
                    </Stack>
                  ) : (
                    <Button
                      variant="outlined"
                      fullWidth={matchesSmDown}
                      onClick={(e) => handlePlaceOrder(e, 'buy')}
                    >
                      Place buy request
                    </Button>
                  )}
                  {isExchangeReqPlaced ? (
                    <Stack direction="row" alignItems="center" sx={{ ml: 2 }}>
                      <CheckCircleOutlineIcon />
                      <Typography sx={{ ml: 1 }}>
                        Exchange Request Placed
                      </Typography>
                    </Stack>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth={matchesSmDown}
                      sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 } }}
                      onClick={(e) => handlePlaceOrder(e, 'exchange')}
                    >
                      Place exchange request
                    </Button>
                  )}
                </Box>
              ) : (
                <Box sx={{ my: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth={matchesSmDown}
                    component={RouterLink}
                    to={`/editPost/${postId}`}
                  >
                    Edit this post
                  </Button>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1.2rem',

                  mb: 1,
                }}
              >
                Description
              </Typography>
              <Typography color="text.secondary">
                {postDetails.description}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              {!isPostFromUser && (
                <Paper sx={{ p: 2, mt: 2.6 }}>
                  <Typography variant="subtitle1" sx={{ mb: 0.3 }}>
                    About the owner
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item>
                      <Avatar
                        src={`${process.env.REACT_APP_BACKEND_URL}/images/${postDetails.user.image}`}
                        sx={{
                          width: 50,
                          height: 50,
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                        {postDetails.user.shopName}
                      </Typography>

                      <Typography color="text.secondary">
                        {postDetails.user.posts.length} book(s) uploaded
                      </Typography>

                      <Typography color="text.secondary">
                        {postDetails.user.orders.length} sell/exchange done
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
                    variant="contained"
                    fullWidth
                    component={RouterLink}
                    to={`/allPost/user/${postDetails.user._id}`}
                  >
                    See other books from this owner
                  </Button>
                </Paper>
              )}
            </Grid>
          </Grid>
        </>
      ) : (
        <Box sx={{ my: 4 }}>
          <Typography textAlign="center" variant="h6">
            No posts to show
          </Typography>
        </Box>
      )}
      <ToastMessage
        open={toastOpen}
        severity={toastMessage.severity}
        message={toastMessage.message}
        onClose={handleToastColse}
      />
    </Paper>
  );
};

export default PostDetails;
