import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

const ConfirmationDialog = ({
  dialogOpen,
  dialogOnClose,
  dialogTitle,
  dialogText,
}) => {
  return (
    <Dialog
      open={dialogOpen}
      onClose={dialogOnClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ mr: 2, mb: 2 }}>
        <Button onClick={(e) => dialogOnClose(e, 'cancel')} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={(e) => dialogOnClose(e, 'confirm')}
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
