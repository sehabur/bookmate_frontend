import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactTimeAgo from 'react-time-ago';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { brown } from '@mui/material/colors';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';

import Spinner from '../components/shared/Spinner';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { notificationActions } from '../store';
import OrderAcceptDialog, {
  callOrderAcceptApi,
} from '../components/shared/OrderAcceptDialog';

const Notification = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [acceptedOrderNotif, setAcceptedOrderNotif] = useState(null);

  const auth = useSelector((state) => state.auth);

  const userLoggedIn = auth && auth.isLoggedIn;

  const notificationItemsList = useSelector((state) => state.notification);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleDialogClose = (e, action) => {
    if (action === 'confirm') {
      callOrderAcceptApi(
        'accepted',
        acceptedOrderNotif.order,
        acceptedOrderNotif.post,
        acceptedOrderNotif.bookTitle,
        auth.token
      );
      dispatch(
        notificationActions.deactivateNotification(acceptedOrderNotif.notifId)
      );
    }
    setDialogOpen(false);
  };

  const handleAcceptRequest = async (
    status,
    { _id: notifId, order, post, bookTitle }
  ) => {
    try {
      setIsLoading(true);

      if (status === 'accepted') {
        setDialogOpen(true);
        setAcceptedOrderNotif({ notifId, order, post, bookTitle });
      } else if (status === 'rejected') {
        callOrderAcceptApi(status, order, post, bookTitle, auth.token);
        dispatch(notificationActions.deactivateNotification(notifId));
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/signin');
    }
  }, [navigate, userLoggedIn]);

  return (
    <>
      <Spinner open={isLoading} />
      <Paper
        sx={{
          py: 2,
          px: { xs: 2, sm: 15 },
        }}
      >
        <Typography sx={{ pb: 1, pt: 1, fontSize: '1.3rem' }}>
          Notifications
        </Typography>
        <Divider />
        {notificationItemsList && notificationItemsList.length > 0 ? (
          notificationItemsList.map((notification) => (
            <>
              <Paper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  pt: 1.5,
                  pb: 1.2,
                  my: 2,
                  maxWidth: '600px',
                  bgcolor: brown[50],
                }}
              >
                <NotificationsIcon color="primary" sx={{ mx: 2 }} />
                <Box>
                  <Typography>{notification.text}</Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    <ReactTimeAgo
                      date={notification.createdAt}
                      locale="en-US"
                      timeStyle="round-minute"
                    />
                  </Typography>
                  {notification.type === 'reqSent' && notification.isActive && (
                    <Box sx={{ my: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="info"
                        sx={{ mr: 1.5 }}
                        component={RouterLink}
                        to={`/allPost/user/${notification.sender}`}
                      >
                        Explore Books
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        sx={{ mr: 1.5 }}
                        onClick={() =>
                          handleAcceptRequest('accepted', notification)
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        sx={{ mr: 1.5 }}
                        onClick={() =>
                          handleAcceptRequest('rejected', notification)
                        }
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                  {/* {notification.type === 'reqAck' && (
                    <Box sx={{ my: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="info"
                        sx={{ mr: 1.5 }}
                        component={RouterLink}
                        to={`/allPost/user/${notification.sender}`}
                      >
                        Explore Books
                      </Button>
                    </Box>
                  )} */}
                </Box>
              </Paper>
            </>
          ))
        ) : (
          <Box sx={{ my: 4 }}>
            <Typography textAlign="center" variant="h6">
              No notifications to show
            </Typography>
          </Box>
        )}
      </Paper>
      <OrderAcceptDialog
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </>
  );
};

export default Notification;
