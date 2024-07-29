
import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, CardMedia, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";
import ProjectLogo from '../project_logo.png'
import Navbar from './Navbar';

function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setEmailError] = useState(false);
  const [errorPassword, setPasswordError] = useState(false);
  const [errorSubmit, setSubmitError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginErrorBool, setLoginErrorBool] = useState(false)
  const navigate = useNavigate();
  // const location = useLocation();

// API to login. store access token in local storage.

  const handleLogin = async (e) => {
    e.preventDefault()
    if (email !== '' || password !== '') {
      setSubmitError('');
      const response = await fetch('http://127.0.0.1:8000/api/user/login/', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      const data = await response.json()
      console.log(response)
      if (response.status !== 200) {
        setLoginError("Invalid credentials. Please try again with correct email and password")
        setLoginErrorBool(true)
      }
      else {
        localStorage.clear()
        localStorage.setItem('access_token', data.token.access)
        localStorage.setItem('refresh_token', data.token.refresh)
        const userType = decodeToken(data.token.access).user_type
        if (userType == 1) {
          navigate('/student-dashboard')
        }
        else if (userType == 2) {
          navigate('/industrial-dashboard')
        }
        else if (userType == 3) {
          navigate('/supervisor-dashboard')
        }
      }

    }
    else {
      setSubmitError('Email and password fields are empty')
    }

  };

// validation for email

  const handleEmail = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (!val.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
      setEmailError(true)
    }
    else {
      setEmailError(false)
    }

  }

// validation for password

  const handlePassword = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (val < 1) {
      setPasswordError(true)
    }
    else {
      setPasswordError(false)
    }

  }

  return (
    <>
      <Navbar></Navbar>
      <Container component="main" maxWidth="xs">
        <Box>
          <img src={ProjectLogo} style={{ width: '300px', height: '300px', marginLeft: '50px' }}></img>
        </Box>
        <Paper elevation={5} style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5">Login</Typography>
          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            fullWidth
            error={errorEmail}
            helperText={errorEmail ? 'Enter valid email' : ''}
            onChange={handleEmail}
          />
          <TextField
            label="Password"
            variant="outlined"
            margin="normal"
            value={password}
            type="password"
            error={errorPassword}
            helperText={errorPassword ? 'Enter valid password' : ''}
            fullWidth

            onChange={handlePassword}
          />
          {errorSubmit && <Typography color="error">{errorSubmit}</Typography>}
          {loginErrorBool ? <Typography color="error">{loginError}</Typography> : <></>}
          <Button type='submit' variant="contained" color="primary" onClick={handleLogin} style={{ marginTop: 16 }}>
            Login
          </Button>
        </Paper>
      </Container>
    </>
  )
}

export default LandingPage