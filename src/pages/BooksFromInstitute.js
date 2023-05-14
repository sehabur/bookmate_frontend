import React, { useState } from 'react';
import PaginationCustom from '../components/shared/PaginationCustom';
import { Box, Grid, Paper, Typography } from '@mui/material';
import MainCard from '../components/shared/MainCard';
import { useSelector } from 'react-redux';
import AdvancedSearch from '../components/shared/AdvancedSearch';

const BooksFromInstitute = () => {
  const posts = useSelector((state) => state.post);

  const auth = useSelector((state) => state.auth);

  const [currentPosts, setCurrentPosts] = useState(null);

  const [imageCachingDisableKey, setImageCachingDisableKey] = useState(false);

  const imageCachingDisable = (status) => {
    setImageCachingDisableKey(status);
  };

  const selectCurrentItems = (currentItems) => {
    window.scrollTo(0, 0);
    setCurrentPosts(currentItems);
  };

  return (
    <Paper>
      <Typography
        variant="h5"
        sx={{
          fontSize: '1.6rem',
          textAlign: 'center',
          mb: 2,
          px: 2,
          pt: 3,
        }}
      >
        {auth?.currentInstitution
          ? `BOOKS AT "${auth?.currentInstitution?.toUpperCase()}"`
          : 'BOOKS AT YOUR INSTITUTE'}
      </Typography>
      {posts.institutionPosts ? (
        <Box>
          <Grid container>
            {currentPosts &&
              currentPosts.map((post) => (
                <Grid Item xs={12} sm={6}>
                  <Box sx={{ m: 2 }}>
                    <MainCard
                      data={post}
                      imageCachingDisableKey={imageCachingDisableKey}
                      imageCachingDisable={imageCachingDisable}
                    />
                  </Box>
                </Grid>
              ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', pb: 4, pt: 2 }}>
            <PaginationCustom
              itemsArray={posts.institutionPosts}
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

      <AdvancedSearch />
    </Paper>
  );
};

export default BooksFromInstitute;
