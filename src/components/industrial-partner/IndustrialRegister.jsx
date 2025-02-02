import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import { useNavigate } from "react-router-dom";

function IndustrialRegister() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [date_of_birth, setDob] = useState("");
  const [city, setCity] = useState("");
  const [zip_code, setZipcode] = useState(0);
  const [gender, setGender] = useState("");
  const [errorName, setNameError] = useState(false);
  const [errorEmail, setEmailError] = useState(false);
  const [errorPassword, setPasswordError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [errorBool, setErrorBool] = useState(false);
  const user_type = 2;
  const status = 1;
  const working_rights = "FULL";

  const navigate = useNavigate();
  // Creating a dictionary for the gender drop-down
  const genders = [
    {
      value: "Male",
      label: "Male",
    },
    {
      value: "Female",
      label: "Female",
    },
    {
      value: "Other",
      label: "Other",
    },
  ];

  // Handling the different elements of the registration form fields
  const handleFirstName = (e) => {
    const val = e.target.value;
    setFirstName(val);
    if (val.length < 2) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const handleLastName = (e) => {
    const val = e.target.value;
    setLastName(val);
    if (val.length < 2) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const handleEmail = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val.length < 1) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handlePassword = (e) => {
    const val = e.target.value;
    setPassword2(val);
    if (val === password) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const signup = async (e) => {
    e.preventDefault();

    const response = await fetch("https://pm-backend-1-191103d1e4c3.herokuapp.com/api/user/register/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        password2,
        user_type,
        date_of_birth,
        zip_code,
        city,
        gender,
        status,
        working_rights,
      }),
    });
    const data = await response.json();
    if (response.status === 201) {
      console.log(data);
      localStorage.clear();
      localStorage.setItem("access_token", data.token.access);
      localStorage.setItem("refresh_token", data.token.refresh);
      navigate("/industrial-landing");
    } else if (response.status === 400) {
      console.log(data);
      setErrorText(
        "There was an issue while registering because of invalid details entered. Please try again"
      );
      setErrorBool(true);
    }
  };

  // Fetching the list of cities to display in the cities/location drop-down
  const [list, setList] = useState([]);
  const getCity = async () => {
    let resp = await fetch("http://localhost:3000/cities.txt");
    let final = await resp.text();
    const splitSentences = final.split("\n");
    setList(splitSentences);
  };

  React.useEffect(() => {
    getCity();
  }, []);

  // After /register:
  //1. refresh token valid and status = 0
  //2. refresh token valid and status = 1
  //if condtion 2. --> Postman's 'Create Partner' call --> headers: Authorization = 'Bearer refresh_token', body = decode(refresh_token).user_id (rename = user)
  return (
    <>
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={4}
          style={{
            margin: 40,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Industry Register</Typography>
          <TextField
            label="First Name"
            variant="outlined"
            margin="normal"
            fullWidth
            value={first_name}
            onChange={handleFirstName}
            error={errorName}
            helperText={errorName ? "Enter valid name" : ""}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            margin="normal"
            fullWidth
            value={last_name}
            onChange={handleLastName}
            error={errorName}
            helperText={errorName ? "Enter valid name" : ""}
          />
          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            fullWidth
            onChange={handleEmail}
            error={errorEmail}
            helperText={errorEmail ? "Enter valid email" : ""}
          />
          <TextField
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={password2}
            fullWidth
            onChange={handlePassword}
            error={errorPassword}
            helperText={errorPassword ? "Passwords do not match" : ""}
          />
          <TextField
            label="Date of Birth"
            InputLabelProps={{ shrink: true }}
            type="date"
            margin="normal"
            onChange={(e) => {
              setDob(e.target.value);
            }}
            value={date_of_birth}
            fullWidth
          />
          <Autocomplete
            style={{ width: 282 }}
            freeSolo
            autoComplete
            autoHighlight
            inputValue={city}
            options={list}
            onInputChange={(event, newInputValue) => setCity(newInputValue)}
            getOptionLabel={(options) => options}
            renderInput={(params) => (
              <TextField
                {...params}
                name="city"
                type="text"
                margin="normal"
                variant="outlined"
                label="Location"
              />
            )}
          />
          <TextField
            label="Gender"
            variant="outlined"
            margin="normal"
            select
            fullWidth
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            {genders.map((g) => (
              <MenuItem key={g.value} value={g.value}>
                {g.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="zipcode"
            variant="outlined"
            margin="normal"
            fullWidth
            type="number"
            value={parseInt(zip_code)}
            onChange={(e) => {
              setZipcode(parseInt(e.target.value));
            }}
          />
          {errorBool ? (
            <Typography color="error">{errorText}</Typography>
          ) : (
            <></>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={signup}
            style={{ marginTop: 16 }}
          >
            Sign Up
          </Button>
        </Paper>
      </Container>
    </>
  );
}

export default IndustrialRegister;
