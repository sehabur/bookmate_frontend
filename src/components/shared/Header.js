import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// import { io } from 'socket.io-client';

import {
  Button,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Avatar,
  Popover,
  Badge,
  Chip,
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
import { blueGrey } from '@mui/material/colors';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import CreateIcon from '@mui/icons-material/Create';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ExploreIcon from '@mui/icons-material/Explore';
import MessageIcon from '@mui/icons-material/Message';
import StorefrontIcon from '@mui/icons-material/Storefront';

import { useSelector, useDispatch } from 'react-redux';
import { authActions, notificationActions } from '../../store';
import ToastMessage from './ToastMessage';

import { yellow, blue } from '@mui/material/colors';
import axios from 'axios';
import Spinner from './Spinner';
import ReactTimeAgo from 'react-time-ago';
import OrderAcceptDialog, { callOrderAcceptApi } from './OrderAcceptDialog';

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
      width: '325px',
    },
  },
}));

// const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

const Header = () => {
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);

  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [logoutSuccess, setLogoutSuccess] = useState(false);

  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const [searchedItemAnchorEl, setSearchedItemAnchorEl] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState(null);

  const [searchedItems, setSearchedItems] = useState(false);

  const [noSearchItem, setNoSearchItem] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [acceptedOrderNotif, setAcceptedOrderNotif] = useState(null);

  const [newMessageCount, setNewMessageCount] = useState(0);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  const userId = auth ? auth.id : '627bb5ef35ffb019b973d811'; // some random fake id //

  const notificationItemsList = useSelector((state) => state.notification);

  const userLoggedIn = auth ? auth.isLoggedIn : false;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth && auth.token}`,
    },
  };

  useEffect(() => {
    const authDataFromStorage = JSON.parse(localStorage.getItem('userInfo'));
    dispatch(authActions.login(authDataFromStorage));
  }, [dispatch]);

  useEffect(() => {
    getNotificationsByUser();
    getNewMessageCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const getNewMessageCount = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/newMessageCount/user/${
          auth && auth.id
        }`,
        config
      );
      setNewMessageCount(response.data.count);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const getNotificationsByUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/notification/user/${
          auth && auth.id
        }`,
        config
      );
      dispatch(
        notificationActions.loadNotifications(response.data.notification)
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // const handleDialogClose = (e, action) => {
  //   if (action === 'confirm') {
  //     setRequestAcceptStatus('accepted');
  //   }
  //   setDialogOpen(false);
  // };

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
    if (urlPath === '/myShop') {
      if (userLoggedIn) {
        navigate(`/allPost/user/${userId}`);
      } else {
        navigate('/signin');
      }
    } else {
      navigate(urlPath);
    }
  };

  const handleMyAccountClick = () => {
    handleProfileMenuClose();
    navigate('/myAccount');
  };

  const handleMyShopClick = () => {
    handleProfileMenuClose();
    navigate(`/allPost/user/${userId}`);
  };

  const handleLogoutClick = () => {
    handleProfileMenuClose();
    localStorage.removeItem('userInfo');
    dispatch(authActions.logout());
    setLogoutSuccess(true);
    navigate('/');
  };

  const handleLogoutToastColse = () => {
    setLogoutSuccess(false);
  };

  const handleOpenNotificationMenu = (e) => {
    setNotificationAnchorEl(e.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleSearchedItemMenuClose = () => {
    setSearchedItems(null);
    setNoSearchItem(false);
    setSearchedItemAnchorEl(null);
  };

  const handleAcceptRequest = async (
    status,
    { _id: notifId, order, post, bookTitle }
  ) => {
    try {
      setIsLoading(true);

      if (status === 'accepted') {
        setDialogOpen(true);
        setAcceptedOrderNotif({ notifId, order, post, bookTitle });
      } else if (status === 'rejected') {
        callOrderAcceptApi(status, order, post, bookTitle, auth.token);
        dispatch(notificationActions.deactivateNotification(notifId));
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
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
      <Typography
        sx={{ mt: 1, mb: 1.4, mx: 1.3, maxWidth: '220px' }}
        textAlign="center"
      >
        Hello, {auth && auth.shopName} !
      </Typography>
      <Divider />

      <MenuItem onClick={handleMyShopClick} sx={{ mt: 1.2 }}>
        <ListItemIcon>
          <StorefrontIcon color="primary" />
        </ListItemIcon>
        <ListItemText>
          <Typography>My Shop</Typography>
        </ListItemText>
      </MenuItem>

      <MenuItem onClick={handleMyAccountClick} sx={{ mt: 0.7 }}>
        <ListItemIcon>
          <ManageAccountsIcon color="primary" />
        </ListItemIcon>
        <ListItemText>
          <Typography>My Account</Typography>
        </ListItemText>
      </MenuItem>

      <MenuItem onClick={handleLogoutClick} sx={{ mt: 0.5, mb: 0.8 }}>
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
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
          <Button onClick={() => handleDrawerClose('/')}>
            <img
              src="book-exchange-logo.png"
              alt="logo"
              width="80"
              height="80"
            />
          </Button>
        </Box>

        <Divider />

        <ListItem
          disablePadding
          sx={{ ml: { xs: 1, sm: 3 }, mr: { xs: 1, sm: 7 } }}
        >
          <ListItemButton onClick={() => handleDrawerClose('/findPost')}>
            <ListItemIcon>
              <ContentPasteSearchIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Find Books" />
          </ListItemButton>
        </ListItem>
        <Divider />

        <ListItem
          disablePadding
          sx={{ ml: { xs: 1, sm: 3 }, mr: { xs: 1, sm: 7 } }}
        >
          <ListItemButton onClick={() => handleDrawerClose('/createPost')}>
            <ListItemIcon>
              <CreateIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Create Post" />
          </ListItemButton>
        </ListItem>
        <Divider />

        <ListItem
          disablePadding
          sx={{ ml: { xs: 1, sm: 3 }, mr: { xs: 1, sm: 7 } }}
        >
          <ListItemButton onClick={() => handleDrawerClose('/exploreShops')}>
            <ListItemIcon>
              <ExploreIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Explore Shops" />
          </ListItemButton>
        </ListItem>
        <Divider />

        <ListItem
          disablePadding
          sx={{ ml: { xs: 1, sm: 3 }, mr: { xs: 1, sm: 7 } }}
        >
          <ListItemButton onClick={() => handleDrawerClose('/notification')}>
            <ListItemIcon>
              <NotificationsNoneIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '1rem' }}>
                    Notifications
                  </Typography>
                  {notificationItemsList && notificationItemsList.length > 0 && (
                    <Chip
                      label={notificationItemsList.length}
                      color="error"
                      size="small"
                      sx={{
                        fontSize: '.8rem',
                        borderRadius: '50%',
                        ml: 2,
                      }}
                    />
                  )}
                </Box>
              }
            />
          </ListItemButton>
        </ListItem>
        <Divider />

        <ListItem
          disablePadding
          sx={{ ml: { xs: 1, sm: 3 }, mr: { xs: 1, sm: 7 } }}
        >
          <ListItemButton onClick={() => handleDrawerClose('/messages')}>
            <ListItemIcon>
              <MessageIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '1rem' }}>Messages</Typography>
                  {newMessageCount > 0 && (
                    <Chip
                      label={newMessageCount}
                      color="error"
                      size="small"
                      sx={{
                        fontSize: '.8rem',
                        borderRadius: '50%',
                        ml: 2,
                      }}
                    />
                  )}
                </Box>
              }
            />
          </ListItemButton>
        </ListItem>
        <Divider />

        <ListItem
          disablePadding
          sx={{ ml: { xs: 1, sm: 3 }, mr: { xs: 1, sm: 7 } }}
        >
          <ListItemButton onClick={() => handleDrawerClose('/myShop')}>
            <ListItemIcon>
              <StorefrontIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="My Shop" />
          </ListItemButton>
        </ListItem>
        <Divider />

        <Box sx={{ mt: 2, ml: 5, mr: 8, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, mt: 2.7 }}>
            My Account
          </Typography>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleDrawerClose('/myAccount#0')}
              sx={{ p: 0, pl: 2, pb: 0.8 }}
            >
              <ListItemText
                primary="Manage Account"
                sx={{ color: 'primary.dark' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleDrawerClose('/myAccount#1')}
              sx={{ p: 0, pl: 2, pb: 0.8 }}
            >
              <ListItemText primary="My Posts" sx={{ color: 'primary.dark' }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleDrawerClose('/myAccount#2')}
              sx={{ p: 0, pl: 2, pb: 0.8 }}
            >
              <ListItemText primary="History" sx={{ color: 'primary.dark' }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleDrawerClose('/myAccount#3')}
              sx={{ p: 0, pl: 2, pb: 0.8 }}
            >
              <ListItemText
                primary="Saved Items"
                sx={{ color: 'primary.dark' }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
        <Divider />
      </Box>
    </SwipeableDrawer>
  );

  const getPostsBySearchQyery = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/byQuery?user=${userId}&limit=10&exchangeOffer=true&sellOffer=true&search=${searchText}`
      );
      if (response.data.posts.length < 1) {
        setNoSearchItem(true);
        setSearchedItems(null);
      } else {
        setSearchedItems(response.data.posts);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      getPostsBySearchQyery();
    }, 3000);
    return () => clearTimeout(debounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setSearchedItemAnchorEl(e.currentTarget);
  };

  const handleDialogClose = (e, action) => {
    if (action === 'confirm') {
      callOrderAcceptApi(
        'accepted',
        acceptedOrderNotif.order,
        acceptedOrderNotif.post,
        acceptedOrderNotif.bookTitle,
        auth.token
      );
      dispatch(
        notificationActions.deactivateNotification(acceptedOrderNotif.notifId)
      );
    }
    setDialogOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ bgcolor: blueGrey[900], py: { xs: 0.7, sm: 0 } }}
      >
        <Toolbar>
          {drawerContent}

          <Box
            component={RouterLink}
            to="/"
            sx={{ pt: 1, mx: 5, display: { xs: 'none', sm: 'block' } }}
          >
            <img
              src="book-exchange-logo.png"
              alt="logo"
              width="70"
              height="70"
            />
          </Box>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: { xs: 1, sm: 3 } }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search title or writer"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSearch}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Button
              variant="text"
              startIcon={<ContentPasteSearchIcon sx={{ color: yellow[600] }} />}
              sx={{ mx: 1.5, color: blueGrey[50] }}
              component={RouterLink}
              to="/findPost"
            >
              Find Books
            </Button>
            <Button
              variant="text"
              color="inherit"
              startIcon={<CreateIcon sx={{ color: yellow[600] }} />}
              sx={{ mx: 1.5, color: blueGrey[50] }}
              component={RouterLink}
              to="/createPost"
            >
              Create Post
            </Button>
            {userLoggedIn && (
              <>
                <IconButton
                  aria-label="messages"
                  sx={{ color: blueGrey[50], mx: 1 }}
                  component={RouterLink}
                  to="/messages"
                >
                  <Badge color="error" badgeContent={newMessageCount}>
                    <MessageIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  aria-label="notification"
                  sx={{ color: blueGrey[50], mx: 1 }}
                  onClick={handleOpenNotificationMenu}
                >
                  <Badge
                    color="error"
                    badgeContent={
                      notificationItemsList ? notificationItemsList.length : 0
                    }
                  >
                    <NotificationsNoneIcon />
                  </Badge>
                </IconButton>
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex' }}>
            {userLoggedIn ? (
              <Avatar
                alt={auth && auth.shopName}
                sx={{
                  width: 36,
                  height: 36,
                  ml: 2,
                  mr: 2,
                  bgcolor: blue[700],
                  color: yellow[600],
                }}
                src={`${process.env.REACT_APP_CLOUD_IMAGE_URL}/${
                  auth && auth.image
                }`}
                onClick={handleProfileMenuOpen}
              />
            ) : (
              <Button
                variant="outlined"
                sx={{ mx: 1.5, px: 2, borderRadius: 1, color: yellow[600] }}
                component={RouterLink}
                to="/signin"
              >
                Login
              </Button>
            )}
          </Box>
          {renderProfileMenu}
        </Toolbar>
      </AppBar>
      <Toolbar />

      <ToastMessage
        open={logoutSuccess}
        severity="success"
        message="Logout Successful!"
        onClose={handleLogoutToastColse}
      />

      {/* Searched Item menu */}
      {searchedItems && searchedItems.length > 0 && (
        <Popover
          id="notification-item-menu"
          anchorEl={searchedItemAnchorEl}
          open={!!searchedItemAnchorEl}
          onClose={handleSearchedItemMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <>
            <Box
              sx={{
                py: 2,
                minWidth: '280px',
                maxWidth: '450px',
                maxHeight: '450px',
              }}
            >
              <Divider />
              {searchedItems.map((item) => (
                <Box
                  component={RouterLink}
                  to={`/post/${item._id}`}
                  onClick={handleSearchedItemMenuClose}
                  sx={{ textDecoration: 'none' }}
                >
                  <Box sx={{ px: 3, py: 1 }}>
                    <Typography sx={{ fontSize: '1rem' }}>
                      {item.title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 0.5, fontSize: '.8rem' }}
                    >
                      {item.district}, {item.category}
                    </Typography>
                    <Typography
                      textAlign="right"
                      color="text.secondary"
                      sx={{ fontSize: '.75rem' }}
                    >
                      posted{' '}
                      <ReactTimeAgo
                        date={item.createdAt}
                        locale="en-US"
                        timeStyle="round-minute"
                      />
                    </Typography>
                  </Box>
                  <Divider />
                </Box>
              ))}
            </Box>
          </>
        </Popover>
      )}

      {noSearchItem && (
        <Popover
          id="search-item-menu"
          anchorEl={searchedItemAnchorEl}
          open={!!searchedItemAnchorEl}
          onClose={handleSearchedItemMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {' '}
          <Box
            sx={{
              p: 2,
              maxWidth: '450px',
              maxHeight: '450px',
              minWidth: '200px',
              minHeight: '60px',
            }}
          >
            <Typography>No books found</Typography>
          </Box>
        </Popover>
      )}

      {/* notification item menu */}
      <Popover
        id="notification-item-menu"
        anchorEl={notificationAnchorEl}
        open={!!notificationAnchorEl}
        onClose={handleNotificationMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Spinner open={isLoading} />
        {notificationItemsList && notificationItemsList.length > 0 ? (
          <Box sx={{ width: '100%', maxWidth: '475px', py: 2 }}>
            <Divider />
            {notificationItemsList.slice(0, 3).map((notification) => (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mr: 3,
                    pt: 1.3,
                    pb: 1,
                  }}
                >
                  <NotificationsIcon color="primary" sx={{ mx: 2 }} />
                  <Box onClick={handleNotificationMenuClose}>
                    <Typography>{notification.text}</Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: '.8rem' }}
                    >
                      <ReactTimeAgo
                        date={notification.createdAt}
                        locale="en-US"
                        timeStyle="round-minute"
                      />
                    </Typography>
                    {notification.type === 'reqSent' && notification.isActive && (
                      <Box sx={{ my: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="info"
                          sx={{ mr: 1.5 }}
                          component={RouterLink}
                          to={`/allPost/user/${notification.sender}`}
                        >
                          Explore Books
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          sx={{ mr: 1.5 }}
                          onClick={() =>
                            handleAcceptRequest('accepted', notification)
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          sx={{ mr: 1.5 }}
                          onClick={() =>
                            handleAcceptRequest('rejected', notification)
                          }
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                    {/* {notification.type === 'reqAck' && (
                      <Box sx={{ my: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="info"
                          sx={{ mr: 1.5 }}
                          component={RouterLink}
                          to={`/allPost/user/${notification.sender}`}
                        >
                          Explore Books
                        </Button>
                      </Box>
                    )} */}
                  </Box>
                </Box>
                <Divider />
              </>
            ))}
            {notificationItemsList && notificationItemsList.length > 3 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: 1,
                }}
              >
                <Button
                  sx={{ mx: 'auto' }}
                  component={RouterLink}
                  to="/notification"
                  onClick={handleNotificationMenuClose}
                >
                  See all notifications
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ p: 1.5 }}>No Notifications</Box>
        )}
      </Popover>
      <OrderAcceptDialog
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </Box>
  );
};

export default Header;
