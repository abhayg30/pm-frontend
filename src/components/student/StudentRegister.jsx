import React, { useState } from "react";
import { TextField, Button, Container, Paper, Typography, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";

function StudentRegister() {
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
  const [working_rights, setWorking_rights] = useState("");
  const [errorText, setErrorText] = useState("");
  const [errorBool, setErrorBool] = useState(false);
  const user_type = 1;
  const status = 1;
  const navigate = useNavigate();
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
  const workingRights = [
    {
      value: "FULL",
      label: "Full working rights",
    },
    {
      value: "PARTIAL",
      label: "Partial working rights",
    },
    {
      value: "NO",
      label: "No working rights",
    },
  ];

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


  const [list, setList] = useState([]);
  const getCity = async () => {
    let resp = await fetch("http://localhost:3000/cities.txt");
    let final = await resp.text();
    const splitSentences = final.split("\n");
    setList(splitSentences);
    // console.log(myOptions)
  };

  const signup = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/user/register/", {
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
      console.log(data.access);
      localStorage.clear();
      localStorage.setItem("access_token", data.token.access);
      localStorage.setItem("refresh_token", data.token.refresh);
      navigate("/student-dashboard");
    } else {
      console.log(data);
      setErrorText(
        "There was an issue while registering because of invalid details entered. Please try again"
      );
      setErrorBool(true);
    }
  };

  React.useEffect(() => {
    getCity();
  }, []);

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
          <Typography variant="h5">Student Register</Typography>
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
          {/* <TextField
            label="City"
            variant="outlined"
            margin="normal"
            fullWidth
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            error={errorName}
            helperText={errorName ? "Enter valid name" : ""}
          /> */}
          <Autocomplete
            style={{ width: 282 }}
            freeSolo
            autoComplete
            autoHighlight
            inputValue={city}
            options={list}
            onInputChange={(event, newInputValue) =>
              setCity(newInputValue)
            }
            getOptionLabel={(options) => options}
            renderInput={(params) => (
              <TextField
                {...params}
                name="city"
                type="text"
                margin="normal"
                variant="outlined"
                label="City"
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
            label="Working Rights"
            variant="outlined"
            margin="normal"
            fullWidth
            select
            value={working_rights}
            onChange={(e) => {
              setWorking_rights(e.target.value);
            }}
          >
            {workingRights.map((w) => (
              <MenuItem key={w.value} value={w.value}>
                {w.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="zipcode"
            variant="outlined"
            margin="normal"
            fullWidth
            type="number"
            value={zip_code}
            onChange={(e) => {
              setZipcode(e.target.value);
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

export default StudentRegister;
