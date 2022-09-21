import React from 'react';
import { useParams } from 'react-router-dom';
import { Paper } from '@mui/material';

import ChangePassword from '../components/managePassword/ChangePassword';
import ResetPasswordLink from '../components/managePassword/ResetPasswordLink';
import SetNewPassword from '../components/managePassword/SetNewPassword';

const ManagePassword = () => {
  const { type } = useParams();

  return (
    <>
      <Paper sx={{ mt: 2, px: 5, py: 3, maxWidth: '550px', mx: 'auto' }}>
        {type === 'change' && <ChangePassword />}
        {type === 'resetLink' && <ResetPasswordLink />}
        {type === 'setNew' && <SetNewPassword />}
      </Paper>
    </>
  );
};

export default ManagePassword;
