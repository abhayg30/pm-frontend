import React from "react";
import StdThemeChanger from "./stdThemeChanger";
import Header from "./Header";
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Autocomplete,
  TextField,
  useTheme,
} from "@mui/material";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useMode } from "./Theme";
import { ColorModeContext } from "./Theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "./Theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Collapse } from "@mui/material";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ApprovedProjects = () => {

  // const [theme, colorMode] = useMode();
  const theme = useTheme();
  const [searchedJobs, setSearchedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([{}]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryRecord, setCategoryRecord] = useState([]);
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = React.useState(false);
  const accessToken = localStorage.getItem("access_token");


  const navigate = useNavigate();
  const [accept, setAccept] = useState(0)
  // const position = allJobs.position;
  const getAllJobs = async () => {

    const response = await fetch("http://localhost:8000/application/approved-jobs/", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log(data.length)
    setAllJobs(data);
    if (data.length === 0)
      alert('No approved projects.')

  };
  const handleClickOpen = (id) => {
    console.log(id)
    setOpen(true);
  };
  const hasAccepted = async () => {

    const response = await fetch(`http://localhost:8000/application/has-accepted/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      }
    });
    const data = await response.json();
    console.log(data)
    setAccept(data.status)
  }
  const handleClose = () => {
    setOpen(false);
  };
  const acceptOffer = async (id) => {
    const response = await fetch(`http://localhost:8000/application/accept-offer/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      }
    });
    if (response.status === 200) {
      const data = await response.json();
      
      handleClose();
      window.location.reload();

    }
    else {
      alert('There was an issue while accepting the offer.')
    }
  }
  React.useEffect(() => {
    getAllJobs();
    hasAccepted();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Box ml="50px" mt={"30px"}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Header
                title="Applications"
                subtitle="All approved applications"
              />
            </Box>
            <Box
              sx={{
                "& .MuiCollapse-root": {
                  border: "none",
                },
              }}
            >
              {allJobs.length === 0 ? <></> : allJobs.map((j) => (
                <>

                  <Box mr={"10%"} mt={"10px"} mb={"15px"}>
                    <Card elevation={3}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>

                          <Box>
                            <Typography
                              color={colors.greenAccent[400]}
                              variant="h5"
                            >
                              {j.position}
                            </Typography>
                            <Typography
                              color={colors.greenAccent[400]}
                              variant="h7"
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
                                Location: {j.location}
                              </Typography>
                              <Typography
                                color={colors.greenAccent[400]}
                                variant="h7"
                              >
                                Skills: {j.skills_req}
                              </Typography>
                            </Box>
                            <Box
                              display={"flex"}
                              justifyContent={"space-between"}
                            >
                              <Typography
                                color={colors.greenAccent[400]}
                                variant="h7"
                              >
                                Category: {j.category}
                              </Typography>
                              <Typography
                                color={colors.greenAccent[400]}
                                variant="h7"
                              >
                                Closes in: {j.closes_at}
                              </Typography>
                            </Box>
                            <Box pt={"15px"}>
                              <Typography variant="h7">
                                {j.short_description}
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

                              <Box mt={'5px'}>
                                <Button
                                  onClick={() => { handleClickOpen(j.id) }}
                                  startIcon={<ThumbUpIcon />}
                                  disabled={accept === 1 ? true : false}

                                >
                                  Accept Offer
                                </Button>
                                <Dialog
                                  open={open}
                                  onClose={handleClose}
                                  aria-describedby="alert-dialog-slide-description"
                                >
                                  <DialogContent>
                                    <DialogTitle>
                                      {"Are you sure you want to accept the offer?"}
                                    </DialogTitle>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleClose}>
                                      No
                                    </Button>
                                    <Button onClick={() => { acceptOffer(j.id) }}>
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
        </main>
      </div>
    </ThemeProvider>
  );
};

export default ApprovedProjects;
