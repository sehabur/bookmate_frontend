import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Container, CssBaseline, ThemeProvider, Box } from '@mui/material';

import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import FindPost from './pages/FindPost';
import CreatePost from './pages/CreatePost';
import MyAccount from './pages/MyAccount';
import Header from './components/shared/Header';
import BottomNav from './components/shared/BottomNav';
import theme from './context/theme';
import Footer from './components/shared/Footer';
import BottomNavCompansator from './components/shared/BottomNavCompansator';
import PostDetails from './pages/PostDetails';
import store from './store';
import EditPost from './pages/EditPost';
import AllPostByUser from './pages/AllPostByUser';
import Notification from './pages/Notification';
import ExploreShops from './pages/ExploreShops';
import Messages from './pages/Messages';

const App = () => {
  const [isMessagePage, setIsMessagePage] = useState(false);

  const messagePageCallback = (status) => {
    setIsMessagePage(status);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container component="main" maxWidth={false} disableGutters>
          <Box
            sx={{
              maxWidth: '1024px',
              mx: 'auto',
              mt: { xs: 2.5, sm: 5 },
              mb: { xs: 2.5, sm: 0 },
            }}
          >
            <BrowserRouter>
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/post/:id" element={<PostDetails />} />
                <Route path="/allPost/user/:id" element={<AllPostByUser />} />
                <Route path="/findPost" element={<FindPost />} />
                <Route path="/createPost" element={<CreatePost />} />
                <Route path="/editPost/:id" element={<EditPost />} />
                <Route path="/myAccount" element={<MyAccount />} />
                <Route path="/notification" element={<Notification />} />
                <Route path="/exploreShops" element={<ExploreShops />} />
                <Route
                  path="/messages"
                  element={<Messages callback={messagePageCallback} />}
                />

                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
            </BrowserRouter>
          </Box>
          {!isMessagePage && <Footer />}
          <BottomNavCompansator />
        </Container>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
