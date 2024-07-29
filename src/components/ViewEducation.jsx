import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, Button, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Divider from "@mui/material/Divider";
import { tokens } from "./Theme";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/CssBaseline";
import { useTheme } from "@emotion/react";

function ViewEducation() {
  // const [theme, colorMode] = useMode();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [education, setEducation] = useState([]);
  const id = useParams().id;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

// API for getting all educations 

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

    setEducation(data);
  };

// functions to handle dialog box actions

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

// delete education API

  const deleteEducation = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(
      `http://localhost:8000/stusup/delete/education/${id}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application.json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // console.log(response.json())
    navigate("/student-dashboard");
  };

// getting all educations

  React.useEffect(() => {
    getEducation();
  }, []);

// rendering components to display educations, edit education and delete education buttons

  return (
    <>
      {/* <ColorModeContext.Provider value={colorMode}> */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar></Sidebar>
          <main className="content">
            <Topbar></Topbar>
            <Box padding={"15px"}>
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/education");
                }}
              >
                Back
              </Button>
              <Box display={"flex"}>
                <Box>
                  {education.map((j) => (
                    <>
                      <Box mr={"10%"} ml={"10%"} mt={"20px"}>
                        {id == j.id ? (
                          <Box
                            display={"flex"}
                            width={"1100px"}
                            height={"80%"}
                          >
                            <Box mr={"40px"} ml={"100"} width={"80%"}>
                              <Card height={"1200px"} elevation={2}>
                                <Box height={"500px"}>
                                  <Box mr={"5%"} ml={"5%"} mt={"20px"}>
                                    <Typography
                                      variant="h4"
                                      textAlign={"left"}
                                    >
                                      {j.university}
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
                                    >
                                      {j.stream}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Card>
                            </Box>
                            <Box width={"40%"} mr={"10%"} minWidth={"30%"}>
                              <Card>
                                <Box mt={"2%"}>
                                  <Button
                                    startIcon={<ModeEditIcon />}
                                    onClick={() => {
                                      navigate(
                                        `/view-education/${id}/edit-education`
                                      );
                                    }}
                                  >
                                    Edit Education
                                  </Button>
                                </Box>
                                <Box mt={"2%"}>
                                  <Button
                                    onClick={handleClickOpen}
                                    startIcon={<DeleteIcon></DeleteIcon>}
                                  >
                                    Delete Education
                                  </Button>
                                  <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    aria-describedby="alert-dialog-slide-description"
                                  >
                                    <DialogContent>
                                      <DialogTitle>
                                        {"Delete Education?"}
                                      </DialogTitle>
                                    </DialogContent>
                                    <DialogActions>
                                      <Button onClick={handleClose}>
                                        No
                                      </Button>
                                      <Button onClick={deleteEducation}>
                                        Yes
                                      </Button>
                                    </DialogActions>
                                  </Dialog>
                                </Box>
                                <Box ml={"5%"} mt={"2%"} mr={"5%"}>
                                  <div>
                                    <p
                                      style={{ textDecorationColor: "gray" }}
                                    >
                                      Skills:
                                    </p>
                                  </div>
                                  <Divider variant="fullWidth"></Divider>
                                  <div
                                    style={{
                                      marginTop: "5px",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    {j.specializaion}
                                  </div>
                                  <div
                                    style={{
                                      marginTop: "5px",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    Degree Type: {j.degree_type}
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
              </Box>
            </Box>
          </main>
        </div>
      </ThemeProvider>
      {/* </ColorModeContext.Provider> */}
    </>
  );
}

export default ViewEducation;