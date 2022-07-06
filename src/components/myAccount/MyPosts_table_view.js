import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import Spinner from '../shared/Spinner';

import noImage from '../../assets/no_image_placeholder.jpg';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const MyPosts = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [posts, setPosts] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  // const userId = auth ? auth.id : null

  const getPostsByUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/user/${auth.id}`
      );
      setPosts(response.data.user.posts);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage('No posts found');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostsByUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Spinner open={isLoading} />
      <TableContainer component={Paper} sx={{ px: 2 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell>Book title</StyledTableCell>
              <StyledTableCell align="center">Active</StyledTableCell>
              <StyledTableCell align="center">Exchange done</StyledTableCell>
              <StyledTableCell>Created at</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          -[]
          <TableBody>
            {posts &&
              posts.map((row) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell component="th" scope="row">
                    <img
                      width="70px"
                      src={`${process.env.REACT_APP_BACKEND_URL}/images/${row.image1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = noImage; // fallback image //
                      }}
                      alt="Not available"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography component={RouterLink} to={`/post/${row._id}`}>
                      {row.title}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.isActive ? (
                      <CheckCircleOutlineIcon color="success" />
                    ) : (
                      <ClearIcon color="error" />
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.isExchanged ? (
                      <CheckCircleOutlineIcon color="success" />
                    ) : (
                      <ClearIcon color="error" />
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    {moment(row.createdAt).format('DD-MM-YYYY')}
                  </StyledTableCell>

                  <StyledTableCell>
                    <Button component={RouterLink} to={`/editPost/${row._id}`}>
                      Edit
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MyPosts;
