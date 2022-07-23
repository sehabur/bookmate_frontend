import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import CreateIcon from '@mui/icons-material/Create';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const bottomNavActions = ['/', '/findPost', '/createPost', '/myAccount'];

const BottomNav = () => {
  const [value, setValue] = useState(null);

  const location = useLocation();

  useEffect(() => {
    setValue(bottomNavActions.indexOf(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Paper
      sx={{
        display: { sm: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
      }}
      elevation={5}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          component={Link}
          to={bottomNavActions[0]}
        />
        <BottomNavigationAction
          label="Find Books"
          icon={<ContentPasteSearchIcon />}
          component={Link}
          to={bottomNavActions[1]}
        />
        <BottomNavigationAction
          label="Create Post"
          icon={<CreateIcon />}
          component={Link}
          to={bottomNavActions[2]}
        />
        <BottomNavigationAction
          label="Account"
          icon={<ManageAccountsIcon />}
          component={Link}
          to={bottomNavActions[3]}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
