import {
  Alert,
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Button,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Spinner from '../components/shared/Spinner';
import DeleteIcon from '@mui/icons-material/Delete';
import { districtMapping } from '../data/districtMap';
import { categories } from '../data/bookCategory';
import ToastMessage from '../components/shared/ToastMessage';
import { useSelector } from 'react-redux';
import ConfirmationDialog from '../components/shared/ConfirmationDialog';

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
  price: 0,
  isActive: true,
};

const EditPost = () => {
  const { id: postId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const [formInputs, setFormInputs] = useState(formDefaultState);

  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const [toastOpen, setToastOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogConfirmAction, setDialogConfirmAction] = useState('');

  const [toastMessage, setToastMessage] = useState({
    severity: null,
    message: null,
  });

  const [success, setSuccess] = useState(false);

  const [imageUrl, setImageUrl] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  const [previewUrl, setPreviewUrl] = useState({
    previewUrl1: null,
    previewUrl2: null,
    previewUrl3: null,
  });

  console.log(formInputs);

  const auth = useSelector((state) => state.auth);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth && auth.token}`,
    },
  };

  const dialogOnClose = (e, status = 'cancel') => {
    setDialogOpen(false);
    if (status === 'confirm') {
      if (dialogConfirmAction === 'deactivate') {
        handleDeactivatePost();
      } else if (dialogConfirmAction === 'delete') {
        handleDeletePost();
      }
    }
  };

  const handleOpenDialog = (e, action) => {
    setDialogOpen(true);
    setDialogConfirmAction(action);
  };

  const getOffer = (sell, exchange) => {
    if (sell && exchange) {
      return 'both';
    } else if (sell && !exchange) {
      return 'sellOnly';
    } else if (!sell && exchange) {
      return 'exchangeOnly';
    }
  };

  const getPostDetails = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`
      );
      const offerType = getOffer(
        response.data.post.enableSellOffer,
        response.data.post.enableExchangeOffer
      );
      setFormInputs({ ...response.data.post, offerType });

      setImageUrl({
        image1: `${process.env.REACT_APP_BACKEND_URL}/images/${response.data.post.image1}`,
        image2: response.data.post.image2
          ? `${process.env.REACT_APP_BACKEND_URL}/images/${response.data.post.image2}`
          : null,
        image3: response.data.post.image3
          ? `${process.env.REACT_APP_BACKEND_URL}/images/${response.data.post.image3}`
          : null,
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getPostDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formInputs.image1 && typeof formInputs.image1 !== 'string') {
      createImagePreview('image1', 'previewUrl1');
    }
    if (formInputs.image2 && typeof formInputs.image2 !== 'string') {
      createImagePreview('image2', 'previewUrl2');
    }
    if (formInputs.image3 && typeof formInputs.image3 !== 'string') {
      createImagePreview('image3', 'previewUrl3');
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

  const handleImagePick = (e, newFile) => {
    if (e.target.files) {
      setFormInputs({
        ...formInputs,
        [newFile]: e.target.files[0],
      });
    }
  };
  const handleRemoveImageFromPreview = (imageNumber, previewNumber) => {
    setFormInputs({
      ...formInputs,
      [imageNumber]: null,
    });
    setPreviewUrl({
      ...previewUrl,
      [previewNumber]: null,
    });
  };

  const handleDeleteImage = async (imageFileName, imageNum) => {
    try {
      setIsLoading(true);
      const fileDeleteResponse = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/file/${imageFileName}`,
        config
      );

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/removeImage/${postId}?image=${imageNum}`,
        {},
        config
      );

      if (response.status === 201 && fileDeleteResponse === 200) {
        setFormInputs({
          ...formInputs,
          [imageNum]: null,
        });
        setImageUrl({
          ...imageUrl,
          [imageNum]: null,
        });

        setToastMessage({
          severity: 'success',
          message: 'Image deleted successfully',
        });
        setToastOpen(true);

        setIsLoading(false);
      } else {
        setToastMessage({
          severity: 'error',
          message: 'Image deletion failed',
        });
        setToastOpen(true);

        setIsLoading(false);
      }
    } catch (error) {
      setToastMessage({
        severity: 'error',
        message: 'Image deletion failed',
      });
      setToastOpen(true);

      setIsLoading(false);
    }
  };

  const handleLogoutToastClose = () => {
    setToastOpen(false);
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
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`,
        formData,
        config
      );

      if (response.status === 201) {
        setSuccess(true);
        setErrorMessage('');
        setSuccessMessage(`Post edit successful.`);
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
        setErrorMessage(`Edit failed. ${composeMsg}`);
      }
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInputs({
      ...formInputs,
      [name]: value,
    });
  };

  const handleDeletePost = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`,
        config
      );

      if (response.status === 200) {
        setSuccess(true);
        setErrorMessage('');
        setSuccessMessage(`Post deletion successful.`);
        setIsLoading(false);
      }
    } catch (error) {
      setSuccess(false);
      const composeMsg = error.response ? error.response.data.message : '';
      setErrorMessage(`Deletion failed. ${composeMsg}`);
      setIsLoading(false);
    }
  };

  const handleDeactivatePost = async () => {
    try {
      setIsLoading(true);

      const activationAction = formInputs.isActive ? 0 : 1;
      console.log(activationAction);
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/deactivatePost/${postId}?active=${activationAction}`,
        {},
        config
      );

      if (response.status === 201) {
        setSuccess(true);
        setErrorMessage('');
        const activationText =
          activationAction === 0 ? 'deactivation' : 'activation';
        setSuccessMessage(`Post ${activationText} successful.`);
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
        setErrorMessage(`Deactivation failed. ${composeMsg}`);
      }
      setIsLoading(false);
    }
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
        price: 0,
        enableSellOffer: false,
        enableExchangeOffer: true,
      });
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
          Edit post
        </Typography>

        <Box sx={{ mb: 2 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {success && (
            <Alert severity="success">
              Post Edit successful.{' '}
              <RouterLink to="/myAccount/#1">See your posts</RouterLink>.
            </Alert>
          )}
        </Box>

        <Grid
          container
          justifyContent="flex-start"
          spacing={3}
          component="form"
          onSubmit={handleSubmit}
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
              onChange={handleChange}
              sx={{ width: '100%' }}
            />
          </Grid>

          <Grid item xs={12} sm={4} style={{ textAlign: 'center' }}>
            {imageUrl.image1 && (
              <>
                <Box sx={{ border: '2px solid grey', borderRadius: 2, p: 1 }}>
                  <img src={imageUrl.image1} width="100%" alt="preview" />
                </Box>
                <Button
                  variant="text"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteImage(formInputs.image1, 'image1')}
                >
                  Delete Image 1
                </Button>
              </>
            )}

            {!imageUrl.image1 && (
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
                  startIcon={<DeleteIcon />}
                  onClick={() =>
                    handleRemoveImageFromPreview('image1', 'previewUrl1')
                  }
                >
                  Delete Image 1
                </Button>
              </>
            )}
          </Grid>

          <Grid item xs={12} sm={4} style={{ textAlign: 'center' }}>
            {imageUrl.image2 && (
              <>
                <Box sx={{ border: '2px solid grey', borderRadius: 2, p: 1 }}>
                  <img src={imageUrl.image2} width="100%" alt="preview" />
                </Box>
                <Button
                  variant="text"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteImage(formInputs.image2, 'image2')}
                >
                  Delete Image 2
                </Button>
              </>
            )}
            {!imageUrl.image2 && (
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
            )}

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
                  startIcon={<DeleteIcon />}
                  onClick={() =>
                    handleRemoveImageFromPreview('image2', 'previewUrl2')
                  }
                >
                  Delete Image 2
                </Button>
              </>
            )}
          </Grid>

          <Grid item xs={12} sm={4} style={{ textAlign: 'center' }}>
            {imageUrl.image3 && (
              <>
                <Box sx={{ border: '2px solid grey', borderRadius: 2, p: 1 }}>
                  <img src={imageUrl.image3} width="100%" alt="preview" />
                </Box>
                <Button
                  variant="text"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteImage(formInputs.image3, 'image3')}
                >
                  Delete Image 3
                </Button>
              </>
            )}
            {!imageUrl.image3 && (
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
            )}

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
                  startIcon={<DeleteIcon />}
                  onClick={() =>
                    handleRemoveImageFromPreview('image3', 'previewUrl3')
                  }
                >
                  Delete Image 3
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
              size="small"
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
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                sx={{ ml: 2 }}
                component={RouterLink}
                to="/myAccount#1"
              >
                Go to My Posts
              </Button>
              <Button variant="contained" type="submit" sx={{ ml: 2 }}>
                Save Changes
              </Button>
              {formInputs.isActive ? (
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ ml: 2 }}
                  onClick={(e) => handleOpenDialog(e, 'deactivate')}
                >
                  Deactivate Post
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  sx={{ ml: 2 }}
                  onClick={(e) => handleOpenDialog(e, 'deactivate')}
                >
                  Activate Post
                </Button>
              )}

              <Button
                variant="contained"
                color="error"
                sx={{ ml: 2 }}
                onClick={(e) => handleOpenDialog(e, 'delete')}
              >
                Delete Post
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
              {successMessage}
            </Alert>
          )}
        </Box>
      </Paper>
      <ConfirmationDialog
        dialogOpen={dialogOpen}
        dialogOnClose={dialogOnClose}
        dialogTitle="Confirm your action"
        dialogText="Please confirm before proceed. Once you confirm, cannot undo it."
      />
      <ToastMessage
        open={toastOpen}
        severity={toastMessage.severity}
        message={toastMessage.message}
        onClose={handleLogoutToastClose}
      />
    </>
  );
};

export default EditPost;
