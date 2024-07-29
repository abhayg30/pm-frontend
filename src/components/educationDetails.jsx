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
} from "@mui/material";
import { useMode } from "./Theme";
import { ColorModeContext } from "./Theme";
import { Theme } from "@mui/material";
import { Box, Button, TextField, useTheme } from "@mui/material";
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
  university: yup.string(),
  stream: yup.string(),
  degree_type: yup.string(),
  specializaion: yup.string(),
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
  university: "",
  stream: "",
  degree_type: "",
  specializaion: "",
  from_date: "",
  to_date: "",
};

// const Example = () => {
//   const [startDate, setStartDate] = useState(new Date());
//   return (
//     <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
//   );
// };

const EducationDetails = () => {
  let c = 0;
  const height = 44;
  // const [theme, colorMode] = useMode();
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [education, setEducation] = useState([{}]);

  //   const colorMode = useMode();
  //   const theme = useTheme();

  const colors = tokens(theme.palette.mode);
  const accessToken = localStorage.getItem("access_token");
  const userDetails = decodeToken(accessToken);
  const user = userDetails.user_id;
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [newId, setNewId] = useState();

  const handleChange = (e) => {
    const { target } = e;
    setEducation((data) => ({ ...data, [target.name]: target.value }));
  };

// API to get educations

  const getEducation = async () => {
    const response = await fetch(
      `http://localhost:8000/stusup/view/education/`,
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

  let cnt = 0;
  const [myOptions, setMyOptions] = useState([]);
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  let { id } = useParams();
  const getText = async () => {
    let resp = await fetch("http://localhost:3000/uni.txt");
    let final = await resp.text();
    const splitSentences = final.split("\n");
    setList(splitSentences);
    console.log(myOptions);
  };


  const handleClickOpen = (id) => {
    console.log(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = (id) => {
    console.log(id)
    setNewId(id);
  }
  // const handleID = () => {
  //   setID();
  // }

// API to delete education

  const deleteEducation = async (id) => {
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

  const updateOptions = (query) => {
    const filteredOptions = list.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setMyOptions([]);
    setMyOptions(filteredOptions);
  };

  React.useEffect(() => {
    getEducation();
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
            <Header title="Your Education" subtitle="Educations" />

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
                  My Education
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate("/student-dashboard/add-new-education");
                    }}
                  >
                    Add New Education
                  </Button>
                </Box>
              </Box>

              <Box>
                {education.map((j) => (
                  <>
                    <Box mr={"10%"} ml={"10%"} mt={"15px"} mb={"15px"}>
                      <Card elevation={3}>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Link
                              to={`/view-education/${j.id}`}
                              style={{ textDecoration: "none" }}
                            >
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
                            </Link>
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
                                <Box mr={"5%"} mt={"2%"}>
                                  <Button
                                    // sx="float: right;"
                                    startIcon={<ModeEditIcon />}
                                    onClick={() => {
                                      navigate(
                                        `/view-education/${j.id}/edit-education`
                                      );
                                    }}
                                  >
                                    Edit Education
                                  </Button>
                                </Box>
                                <Box ml={"0%"}>
                                  <Button
                                    onClick={handleClickOpen}
                                    startIcon={<DeleteIcon />}
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
                                      <Button onClick={() => { deleteEducation(j.id) }}>
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

export default EducationDetails;
