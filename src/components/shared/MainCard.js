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

import { teal } from '@mui/material/colors';

import beat from '../../assets/beat.jpg';

const MainCard = () => {
  return (
    <Card
      sx={{
        width: { sm: '48%' },
        '& .MuiCardContent-root': {
          paddingBottom: 1,
        },
        mb: 2,
        borderRadius: { xs: 0, sm: 'inherit' },
        mx: { xs: 0, sm: 2 },
      }}
    >
      <CardActionArea
        sx={{
          display: 'flex',
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: { xs: 110, sm: 160 },
            height: { xs: 120, sm: 160 },
            my: { sm: 1.5 },
            ml: 1.5,
          }}
          image={beat}
          alt="Live from space album cover"
        />
        <Chip
          label="12 kM"
          color="warning"
          // icon={<LocationOnIcon sx={{ fontSize: '.9rem' }} />}
          size="small"
          sx={{ fontSize: '.7rem', position: 'absolute', left: 8, top: 10 }}
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
            >
              Putul Nacher Itikotha by Manik Bondhopadhay
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 0.5, fontSize: '.8rem' }}
            >
              Pabna, Uponnyash
            </Typography>
            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: '1.1rem',
                  mr: 1.5,
                  fontWeight: 'bold',
                  color: teal[600],
                }}
              >
                ৳135
              </Typography>
              <Chip
                label="Exchange Offer"
                color="info"
                size="small"
                sx={{ fontSize: '.75rem' }}
              />
            </Stack>
            <Typography textAlign="right" sx={{ fontSize: '.75rem' }}>
              posted 15 minutes ago
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default MainCard;
