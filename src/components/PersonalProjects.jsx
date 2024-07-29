/** @format */

import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import {
  CssBaseline,
  ThemeProvider,
  Autocomplete,
  Typography,
  Card,
  useTheme
} from "@mui/material";
import { useMode } from "./Theme";
import { ColorModeContext } from "./Theme";
import { Theme } from "@mui/material";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "./Header";
import parse from "date-fns/parse";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import { decodeToken } from "react-jwt";
import { tokens } from "./Theme";
import { useState } from "react";
import { Link } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const checkoutSchema = yup.object().shape({
  user: yup.string(),
  name: yup.string(),
  description: yup.string(),
  from_date: yup
    .date()
    .transform((value, originalValue) =>
      parse(originalValue, "dd/MM/yyyy", new Date())
    ),
  to_date: yup
    .date()
    .transform((value, originalValue) =>
      parse(originalValue, "dd/MM/yyyy", new Date())
    ),
});

const initialValues = {
  user: "",
  name: "",
  description: "",
  from_date: "",
  to_date: "",
};

const PersonalProjects = () => {
  let c = 0;
  const height = 44;
  // const [theme, colorMode] = useMode();
  const theme = useTheme();

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [project, setProject] = useState([{}]);

  //   const colorMode = useMode();
  //   const theme = useTheme();

  const colors = tokens(theme.palette.mode);
  const accessToken = localStorage.getItem("access_token");
  const userDetails = decodeToken(accessToken);
  const user = userDetails.user_id;
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleChange = (e) => {
    const { target } = e;
    setProject((data) => ({ ...data, [target.name]: target.value }));
  };

// API for getting project details

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
  };

  let cnt = 0;
  const [myOptions, setMyOptions] = useState([]);
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  let { id } = useParams();

// API for getting list of all universities.

  const getText = async () => {
    let resp = await fetch("http://localhost:3000/uni.txt");
    let final = await resp.text();
    const splitSentences = final.split("\n");
    setList(splitSentences);
    console.log(myOptions);
  };
  const filteredItems = myOptions.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleID = () => {
  //   setID();
  // }

  const deleteProject = async (projectid) => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(
      `http://localhost:8000/stusup/delete/project/${projectid}`,
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    updateOptions(event.target.value);
  };
  const updateOptions = (query) => {
    const filteredOptions = list.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setMyOptions([]);
    setMyOptions(filteredOptions);
  };

  React.useEffect(() => {
    getProject();
    getText();
  }, []);

  return (
    // <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Box m="20px">
            <Header
              title="Your Projects"
              subtitle="Previously Completed Projects"
            />

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
                  // color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "0 0 5px 0" }}
                >
                  My Projects
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate("/student-dashboard/add-new-project");
                    }}
                  >
                    Add New Project
                  </Button>
                </Box>
              </Box>

              <Box>
                {project.map((j) => (
                  <>
                    <Box mr={"10%"} ml={"10%"} mt={"15px"} mb={"15px"}>
                      <Card elevation={3}>
                        <Accordion defaultExpanded>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Link style={{ textDecoration: "none" }}>
                              <Box>
                                <Typography
                                  color={colors.greenAccent[400]}
                                  variant="h5"
                                >
                                  {j.name}
                                </Typography>
                              </Box>
                            </Link>
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
                                <Box mr={"5%"} mt={"2%"}>
                                  <Button
                                    // sx="float: right;"
                                    startIcon={<ModeEditIcon />}
                                    onClick={() => {
                                      navigate(
                                        `/view-project/${j.id}/edit-project`
                                      );
                                    }}
                                  >
                                    Edit Project
                                  </Button>
                                  <Button
                                    onClick={ handleClickOpen }
                                    startIcon={<DeleteIcon />}
                                  >
                                    Delete Project
                                  </Button>
                                  <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    aria-describedby="alert-dialog-slide-description"
                                  >
                                    <DialogContent>
                                      <DialogTitle>
                                        {"Delete Project?"}
                                      </DialogTitle>
                                    </DialogContent>
                                    <DialogActions>
                                      <Button onClick={handleClose}>
                                        No
                                      </Button>
                                      <Button onClick={() =>  deleteProject(j.id) }>
                                        Yes
                                      </Button>
                                    </DialogActions>
                                  </Dialog>
                                </Box>
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
        </main>
      </div>
    </ThemeProvider>
    // </ColorModeContext.Provider>
  );
};

export default PersonalProjects;
