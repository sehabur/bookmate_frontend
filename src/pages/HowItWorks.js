import { Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import YouTube from 'react-youtube';

const HowItWorks = () => {
  const theme = useTheme();
  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Paper
        sx={{
          py: 2,
          px: { xs: 3, sm: 15 },
        }}
      >
        <Typography sx={{ pb: 1, pt: 1, mb: 3, fontSize: '1.3rem' }}>
          How this website works
        </Typography>
        <YouTube
          videoId="2g811Eo7K8U"
          opts={{
            height: matchesSmDown ? '260' : '480',
            width: '100%',
          }}
        />
        ;
      </Paper>
    </>
  );
};

export default HowItWorks;
