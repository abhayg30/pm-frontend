import React from "react";
import { Box, useTheme, Button, IconButton, Divider } from "@mui/material";
import Header from "./Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { tokens } from "./Theme";
import { useMode } from "./Theme";
import { ColorModeContext } from "./Theme";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/CssBaseline";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";
import { decodeToken } from "react-jwt";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const ReviewInformation = (access_token) => {
  // const [theme, colorMode] = useMode();
  const location = useLocation();
  //   const colorMode = useMode();
  const theme = useTheme();
  const [allJobs, setAllJobs] = useState([{}]);
  const [showAlert, setShowAlert] = useState(false);
  const colors = tokens(theme.palette.mode);
  const accessToken = localStorage.getItem("access_token");
  const userDetails = decodeToken(accessToken);
  const [profile, setProfile] = useState({})
  const [education, setEducation] = useState([{}])
  const [experience, setExperience] = useState([{}]);
  const [project, setProject] = useState([{}]);
  const [links, setLinks] = useState({});

  let { id } = useParams();
  const [appStatus, setAppStatus] = useState(0);
  // let appStatus;
  const navigate = useNavigate();
  // console.log("abcd");
  const getAllJobs = async () => {
    const response = await fetch(
      `http://localhost:8000/partner/job/display/${id}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    // console.log("abcd");
    console.log(data);
    setAllJobs(data);
  };

  const applicationStatus = async () => {
    const response = await fetch(
      `http://localhost:8000/application/status/${id}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
      }
    );
    const data = await response.json();
    setAppStatus(data.status);
    // console.log(appStatus);
  };

  const withdrawApplication = async () => {
    const response = await fetch(
      `http://localhost:8000/application/withdraw/${id}/${userDetails.user_id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    // const data = await response.json();
    window.location.reload();
    navigate(location.pathname);
  };

// API call for getting all information of the applicant

  const getUserInformation = async () => {
    console.log(accessToken)
    const response = await fetch(
      `http://localhost:8000/application/review/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log(data);
    setProfile(data.personal)
    setEducation(data.education)
    setExperience(data.experience)
    setProject(data.project)
    setLinks(data.url)
  };

// API for applying to job

  const applyToJob = async () => {
    const response = await fetch(
      `http://localhost:8000/application/apply/${id}/${userDetails.user_id}/`,
      {
        method: "PUT",
        body: JSON.stringify({
          status: "Under review",
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.status === 201) {
      alert('Applicant has been successfully approved. This window will automatically close in 7 seconds');
      const closeWindowTimeout = setTimeout(() => {
        window.close();
      }, 7000);
      return () => clearTimeout(closeWindowTimeout);
    } else {
      console.log(data.errors)
    }
  };

  React.useEffect(() => {
    // getAllJobs();
    // applicationStatus();
    getUserInformation();
  }, []);

// rendering components to display all information of applicant to review before applying to project.

  return (
    // <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Typography ml={"50px"} mt={"30px"} textAlign={"left"}>
            {userDetails.user_type === 1 ? (
              <IconButton
                variant="contained"
                onClick={() => {
                  navigate("/student-dashboard")
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <IconButton
                variant="contained"
                onClick={() => {
                  navigate("/supervisor-dashboard")
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
          </Typography>
          <Box ml={"50px"} mr={"50px"}>
            <Box m="20px">
              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyItems={"center"}
              >
                <Typography variant="h3">Personal Information</Typography>
                <Box mt={'20px'} mb={'20px'}>
                  <Box display={"flex"} mt={'10px'}>
                    <Typography color={colors.greenAccent[400]} variant="h5">
                      First Name:
                    </Typography>
                    <Typography
                      ml={"4px"}
                      mr={"200px"}
                      variant="h5"
                      textAlign={"justify"}
                    >
                      {profile.first_name}
                    </Typography>
                  </Box>
                  <Box display={"flex"} mt={'10px'}>
                    <Typography color={colors.greenAccent[400]} variant="h5">
                      Last Name:
                    </Typography>
                    <Typography
                      ml={"4px"}
                      mr={"200px"}
                      variant="h5"
                      textAlign={"justify"}
                    >
                      {profile.last_name}
                    </Typography>

                  </Box>
                  <Box display={"flex"} mt={'10px'}>
                    <Typography color={colors.greenAccent[400]} variant="h5">
                      Email:
                    </Typography>
                    <Typography
                      ml={"4px"}
                      mr={"200px"}
                      variant="h5"
                      textAlign={"justify"}
                    >
                      {profile.email}
                    </Typography>

                  </Box>

                </Box>
                <Divider variant={'fullWidth'}></Divider>
                <Typography mt={'20px'} variant="h3">Education</Typography>
                {education.map((e) => (
                  <Box mt={'20px'} mb={'20px'}>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        Degree Type:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.degree_type}
                      </Typography>
                    </Box>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        Stream:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.stream}
                      </Typography>

                    </Box>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        Specializaion:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.specializaion}
                      </Typography>

                    </Box>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        University:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.university}
                      </Typography>

                    </Box>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        From:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.from_date}
                      </Typography>

                    </Box>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        To:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.to_date}
                      </Typography>

                    </Box>

                  </Box>
                ))}
                <Divider variant={'fullWidth'}></Divider>
                <Typography mt={'20px'} variant="h3">Experience</Typography>
                {experience.map((e) => (
                  <Box mt={'20px'} mb={'20px'}>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        Company:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.company}
                      </Typography>
                    </Box>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        Title:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.title}
                      </Typography>

                    </Box>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        Description:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.description}
                      </Typography>

                    </Box>

                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        From:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.from_date}
                      </Typography>

                    </Box>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        To:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.to_date}
                      </Typography>

                    </Box>

                  </Box>
                ))}
                <Divider variant={'fullWidth'}></Divider>
                <Typography mt={'20px'} variant="h3">Projects</Typography>
                {project.map((e) => (
                  <Box mt={'20px'} mb={'20px'}>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        Name:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.name}
                      </Typography>
                    </Box>

                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        Description:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.description}
                      </Typography>

                    </Box>

                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        From:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.from_date}
                      </Typography>

                    </Box>
                    <Box display={"flex"} mt={'10px'}>
                      <Typography color={colors.greenAccent[400]} variant="h5">
                        To:
                      </Typography>
                      <Typography
                        ml={"4px"}
                        mr={"200px"}
                        variant="h5"
                        textAlign={"justify"}
                      >
                        {e.to_date}
                      </Typography>

                    </Box>

                  </Box>
                ))}
                <Divider variant={'fullWidth'}></Divider>




                <Typography
                  padding="50px"
                  paddingRight={"100px"}
                  textAlign={"center"}
                >
                  <Box ml={"40%"} mr={"40%"}>
                    <Button
                      variant="contained"
                      startIcon={<LaunchIcon />}
                      style={{ height: "45px" }}
                      fullWidth
                      onClick={applyToJob}
                    >
                      <p style={{ fontSize: 15 }}>Submit</p>
                    </Button>
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Box>
        </main>
      </div>
    </ThemeProvider>
    // </ColorModeContext.Provider>
  )
};

export default ReviewInformation;
