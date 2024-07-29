import React from "react";
import { TextField, Button, Container, Card, Typography, Box } from '@mui/material';
import { useLocation, useNavigate, Link } from "react-router-dom";
import ProjectLogo from '../project_logo.png'

const RegisterPage = () => {
  const navigate = useNavigate()

// rendering a page to display options to decide user types. Here user can decide to register as student, academic supervisor or industrial partner.

  return (
    <>
      <Container style={{ minHeight: '1200px', height: '100%' }}>
        <Box display={'flex'} justifyContent={'center'}>
          <img src={ProjectLogo} style={{ width: '300px', height: '300px', alignItems: 'center' }}></img>
        </Box>
        <div>
          <Card elevation={4} style={{ margin: '30px', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '300px', justifyItems: 'flex-start' }}>
            <Typography variant="h5">Select Profile Type</Typography>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Card style={{ padding: 16, display: 'flex', margin: '0 10px' }}>
                <Link style={{ textDecoration: 'None', color: 'black' }} to={'/register/studentRegister'} onClick={() => { navigate('studentRegister') }}>
                  Student
                </Link>
              </Card>
              <Card style={{ padding: 16, display: 'flex', margin: '0 10px' }}>
                <Link style={{ textDecoration: 'None', color: 'black' }} to={'/register/supervisorRegister'} onClick={() => { navigate('supervisorRegister') }}>
                  Academic superviser
                </Link>
              </Card>
              <Card style={{ padding: 16, display: 'flex', margin: '0 10px' }}>
                <Link style={{ textDecoration: 'None', color: 'black' }} to={'/register/industrialRegister'} onClick={() => { navigate('industrialRegister') }}>
                  Industrial partner
                </Link>
              </Card>
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
}

export default RegisterPage;