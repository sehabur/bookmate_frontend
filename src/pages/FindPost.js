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
  Button,
  Box,
  Drawer,
  FormControl,
  Radio,
  useTheme,
  useMediaQuery,
  IconButton,
  Autocomplete,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import MainCard from '../components/shared/MainCard';

import FilterListIcon from '@mui/icons-material/FilterList';

import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { postActions } from '../store';
import { districtMapping } from '../data/districtMap';
import { categories } from '../data/bookCategory';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Spinner from '../components/shared/Spinner';
import PaginationCustom from '../components/shared/PaginationCustom';

import { institution } from '../data/institution';

const sortByOptions = [
  'Date: Newest on top',
  'Date: Oldest on top',
  // 'Nearest on top',
  'Price: High to low',
  'Price: Low to high',
];

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
    currentInstitution: null,
    category: 'All',
    search: null,
  });

  const [posts, setPosts] = useState([]);

  const [radioValue, setRadioValue] = useState();

  const [sortedOption, setSortedOption] = useState('Date: Newest on top');

  const [triggerSortedOption, setTriggerSortedOption] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // const posts = useSelector((state) => state.post);

  const [currentPosts, setCurrentPosts] = useState(null);

  const [imageCachingDisableKey, setImageCachingDisableKey] = useState(false);

  const auth = useSelector((state) => state.auth);

  const userId = auth ? auth.id : 0;

  const getPostsByQyery = async (sortingText = '', byQuery = '') => {
    try {
      console.log(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${byQuery}?type=findpost&user=${userId}&limit=60${sortingText}`
      );
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${byQuery}?type=findpost&user=${userId}&limit=60${sortingText}`
      );
      setPosts(response.data.posts);
      console.log(response.data.posts);
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

  useEffect(() => {
    if (triggerSortedOption) {
      getPostsByQyery(buildQueryString(), 'byQuery');
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setTriggerSortedOption(false);
    }
  }, [triggerSortedOption]);

  const handleToggleDrawer = (state) => {
    setOpenDrawer(state);
  };

  const handleRadioChange = (event) => {
    setFilterOption({
      ...filterOption,
      location: {
        division: null,
        district: null,
        area: null,
      },
    });

    setRadioValue(event.target.value);
  };

  const handleFilterOptionSelect = (e) => {
    setFilterOption({
      ...filterOption,
      location: {
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleCategoryOptionSelect = (e) => {
    setFilterOption({
      ...filterOption,
      category: e.target.value,
    });
  };

  const handleInstitutionOptionSelect = (e) => {
    setFilterOption({
      ...filterOption,
      currentInstitution: e.target.textContent,
    });
  };

  const handleFilterOptionChecked = (e) => {
    setFilterOption({
      ...filterOption,
      offerType: {
        ...filterOption.offerType,
        [e.target.name]: e.target.checked,
      },
    });
  };

  const buildQueryString = () => {
    const sortedBy = filterOption.sortBy.split('=');
    const reqBody = {
      [sortedBy[0]]: sortedBy[1],
      ...filterOption.location,
      ...filterOption.offerType,
      search: filterOption.search,
      category: filterOption?.category?.replace('&', 'AND'),
      currentInstitution: filterOption?.currentInstitution?.replace('&', 'AND'),
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
    setTriggerSortedOption(true);
    setOpenDrawer(false);
  };

  const handleSearchInput = (e) => {
    setFilterOption({
      ...filterOption,
      search: e.target.value,
    });
  };

  const selectCurrentItems = (currentItems) => {
    window.scrollTo(0, 0);

    setCurrentPosts(currentItems);
  };

  const handleSearch = () => {
    getPostsByQyery(buildQueryString(), 'byQuery');
  };

  const imageCachingDisable = (status) => {
    setImageCachingDisableKey(status);
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
        name="category"
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

      <FormLabel>Filter results by Institution</FormLabel>
      <Autocomplete
        disablePortal
        freeSolo
        options={institution}
        renderInput={(params) => (
          <TextField
            name="currentInstitution"
            {...params}
            size="small"
            sx={{ mt: 1, mb: 4 }}
          />
        )}
        value={filterOption.currentInstitution}
        onChange={(e) => {
          handleInstitutionOptionSelect(e);
        }}
      />

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
      <Spinner open={isLoading} />

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

            {posts ? (
              <Box sx={{ maxWidth: '520px' }}>
                {currentPosts &&
                  currentPosts.map((post) => (
                    <Box sx={{ m: 2 }}>
                      <MainCard
                        data={post}
                        imageCachingDisableKey={imageCachingDisableKey}
                        imageCachingDisable={imageCachingDisable}
                      />
                    </Box>
                  ))}

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <PaginationCustom
                    itemsArray={posts}
                    itemsPerPage={12}
                    selectCurrentItems={selectCurrentItems}
                    imageCachingDisable={imageCachingDisable}
                  />
                </Box>
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
