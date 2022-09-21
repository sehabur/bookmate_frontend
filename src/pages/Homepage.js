import React, { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';

import LatestBooks from '../components/homepage/LatestBooks';
import NearestBooks from '../components/homepage/NearestBooks';

import {
  Tabs,
  Tab,
  Paper,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  IconButton,
} from '@mui/material';
import { yellow, blue } from '@mui/material/colors';

import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CreateIcon from '@mui/icons-material/Create';

const tabItems = [
  {
    title: 'Latest Books',
    component: <LatestBooks />,
  },
  {
    title: 'Nearest Books',
    component: <NearestBooks />,
  },
];

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </Box>
  );
};

const Homepage = () => {
  const location = useLocation();

  const theme = useTheme();

  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const tabIndex = location.hash ? Number(location.hash.replace('#', '')) : 0;
    setValue(tabIndex);
  }, [location]);

  return (
    <>
      {/* GPS work. will do later */}
      {/* <Paper sx={{ px: 2, py: 1.5, mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Typography sx={{ mr: 1 }}>
            Enable location and then press 'Locate Me' to set your precise
            location
          </Typography>
          <Button variant="contained">
            <Typography>Locate Me!</Typography>
          </Button>
        </Stack>
      </Paper> */}

      <Stack
        direction={matchesSmDown ? 'column' : 'row'}
        justifyContent={matchesSmDown ? 'center' : 'space-between'}
        alignItems="stretch"
        sx={{ display: { xs: 'none', sm: 'flex' }, mb: 2 }}
      >
        <Paper
          sx={{
            width: { sm: '32%' },
            p: 3,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            bgcolor: blue[700],
          }}
          component={RouterLink}
          to="/findPost"
        >
          <Box sx={{ textAlign: 'center' }}>
            <ContentPasteSearchIcon
              sx={{ color: yellow[600] }}
              color="primary"
              fontSize="large"
            />
          </Box>
          <Typography sx={{ pl: 2, color: 'white' }}>
            Find books of your interest by category or location
          </Typography>
          <IconButton>
            <ArrowForwardIosIcon sx={{ color: yellow[600] }} />
          </IconButton>
        </Paper>

        <Paper
          sx={{
            width: { sm: '32%' },
            p: 3,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            bgcolor: blue[700],
          }}
          component={RouterLink}
          to="/createPost"
        >
          <Box sx={{ textAlign: 'center' }}>
            <CreateIcon fontSize="large" sx={{ color: yellow[600] }} />
          </Box>

          <Typography sx={{ ml: 2, color: 'white' }}>
            Create a post and start sharing books with friends
          </Typography>
          <IconButton>
            <ArrowForwardIosIcon sx={{ color: yellow[600] }} />
          </IconButton>
        </Paper>

        <Paper
          sx={{
            width: { sm: '32%' },
            p: 3,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            bgcolor: blue[700],
          }}
          component={RouterLink}
          to="/myAccount"
        >
          <Box sx={{ textAlign: 'center' }}>
            <ManageAccountsIcon sx={{ color: yellow[600] }} fontSize="large" />
          </Box>

          <Typography sx={{ ml: 2, color: 'white' }}>
            Manage your account details, favorite books etc.
          </Typography>
          <IconButton>
            <ArrowForwardIosIcon sx={{ color: yellow[600] }} />
          </IconButton>
        </Paper>
      </Stack>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant={matchesSmDown && 'fullWidth'}
          >
            {tabItems.map((item) => (
              <Tab
                key={item.title}
                label={item.title}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              />
            ))}
          </Tabs>
        </Box>
        {tabItems.map((item, index) => (
          <TabPanel value={value} index={index}>
            {item.component}
          </TabPanel>
        ))}
      </Paper>
    </>
  );
};

export default Homepage;
