import React, { useState } from "react";
import { isExpired, decodeToken } from "react-jwt";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Autocomplete,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/CssBaseline";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TextareaAutosize from "@mui/material/TextareaAutosize";


function EditPrevProject(){
  const theme = useTheme();
  const id = useParams().id;

  const [project, setProject] = useState([{}]);
  const [projectDetails, setProjectDetails] = useState({});
  const accessToken = localStorage.getItem("access_token");
  const user = decodeToken(accessToken).user_id;
  const navigate = useNavigate();

// API to get all previous projects. 

  const getProject = async () => {
    const response = await fetch(`http://localhost:8000/stusup/view/project/`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setProject(data);
    for (let d = 0; d < data.length; d++) {
      if (data[d].id == id) {
        // console.log("in here");
        setProjectDetails(data[d]);
      }
    }
  };

// handling the changes in the fields and updating the previous values.

  const handleChange = (e) => {
    const { target } = e;

    // allJobs.map(j => (
    //   j.id == id ? setAllJobs({...j, [target.name]: target.value}) : console.log('n')
    // ))
    setProjectDetails((data) => ({ ...data, [target.name]: target.value }));
  };

// API to update the previous projects

  const handleEditPrevProject = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(
      `http://localhost:8000/stusup/update/project/${id}`,
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
    navigate("/PersonalProjects");
  };

  React.useEffect(() => {
    getProject();
  }, []);
  return (
    <>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar></Sidebar>
          <main className="content">
            <Topbar></Topbar>
            {project.map((j) => (
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
                      <Typography variant="h5">Update Previous Project</Typography>
                      
                      <TextField
                        label="Title"
                        variant="outlined"
                        margin="normal"
                        name="name"
                        value={projectDetails.name}
                        fullWidth
                        onChange={handleChange}
                      />
                      <TextareaAutosize
                        placeholder="Description"
                        // variant="solid"
                        margin="normal"
                        minRows={6}
                        fullWidth
                        name="description"
                        style={{ width: "285px" }}
                        value={projectDetails.description}
                        color="primary"
                        onChange={handleChange}
                      ></TextareaAutosize>
                      <TextField
                        label="From Date"
                        InputLabelProps={{ shrink: true }}
                        type="date"
                        name="from_date"
                        margin="normal"
                        onChange={handleChange}
                        value={projectDetails.from_date}
                        fullWidth
                      />
                      <TextField
                        label="To Date"
                        name="to_date"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        type="date"
                        onChange={handleChange}
                        value={projectDetails.to_date}
                        fullWidth
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditPrevProject}
                        style={{ marginTop: 16 }}
                      >
                        Update Project
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

export default EditPrevProject