import React, { useState } from "react";
import {
  Box,
  Card,
  Button,
  Typography,
  useTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import Topbar from "../Topbar";
import Sidebar from "../Sidebar";
import { Link, useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../Theme";
import Header from "../Header";

function IndustrialDashboard(accessToken) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [allJobs, setAllJobs] = useState([]);
  const [errorJobs, setErrorJobs] = useState("");
  const [errorJobsBool, setErrorJobsBool] = useState(false);
  const [categoryRecord, setCategoryRecord] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetching all the industry partner's projects
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
    if (response.status === 200) {
      const data = await response.json();
      setAllJobs(data);
    } else if (response.status === 401) {
      setErrorJobs(
        "You are not authorized to view this page. Please logout and try login again."
      );
      setErrorJobsBool(true);
    } else {
      setErrorJobs(
        "There was some unexpected problem while showing dashboard. Please logout and try login again."
      );
      setErrorJobsBool(true);
    }
  };

  const getCategory = async () => {
    const response = await fetch(
      `https://api.jsonbin.io/v3/b/654ca96212a5d3765996f5c6`,
      {
        method: "GET",
        headers: {
          "X-Master-Key":
            "$2a$10$4iQqcQHcx8xsiqfcZEMfTuUd0y4.am3F1ox3/97XmRD4uJmplC/yK",
        },
      }
    );
    const data = await response.json();
    setCategoryRecord(data.record.category);
  };

  const getSearchedProjects = async () => {
    console.log(searchQuery);
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(
      `http://localhost:8000/partner/search/${searchQuery}/`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    // window.location.reload();
    setAllJobs(data);
  };

  React.useEffect(() => {
    getAllJobs();
    getCategory();
  }, []);

  return (
    // Importing the global theme, side bar, and top bar
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          {errorJobsBool ? (
            <Typography variant="h4" ml={"20px"} mt={"20px"}>
              {errorJobs}
            </Typography>
          ) : (
            <Box ml="60px" mt={"30px"}>
              <Header color="#3d3d3d" title="Your Dashboard" subtitle="Projects" />

              <Box>
                <Box
                  mr={"10%"}
                  mt={"20px"}
                  display={"flex"}
                  justifyContent={"space-between"}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ m: "0 0 5px 0" }}
                  >
                    My Projects
                  </Typography>
                  <Box>
                    <Button
                      
                      variant="contained"
                      onClick={() => {
                        navigate("add-new-project");
                      }}
                    >
                      Add New Project
                    </Button>
                  </Box>
                </Box>

                <Box>
                  {allJobs &&
                    allJobs.map((j) => (
                      <>
                        <Box mr={"10%"} mt={"15px"} mb={"15px"}>
                          <Card elevation={3}>
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Link
                                  to={`/view-project/${j.id}`}
                                  style={{ textDecoration: "none" }}
                                >
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
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default IndustrialDashboard;
