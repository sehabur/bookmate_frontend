import React from 'react';
import {
  Button,
  Paper,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  IconButton,
  Divider,
} from '@mui/material';

import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import MainCard from '../components/shared/MainCard';

const Dashboard = () => {
  const theme = useTheme();
  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Paper sx={{ px: 2, py: 1.5 }}>
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
      </Paper>

      <Stack
        direction={matchesSmDown ? 'column' : 'row'}
        justifyContent={matchesSmDown ? 'center' : 'space-between'}
        alignItems="stretch"
        sx={{ display: { xs: 'none', sm: 'flex' }, mt: 2 }}
      >
        <Paper
          sx={{
            width: { sm: '32%' },
            p: 2,
            mb: matchesSmDown && 2,
          }}
          component={Button}
        >
          <Box sx={{ textAlign: 'center' }}>
            <ContentPasteSearchIcon color="primary" fontSize="large" />
          </Box>
          <Typography>
            Find a post by specific location and/or category
          </Typography>
          <IconButton>
            <ArrowForwardIosIcon />
          </IconButton>
        </Paper>

        <Paper
          sx={{ width: { sm: '32%' }, p: 3, mb: matchesSmDown && 2 }}
          component={Button}
        >
          <Box sx={{ textAlign: 'center' }}>
            <AddBoxIcon color="primary" fontSize="large" />
          </Box>

          <Typography>Create a post and start sharing books</Typography>
          <IconButton>
            <ArrowForwardIosIcon />
          </IconButton>
        </Paper>

        <Paper sx={{ width: { sm: '32%' }, p: 3 }} component={Button}>
          <Box sx={{ textAlign: 'center' }}>
            <ManageAccountsIcon color="primary" fontSize="large" />
          </Box>

          <Typography>
            Manage your account details, precise location, area etc.
          </Typography>
          <IconButton>
            <ArrowForwardIosIcon />
          </IconButton>
        </Paper>
      </Stack>

      <Paper sx={{ mt: 2, py: 2 }}>
        <Typography variant="h5" sx={{ px: 2, pb: 1, fontSize: '1.3rem' }}>
          Latest Posts
        </Typography>
        <Divider
          variant="middle"
          sx={{ display: { xs: 'none', sm: 'block' }, mb: 2 }}
        />
        <MainCard sx={{ pb: 3 }} />
        <MainCard sx={{ pb: 3 }} />
        <MainCard sx={{ pb: 3 }} />
        <MainCard />
      </Paper>
    </Box>
  );
};

export default Dashboard;
