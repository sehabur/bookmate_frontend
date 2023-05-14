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
import {
  Paper,
  Alert,
  MenuItem,
  Autocomplete,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Spinner from '../components/shared/Spinner';

import { dhakaCityArea, districtMapping } from '../data/districtMap';
import { institution } from '../data/institution';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const [success, setSuccess] = useState(false);

  const [signUpStep, setSignUpStep] = useState(1);

  const [radioValue, setRadioValue] = useState('insideDhaka');

  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    password: '',
    division: 'Dhaka',
    district: 'Dhaka',
    area: '',
    currentInstitution: '',
    phoneNo: '',
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

  const handleAutoCompleteChange = (event, targetName) => {
    setFormData({
      ...formData,
      [targetName]: event.target.textContent,
    });
  };

  const handleRadioChange = ({ target: { value: targetValue } }) => {
    setRadioValue(targetValue);
    if (targetValue === 'insideDhaka') {
      setFormData({
        ...formData,
        division: 'Dhaka',
        district: 'Dhaka',
        area: '',
      });
    } else if (targetValue === 'outsideDhaka') {
      setFormData({
        ...formData,
        division: '',
        district: '',
        area: '',
      });
    }
  };

  const handleBackPress = () => {
    setSignUpStep(1);
  };

  const handleFinalSubmit = async (event) => {
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

  const handleStepOneSubmit = () => {
    setSignUpStep(2);
  };

  console.log(formData);

  const errorAndSuccessAlert = (
    <>
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
    </>
  );

  return (
    <>
      <Spinner open={isLoading} />
      <Paper sx={{ mt: 2, px: 5, py: 3, maxWidth: '550px', mx: 'auto' }}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ textAlign: 'center', mb: 3 }}
        >
          Sign Up
        </Typography>

        {errorAndSuccessAlert}
        {signUpStep === 1 && (
          <Box component="form" onSubmit={handleStepOneSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
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
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ my: 3 }}>
              Continue
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/signin">
                  <Typography>Already have an account? Sign in</Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}

        {signUpStep === 2 && (
          <Box component="form" onSubmit={handleFinalSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    mt: 2,
                    fontSize: '1.1rem',
                    color: 'primary.main',
                  }}
                >
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="shopName"
                  fullWidth
                  label="Username"
                  required
                  value={formData.shopName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  name="phoneNo"
                  type="number"
                  fullWidth
                  required
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>

              <Grid item xs={12}>
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
                      onChange={handleInputChange}
                    />
                  )}
                  value={formData.currentInstitution}
                  onChange={(e) => {
                    handleAutoCompleteChange(e, 'currentInstitution');
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  sx={{
                    mt: 2,
                    fontSize: '1.1rem',
                    color: 'primary.main',
                  }}
                >
                  Location Details
                </Typography>
              </Grid>

              <RadioGroup
                name="location-radio"
                value={radioValue}
                onChange={handleRadioChange}
                sx={{ display: 'block', ml: 2.3, mt: 1 }}
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

              {radioValue === 'insideDhaka' ? (
                <Grid item xs={12}>
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
                        onChange={handleInputChange}
                      />
                    )}
                    value={formData.area}
                    onChange={(e) => {
                      handleAutoCompleteChange(e, 'area');
                    }}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Division"
                      name="division"
                      fullWidth
                      required
                      value={formData.division}
                      onChange={handleInputChange}
                    >
                      {districtMapping.map((option) => (
                        <MenuItem key={option.id} value={option.division}>
                          {option.division}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      label="District"
                      name="district"
                      fullWidth
                      required
                      value={formData.district}
                      onChange={handleInputChange}
                    >
                      {districtMapping.map((option) => {
                        if (option.division === formData.division) {
                          return option.district.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ));
                        }
                      })}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Area"
                      name="area"
                      fullWidth
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  sx={{ my: 3 }}
                  onClick={handleBackPress}
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ my: 3 }}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        {errorAndSuccessAlert}
      </Paper>
    </>
  );
};

export default SignUp;
