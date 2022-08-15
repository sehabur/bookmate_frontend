import {
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Button,
  Box,
  Drawer,
  FormControl,
  Radio,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import MainCard from '../components/shared/MainCard';

import FilterListIcon from '@mui/icons-material/FilterList';

import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { postActions } from '../store';
import { districtMapping } from '../data/districtMap';
import { categories } from '../data/bookCategory';
import SearchIcon from '@mui/icons-material/Search';
import { blue } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';

const sortByOptions = [
  'Date: Newest on top',
  'Date: Oldest on top',
  // 'Nearest on top',
  'Price: High to low',
  'Price: Low to high',
];

const division = ['Dhaka', 'Chittagong'];

const district = ['Dhaka', 'Gazipur'];

const allDistricts = [];

districtMapping.forEach((currentValue) => {
  allDistricts.push(...currentValue.district);
});

const FindPost = () => {
  const theme = useTheme();

  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [filterOption, setFilterOption] = useState({
    sortBy: 'date=desc',
    location: {
      division: null,
      district: null,
      area: null,
    },
    offerType: {
      exchangeOffer: true,
      sellOffer: true,
    },
    category: 'All',
    search: null,
  });

  const [radioValue, setRadioValue] = useState();

  const [sortedOption, setSortedOption] = useState('Date: Newest on top');

  // const [sortingText, setSortingText] = useState('');

  const [openDrawer, setOpenDrawer] = useState(false);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const posts = useSelector((state) => state.post);

  const auth = useSelector((state) => state.auth);

  const userId = auth ? auth.id : '627bb5ef35ffb019b973d811'; // some random fake id //

  const handleChange = () => {};

  const getPostsByQyery = async (sortingText = '', byQuery = '') => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${byQuery}?user=${userId}&limit=50${sortingText}`
      );
      dispatch(postActions.loadPosts(response.data.posts));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getPostsByQyery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleDrawer = (state) => {
    setOpenDrawer(state);
  };

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const handleFilterOptionSelect = (e) => {
    setFilterOption({
      location: {
        [e.target.name]: e.target.value,
      },
      offerType: { ...filterOption.offerType },
      sortBy: filterOption.sortBy,
      search: filterOption.search,
    });
  };

  const handleCategoryOptionSelect = (e) => {
    setFilterOption({
      ...filterOption,
      category: e.target.value,
    });
  };

  const handleFilterOptionChecked = (e) => {
    setFilterOption({
      location: { ...filterOption.location },
      offerType: {
        ...filterOption.offerType,
        [e.target.name]: e.target.checked,
      },
      sortBy: filterOption.sortBy,
      search: filterOption.search,
    });
  };

  const buildQueryString = () => {
    const sortedBy = filterOption.sortBy.split('=');
    const reqBody = {
      [sortedBy[0]]: sortedBy[1],
      ...filterOption.location,
      ...filterOption.offerType,
      search: filterOption.search,
      category: filterOption.category,
    };
    let queryText = '';
    for (let key in reqBody) {
      if (reqBody[key]) {
        queryText += '&' + key + '=' + reqBody[key];
      }
    }
    return queryText;
  };

  const handleFilterOptionSubmit = async () => {
    setOpenDrawer(false);
    // setSortingText(buildQueryString());
    getPostsByQyery(buildQueryString(), 'byQuery');
  };

  const handleSortByOption = async (e) => {
    setSortedOption(e.target.value);

    const sortedOptionIndex = sortByOptions.indexOf(e.target.value);

    let text;
    switch (sortedOptionIndex) {
      case 0:
        text = 'date=desc';
        break;
      case 1:
        text = 'date=asc';
        break;
      // case 2:
      //   text = 'date=desc';
      //   break;
      case 2:
        text = 'price=desc';
        break;
      case 3:
        text = 'price=asc';
        break;
      default:
        text = 'date=desc';
    }
    setFilterOption({
      ...filterOption,
      sortBy: text,
    });
    // setSortingText(buildQueryString());
    getPostsByQyery(buildQueryString(), 'byQuery');
  };

  const handleSearchInput = (e) => {
    setFilterOption({
      ...filterOption,
      search: e.target.value,
    });
  };

  const handleSearch = () => {
    // const text = '&search=' + filterOption.search;
    // setSortingText(buildQueryString());
    getPostsByQyery(buildQueryString(), 'byQuery');
  };

  const filterMobileMenu = (
    <Box sx={{ px: 4, pt: 2, mb: 2 }}>
      <FormLabel>Sort results by</FormLabel>
      <TextField
        select
        fullWidth
        value={sortedOption}
        onChange={handleSortByOption}
        name="sortBy"
        size="small"
        sx={{ mt: 1, mb: 4 }}
      >
        {sortByOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <FormLabel>Filter results by Category</FormLabel>
      <TextField
        select
        fullWidth
        value={filterOption.category}
        onChange={handleCategoryOptionSelect}
        name="sortBy"
        size="small"
        sx={{ mt: 1, mb: 4 }}
      >
        <MenuItem value="All">All</MenuItem>
        {categories.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <FormControl>
        <FormLabel id="location" name="location">
          Filter results by location
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={radioValue}
          onChange={handleRadioChange}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              value="division"
              control={<Radio />}
              label="Division"
            />
            {radioValue === 'division' && (
              <TextField
                select
                fullWidth
                name="division"
                size="small"
                sx={{ width: '150px' }}
                value={filterOption.division}
                onChange={handleFilterOptionSelect}
              >
                {districtMapping.map((option) => (
                  <MenuItem key={option.division} value={option.division}>
                    {option.division}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              value="district"
              control={<Radio />}
              variant="filled"
              label="District"
            />
            {radioValue === 'district' && (
              <TextField
                select
                fullWidth
                name="district"
                size="small"
                sx={{ width: '150px' }}
                value={filterOption.district}
                onChange={handleFilterOptionSelect}
              >
                {allDistricts.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel value="area" control={<Radio />} label="Area" />
            {radioValue === 'area' && (
              <TextField
                fullWidth
                name="area"
                size="small"
                sx={{ width: '150px' }}
                value={filterOption.area}
                onChange={handleFilterOptionSelect}
              />
            )}
          </Box>
        </RadioGroup>
      </FormControl>

      {/* <FormGroup>
        <FormControlLabel
          control={<Checkbox />}
          label="Division"
          onChange={handleFilterOptionSelect}
          name="division"
        />
        {filterOption.division && (
          <TextField
            select
            fullWidth
            // value={currency}
            name="division"
            size="small"
            // onChange={handleFilterOptionSelect}
          >
            {division.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      </FormGroup>

      <FormGroup>
        <FormControlLabel
          control={<Checkbox />}
          label="District"
          name="district"
          onChange={handleFilterOptionSelect}
        />
        {filterOption.district && (
          <TextField
            select
            fullWidth
            // value={currency}
            name="district"
            size="small"
            // onChange={handleFilterOptionSelect}
          >
            {district.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      </FormGroup> */}
      <FormControl sx={{ mt: 3 }}>
        <FormLabel id="type" name="type">
          Filter results by offer type
        </FormLabel>

        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Exchange offer available"
            onChange={handleFilterOptionChecked}
            checked={filterOption.offerType.exchangeOffer}
            name="exchangeOffer"
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Sell offer available"
            onChange={handleFilterOptionChecked}
            checked={filterOption.offerType.sellOffer}
            name="sellOffer"
          />
        </FormGroup>
      </FormControl>
      <Box sx={{ mb: 1 }}>
        <Button
          variant="contained"
          onClick={handleFilterOptionSubmit}
          sx={{ mt: 3 }}
          fullWidth
        >
          Apply
        </Button>
      </Box>
    </Box>
  );

  return (
    <Paper sx={{ py: 2 }}>
      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={() => handleToggleDrawer(false)}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" textAlign="center" sx={{ mt: 1 }}>
            Sort and filtering options
          </Typography>
          <Button
            variant="text"
            color="warning"
            startIcon={<CloseIcon fontSize="small" />}
            onClick={() => handleToggleDrawer(false)}
          >
            Cancel
          </Button>
        </Box>

        {filterMobileMenu}
      </Drawer>

      <Typography sx={{ px: 2, pb: 1, fontSize: '1.3rem' }}>
        Find the book you need!
      </Typography>
      <Divider variant="middle" sx={{ mb: 2 }} />
      <Grid container spacing={3}>
        <Grid item sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
          {filterMobileMenu}
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box>
            {/* GPS options. will work later */}
            {/* <Stack direction="row" alignItems="center" sx={{ px: 2 }}>
              <Typography>
                Enable location and then press 'Locate Me' to set your precise
                location
              </Typography>
              <Button variant="contained" sx={{ ml: 2 }}>
                <Typography>Locate Me!</Typography>
              </Button>
            </Stack> */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TextField
                value={filterOption.search}
                onChange={handleSearchInput}
                name="sortBy"
                size="small"
                fullWidth
                placeholder="Search title or writer"
                InputProps={{
                  endAdornment: (
                    <>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ mr: 1.8 }}
                      />
                      <IconButton onClick={handleSearch}>
                        <SearchIcon color="primary" />
                      </IconButton>
                    </>
                  ),
                }}
                sx={{ mx: 2, mt: 2, maxWidth: '490px' }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                mt: 3,
                mb: 1,
                alignItems: 'center',
                px: 2,
              }}
            >
              <Typography sx={{ fontSize: '1.3rem' }}>
                Search results
              </Typography>
              {matchesSmDown && (
                <Button
                  variant="text"
                  startIcon={<FilterListIcon />}
                  sx={{ ml: 5 }}
                  onClick={() => handleToggleDrawer(true)}
                >
                  Filter Options
                </Button>
              )}
            </Box>

            {posts && posts.length > 0 ? (
              <Box sx={{ maxWidth: '520px' }}>
                {posts.map((post) => (
                  <Box sx={{ m: 2 }}>
                    <MainCard data={post} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ my: 4 }}>
                <Typography textAlign="center" variant="h6">
                  No books to show
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FindPost;
