import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

import ReactTimeAgo from 'react-time-ago';

import noImage from '../../assets/no_image_placeholder.jpg';

import SellIcon from '@mui/icons-material/Sell';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import { useNavigate } from 'react-router-dom';

import { bdtSign } from '../../data/constants';

const MainCard = ({ data }) => {
  const navigate = useNavigate();

  const handleCardClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <Card
      sx={{
        '& .MuiCardContent-root': {
          paddingBottom: 1,
        },
      }}
    >
      <CardActionArea
        onClick={() => handleCardClick(data._id)}
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
            my: { sm: 1.5 },
            ml: 1.5,
          }}
          image={`${process.env.REACT_APP_CLOUD_IMAGE_URL}/${data.image1}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = noImage; // fallback image //
          }}
          alt="No image available"
        />

        {/* GPS work. will do later */}
        {/* <Chip
          label="12 kM"
          color="warning"
          // icon={<LocationOnIcon sx={{ fontSize: '.9rem' }} />}
          size="small"
          sx={{ fontSize: '.7rem', position: 'absolute', left: 8, top: 8 }}
        /> */}
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
              sx={{
                color: 'info.dark',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              {data.title}
            </Typography>
            <Typography sx={{ mb: 0.8, fontSize: '.85rem' }}>
              By {data.writer}
            </Typography>

            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              <Typography
                color="text.secondary"
                sx={{ fontSize: '.8rem', mr: 1.3 }}
              >
                {data.area}, {data.district}
              </Typography>
              <Chip label={data.category} size="small" variant="outlined" />
            </Stack>

            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              {data.enableSellOffer && (
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

              {data.enableExchangeOffer && (
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
            </Stack>

            {data.enableSellOffer && (
              <Typography
                variant="body2"
                sx={{ color: 'success.dark', fontSize: '1rem' }}
              >
                Price: {bdtSign} {data.price}
              </Typography>
            )}

            <Typography textAlign="right" sx={{ fontSize: '.75rem' }}>
              posted{' '}
              <ReactTimeAgo
                date={data.createdAt}
                locale="en-US"
                timeStyle="round-minute"
              />
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default MainCard;
