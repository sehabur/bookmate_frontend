import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';

import noImage from '../../assets/no_image_placeholder.jpg';
import Spinner from './Spinner';
import OrderAcceptDialog, { callOrderAcceptApi } from './OrderAcceptDialog';

const RequestCard = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [requestAcceptStatus, setRequestAcceptStatus] = useState(
    data.requestStatus
  );

  const auth = useSelector((state) => state.auth);

  const userId = auth ? auth.id : '';

  const handleDialogClose = (e, action) => {
    if (action === 'confirm') {
      callOrderAcceptApi(
        'accepted',
        data._id,
        data.orderItem._id,
        data.orderItem.title,
        auth.token
      );
      setRequestAcceptStatus('accepted');
    }
    setDialogOpen(false);
  };

  const requestAcceptStatusText = () => {
    let text = 'Status: ';
    if (requestAcceptStatus === 'accepted') {
      text += 'Accepted';
    } else if (requestAcceptStatus === 'rejected') {
      text += 'Rejected';
    }
    if (requestAcceptStatus === 'pending') {
      text += 'Pending';
    }
    if (requestAcceptStatus !== 'pending' && data.acceptTime) {
      text += ` on ${format(new Date(data.acceptTime), 'dd-MM-yyyy HH:mm')}`;
    }
    return text;
  };

  const handleAcceptRequest = async (status) => {
    try {
      setIsLoading(true);
      if (status === 'accepted') {
        setDialogOpen(true);
      } else if (status === 'rejected') {
        callOrderAcceptApi(
          status,
          data._id,
          data.orderItem._id,
          data.orderItem.title,
          auth.token
        );
        setRequestAcceptStatus(status);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 0,
        }}
      >
        <Spinner open={isLoading} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              my: 1.5,
              ml: 1.5,
            }}
            image={`${process.env.REACT_APP_BACKEND_URL}/images/${data.orderItem.image1}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = noImage; // fallback image //
            }}
            alt="No image available"
          />
          <Box>
            <CardContent
              sx={{
                flex: '1 0 auto',
                '& .MuiCardContent-root': {
                  paddingBottom: 0,
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{ mb: 0.8, color: 'info.dark', fontWeight: 'bold' }}
                component={RouterLink}
                to={`/post/${data.orderItem._id}`}
              >
                {data.orderItem.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mb: 0.5, fontSize: '.8rem' }}
              >
                {data.orderItem.writer}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mb: 0.5, fontSize: '.8rem' }}
              >
                {data.orderItem.district}, {data.orderItem.category}
              </Typography>
              <Divider sx={{ mt: 1, mb: 1.5 }} />

              <Typography sx={{ mb: 0.5, fontSize: '.8rem' }}>
                Request type: {data.offerType}
              </Typography>

              {userId === data.requestor && (
                <>
                  <Typography sx={{ mb: 0.5, fontSize: '.8rem' }}>
                    Request sent to{' '}
                    <RouterLink to={`/allPost/user/${data.requestedTo._id}`}>
                      {data.requestedTo.shopName}
                    </RouterLink>{' '}
                    on {format(new Date(data.requestTime), 'dd-MM-yyyy HH:mm')}
                  </Typography>

                  <Typography sx={{ mb: 0.5, fontSize: '.8rem' }}>
                    {requestAcceptStatusText()}
                  </Typography>
                </>
              )}

              {userId === data.requestedTo._id && (
                <>
                  <Typography sx={{ mb: 0.5, fontSize: '.8rem' }}>
                    Request from{' '}
                    <RouterLink to={`/allPost/user/${data.requestor}`}>
                      {data.requestedTo.shopName}
                    </RouterLink>{' '}
                    on {format(new Date(data.requestTime), 'dd-MM-yyyy HH:mm')}
                  </Typography>

                  <Typography sx={{ mb: 0.5, fontSize: '.8rem' }}>
                    {requestAcceptStatusText()}
                  </Typography>

                  {requestAcceptStatus === 'pending' && (
                    <Box sx={{ mt: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        sx={{ mr: 2 }}
                        onClick={() => handleAcceptRequest('rejected')}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleAcceptRequest('accepted')}
                      >
                        Accept
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Box>
        </Box>
      </Card>
      <OrderAcceptDialog
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </>
  );
};

export default RequestCard;
