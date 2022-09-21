import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import Spinner from '../../components/shared/Spinner';

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const auth = useSelector((state) => state.auth);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.newPassword === formData.confirmPassword) {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/changePassword`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth && auth.token}`,
            },
          }
        );
        if (response.status === 201) {
          setSuccess(true);
        }
        setIsLoading(false);
      } catch (error) {
        if (error.response) {
          if (error.response.data) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage(`Password change failed. Error Occured.`);
          }
        } else {
          setErrorMessage(`Password change failed. Error Occured`);
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
          name="oldPassword"
          label="Old Password"
          type="password"
          value={formData.oldPassword}
          onChange={handleInputChange}
        />

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
          Change Password
        </Button>
      </Box>
    </>
  );
};

export default ChangePassword;
