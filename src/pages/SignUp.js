import React from 'react';

import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { Paper } from '@mui/material';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Alert } from '@mui/material';

const SignUp = () => {
  return (
    <Paper sx={{ mt: 5, px: 5, py: 3, maxWidth: '500px', mx: 'auto' }}>
      <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
        Sign Up
      </Typography>
      {/* <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}> */}
      <Box component="form" sx={{ mt: 3 }}>
        {/* {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )} */}
        {/* {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              We have sent an email to the mail address you registered. Please
              verify.
            </Alert>
          )} */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              fullWidth
              id="firstName"
              label="First Name"
              // onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              // onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              // onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              inputProps={{ minLength: 6 }}
              // onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ my: 3 }}>
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/signin">
              <Typography>Already have an account? Sign in</Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default SignUp;
