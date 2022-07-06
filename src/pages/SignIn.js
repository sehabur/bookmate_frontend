import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Alert, FormGroup } from '@mui/material';

import { Paper } from '@mui/material';
import Spinner from '../components/shared/Spinner';

import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../store';
import axios from 'axios';

// import ToastMessage from '../components/shared/ToastMessage';

const SignIn = ({ redirect }) => {
  const redirection = redirect ? redirect : '/';

  const [isLoading, setIsLoading] = useState(false);

  // const [loginSuccess, setLoginSuccess] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth) {
      if (auth.isLoggedIn) {
        navigate(redirection);
      }
    }
  }, [auth, navigate, redirection]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        formData
      );
      if (response.status === 200) {
        dispatch(authActions.login(response.data.user));

        if (formData.rememberMe) {
          localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        }
        // setLoginSuccess(true);
      }
      setIsLoading(false);
    } catch (error) {
      if (error.response) {
        if (error.response.data) {
          setErrorMessage(`Login Failed. ${error.response.data.message}`);
        } else {
          setErrorMessage(`Login Failed. Error Occured.`);
        }
      } else {
        setErrorMessage(`Login Failed. Error Occured`);
      }
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.name === 'rememberMe'
          ? event.target.checked
          : event.target.value,
    });
  };

  // const handleLoginToastColse = () => {
  //   setLoginSuccess(false);
  // };

  return (
    <>
      <Spinner open={isLoading} />

      <Paper sx={{ mt: 2, px: 5, py: 3, maxWidth: '550px', mx: 'auto' }}>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />

          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              label="Keep me signed in"
              checked={formData.rememberMe}
              name="rememberMe"
              color="primary"
              onChange={handleInputChange}
            />
          </FormGroup>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2, mb: 3 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="space-between">
            <Grid item sx={{ mb: { xs: 2, sm: 0 } }}>
              <Link component={RouterLink} to="#">
                <Typography>Forgot password?</Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup">
                <Typography>Don't have an account? Sign Up</Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {/* <ToastMessage
        keepMounted
        open={loginSuccess}
        severity="success"
        message="Logout Successful!"
        onClose={handleLoginToastColse}
      /> */}
    </>
  );
};

export default SignIn;
