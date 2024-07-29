import React, { useState } from "react";
import { decodeToken } from "react-jwt";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
  Autocomplete,
  CssBaseline, 
  ThemeProvider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

function AddNewProject() {
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [skills_req, setSkillsReq] = useState("");
  const [description, setDescription] = useState("");
  const [short_description, setShortDescription] = useState("");
  const [vacancies, setVacancies] = useState(0);
  const [location, setLocation] = useState("");
  const [other_req, setOtherReq] = useState("");
  const [closes_at, setClosesAt] = useState(0);
  const job_status = 0;
  const is_active = 1;
  const [errorPosition, setPositionError] = useState(false);
  const [errorCompany, setCompanyError] = useState(false);
  const [errorSkillsReq, setSkillReqError] = useState(false);
  const [errorDescription, setDescriptionError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [errorBool, setErrorBool] = useState(false);
  const [category, setCategory] = useState("");
  const accessToken = localStorage.getItem("access_token");
  const job_posted_by = decodeToken(accessToken).user_id;
  const theme = useTheme();
  const navigate = useNavigate();

  // Handling the various components of the form to add a new project
  const handlePosition = (e) => {
    const val = e.target.value;
    setPosition(val);
    if (val.length < 0) {
      setPositionError(true);
    } else {
      setPositionError(false);
    }
  };

  const handleCompany = (e) => {
    const val = e.target.value;
    setCompany(val);
    if (val.length < 0) {
      setCompanyError(true);
    } else {
      setCompanyError(false);
    }
  };

  const handleSkillReq = (e) => {
    const val = e.target.value;
    setSkillsReq(val);
    if (val.length < 0) {
      setSkillReqError(true);
    } else {
      setSkillReqError(false);
    }
  };

  const handleDecription = (e) => {
    const val = e.target.value;
    setDescription(val);
    if (val.length < 0) {
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
    }
  };

  // Using the POST API to create or post a new project
  const NewProject = async () => {
    console.log(
      JSON.stringify({
        job_posted_by,
        position,
        company,
        category,
        skills_req,
        description,
        short_description,
        vacancies,
        location,
        other_req,
        closes_at,
        is_active,
        job_status,
      })
    );
    const response = await fetch("http://localhost:8000/partner/job/create/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        job_posted_by,
        position,
        company,
        category,
        skills_req,
        description,
        short_description,
        vacancies,
        location,
        other_req,
        closes_at,
        is_active,
        job_status,
      }),
    });

    if (response.status === 201) {
      const data = await response.json();
      console.log(data);
      navigate("/industrial-dashboard");
    } else if (response.status === 401) {
      const data = await response.json();
      console.log(data);
      setErrorText(
        "You are not authorised. Please try again after logging in."
      );
      setErrorBool(true);
    } else if (response.status === 400) {
      setErrorText("Invalid details added. Please try again after logging in.");
      setErrorBool(true);
    }
  };

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

  return (
    <>
    {/* Importing the global theme, side bar and top bar before adding the elements of this page */}
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
                  label="Position"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={position}
                  onChange={handlePosition}
                  error={errorPosition}
                  helperText={errorPosition ? "Enter valid position" : ""}
                />
                <TextField
                  label="Company"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={company}
                  onChange={handleCompany}
                  error={errorCompany}
                  helperText={errorCompany ? "Enter valid Company name" : ""}
                />
                <TextField
                  label="Skills Required"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={skills_req}
                  onChange={handleSkillReq}
                  error={errorSkillsReq}
                  helperText={errorSkillsReq ? "Enter valid skills" : ""}
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  margin="normal"
                  value={description}
                  fullWidth
                  onChange={handleDecription}
                  rows={4}
                  error={errorDescription}
                  helperText={errorDescription ? "Enter valid description" : ""}
                />
                <TextField
                  label="Short Description"
                  variant="outlined"
                  margin="normal"
                  value={short_description}
                  fullWidth
                  onChange={(e) => setShortDescription(e.target.value)}
                />
                <TextField
                  label="Category"
                  variant="outlined"
                  margin="normal"
                  value={category}
                  fullWidth
                  onChange={(e) => setCategory(e.target.value)}
                />
                <TextField
                  label="Vacancies"
                  variant="outlined"
                  margin="normal"
                  type="number"
                  fullWidth
                  value={parseInt(vacancies)}
                  onChange={(e) => setVacancies(parseInt(e.target.value))}
                />
                {/* Using autocomplete dropdown field for the list of cities or location */}
                <Autocomplete
                  style={{ width: 282 }}
                  freeSolo
                  autoComplete
                  autoHighlight
                  inputValue={location}
                  options={list}
                  onInputChange={(event, newInputValue) =>
                    setLocation(newInputValue)
                  }
                  getOptionLabel={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="city"
                      type="text"
                      variant="outlined"
                      label="Location"
                    />
                  )}
                />
                <TextField
                  label="Other requirements"
                  variant="outlined"
                  margin="normal"
                  onChange={(e) => {
                    setOtherReq(e.target.value);
                  }}
                  value={other_req}
                  fullWidth
                />
                <TextField
                  label="Closes At"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="number"
                  value={parseInt(closes_at)}
                  onChange={(e) => {
                    setClosesAt(parseInt(e.target.value));
                  }}
                />
                {errorBool ? (
                  <Typography variant="error">{errorText}</Typography>
                ) : (
                  <></>
                )}
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
    </>
  );
}

export default AddNewProject;
