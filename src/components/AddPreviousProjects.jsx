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
import { tokens } from "./Theme";
import { useMode } from "./Theme";
import { ColorModeContext } from "./Theme";
import ThemeProvider from "@mui/material/CssBaseline";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Header from "./Header";
import TextareaAutosize from "@mui/material/TextareaAutosize";

function AddPreviousProjects() {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [from_date, setFrom] = useState("");
  const [to_date, setTo] = useState("");
  const accessToken = localStorage.getItem("access_token");
  const user = decodeToken(accessToken).user_id;
  const navigate = useNavigate();
  const [myOptions, setMyOptions] = useState([]);
  const [list, setList] = useState([]);
  const [listStream, setListStream] = useState([]);
  const [listData, setListData] = useState([]);
  //   const [project, setProject] = useState("")

  const updateOptions = (query) => {
    const filteredOptions = list.filter((item) => item.includes(query));
    setMyOptions([]);
    setMyOptions(filteredOptions);
  };

  const NewProject = async () => {
    console.log(
      JSON.stringify({
        user,
        name,
        description,
        from_date,
        to_date,
      })
    );
    if (to_date.length > 0) {
      setTo(to_date);
    } else {
      setTo(null);
    }
    const response = await fetch(
      "http://localhost:8000/stusup/create/project/",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({
          user,
          name,
          description,
          from_date,
          to_date,
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    navigate("/student-dashboard");
  };

  const handleName = (e) => {
    const val = e.target.value;
    setName(val);
  };

  const handleDescription = (e) => {
    const val = e.target.value;
    setDescription(val);
  };

  return (
    <>
      {/* <ColorModeContext.Provider value={colorMode}> */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
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
                <Typography variant="h5">Add New Project</Typography>
                <TextField
                  label="Project Name"
                  variant="outlined"
                  margin="normal"
                  value={name}
                  fullWidth
                  onChange={handleName}
                ></TextField>
                {/* <TextField
                    label="Description"
                    variant="outlined"
                    margin="normal"
                    value={description}
                    fullWidth
                    rows={4}
                    onChange={handleDescription}
                  ></TextField> */}
                <TextareaAutosize
                  placeholder="Description"
                  // variant="solid"
                  margin="normal"
                  minRows={6}
                  fullWidth
                  style={{ width: "285px" }}
                  value={description}
                  color="primary"
                  onChange={handleDescription}
                ></TextareaAutosize>
                <TextField
                  label="From Date"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  type="date"
                  onChange={(e) => {
                    setFrom(e.target.value);
                  }}
                  value={from_date}
                  fullWidth
                />
                <TextField
                  label="To Date"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  type="date"
                  onChange={(e) => {
                    setTo(e.target.value);
                  }}
                  value={to_date}
                  fullWidth
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={NewProject}
                  style={{ marginTop: 16 }}
                >
                  Add Project
                </Button>
              </Paper>
            </Container>
          </main>
        </div>
      </ThemeProvider>
      {/* </ColorModeContext.Provider> */}
    </>
  );
}

export default AddPreviousProjects;
