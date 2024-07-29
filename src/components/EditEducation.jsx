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

function EditEducation() {
  const theme = useTheme();
  const id = useParams().id;
  const [university, setUniversity] = useState("");
  const [stream, setStream] = useState("");
  const [specializaion, setSpecializaion] = useState("");
  const [degree_type, setDegree_type] = useState("");
  const [from_date, setFrom] = useState("");
  const [to_date, setTo] = useState("");
  const [education, setEducation] = useState([{}]);
  const [educationDetails, setEducationDetails] = useState({});
  const accessToken = localStorage.getItem("access_token");
  const user = decodeToken(accessToken).user_id;
  const navigate = useNavigate();

  const handleStream = (e) => {
    const val = e.target.value;
    setStream(val);
    // if(val.length < 0){
    //   setCompanyError(true)
    // }
    // else{
    //   setCompanyError(false)
    // }
  };

  const handleSpecialization = (e) => {
    const val = e.target.value;
    setSpecializaion(val);
    // if(val.length < 0){
    //   setSkillReqError(true)
    // }
    // else{
    //   setSkillReqError(false)
    // }
  };

  const handleType = (e) => {
    const val = e.target.value;
    setDegree_type(val);
    // if(val.length < 0){
    //   setDescriptionError(true)
    // }
    // else{
    //   setDescriptionError(false)
    // }
  };

  const [myOptions, setMyOptions] = useState([]);
  const [list, setList] = useState([]);
  const [listStream, setListStream] = useState([]);
  const [listData, setListData] = useState([]);
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

  const getEducation = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(
      "http://localhost:8000/stusup/view/education/",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    console.log("abcderr");
    console.log(data);
    setEducation(data);
    for (let d = 0; d < data.length; d++) {
      if (data[d].id == id) {
        console.log("in here");
        setEducationDetails(data[d]);
      }
    }
    console.log(educationDetails);
  };

  const handleChange = (e) => {
    const { target } = e;

    // allJobs.map(j => (
    //   j.id == id ? setAllJobs({...j, [target.name]: target.value}) : console.log('n')
    // ))
    setEducationDetails((data) => ({ ...data, [target.name]: target.value }));
  };
  const handleEditEducation = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (university !== "") {
      educationDetails.university = university;
    }

    if (stream !== "") {
      educationDetails.stream = stream;
    }
    if (specializaion !== "") {
      educationDetails.specializaion = specializaion;
    }

    //     console.log(educationDetails)
    // >>>>>>> student-supervisor-backend
    const response = await fetch(
      `http://localhost:8000/stusup/update/education/${id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(educationDetails),
      }
    );
    const data = await response.json();
    console.log(data);
    navigate("/student-dashboard");
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
    getEducation();
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
            {education.map((j) => (
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
                      <Autocomplete
                        style={{ width: 282 }}
                        freeSolo
                        autoComplete
                        autoHighlight
                        value={educationDetails.university}
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
                        value={educationDetails.stream}
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
                            variant="outlined"
                            margin="normal"
                            label="Stream"
                          />
                        )}
                      />
                      <Autocomplete
                        style={{ width: 282 }}
                        freeSolo
                        autoComplete
                        autoHighlight
                        value={educationDetails.specializaion}
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
                            variant="outlined"
                            margin="normal"
                            label="Specialization"
                          />
                        )}
                      />
                      <TextField
                        label="Degree Type"
                        variant="outlined"
                        margin="normal"
                        name="degree_type"
                        value={educationDetails.degree_type}
                        fullWidth
                        onChange={handleChange}
                      // rows={4}
                      // error={errorDescription}
                      // helperText={errorDescription ? "Enter valid description" : ""}
                      />
                      <TextField
                        label="From Date"
                        InputLabelProps={{ shrink: true }}
                        type="date"
                        name="from_date"
                        margin="normal"
                        onChange={handleChange}
                        value={educationDetails.from_date}
                        fullWidth
                      />
                      <TextField
                        label="To Date"
                        name="to_date"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        type="date"
                        onChange={handleChange}
                        value={educationDetails.to_date}
                        fullWidth
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditEducation}
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

export default EditEducation;
