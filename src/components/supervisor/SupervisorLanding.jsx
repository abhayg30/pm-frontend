import React, { useState } from "react";
import { TextField, Button, Container, Box, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import Topbar from "../Topbar";

function SupervisorLanding() {
  const accessToken = localStorage.getItem('access_token')
  const [isSupervisor, setIsSupervisor] = useState(false)

  const userDetails = decodeToken(accessToken)
  const user = userDetails.user_id;
  const navigate = useNavigate()
  console.log(decodeToken(accessToken))

  // letting user know that they will be approved as supervisor by admin and will be notified by email.

  React.useEffect(() => {
    alert('Registeration is complete. Please wait for approval. You will receive an email once approved.')
    navigate('/')
    localStorage.clear();

    const closeWindowTimeout = setTimeout(() => {
      window.close();
    }, 3000);
    return () => clearTimeout(closeWindowTimeout);
  }, [])
  return (
    <>
      <Topbar></Topbar>
      <Container>
        <Box>
          <Box>
            <Typography variant="h3">
              Welcome!
            </Typography>
            {isSupervisor
              ? <Typography variant='h5'>
                If you are not redirected to the dashboard, try logging in again.
              </Typography>
              :
              <Typography variant='h5'>
                Your application to be a supervisor is under review. Please wait for approval.
              </Typography>}
          </Box>

        </Box>
      </Container>
    </>
  );
}

export default SupervisorLanding;