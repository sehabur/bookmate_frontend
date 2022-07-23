import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import ManageAccount from '../components/myAccount/ManageAccount';
import MyPosts from '../components/myAccount/MyPosts';
import SavedItems from '../components/myAccount/SavedItems';
import History from '../components/myAccount/History';
import { Paper } from '@mui/material';
import { useSelector } from 'react-redux';

const tabItems = [
  {
    title: 'Account',
    component: <ManageAccount />,
  },
  {
    title: 'My Posts',
    component: <MyPosts />,
  },
  {
    title: 'History',
    component: <History />,
  },
  {
    title: 'Saved Items',
    component: <SavedItems />,
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

const MyAccount = () => {
  const location = useLocation();

  const [value, setValue] = useState(0);

  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const userLoggedIn = auth && auth.isLoggedIn;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/signin');
    }
  }, [navigate, userLoggedIn]);

  useEffect(() => {
    const tabIndex = location.hash ? Number(location.hash.replace('#', '')) : 0;
    setValue(tabIndex);
  }, [location]);

  return (
    <Paper sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          variant="scrollable"
          scrollButtons
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabItems.map((item) => (
            <Tab key={item.title} label={item.title} />
          ))}
        </Tabs>
      </Box>
      {tabItems.map((item, index) => (
        <TabPanel key={index} value={value} index={index}>
          {item.component}
        </TabPanel>
      ))}
    </Paper>
  );
};

export default MyAccount;
