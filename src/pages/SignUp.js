import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Paper, Alert } from '@mui/material';

import Spinner from '../components/shared/Spinner';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    shopName: null,
    email: null,
    password: null,
  });

  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth) {
      if (auth.isLoggedIn) {
        navigate('/');
      }
    }
  }, [auth, navigate]);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/register`,
        formData
      );
      if (response.status === 201) {
        setSuccess(true);
        setErrorMessage(null);
      }
    } catch (error) {
      setSuccess(false);

      if (error.response) {
        let composeMsg;
        if (error.response.data.message) {
          composeMsg = error.response.data.message;
        } else if (error.response.data.errors) {
          composeMsg = error.response.data.errors[0].msg;
        }
        setErrorMessage(`User creation failed. ${composeMsg}`);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <Spinner open={isLoading} />
      <Paper sx={{ mt: 2, px: 5, py: 3, maxWidth: '550px', mx: 'auto' }}>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Account creation successful. Please{' '}
              <RouterLink to="/signin">login</RouterLink> now.
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="shopName"
                fullWidth
                id="shopName"
                label="Shop Name"
                required
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
    </>
  );
};

export default SignUp;
