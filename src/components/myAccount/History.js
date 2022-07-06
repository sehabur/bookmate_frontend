import React, { useState, useEffect } from 'react';

import RequestCard from '../shared/RequestCard';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Spinner from '../shared/Spinner';
import { Box, Grid, Typography } from '@mui/material';

const History = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [orders, setOrders] = useState();

  const auth = useSelector((state) => state.auth);

  const getOrdersByUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/user/${
          auth && auth.id
        }`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth && auth.token}`,
          },
        }
      );
      setOrders(response.data.orders);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getOrdersByUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Spinner open={isLoading} />
      {orders && orders.length > 0 ? (
        <Box sx={{ ml: 2 }}>
          <Grid container>
            {orders.map((order) => (
              <Grid Item xs={12} sm={6}>
                <Box sx={{ mr: 2, mb: 2 }}>
                  <RequestCard data={order} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box sx={{ my: 4 }}>
          <Typography textAlign="center" variant="h6">
            No requests to show
          </Typography>
        </Box>
      )}
    </>
  );
};
export default History;
