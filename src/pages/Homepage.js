import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Carousel } from 'react-carousel-minimal';

import LatestBooks from '../components/homepage/LatestBooks';
import NearestBooks from '../components/homepage/NearestBooks';

import TaskAltIcon from '@mui/icons-material/TaskAlt';

import {
  Paper,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  Divider,
  Button,
} from '@mui/material';
import { yellow, blue, grey } from '@mui/material/colors';

import ban1 from '../assets/ban_1.jpg';
import ban2 from '../assets/ban_2.jpg';
import ban3 from '../assets/ban_3.jpg';
import banner1 from '../assets/boiexchange-banner.jpg';
import bannerMobile from '../assets/boiexchange-banner-mobile.jpg';

import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/shared/Spinner';
import axios from 'axios';
import { postActions } from '../store';
import InstituteBooks from '../components/homepage/InstituteBooks';
import AdvancedSearch from '../components/shared/AdvancedSearch';

// const tabItems = [
//   {
//     title: 'Latest Books',
//     component: <LatestBooks />,
//   },
//   {
//     title: 'Nearest Books',
//     component: <NearestBooks />,
//   },
// ];

// const TabPanel = (props) => {
//   const { children, value, index, ...other } = props;

//   return (
//     <Box
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
//     </Box>
//   );
// };

const bannerImage = [
  {
    image: ban2,
  },
  {
    image: ban1,
  },

  {
    image: ban3,
  },
];

const Homepage = () => {
  const theme = useTheme();

  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [isLoading, setIsLoading] = useState(false);

  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const userId = auth ? auth.id : 0;

  const isLoggedIn = auth ? auth.isLoggedIn : false;

  console.log(auth);
  // const location = useLocation();
  // const [value, setValue] = useState(0);
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  // useEffect(() => {
  //   const tabIndex = location.hash ? Number(location.hash.replace('#', '')) : 0;
  //   setValue(tabIndex);
  // }, [location]);

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // useEffect(() => {
  //   if (auth && auth.id) {
  //     getPosts();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [auth]);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts?type=homepage&user=${userId}&limit=6`
      );
      dispatch(postActions.loadPosts(response.data.posts));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Paper>
      <Spinner open={isLoading} />
      {matchesSmDown && (
        <Box
          sx={{
            textAlign: 'center',
            p: 2,
          }}
          style={{
            'background-image': `linear-gradient(to right, #eff, ${yellow[100]})`,
          }}
        >
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: grey[800],
            }}
          >
            Get started by exploring{' '}
            <Typography
              component={RouterLink}
              to="/howitworks"
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: blue[800],
              }}
            >
              how this website works
            </Typography>
          </Typography>
        </Box>
      )}

      <Box sx={{ position: 'relative', maxWidth: '1024px' }}>
        <Box sx={{ width: '100%', filter: 'brightness(30%) grayscale(10%)' }}>
          <img
            src={matchesSmDown ? bannerMobile : banner1}
            alt="banner"
            width="100%"
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '50%', sm: '50%' },
            left: { xs: '16px', sm: '64px' },
            transform: `translate(0, -50%)`,
            pr: 2,
          }}
        >
          <Typography
            sx={{
              color: `${grey[200]}`,
              fontSize: { xs: '2.2rem', sm: '3.5rem' },
              fontFamily: 'Fira Sans, sans-serif',
            }}
          >
            BOOK NEVER GETS OLD
          </Typography>

          <Typography
            sx={{
              color: `${grey[400]}`,
              fontSize: { xs: '1.4rem', sm: '2.2rem' },
              fontFamily: 'Fira Sans, sans-serif',
            }}
          >
            Let's not keep it unused in your shelf
          </Typography>

          <Typography
            sx={{
              color: `${grey[300]}`,
              fontSize: { xs: '1.7rem', sm: '2.5rem' },
              fontFamily: 'Fira Sans, sans-serif',
              fontWeight: 'bold',
              fontStyle: 'italic',
              mt: { xs: 5, sm: 8 },
            }}
          >
            EXCHANGE it for another one !
          </Typography>
        </Box>
      </Box>

      {/* <Box
        sx={{
          backgroundImage: `url(${banner1})`,
          height: '512px',
          backgroundSize: '1024px',
          backgroungFilter: 'brightness(30%) grayscale(50%)',
        }}
      >
        <Typography variant="h1" sx={{ color: 'white' }}>
          BOOK never gets old
        </Typography>
      </Box> */}

      {/* <Box>
        <Carousel
          data={bannerImage}
          automatic={false}
          time={6000}
          width="1024px"
          height="350px"
          radius="0"
          slideNumber={false}
          dots={true}
          slideImageFit="cover"
          style={{
            textAlign: 'center',
            maxWidth: '1024px',
            maxHeight: '350px',
          }}
        />
      </Box> */}

      <Paper
        sx={{
          width: '100%',
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        style={{
          'background-image': 'linear-gradient(to right, #eff, #eef)',
        }}
        elevation={0}
      >
        {/* Exchange */}
        <Box
          sx={{
            px: 5,
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
              color: blue[700],
              mb: 1,
            }}
          >
            Exchange books with friends!
          </Typography>

          <Typography sx={{ fontSize: '1rem', textAlign: 'center', my: 2 }}>
            Find friends at your institute/area and exchange books easily!
          </Typography>

          <Box>
            <Stack direction="row" alignItems="flex-start" sx={{ my: 1.5 }}>
              <TaskAltIcon
                sx={{ fontSize: '1.5rem', mr: 0.8 }}
                color="success"
              />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Infinite book reading opportunity
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="flex-start" sx={{ my: 1.5 }}>
              <TaskAltIcon
                sx={{ fontSize: '1.5rem', mr: 0.8 }}
                color="success"
              />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Build book network
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="flex-start" sx={{ my: 1.5 }}>
              <TaskAltIcon
                sx={{ fontSize: '1.5rem', mr: 0.8 }}
                color="success"
              />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Hastle free exchange
              </Typography>
            </Stack>
          </Box>

          <Button
            variant="contained"
            sx={{
              borderRadius: '10rem',
              fontSize: '1rem',
              px: 4,
              mt: 2,
            }}
            component={RouterLink}
            to="/exploreNearestBooks"
          >
            Get Started
          </Button>
        </Box>

        <Divider
          orientation={matchesSmDown ? 'horizontal' : 'vertical'}
          flexItem
        />

        {/* Buy */}
        <Box
          sx={{
            px: 5,
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
              color: blue[700],
              mb: 1,
            }}
          >
            Buy books at cheapest rate!
          </Typography>

          <Typography sx={{ fontSize: '1rem', textAlign: 'center', my: 2 }}>
            Find sellers at your institute/area abd buy their books
          </Typography>

          <Box>
            <Stack direction="row" alignItems="flex-start" sx={{ my: 1.5 }}>
              <TaskAltIcon
                sx={{ fontSize: '1.5rem', mr: 0.8 }}
                color="success"
              />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Lowest possible price
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="flex-start" sx={{ my: 1.5 }}>
              <TaskAltIcon
                sx={{ fontSize: '1.5rem', mr: 0.8 }}
                color="success"
              />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Advanced search options
              </Typography>
            </Stack>
          </Box>

          <Button
            variant="contained"
            sx={{
              borderRadius: '10rem',
              fontSize: '1rem',
              px: 4,
              mt: 2,
            }}
            component={RouterLink}
            to="/exploreNearestBooks"
          >
            Get Started
          </Button>
        </Box>

        <Divider
          orientation={matchesSmDown ? 'horizontal' : 'vertical'}
          flexItem
        />

        {/* Sell */}
        <Box
          sx={{
            px: 5,
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
              color: blue[700],
            }}
          >
            Sell books after reading!
          </Typography>

          <Typography sx={{ fontSize: '1rem', textAlign: 'center', my: 2 }}>
            Post free ads of your books as many as you want
          </Typography>

          <Box>
            <Stack direction="row" alignItems="flex-start" sx={{ my: 1.5 }}>
              <TaskAltIcon
                sx={{ fontSize: '1.5rem', mr: 0.8 }}
                color="success"
              />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Own a virtual book shop
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="flex-start" sx={{ my: 1.5 }}>
              <TaskAltIcon
                sx={{ fontSize: '1.5rem', mr: 0.8 }}
                color="success"
              />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Earn from books you already read
              </Typography>
            </Stack>
          </Box>

          <Button
            variant="contained"
            sx={{
              borderRadius: '10rem',
              fontSize: '1rem',
              px: 4,
              mt: 2,
            }}
            component={RouterLink}
            to="/createPost"
          >
            Get Started
          </Button>
        </Box>
      </Paper>

      {/* <Box
        sx={{
          textAlign: 'center',
          p: 2,
          bgcolor: '#fee',
        }}
      >
        <Typography
          sx={{
            fontSize: '1.6rem',
            fontWeight: 'bold',
            color: blue[700],
          }}
        >
          New Writer's Den!
        </Typography>

        <Typography variant="h6" color="text.secondary">
          Are you a new writer? Post your book and start reaching reader
          community
        </Typography>
        <Button
          variant="outlined"
          endIcon={<KeyboardArrowRightIcon />}
          sx={{
            mt: 1,
            fontSize: '1.1rem',
          }}
        >
          Learn More
        </Button>
      </Box> */}

      {/* <Stack
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
      </Stack> */}

      <Box
        sx={{
          display: 'flex',
          flexDirection: isLoggedIn ? 'column' : 'column-reverse',
        }}
      >
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: '1.6rem',
              textAlign: 'center',
              mb: 2,
              px: 2,
            }}
          >
            {auth?.currentInstitution
              ? `BOOKS AT "${auth?.currentInstitution?.toUpperCase()}"`
              : 'BOOKS AT YOUR INSTITUTE'}
          </Typography>
          <InstituteBooks isLoggedIn={isLoggedIn} />
        </Box>

        <Box sx={{ py: 4, bgcolor: '#FAFFFA' }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: '1.6rem',
              textAlign: 'center',
              mb: 2,
              px: 2,
            }}
          >
            {auth?.area
              ? `BOOKS NEAR "${auth?.area?.toUpperCase()}"`
              : 'BOOKS NEAR YOU'}
          </Typography>
          <NearestBooks isLoggedIn={isLoggedIn} />
        </Box>

        <Box sx={{ py: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: '1.6rem',
              textAlign: 'center',
              mb: 2,
            }}
          >
            LATEST BOOKS
          </Typography>
          <LatestBooks />
        </Box>
      </Box>

      <Box sx={{ bgcolor: '#FAFAEA' }}>
        <AdvancedSearch />
      </Box>
    </Paper>
  );
};

export default Homepage;
