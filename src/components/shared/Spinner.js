import { CircularProgress, Dialog, Stack, Typography } from '@mui/material';
import React from 'react';

const Spinner = ({ open }) => {
  return (
    <Dialog open={open}>
      <Stack direction="row" sx={{ p: 2 }} alignItems="center">
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Please wait
        </Typography>
      </Stack>
    </Dialog>
  );
};

export default Spinner;
