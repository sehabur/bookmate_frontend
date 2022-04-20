import React from 'react';
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

const SignIn = () => {
  return (
    <Paper sx={{ mt: 5, px: 5, py: 3, maxWidth: '500px', mx: 'auto' }}>
      <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
        Sign In
      </Typography>
      {/* <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}> */}
      <Box component="form" sx={{ mt: 1 }}>
        {/* {errorMessage && <Alert severity="error">{errorMessage}</Alert>} */}
        <TextField
          type="email"
          margin="normal"
          required
          fullWidth
          label="Email Address"
          name="email"
          autoFocus
          //   onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          //   onChange={handleInputChange}
        />

        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Keep me signed in"
            // checked={formData.rememberMe}
            name="rememberMe"
            color="primary"
            // onChange={handleInputChange}
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
  );
};

export default SignIn;
