import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import { teal } from '@mui/material/colors';

import ReactTimeAgo from 'react-time-ago';

import noImage from '../../assets/no_image_placeholder.jpg';

import SellIcon from '@mui/icons-material/Sell';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { format } from 'date-fns';
import axios from 'axios';

import Spinner from './Spinner';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ClearIcon from '@mui/icons-material/Clear';

const MyPostsCard = ({ data }) => {
  const auth = useSelector((state) => state.auth);

  const userId = auth ? auth.id : '';

  return (
    <Card
      sx={{
        borderRadius: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: { xs: 90, sm: 130 },
            height: { xs: 120, sm: 160 },
            my: 1.5,
            ml: 1.5,
          }}
          image={`${process.env.REACT_APP_CLOUD_IMAGE_URL}/${data.image1}`}
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
              to={`/post/${data._id}`}
            >
              {data.title}
            </Typography>
            <Typography sx={{ mb: 0.5, fontSize: '.8rem' }}>
              By {data.writer}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 0.5, fontSize: '.8rem' }}
            >
              {data.area}, {data.district}, {data.category}
            </Typography>
            <Divider sx={{ mt: 1, mb: 1.5 }} />

            <Typography sx={{ mb: 0.5, fontSize: '.8rem' }}>
              Post created on{' '}
              {format(new Date(data.createdAt), 'dd-MM-yyyy HH:mm')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.8 }}>
              {data.isActive ? (
                <>
                  <CheckCircleOutlineIcon color="success" />
                  <Typography sx={{ ml: 1, fontSize: '.9rem' }}>
                    Active
                  </Typography>
                </>
              ) : (
                <>
                  <ErrorOutlineIcon color="error" />{' '}
                  <Typography sx={{ ml: 1, fontSize: '.9rem' }}>
                    Not active
                  </Typography>
                </>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              {data.isExchanged ? (
                <>
                  <CheckCircleOutlineIcon color="success" />
                  <Typography sx={{ ml: 1, fontSize: '.9rem' }}>
                    Exchange done
                  </Typography>
                </>
              ) : (
                <>
                  <ErrorOutlineIcon color="warning" />{' '}
                  <Typography sx={{ ml: 1, fontSize: '.9rem' }}>
                    Exchange not done yet
                  </Typography>
                </>
              )}
            </Box>

            <Button
              component={RouterLink}
              variant="outlined"
              size="small"
              sx={{ mt: 1.2 }}
              to={`/editPost/${data._id}`}
            >
              Edit Post
            </Button>
          </CardContent>
        </Box>
      </Box>
    </Card>
  );
};

export default MyPostsCard;
