import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Alert,
  Divider,
  MenuItem,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { authActions } from '../../store';

import Spinner from '../shared/Spinner';
import { dhakaCityArea, districtMapping } from '../../data/districtMap';
import { institution } from '../../data/institution';
import { compressImageFile } from '../../helper';

const formDefaultState = {
  shopName: '',
  email: '',
  phoneNo: '',
  firstName: '',
  lastName: '',
  image: null,
  division: '',
  district: '',
  area: '',
  currentInstitution: '',
};

const ManageAccount = () => {
  const dispatch = useDispatch();

  const [formInputs, setFormInputs] = useState(formDefaultState);

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [success, setSuccess] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);

  const [locationRadioButtonValue, setLocationRadioButtonValue] =
    useState(null);

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

  useEffect(() => {
    if (formInputs.image && typeof formInputs.image !== 'string') {
      var reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(formInputs.image);
    }
  }, [formInputs.image]);

  const getUserDetails = async () => {
    try {
      console.log(process.env);
      setIsLoading(true);
      const userRespose = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile/${
          auth && auth.id
        }`,
        config
      );
      const {
        shopName,
        firstName,
        lastName,
        email,
        phoneNo,
        image,
        division,
        district,
        area,
        currentInstitution,
      } = userRespose.data.user;

      if (division === 'Dhaka' && district === 'Dhaka') {
        setLocationRadioButtonValue('insideDhaka');
      } else {
        setLocationRadioButtonValue('outsideDhaka');
      }

      setFormInputs({
        ...formInputs,
        shopName,
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        phoneNo: phoneNo || '',
        image: image || null,
        division: division || '',
        district: district || '',
        area: area || '',
        currentInstitution: currentInstitution || '',
      });
      if (image) {
        setImageUrl(`${process.env.REACT_APP_CLOUD_IMAGE_URL}/${image}`);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleImagePick = async (e) => {
    if (e.target.files) {
      const imageFile = e.target.files[0];
      const compressedFile = await compressImageFile(imageFile, 0.08);
      setFormInputs({
        ...formInputs,
        image: compressedFile,
      });
    }
    setImageUrl(null);
  };

  const handleRemoveImage = () => {
    setFormInputs({
      ...formInputs,
      image: null,
    });
    setPreviewUrl(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInputs({
      ...formInputs,
      [name]: value,
    });
  };

  const handleRadioChange = ({ target: { value: targetValue } }) => {
    setLocationRadioButtonValue(targetValue);
    if (targetValue === 'insideDhaka') {
      setFormInputs({
        ...formInputs,
        division: 'Dhaka',
        district: 'Dhaka',
        area: '',
      });
    } else if (targetValue === 'outsideDhaka') {
      setFormInputs({
        ...formInputs,
        division: '',
        district: '',
        area: '',
      });
    }
  };

  const handleAutoCompleteChange = (event, targetName) => {
    setFormInputs({
      ...formInputs,
      [targetName]: event.target.textContent,
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
        dispatch(
          authActions.updateUserLocation({
            division: formInputs.division,
            district: formInputs.district,
            area: formInputs.area,
          })
        );
        setPreviewUrl(null);
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

  console.log(formInputs);

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
      <Spinner open={isLoading} />
      <Typography sx={{ pb: 1, pt: 1, mb: 3, fontSize: '1.3rem' }}>
        Manage your account
      </Typography>

      {errorAndSuccessAlert}

      <Grid
        container
        justifyContent="space-between"
        spacing={3}
        component="form"
        onSubmit={handleSubmit}
        sx={{ mb: 2 }}
      >
        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: '1.1rem',
              color: 'primary.main',
            }}
          >
            Basic Information
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Username"
            name="shopName"
            fullWidth
            required
            value={formInputs.shopName}
            onChange={handleChange}
          ></TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            disablePortal
            freeSolo
            options={institution}
            renderInput={(params) => (
              <TextField
                name="currentInstitution"
                required
                {...params}
                label="Current Institution"
                helperText="Current school/college/university/office name"
                onChange={handleChange}
              />
            )}
            value={formInputs.currentInstitution}
            onChange={(e) => {
              handleAutoCompleteChange(e, 'currentInstitution');
            }}
          />
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
            label="Phone Number"
            name="phoneNo"
            type="number"
            fullWidth
            required
            value={formInputs.phoneNo}
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

        <Grid item xs={12}>
          <Typography
            sx={{
              mt: 3,
              fontSize: '1.1rem',
              color: 'primary.main',
            }}
          >
            Location Details
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <RadioGroup
            name="location-radio"
            value={locationRadioButtonValue}
            onChange={handleRadioChange}
            sx={{ display: 'block' }}
          >
            <FormControlLabel
              value="insideDhaka"
              control={<Radio />}
              label="Inside Dhaka City"
            />

            <FormControlLabel
              value="outsideDhaka"
              control={<Radio />}
              label="Outside Dhaka City"
            />
          </RadioGroup>
        </Grid>

        {locationRadioButtonValue === 'insideDhaka' ? (
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="area"
              freeSolo
              options={dhakaCityArea}
              renderInput={(params) => (
                <TextField
                  name="area"
                  required
                  {...params}
                  label="Area"
                  onChange={handleChange}
                />
              )}
              value={formInputs.area}
              onChange={(e) => {
                handleAutoCompleteChange(e, 'area');
              }}
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Division"
                name="division"
                fullWidth
                value={formInputs.division}
                onChange={handleChange}
                required
              >
                {districtMapping.map((option) => (
                  <MenuItem key={option.id} value={option.division}>
                    {option.division}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="District"
                name="district"
                fullWidth
                value={formInputs.district}
                onChange={handleChange}
                required
              >
                {districtMapping.map((option) => {
                  if (option.division === formInputs.division) {
                    return option.district.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ));
                  }
                })}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Area"
                name="area"
                fullWidth
                value={formInputs.area}
                onChange={handleChange}
                required
              />
            </Grid>
          </>
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography
          sx={{
            mt: 5,
            mb: 2,
            fontSize: '1.1rem',
            color: 'primary.main',
          }}
        >
          Display Picture
        </Typography>
      </Grid>
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
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
      <Box sx={{ my: 4 }}>
        <Button
          variant="outlined"
          component={RouterLink}
          to="/managePassword/change"
        >
          Change your account password
        </Button>
      </Box>
    </Box>
  );
};

export default ManageAccount;
