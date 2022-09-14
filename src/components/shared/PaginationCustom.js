import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';

const PaginationCustom = ({ itemsArray, itemsPerPage, selectCurrentItems }) => {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(itemsArray.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(itemsArray.length / itemsPerPage));
  }, [itemOffset, itemsArray, itemsPerPage]);

  useEffect(() => {
    selectCurrentItems(currentItems);
  }, [currentItems, selectCurrentItems]);

  const handlePageClick = (event, page) => {
    const newOffset = page * itemsPerPage - itemsPerPage;
    setItemOffset(newOffset);
  };

  return (
    <Pagination
      count={pageCount}
      color="primary"
      onChange={handlePageClick}
      variant="text"
    />
  );
};

export default PaginationCustom;
