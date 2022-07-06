import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Alert,
  Divider,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import noImage from '../../assets/no_image_placeholder.jpg';

import CloseIcon from '@mui/icons-material/Close';

const formDefaultState = {
  shopName: '',
  email: '',
  firstName: '',
  lastName: '',
  image: null,
};

const ManageAccount = () => {
  const [formInputs, setformInputs] = useState(formDefaultState);

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [success, setSuccess] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  // const [previewUrl, setPreviewUrl] = useState(
  //   formInputs
  //     ? `${process.env.REACT_APP_BACKEND_URL}/images/${formInputs.image}`
  //     : null
  // );

  const auth = useSelector((state) => state.auth);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth && auth.token}`,
    },
  };

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const getUserDetails = async () => {
    try {
      setIsLoading(true);
      const userRespose = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile/${
          auth && auth.id
        }`,
        config
      );
      setformInputs({
        ...formInputs,
        shopName: userRespose.data.user.shopName,
        firstName: userRespose.data.user.firstName || '',
        lastName: userRespose.data.user.lastName || '',
        email: userRespose.data.user.email,
        image: userRespose.data.user.image,
        division: userRespose.data.user.division || '',
        district: userRespose.data.user.district || '',
        area: userRespose.data.user.area || '',
      });
      if (userRespose.data.user.image) {
        setImageUrl(
          `${process.env.REACT_APP_BACKEND_URL}/images/${userRespose.data.user.image}`
        );
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (formInputs.image && typeof formInputs.image !== 'string') {
      var reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(formInputs.image);
    }
  }, [formInputs.image]);

  const handleImagePick = (e) => {
    if (e.target.files) {
      setformInputs({
        ...formInputs,
        image: e.target.files[0],
      });
    }
    setImageUrl(null);
  };

  const handleRemoveImage = () => {
    setformInputs({
      ...formInputs,
      image: null,
    });
    setPreviewUrl(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformInputs({
      ...formInputs,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      for (let key in formInputs) {
        formData.append(key, formInputs[key]);
      }
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile/${auth.id}`,
        formData,
        config
      );

      if (response.status === 201) {
        setSuccess(true);
        setErrorMessage('');
        setIsLoading(false);
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
        setErrorMessage(`Post creation failed. ${composeMsg}`);
      }
      setIsLoading(false);
      console.log(error);
    }
  };

  const errorAndSuccessAlert = (
    <Box sx={{ mb: 2 }}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {success && (
        <Alert severity="success">Account details update successful.</Alert>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        px: { xs: 4, sm: 15 },
      }}
    >
      <Typography sx={{ pb: 1, pt: 1, mb: 3, fontSize: '1.3rem' }}>
        Manage your account
      </Typography>

      {errorAndSuccessAlert}

      <Grid
        container
        justifyContent="center"
        spacing={3}
        component="form"
        onSubmit={handleSubmit}
        sx={{ mb: 2 }}
      >
        <Grid item xs={12} sm={6}>
          <TextField
            label="Shop Name"
            name="shopName"
            fullWidth
            required
            value={formInputs.shopName}
            onChange={handleChange}
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="E-mail"
            name="email"
            fullWidth
            value={formInputs.email}
            inputProps={{ readOnly: true }}
            onChange={handleChange}
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            name="firstName"
            fullWidth
            value={formInputs.firstName}
            onChange={handleChange}
          ></TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            value={formInputs.lastName}
            onChange={handleChange}
          ></TextField>
        </Grid>
      </Grid>

      <Typography color="text.secondary" sx={{ mt: 4, mb: 2 }}>
        Display Picture
      </Typography>
      {!(imageUrl || previewUrl) && (
        <Button variant="outlined" component="label" sx={{ my: 2 }}>
          Upload Display Picture
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            hidden
            onChange={handleImagePick}
          />
        </Button>
      )}
      {previewUrl && (
        <Box>
          <img
            src={previewUrl}
            alt="preview"
            style={{
              borderRadius: '50%',
              border: '2px solid grey',
              padding: '.2rem',
            }}
            width="200px"
            height="200px"
          />
        </Box>
      )}
      {imageUrl && (
        <Box>
          <img
            src={imageUrl}
            alt="preview"
            style={{
              borderRadius: '50%',
              border: '2px solid grey',
              padding: '.2rem',
            }}
            width="200px"
            height="200px"
          />
        </Box>
      )}
      {(imageUrl || previewUrl) && (
        <Box>
          {previewUrl && (
            <Button variant="text" onClick={handleRemoveImage} sx={{ mr: 2 }}>
              Remove Photo
            </Button>
          )}

          <Button variant="text" component="label">
            Change Photo
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              hidden
              onChange={handleImagePick}
            />
          </Button>
        </Box>
      )}
      {errorAndSuccessAlert}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          type="submit"
          onClick={handleSubmit}
          sx={{ mt: 3 }}
        >
          Update account info
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <RouterLink to="/change-password">Change Password</RouterLink>
    </Box>
  );
};

export default ManageAccount;
