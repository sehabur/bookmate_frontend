import React from 'react';
import axios from 'axios';
import ConfirmationDialog from './ConfirmationDialog';

export const callOrderAcceptApi = async (
  status,
  orderId,
  postId,
  title,
  authToken
) => {
  try {
    await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/api/orders/accept/${orderId}`,
      {
        acceptTime: new Date(),
        requestStatus: status,
        postId,
        bookTitle: title,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const OrderAcceptDialog = ({ dialogOpen, handleDialogClose }) => {
  return (
    <ConfirmationDialog
      dialogOpen={dialogOpen}
      dialogOnClose={handleDialogClose}
      dialogTitle="Your post will be deactivated"
      dialogText="If you accept buy/exchange request for this book, your post will be automatically deactivated. To activate it again, please do it manually from 'My Posts' section."
    />
  );
};

export default OrderAcceptDialog;
