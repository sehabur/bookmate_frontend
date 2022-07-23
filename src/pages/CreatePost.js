import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Grid,
  Button,
  Alert,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import Spinner from '../components/shared/Spinner';

import { districtMapping } from '../data/districtMap';
import { categories } from '../data/bookCategory';

const formDefaultState = {
  category: '',
  writer: '',
  title: '',
  description: '',
  image1: null,
  image2: null,
  image3: null,
  division: '',
  district: '',
  area: '',
  lat: null,
  long: null,
  enableExchangeOffer: true,
  enableSellOffer: true,
  offerType: 'both',
  price: '',
};

const previewUrlDefaultSet = {
  previewUrl1: null,
  previewUrl2: null,
  previewUrl3: null,
};

const CreatePost = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [success, setSuccess] = useState(false);

  const [formInputs, setFormInputs] = useState(formDefaultState);

  const [previewUrl, setPreviewUrl] = useState(previewUrlDefaultSet);

  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const userLoggedIn = auth && auth.isLoggedIn;

  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/signin?redirect=createPost');
    }
  }, [navigate, userLoggedIn]);

  useEffect(() => {
    if (!(formInputs.image1 || formInputs.image2 || formInputs.image3)) {
      return;
    } else {
      if (formInputs.image1) {
        createImagePreview('image1', 'previewUrl1');
      }
      if (formInputs.image2) {
        createImagePreview('image2', 'previewUrl2');
      }
      if (formInputs.image3) {
        createImagePreview('image3', 'previewUrl3');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formInputs.image1, formInputs.image2, formInputs.image3]);

  const createImagePreview = (fileName, previewName) => {
    var reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl({
        ...previewUrl,
        [previewName]: reader.result,
      });
    };
    reader.readAsDataURL(formInputs[fileName]);
  };

  const handleRemoveImage = (imageNumber, previewNumber) => {
    setFormInputs({
      ...formInputs,
      [imageNumber]: null,
    });
    setPreviewUrl({
      ...previewUrl,
      [previewNumber]: null,
    });
  };

  const handleImagePick = (e, newFile) => {
    if (e.target.files) {
      setFormInputs({
        ...formInputs,
        [newFile]: e.target.files[0],
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInputs({
      ...formInputs,
      [name]: value,
    });
  };

  const handleOfferChange = (e) => {
    const { value } = e.target;
    if (value === 'both') {
      setFormInputs({
        ...formInputs,
        offerType: value,
        enableSellOffer: true,
        enableExchangeOffer: true,
      });
    } else if (value === 'sellOnly') {
      setFormInputs({
        ...formInputs,
        offerType: value,
        enableSellOffer: true,
        enableExchangeOffer: false,
      });
    } else if (value === 'exchangeOnly') {
      setFormInputs({
        ...formInputs,
        offerType: value,
        enableSellOffer: false,
        enableExchangeOffer: true,
      });
    }
  };

  // const handleCheckboxChange = (e) => {
  //   const { name, checked } = e.target;
  //   setFormInputs({
  //     ...formInputs,
  //     [name]: checked,
  //   });
  // };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    // if (!(formInputs.enableExchangeOffer || formInputs.enableSellOffer)) {
    //   setErrorMessage('Please select at least 1 offer type');
    //   return;
    // } // Check if at least 1 offer is selected //

    try {
      setIsLoading(true);

      const formData = new FormData();
      for (let key in formInputs) {
        formData.append(key, formInputs[key]);
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts`,
        formData,
        config
      );

      if (response.status === 201) {
        setSuccess(true);
        setErrorMessage('');
        setFormInputs(formDefaultState);
        setPreviewUrl(previewUrlDefaultSet);
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

  return (
    <>
      <Spinner open={isLoading} />
      <Paper
        sx={{
          py: 2,
          px: { xs: 3, sm: 15 },
        }}
      >
        <Typography sx={{ pb: 1, pt: 1, mb: 3, fontSize: '1.3rem' }}>
          Create new post
        </Typography>

        <Box sx={{ mb: 2 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {success && (
            <Alert severity="success">
              Post creation successful. Continue to create another post or{' '}
              <RouterLink to="/myAccount/#1">see your posts</RouterLink>.
            </Alert>
          )}
        </Box>

        <Grid
          container
          justifyContent="flex-start"
          spacing={3}
          component="form"
          onSubmit={handlePostSubmit}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Category"
              name="category"
              fullWidth
              required
              value={formInputs.category}
              onChange={handleChange}
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Writer"
              name="writer"
              fullWidth
              value={formInputs.writer}
              onChange={handleChange}
              sx={{ width: '100%' }}
              required
            />
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Sub-category"
              name="subCategory"
              fullWidth
              value={formInputs.subCategory}
              onChange={handleChange}
              size="small"
            >
              {categories.map((option) => {
                if (option.category === formInputs.category) {
                  return option.subCategory.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ));
                }
              })}
            </TextField>
          </Grid> */}

          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              value={formInputs.title}
              onChange={handleChange}
              sx={{ width: '100%' }}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description (optional)"
              multiline
              name="description"
              rows={3}
              fullWidth
              value={formInputs.description}
              onChange={handleChange}
              size="small"
              sx={{ width: '100%' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Offer Type"
              name="offerType"
              fullWidth
              required
              value={formInputs.offerType}
              onChange={handleOfferChange}
            >
              <MenuItem value="both" selected>
                Both Sell and Exchange Offer
              </MenuItem>

              <MenuItem value="sellOnly">Only Sell Offer</MenuItem>

              <MenuItem value="exchangeOnly">Only Exchange Offer</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Price (Taka)"
              name="price"
              type="number"
              fullWidth
              value={formInputs.price}
              disabled={formInputs.offerType === 'exchangeOnly'}
              required={formInputs.offerType !== 'exchangeOnly'}
              onChange={handleChange}
              sx={{ width: '100%' }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              component="label"
              disabled={previewUrl.previewUrl1}
              sx={{ mb: 2 }}
            >
              Upload Image 1
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                hidden
                onChange={(e) => handleImagePick(e, 'image1')}
              />
            </Button>
            {!previewUrl.previewUrl1 && (
              <Typography sx={{ fontSize: '.8rem' }}>
                *please upload at least 1 image
              </Typography>
            )}

            {previewUrl.previewUrl1 && (
              <>
                <Box sx={{ border: '2px solid grey', borderRadius: 2, p: 1 }}>
                  <img
                    src={previewUrl.previewUrl1}
                    width="100%"
                    alt="preview"
                  />
                </Box>
                <Button
                  variant="text"
                  startIcon={<CloseIcon />}
                  onClick={() => handleRemoveImage('image1', 'previewUrl1')}
                >
                  Remove Image 1
                </Button>
              </>
            )}
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              component="label"
              disabled={previewUrl.previewUrl2}
              sx={{ mb: 2 }}
            >
              Upload Image 2
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                hidden
                onChange={(e) => handleImagePick(e, 'image2')}
              />
            </Button>

            {previewUrl.previewUrl2 && (
              <>
                <Box sx={{ border: '2px solid grey', borderRadius: 2, p: 1 }}>
                  <img
                    src={previewUrl.previewUrl2}
                    width="100%"
                    alt="preview"
                  />
                </Box>
                <Button
                  variant="text"
                  startIcon={<CloseIcon />}
                  onClick={() => handleRemoveImage('image2', 'previewUrl2')}
                >
                  Remove Image 2
                </Button>
              </>
            )}
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              component="label"
              disabled={previewUrl.previewUrl3}
              sx={{ mb: 2 }}
            >
              Upload Image 3
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                hidden
                onChange={(e) => handleImagePick(e, 'image3')}
              />
            </Button>

            {previewUrl.previewUrl3 && (
              <>
                <Box sx={{ border: '2px solid grey', borderRadius: 2, p: 1 }}>
                  <img
                    src={previewUrl.previewUrl3}
                    width="100%"
                    alt="preview"
                  />
                </Box>
                <Button
                  variant="text"
                  startIcon={<CloseIcon />}
                  onClick={() => handleRemoveImage('image3', 'previewUrl3')}
                >
                  Remove Image 3
                </Button>
              </>
            )}
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Division"
              name="division"
              fullWidth
              value={formInputs.division}
              onChange={handleChange}
              sx={{ width: '100%' }}
              size="small"
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
              value={formInputs.subCategory}
              onChange={handleChange}
              size="small"
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
              sx={{ width: '100%' }}
              size="small"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" type="submit" sx={{ mt: 3 }}>
                Create Post
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Post creation successful. Continue to create another post or{' '}
              <RouterLink to="/myAccount/#1">see your posts</RouterLink>.
            </Alert>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default CreatePost;
