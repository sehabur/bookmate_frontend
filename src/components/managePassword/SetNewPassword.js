import React, { useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Alert, Box } from '@mui/material';

import Spinner from '../../components/shared/Spinner';

const SetNewPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const resetToken = searchParams.get('resetToken');

  const userId = searchParams.get('user');

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    userId,
    resetToken,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.newPassword === formData.confirmPassword) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/setNewPassword`,
          formData
        );
        if (response.status === 201) {
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
    } else {
      setErrorMessage(`Confirmed password does not match with new password.`);
    }
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <Spinner open={isLoading} />
      <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
        Change Password
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password has been changed successfully. Please{' '}
            <RouterLink to="/signin">login</RouterLink> with new password.
          </Alert>
        )}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <TextField
          margin="normal"
          required
          fullWidth
          name="newPassword"
          label="New Password"
          type="password"
          value={formData.newPassword}
          onChange={handleInputChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 2, mb: 3 }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default SetNewPassword;
