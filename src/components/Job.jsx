import React from "react";

import { Box, useTheme, Button, IconButton } from "@mui/material";
import Header from "./Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import LaunchIcon from "@mui/icons-material/Launch";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { tokens } from "./Theme";
import { useMode } from "./Theme";
import { ColorModeContext } from "./Theme";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/CssBaseline";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState, useEffect } from "react";
import { decodeToken } from "react-jwt";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CachedIcon from "@mui/icons-material/Cached";

const Job = (access_token) => {
  // const [theme, colorMode] = useMode();
  const theme = useTheme();
  const location = useLocation();
  //   const colorMode = useMode();
  //   const theme = useTheme();
  const [allJobs, setAllJobs] = useState([{}]);
  const [showAlert, setShowAlert] = useState(false);
  const colors = tokens(theme.palette.mode);
  const accessToken = localStorage.getItem("access_token");
  const userDetails = decodeToken(accessToken);
  let { id } = useParams();
  const [appStatus, setAppStatus] = useState(0);
  const [approvedPersonnelData, setPersonnelData] = useState([]);
  // let appStatus;
  const navigate = useNavigate();
  // console.log("abcd");
  console.log(userDetails);
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
    console.log(data)
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
    window.location.reload();
    navigate(location.pathname);
  };

  useEffect(() => {
    const fetchRatedOnOptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/application/view-approved-personnel/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        ); // Replace with your actual API endpoint
        const data = await response.json();
        setPersonnelData(data);
      } catch (error) {
        console.error("Failed to fetch rated on options", error);
      }
    };

    fetchRatedOnOptions();
  }, []);

  function approvedUser(userId) {
    // Assuming 'data' is the array containing your user objects.
    // Loop through each object in the data array
    console.log(allJobs.job_status !== "1");
    if (approvedPersonnelData) {
      for (let i = 0; i < approvedPersonnelData.length; i++) {
        // Check if the 'user' property exists and matches the userId
        console.log(approvedPersonnelData[i].other);
        if (approvedPersonnelData[i].other.user === userId) {
          return true; // Return true if a match is found
        }
      }
      return false; // Return false if no match is found
    } else {
      return false;
    }
  }


  React.useEffect(() => {
    getAllJobs();
    applicationStatus();
  }, []);
  return (
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
                  navigate("/student-dashboard");
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            ) : userDetails.user_type === 2 ? (
              <IconButton
                variant="contained"
                onClick={() => {
                  navigate("/industrial-dashboard");
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <IconButton
                variant="contained"
                onClick={() => {
                  navigate("/supervisor-dashboard");
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
          </Typography>
          <Box ml={"50px"} mr={"50px"}>
            <Box m="20px">
              <Header title={allJobs.position} subtitle={allJobs.location} />
              <Typography
                padding="5px"
                color={colors.greenAccent[400]}
                variant="h5"
              >
                Skills: {allJobs.skills_req}
              </Typography>
              <p></p>

              {/* <Box display={"flex"}>
                  <Typography
                    padding="5px"
                    color={colors.greenAccent[400]}
                    variant="h7"
                  >
                    Description:
                  </Typography>
                  <Typography padding="5px" variant="h7">
                    {allJobs.description}
                    </Typography> */}

              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyItems={"center"}
              >
                <Box display={"flex"}>
                  <Typography color={colors.greenAccent[400]} variant="h5">
                    Description:
                  </Typography>
                  <Typography
                    ml={"4px"}
                    mr={"200px"}
                    variant="h5"
                    textAlign={"justify"}
                  >
                    {allJobs.description}
                  </Typography>
                </Box>
                <Typography
                  padding="50px"
                  paddingRight={"100px"}
                  textAlign={"center"}
                ></Typography>
              </Box>
            </Box>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'}>
            {(appStatus == 2 || appStatus == 1) ? (
              <Box ml={'32%'}>
                {console.log(appStatus)}
                <Button
                  variant="contained"
                  onClick={withdrawApplication}
                  startIcon={<CancelPresentationIcon />}
                  style={{ height: "30px" }}
                  fullWidth
                >
                  <p style={{ fontSize: 12 }}>Withdraw</p>
                </Button>
              </Box>
            ) : (
              <Box ml={"32%"}>
                <Button
                  variant="contained"
                  startIcon={<LaunchIcon />}
                  style={{ height: "30px" }}
                  fullWidth
                  onClick={() => {
                    window.open(`http://localhost:3000/review-info/${id}`)
                    navigate("add-new-project")

                  }}
                >
                  <p style={{ fontSize: 12 }}>Apply</p>
                </Button>
              </Box>
            )}
            {console.log('here')}
            {console.log(!approvedUser(userDetails.user_id))}
            {console.log('here2')}
            {console.log('here3')}
            {console.log((allJobs.job_status))}
            {console.log(!approvedUser(userDetails.user_id)) || (allJobs.job_status !== "1")}
            <Box mr={"32%"}>
              <Button
                variant="contained"
                startIcon={<EditNoteIcon />}
                style={{ height: "30px" }}
                fullWidth
                onClick={() => {
                  navigate(`/progress_logs/${id}`);
                }}
                disabled={(!approvedUser(userDetails.user_id)) || (allJobs.job_status !== "1")}
              >
                <p style={{ fontSize: 12 }}>Progress Logs</p>
              </Button>
            </Box>
          </Box>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Job;
