import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  useTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

function EditProject() {
  const theme = useTheme();
  const id = useParams().id;
  const [allJobs, setAllJobs] = useState([{}]);
  const [errorJobs, setErrorJobs] = useState("");
  const [errorJobsBool, setErrorJobsBool] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});
  const navigate = useNavigate();

  // Fetching all the active projects
  const getAllJobs = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(
      "http://localhost:8000/partner/job/view/all/",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      const data = await response.json();

      setAllJobs(data);
      for (let d = 0; d < data.length; d++) {
        if (data[d].id == id) {
          setProjectDetails(data[d]);
        }
      }
    } else if (response.status === 401) {
      setErrorJobs(
        "You are not authorized to view this page. Please logout and try login again."
      );
      setErrorJobsBool(true);
    } else {
      setErrorJobs(
        "There was some unexpected problem while showing dashboard. Please logout and try login again."
      );
      setErrorJobsBool(true);
    }
  };
  const handleChange = (e) => {
    const { target } = e;
    setProjectDetails((data) => ({ ...data, [target.name]: target.value }));
  };

  // Updating the project info upon changes made
  const handleEditProject = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(
      `http://localhost:8000/partner/job/update/${id}/`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(projectDetails),
      }
    );
    const data = await response.json();
    console.log(data);
    navigate("/industrial-dashboard");
  };

  React.useEffect(() => {
    getAllJobs();
  }, []);

  return (
    <>
      {/* Importing the global theme, side bar, and top bar. */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            {allJobs.map((j) => (
              <>
                {j.id == id ? (
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
                      <Typography variant="h5">Update Project</Typography>
                      {errorJobsBool ? (
                        <Typography variant="error">{errorJobs}</Typography>
                      ) : (
                        <Box display={"flex"} flexDirection={"column"}>
                          <TextField
                            label="Position"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            name="position"
                            fullWidth
                            value={projectDetails.position}
                            onChange={handleChange}
                          />
                          <TextField
                            label="Company"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            name="company"
                            fullWidth
                            value={projectDetails.company}
                            onChange={handleChange}
                          />
                          <TextField
                            label="Skills Required"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            name="skills_req"
                            fullWidth
                            value={projectDetails.skills_req}
                            onChange={handleChange}
                          />
                          <TextField
                            label="Description"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            name="description"
                            value={projectDetails.description}
                            fullWidth
                            onChange={handleChange}
                          />
                          <TextField
                            label="Vacancies"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            type="number"
                            name="vacancies"
                            fullWidth
                            value={parseInt(projectDetails.vacancies)}
                            onChange={handleChange}
                          />
                          <TextField
                            label="Location"
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            name="location"
                            value={projectDetails.location}
                            fullWidth
                            onChange={handleChange}
                          />
                          <TextField
                            label="Other requirements"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            name="other_req"
                            onChange={handleChange}
                            value={projectDetails.other_req}
                            fullWidth
                          />
                          <TextField
                            label="Closes At"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            fullWidth
                            type="number"
                            name="closes_at"
                            value={parseInt(projectDetails.closes_at)}
                            onChange={handleChange}
                          />
                        </Box>
                      )}

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditProject}
                        style={{ marginTop: 16 }}
                      >
                        Edit Project
                      </Button>
                    </Paper>
                  </Container>
                ) : (
                  <div style={{ display: "none" }}></div>
                )}
              </>
            ))}
          </main>
        </div>
      </ThemeProvider>
    </>
  );
}

export default EditProject;
