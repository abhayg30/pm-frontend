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
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/CssBaseline";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TextareaAutosize from "@mui/material/TextareaAutosize";

function EditExperience() {
  const theme = useTheme();
  const id = useParams().id;
  const [university, setUniversity] = useState("");
  const [stream, setStream] = useState("");
  const [specializaion, setSpecializaion] = useState("");
  const [degree_type, setDegree_type] = useState("");
  const [from_date, setFrom] = useState("");
  const [to_date, setTo] = useState("");
  const [experience, setExperience] = useState([{}]);
  const [experienceDetails, setExperienceDetails] = useState({});
  const accessToken = localStorage.getItem("access_token");
  const user = decodeToken(accessToken).user_id;
  const navigate = useNavigate();

  const handleStream = (e) => {
    const val = e.target.value;
    setStream(val);
  };

  const handleSpecialization = (e) => {
    const val = e.target.value;
    setSpecializaion(val);
  };

  const handleType = (e) => {
    const val = e.target.value;
    setDegree_type(val);

  };

  const [myOptions, setMyOptions] = useState([]);
  const [list, setList] = useState([]);
  const [listStream, setListStream] = useState([]);
  const [listData, setListData] = useState([]);

  // get list of all universities
  const getText = async () => {
    let resp = await fetch("http://localhost:3000/uni.txt");
    let final = await resp.text();
    const splitSentences = final.split("\n");
    setList(splitSentences);
    console.log(myOptions);
  };

  const handleSearchChange = (event) => {
    setUniversity(event.target.value);
    updateOptions(event.target.value);
  };
  const updateOptions = (query) => {
    const filteredOptions = list.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setMyOptions([]);
    setMyOptions(filteredOptions);
  };

// get all experiences of student and supervisor and set value of experience to be editted to a dictionary.

  const getExperience = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(
      "http://localhost:8000/stusup/view/experience/",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    setExperience(data);
    for (let d = 0; d < data.length; d++) {
      if (data[d].id == id) {
        setExperienceDetails(data[d]);
      }
    }

  };

// handle editted values 

  const handleChange = (e) => {
    const { target } = e;
    setExperienceDetails((data) => ({ ...data, [target.name]: target.value }));
  };

// API to edit experience by using editted values from updated dictionary.

  const handleEditExperience = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(
      `http://localhost:8000/stusup/update/experience/${id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(experienceDetails),
      }
    );
    const data = await response.json();
    console.log(data);
    navigate("/experience");
  };

// get all specializations

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
    getExperience();
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
            {experience.map((j) => (
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
                      <Typography variant="h5">Update Education</Typography>
                      <TextField
                        label="Title"
                        variant="outlined"
                        margin="normal"
                        name="title"
                        value={experienceDetails.title}
                        fullWidth
                        onChange={handleChange}
                      />
                      <TextField
                        label="Company"
                        variant="outlined"
                        margin="normal"
                        name="company"
                        value={experienceDetails.company}
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
                        value={experienceDetails.description}
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
                        value={experienceDetails.from_date}
                        fullWidth
                      />
                      <TextField
                        label="To Date"
                        name="to_date"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        type="date"
                        onChange={handleChange}
                        value={experienceDetails.to_date}
                        fullWidth
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditExperience}
                        style={{ marginTop: 16 }}
                      >
                        Update Education
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

export default EditExperience;
