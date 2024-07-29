/** @format */

import React, { useState } from "react";
import { isExpired, decodeToken } from "react-jwt";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Autocomplete,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/CssBaseline";

function AddEducation() {
  const theme = useTheme();
  const [university, setUniversity] = useState("");
  const [stream, setStream] = useState("");
  const [specializaion, setSpecializaion] = useState("");
  const [degree_type, setDegree_type] = useState("");
  const [from_date, setFrom] = useState("");
  const [to_date, setTo] = useState("");
  const [myOptions, setMyOptions] = useState([]);
  const [list, setList] = useState([]);
  const [listStream, setListStream] = useState([]);
  const [listData, setListData] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [errorBool, setErrorBool] = useState(false);
  const accessToken = localStorage.getItem("access_token");
  const user = decodeToken(accessToken).user_id;
  const navigate = useNavigate();
  const degrees = [
    {
      value: "PG",
      label: "Postgraduate",
    },
    {
      value: "UG",
      label: "Undergraduate",
    },
    {
      value: "DP",
      label: "Diploma",
    },
    {
      value: "PD",
      label: "Doctorate (PhD)",
    },
  ];

  const handleType = (e) => {
    const val = e.target.value;
    setDegree_type(val);
  };

  const getText = async () => {
    let resp = await fetch("http://localhost:3000/uni.txt");
    let final = await resp.text();
    const splitSentences = final.split("\n");
    setList(splitSentences);
    console.log(myOptions);
  };

  const updateOptions = (query) => {
    const filteredOptions = list.filter((item) => item.includes(query));
    setMyOptions([]);
    setMyOptions(filteredOptions);
  };

  const NewEducation = async () => {
    if (to_date.length > 0) {
      setTo(to_date);
    } else {
      setTo(null);
    }
    const response = await fetch(
      "http://localhost:8000/stusup/create/education/",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({
          user,
          university,
          degree_type,
          stream,
          specializaion,
          from_date,
          to_date,
        }),
      }
    );
    if (response.status === 201) {
      const data = await response.json();
      console.log(data);
      navigate("/student-dashboard");
    } else if (response.status === 401) {
      setErrorText("You are not authorised. Please try again after loging in.");
      setErrorBool(true);
    } else if (response.status === 400) {
      setErrorText("Invalid details added. Please try again after loging in.");
      setErrorBool(true);
    }
  };

  const StreamSpecialization = async () => {
    const response = await fetch(
      `https://api.jsonbin.io/v3/b/652fdc0454105e766fc3e59c`,
      {
        method: "GET",
        headers: {
          "X-Master-Key":
            "$2a$10$4iQqcQHcx8xsiqfcZEMfTuUd0y4.am3F1ox3/97XmRD4uJmplC/yK",
        },
      }
    );
    const data = await response.json();
    setListData(data.record);
    setListStream(Object.keys(data.record));
  };

  React.useEffect(() => {
    getText();
    StreamSpecialization();
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar></Sidebar>
          <main className="content">
            <Topbar></Topbar>
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
                <Typography variant="h5">Add New Education</Typography>
                <Autocomplete
                  style={{ width: 282 }}
                  freeSolo
                  autoComplete
                  autoHighlight
                  inputValue={university}
                  options={list}
                  onInputChange={(event, newInputValue) =>
                    setUniversity(newInputValue)
                  }
                  getOptionLabel={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="university"
                      type="text"
                      margin="normal"
                      variant="outlined"
                      label="University"
                    />
                  )}
                />
                <Autocomplete
                  style={{ width: 282 }}
                  freeSolo
                  autoComplete
                  autoHighlight
                  inputValue={stream}
                  options={listStream}
                  onInputChange={(event, newInputValue) =>
                    setStream(newInputValue)
                  }
                  getOptionLabel={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="stream"
                      type="text"
                      margin="normal"
                      variant="outlined"
                      label="Stream"
                    />
                  )}
                />
                <Autocomplete
                  style={{ width: 282 }}
                  freeSolo
                  autoComplete
                  autoHighlight
                  disabled={stream !== "" ? false : true}
                  inputValue={specializaion}
                  options={listData[stream]}
                  onInputChange={(event, newInputValue) =>
                    setSpecializaion(newInputValue)
                  }
                  getOptionLabel={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="specializaion"
                      type="text"
                      margin="normal"
                      variant="outlined"
                      label="Specialization"
                    />
                  )}
                />
                <TextField
                  label="Degree Type"
                  variant="outlined"
                  margin="normal"
                  select
                  value={degree_type}
                  fullWidth
                  onChange={handleType}
                >
                  {degrees.map((d) => (
                    <MenuItem key={d.value} value={d.value}>
                      {d.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="From Date"
                  InputLabelProps={{ shrink: true }}
                  type="date"
                  margin="normal"
                  onChange={(e) => {
                    setFrom(e.target.value);
                  }}
                  value={from_date}
                  fullWidth
                />
                <TextField
                  label="To Date"
                  InputLabelProps={{ shrink: true }}
                  type="date"
                  margin="normal"
                  onChange={(e) => {
                    setTo(e.target.value);
                  }}
                  value={to_date}
                  fullWidth
                />
                {errorBool ? (
                  <Typography variant="error">{errorText}</Typography>
                ) : (
                  <></>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={NewEducation}
                  style={{ marginTop: 16 }}
                >
                  Add Education
                </Button>
              </Paper>
            </Container>
          </main>
        </div>
      </ThemeProvider>
    </>
  );
}

export default AddEducation;
