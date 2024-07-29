import React from "react";
import Topbar from "../Topbar";
import Sidebar from "../Sidebar";
import {
  CssBaseline,
  ThemeProvider,
  Typography,
  Card,
  Divider,
  Box,
  Button,
  useTheme,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { tokens } from "../Theme";
import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function ApplicantDetail() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [educationDetails, setEducationDetails] = useState([]);
  const [projectDetails, setProjectDetails] = useState([]);
  const [experienceDetails, setExperienceDetails] = useState([]);
  const [jobId, setJobId] = useState(0);
  const [user, setUser] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [email, setEmail] = useState("");
  const [errorTextBool, setErrorTextBool] = useState(false);
  const accessToken = localStorage.getItem("access_token");
  const [applicationStatus, setApplicationStatus] = useState(0);
  const statusApproved = "Approved";
  const statusRejected = "Rejected";
  const searchParams = useParams();

  // Sending an email to the applicant with the status of their application - approved or rejected
  const handleEmail = async (email, status) => {
    let subject = "";
    let body = "";
    if (status == statusRejected) {
      subject = "Application Unsuccessful";
      body = `Unfortunately, your application has been unsuccessful this time for project: http://localhost:3000/Job/${jobId}`;
    } else {
      subject = "Application Successful";
      body = `Congratulations, your application has been successful for project: http://localhost:3000/Job/${jobId}`;
    }
    const response = await fetch(
      `http://localhost:8000/application/send-email/`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: email,
          subject: subject,
          body: body,
        }),
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      console.log(data);
    } else if (response.status !== 200) {
      console.log(data.errors);
    }
  };
  // Updating the applicant's application's status to rejected
  const rejectApplicant = async () => {
    const response = await fetch(
      `http://localhost:8000/application/update/${jobId}/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          status: statusRejected,
        }),
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      handleEmail(email, statusRejected);
      alert(
        "Applicant has been successfully rejected. This window will automatically close in 7 seconds"
      );
      // Automatically closing the window in 7 seconds
      const closeWindowTimeout = setTimeout(() => {
        window.close();
      }, 7000);
      return () => clearTimeout(closeWindowTimeout);
    } else if (response.status !== 200) {
      setErrorText("There was some unexpected error");
      setErrorTextBool(true);
    }
  };

  // Updating the applicant's application's status to approved
  const approveAplicant = async () => {
    console.log(user);
    const response = await fetch(
      `http://localhost:8000/application/update/${jobId}/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          status: statusApproved,
        }),
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      handleEmail(email, statusApproved);
      alert(
        "Applicant has been successfully approved. This window will automatically close in 7 seconds"
      );
      const closeWindowTimeout = setTimeout(() => {
        window.close();
      }, 7000);
      return () => clearTimeout(closeWindowTimeout);
    } else if (response.status !== 200) {
      setErrorText("There was some unexpected error");
      setErrorTextBool(true);
    }
  };

  React.useEffect(() => {
    const dataParam = searchParams.data;
    if (dataParam) {
      const decodedData = decodeURIComponent(dataParam);
      const parsedData = JSON.parse(decodedData);
      console.log(parsedData.user);
      console.log(parsedData.status);
      console.log(parsedData);
      setEducationDetails(parsedData.education);
      setProjectDetails(parsedData.project);
      setExperienceDetails(parsedData.experience);
      setJobId(parsedData.job_id);
      setUser(parsedData.user);
      setEmail(parsedData.email);
      setApplicationStatus(parsedData.status);
    }
  }, []);

  return (
    // Importing the global theme, side bar and top bar before adding the elements of this page
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Box>
            <Box mb={"40px"}>
              <Box
                mr={"10%"}
                ml={"20px"}
                mt={"20px"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{ m: "0 0 5px 0" }}
                >
                  Applicant's Education
                </Typography>
              </Box>

              <Box>
                <Box
                  mr={"10%"}
                  ml={"10%"}
                  mt={"20px"}
                  display={"flex"}
                  justifyContent={"space-between"}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ m: "0 0 5px 0" }}
                  >
                    Education
                  </Typography>
                </Box>

                <Box>
                  {educationDetails &&
                    educationDetails.map((j) => (
                      <>
                        <Box mr={"10%"} ml={"10%"} mt={"15px"} mb={"15px"}>
                          <Card elevation={3}>
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box>
                                  <Typography
                                    color={colors.greenAccent[400]}
                                    variant="h5"
                                  >
                                    {j.university}
                                  </Typography>
                                  <Typography
                                    color={colors.greenAccent[400]}
                                    variant="h5"
                                  >
                                    {j.stream}
                                  </Typography>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box>
                                  <Box
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                  >
                                    <Typography
                                      color={colors.greenAccent[400]}
                                      variant="h6"
                                    >
                                      Specialization: {j.specializaion}
                                    </Typography>
                                    <Typography
                                      color={colors.greenAccent[400]}
                                      variant="h7"
                                      mr="15px"
                                    >
                                      Degree Type: {j.degree_type}
                                    </Typography>
                                  </Box>
                                  <Box pt={"15px"}>
                                    <Typography
                                      variant="h7"
                                      mr="15px"
                                      display="flex"
                                    >
                                      From date: {j.from_date}
                                    </Typography>
                                  </Box>
                                  <Box pt={"15px"}>
                                    <Typography
                                      variant="h7"
                                      mr="15px"
                                      display="flex"
                                    >
                                      To date: {j.to_date}
                                    </Typography>
                                  </Box>
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          </Card>
                        </Box>
                      </>
                    ))}
                </Box>
              </Box>
            </Box>
          </Box>
          <Divider variant="middle" />
          <Box>
            <Box mt={"40px"} ml={"20px"} mb={"20px"}>
              <Box
                mr={"10%"}
                ml={"20px"}
                mt={"20px"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{ m: "0 0 5px 0" }}
                >
                  Applicant's Projects
                </Typography>
              </Box>
              <Box>
                <Box
                  mr={"10%"}
                  ml={"10%"}
                  mt={"20px"}
                  display={"flex"}
                  justifyContent={"space-between"}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ m: "0 0 5px 0" }}
                  >
                    Projects
                  </Typography>
                  <Box></Box>
                </Box>

                <Box>
                  {projectDetails &&
                    projectDetails.map((j) => (
                      <>
                        <Box mr={"10%"} ml={"10%"} mt={"15px"} mb={"15px"}>
                          <Card elevation={3}>
                            <Accordion defaultExpanded>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box>
                                  <Typography
                                    color={colors.greenAccent[400]}
                                    variant="h5"
                                  >
                                    {j.name}
                                  </Typography>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box>
                                  <Box
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                  ></Box>
                                  <Typography
                                    color={colors.greenAccent[400]}
                                    variant="h5"
                                  >
                                    {j.description}
                                  </Typography>
                                  <Box pt={"15px"}>
                                    <Typography
                                      variant="h7"
                                      mr="15px"
                                      display="flex"
                                    >
                                      From date: {j.from_date}
                                    </Typography>
                                  </Box>
                                  <Box pt={"15px"}>
                                    <Typography
                                      variant="h7"
                                      mr="15px"
                                      display="flex"
                                    >
                                      To date: {j.to_date}
                                    </Typography>
                                  </Box>
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          </Card>
                        </Box>
                      </>
                    ))}
                </Box>
              </Box>
            </Box>
          </Box>
          <Divider variant="middle" />
          <Box>
            <Box m="20px" mb={"40px"} mt={"40px"} ml={"20px"}>
              <Box
                mr={"10%"}
                ml={"20px"}
                mt={"20px"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{ m: "0 0 5px 0" }}
                >
                  Applicant's Experience
                </Typography>
              </Box>

              <Box>
                <Box
                  mr={"10%"}
                  ml={"10%"}
                  mt={"20px"}
                  display={"flex"}
                  justifyContent={"space-between"}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ m: "0 0 5px 0" }}
                  >
                    Experience
                  </Typography>
                </Box>

                <Box>
                  {experienceDetails &&
                    experienceDetails.map((j) => (
                      <>
                        <Box mr={"10%"} ml={"10%"} mt={"15px"} mb={"15px"}>
                          <Card elevation={3}>
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box>
                                  <Typography
                                    color={colors.greenAccent[400]}
                                    variant="h5"
                                  >
                                    {j.title}
                                  </Typography>
                                  <Typography
                                    color={colors.greenAccent[400]}
                                    variant="h5"
                                  >
                                    {j.company}
                                  </Typography>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box>
                                  <Box
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                  >
                                    <Typography
                                      color={colors.greenAccent[400]}
                                      variant="h6"
                                    >
                                      Description: {j.description}
                                    </Typography>
                                    <Typography
                                      color={colors.greenAccent[400]}
                                      variant="h7"
                                      mr="15px"
                                    >
                                      Degree Type: {j.to_date}
                                    </Typography>
                                  </Box>
                                  <Box pt={"15px"}>
                                    <Typography
                                      variant="h7"
                                      mr="15px"
                                      display="flex"
                                    >
                                      From date: {j.from_date}
                                    </Typography>
                                  </Box>
                                  <Box pt={"15px"}>
                                    <Typography
                                      variant="h7"
                                      mr="15px"
                                      display="flex"
                                    >
                                      From date: {j.to_date}
                                    </Typography>
                                  </Box>
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          </Card>
                        </Box>
                      </>
                    ))}
                </Box>
              </Box>
            </Box>
          </Box>
          <Divider variant="middle"></Divider>
          {applicationStatus === 2 || applicationStatus === 0 ? (
            <Box mt={"40px"} display={"flex"} justifyContent={"center"}>
              {console.log(applicationStatus)}
              <Box mr={"20px"}>
                <Button
                  variant="contained"
                  onClick={approveAplicant}
                  startIcon={<DoneIcon />}
                  style={{ height: "45px", width: "200px", fontSize: "15px" }}
                >
                  Approve Applicant
                </Button>
              </Box>
              <Box ml={"20px"}>
                <Button
                  variant="contained"
                  onClick={rejectApplicant}
                  startIcon={<CloseIcon />}
                  style={{ height: "45px", width: "200px", fontSize: "15px" }}
                >
                  Reject Applicant
                </Button>
              </Box>
            </Box>
          ) : applicationStatus === 1 ? (
            <Box mt={"40px"} textAlign={"center"}>
              <Button
                variant="contained"
                color="success"
                disableFocusRipple={false}
                startIcon={<DoneIcon />}
                style={{ height: "45px", width: "200px", fontSize: "15px" }}
              >
                Approved
              </Button>
            </Box>
          ) : (
            <Box mt={"40px"} textAlign={"center"}>
              <Button
                variant="contained"
                disableFocusRipple={false}
                color="error"
                startIcon={<CloseIcon />}
                style={{ height: "45px", width: "200px", fontSize: "15px" }}
              >
                Rejected
              </Button>
            </Box>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default ApplicantDetail;
