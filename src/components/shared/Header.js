import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { styled, alpha } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import CreateIcon from '@mui/icons-material/Create';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const userLoggedIn = true; // dummy //

  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);

  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = (urlPath) => {
    setIsDrawerOpen(false);
    navigate(urlPath);
  };

  const renderProfileMenu = (
    <Menu
      anchorEl={profileMenuAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id="profile-menu"
      keepMounted
      open={isProfileMenuOpen}
      onClose={handleProfileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <ManageAccountsIcon color="primary" />
        </ListItemIcon>
        <ListItemText>
          <Typography>My Account</Typography>
        </ListItemText>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <LogoutIcon color="primary" />
        </ListItemIcon>
        <ListItemText>
          <Typography>Logout</Typography>
        </ListItemText>
      </MenuItem>
    </Menu>
  );

  const drawerContent = (
    <SwipeableDrawer
      anchor="left"
      open={isDrawerOpen}
      onClose={handleDrawerClose}
    >
      <Box sx={{ mt: 7 }}>
        <Divider />

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleDrawerClose('/findPost')}>
            <ListItemIcon>
              <ContentPasteSearchIcon />
            </ListItemIcon>
            <ListItemText primary="Find Post" />
          </ListItemButton>
        </ListItem>
        <Divider />

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleDrawerClose('/createPost')}>
            <ListItemIcon>
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary="Create Post" />
          </ListItemButton>
        </ListItem>
        <Divider />

        <Box sx={{ mt: 2, ml: 3, mr: 8, mb: 2 }}>
          <Typography variant="h6">My Account</Typography>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerClose('/myAccount/#0')}>
              <Typography>Manage Account</Typography>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerClose('/myAccount/#1')}>
              <Typography>My Posts</Typography>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerClose('/myAccount/#2')}>
              <Typography>History</Typography>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerClose('/myAccount/#3')}>
              <Typography>Saved Items</Typography>
            </ListItemButton>
          </ListItem>
        </Box>
        <Divider />
      </Box>
    </SwipeableDrawer>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          {drawerContent}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            // sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Boi Bondhu
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Button
              variant="text"
              color="inherit"
              startIcon={<ContentPasteSearchIcon />}
              sx={{ mx: 1.5 }}
            >
              Find Post
            </Button>
            <Button
              variant="text"
              color="inherit"
              startIcon={<CreateIcon />}
              sx={{ mx: 1.5 }}
            >
              Create Post
            </Button>
          </Box>
          <Box sx={{ display: 'flex' }}>
            {userLoggedIn ? (
              <IconButton
                size="large"
                color="inherit"
                sx={{ mx: 1.5 }}
                onClick={handleProfileMenuOpen}
              >
                <AccountCircleIcon />
              </IconButton>
            ) : (
              <Button
                variant="contained"
                color="success"
                sx={{ mx: 1.5, px: 2.5, borderRadius: 5 }}
              >
                Login
              </Button>
            )}
          </Box>
          {renderProfileMenu}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
};

export default Header;
