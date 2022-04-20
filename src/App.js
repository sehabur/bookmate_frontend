import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth={false} disableGutters>
        <Box sx={{ maxWidth: '1024px', mx: 'auto', px: 2, mt: 2 }}>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/findPost" element={<FindPost />} />
              <Route path="/createPost" element={<CreatePost />} />
              <Route path="/myAccount" element={<MyAccount />} />

              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </BrowserRouter>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
