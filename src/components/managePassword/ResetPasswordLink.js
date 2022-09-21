import React, { useState } from 'react';
import { TextField, Button, Typography, Alert, Box } from '@mui/material';
import axios from 'axios';

import Spinner from '../../components/shared/Spinner';

const ResetPasswordLink = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/resetPasswordLink`,
        formData
      );
      if (response.status === 200) {
        setErrorMessage('');
        setSuccess(true);
      }
      setIsLoading(false);
    } catch (error) {
      if (error.response.data) {
        setErrorMessage(error.response.data.message);
      }
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setFormData({
      email: event.target.value,
    });
  };

  return (
    <>
      <Spinner open={isLoading} />
      <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
        Reset Password
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password reset link has been sent. Please check your email.
          </Alert>
        )}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <TextField
          type="email"
          margin="normal"
          required
          fullWidth
          label="Email Address"
          name="email"
          autoFocus
          value={formData.email}
          onChange={handleInputChange}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 4, mb: 3 }}
        >
          Send Reset Link
        </Button>
      </Box>
    </>
  );
};

export default ResetPasswordLink;
