import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Button, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { tokens, useMode } from "../Theme";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/CssBaseline";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import CachedIcon from "@mui/icons-material/Cached";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

function ViewProjectPage() {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  const [allJobs, setAllJobs] = useState([]);
  const id = useParams().id;
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [jobState, setJobState] = useState("");
  const navigate = useNavigate();

  // Fetching the particular project for which the user wants to view the page/details.
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
    const data = await response.json();

    setAllJobs(data);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenStatus = () => {
    setOpenStatus(true);
  };

  const handleCloseStatus = () => {
    setOpenStatus(false);
  };

  // Delete a project, only the project owner is authorised to delete the project
  const deleteProject = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(
      `http://localhost:8000/partner/job/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application.json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    navigate("/industrial-dashboard");
  };

  const updateJobState = (event) => {
    // Update the jobState
    let status = 0;
    console.log(jobState);

    if (jobState === "Start") {
      status = 0;
    } else if (jobState === "Development") {
      status = 1;
    } else if (jobState === "End") {
      status = 2;
    }
    const updateJobStatusBackend = async (state) => {
      const accessToken = localStorage.getItem("access_token");
      console.log(status);
      const response = await fetch(
        `http://localhost:8000/partner/change/status/${id}/`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();
      console.log(data);
    };
    updateJobStatusBackend(status);
    window.location.reload();
  };

  React.useEffect(() => {
    getAllJobs();
  }, []);

  return (
    <>
      {/* Importing the global theme, side bar and top bar before adding the elements of this page */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar></Sidebar>
          <main className="content">
            <Topbar></Topbar>
            <Typography ml={"50px"} mt={"30px"} textAlign={"left"}>
              <IconButton
                variant="contained"
                onClick={() => {
                  navigate("/industrial-dashboard");
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Typography>
            <Box>
              {allJobs.map((j) => (
                <>
                  <Box mr={"10%"} ml={"50px"} mt={"20px"}>
                    {id == j.id ? (
                      <Box display={"flex"} height={"80%"}>
                        <Box mr={"10px"} ml={"100"}>
                          <Card height={"1000px"} elevation={2}>
                            <Box>
                              <Box mr={"5%"} ml={"5%"} mt={"20px"}>
                                <Typography variant="h4" textAlign={"left"}>
                                  {j.position}
                                </Typography>
                              </Box>
                              <Divider variant="middle"></Divider>
                              <Box
                                mr={"5%"}
                                ml={"5%"}
                                textAlign={"left"}
                                mt={"10px"}
                              >
                                <Typography
                                  variant="h6"
                                  textAlign={"left"}
                                  mt={"5%"}
                                  mb={"5%"}
                                >
                                  {j.description}
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Box>
                        <Box width={"40%"} mr={"10%"} minWidth={"30%"}>
                          <Card>
                            <Box ml={"5%"} mt={"2%"}>
                              <Button
                                startIcon={<ModeEditIcon />}
                                onClick={() => {
                                  navigate(`/view-project/${id}/edit-job`);
                                }}
                              >
                                Edit Project
                              </Button>
                            </Box>
                            <Box ml={"5%"} mt={"2%"}>
                              <Button
                                onClick={() => {
                                  navigate(`/applicants-info/${id}/`);
                                }}
                                startIcon={<PeopleAltIcon />}
                              >
                                Applications
                              </Button>
                            </Box>
                            <Box ml={"5%"} mt={"2%"}>
                              <Button
                                onClick={handleClickOpen}
                                startIcon={<DeleteIcon></DeleteIcon>}
                              >
                                Delete Project
                              </Button>
                              <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-describedby="alert-dialog-slide-description"
                              >
                                <DialogContent>
                                  <DialogTitle>{"Delete Project?"}</DialogTitle>
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleClose}>No</Button>
                                  <Button onClick={deleteProject}>Yes</Button>
                                </DialogActions>
                              </Dialog>
                            </Box>
                            <Box ml={"5%"} mt={"2%"}>
                              <Button
                                onClick={handleClickOpenStatus}
                                startIcon={<SettingsIcon></SettingsIcon>}
                              >
                                Change Project Status
                              </Button>
                              <Dialog
                                open={openStatus}
                                onClose={handleCloseStatus}
                                aria-describedby="alert-dialog-slide-description"
                                fullWidth
                              >
                                <DialogContent>
                                  <DialogTitle
                                    textAlign="center"
                                    style={{ fontSize: "18px" }}
                                    mt={"-20px"}
                                    mb={"-20px"}
                                  >
                                    {"Project Status"}
                                  </DialogTitle>
                                </DialogContent>
                                <DialogActions>
                                  <FormControl fullWidth>
                                    <Box>
                                      <Box m={"5px"}>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                          labelId="demo-simple-select-label"
                                          // id="demo-simple-select"
                                          fullWidth
                                          value={jobState}
                                          label="Status"
                                          onChange={(e) =>
                                            setJobState(e.target.value)
                                          }
                                        >
                                          <MenuItem value={"Start"}>
                                            Start
                                          </MenuItem>
                                          <MenuItem value={"Development"}>
                                            Development
                                          </MenuItem>
                                          <MenuItem value={"End"}>End</MenuItem>
                                        </Select>
                                      </Box>
                                      <Box margin={"15px"}>
                                        <Button
                                          onClick={updateJobState}
                                          variant="contained"
                                          color="primary"
                                        >
                                          Confirm
                                        </Button>
                                        <Button onClick={handleCloseStatus}>
                                          Cancel
                                        </Button>
                                      </Box>
                                    </Box>
                                  </FormControl>
                                </DialogActions>
                              </Dialog>
                            </Box>

                            <Box ml={"5%"} mt={"2%"}>
                              <Button
                                startIcon={<RateReviewIcon />}
                                onClick={() => {
                                  navigate(`/rating/${id}`);
                                }}
                                disabled={j.job_status !== "2"}
                              >
                                Ratings
                              </Button>
                            </Box>
                            <Box ml={"5%"} mt={"2%"}>
                              <Button
                                startIcon={<CachedIcon />}
                                onClick={() => {
                                  navigate(`/progress_logs/${id}`);
                                }}
                                disabled={j.job_status !== "1"}
                              >
                                Progress Logs
                              </Button>
                            </Box>
                            <Box ml={"5%"} mt={"2%"} mr={"5%"}>
                              <div>
                                <p style={{ textDecorationColor: "gray" }}>
                                  Skills: {j.skills_req}
                                </p>
                              </div>
                              <Divider variant="fullWidth"></Divider>
                              <div
                                style={{
                                  marginTop: "5px",
                                  marginBottom: "5px",
                                }}
                              >
                                {j.skills_req}
                              </div>
                              <div
                                style={{
                                  marginTop: "5px",
                                  marginBottom: "5px",
                                }}
                              >
                                Vacanies: {j.vacancies}
                              </div>
                            </Box>
                          </Card>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <div style={{ display: "none" }}></div>
                      </>
                    )}
                  </Box>
                </>
              ))}
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </>
  );
}

export default ViewProjectPage;
