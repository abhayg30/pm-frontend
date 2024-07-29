import React from "react";
// import StdThemeChanger from "./stdThemeChanger";
import Header from "../Header";
import {
  Box,
  Card,
  Typography,
  Button,
  Autocomplete,
  TextField,
  IconButton,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Topbar from "../Topbar";
import Sidebar from "../Sidebar";
import { useMode } from "../Theme";
import { ColorModeContext } from "../Theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../Theme";

function SupervisorDashboard(accessToken) {
  const theme = useTheme();
  const [allJobs, setAllJobs] = useState([{}]);
  const [searchedJobs, setSearchedJobs] = useState([]);
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryRecord, setCategoryRecord] = useState([]);
  const navigate = useNavigate();

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
  const getAllJobs = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch("http://localhost:8000/partner/job/display/", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    setAllJobs(data);
  };

  React.useEffect(() => {
    getAllJobs();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Box ml="60px" mt={"30px"}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Header
                title="Supervisor Dashboard"
                subtitle="All available projects"
              />

              <Box
                display={"flex"}
                mr={"10%"}
                alignItems={"center"}
                border={1}
                borderRadius={2}
                height={"50px"}
                borderColor={"grey.300"}
              >
                <Autocomplete
                  style={{ width: 282 }}
                  freeSolo
                  autoComplete
                  autoHighlight
                  inputValue={searchQuery}
                  options={categoryRecord}
                  onInputChange={(event, newInputValue) =>
                    setSearchQuery(newInputValue)
                  }
                  getOptionLabel={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      type="text"
                      margin="normal"
                      variant="outlined"
                      sx={{
                        "& fieldset": { border: "none" },
                      }}
                      placeholder="Search Project Category"
                    />
                  )}
                />
                <IconButton
                  type="button"
                  sx={{ p: 1, m: 1, color: "${colors.primary[300]}" }}
                  onClick={() => {
                    getSearchedProjects();
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>

            <Box>
              {allJobs.map((j) => (
                <>
                  <Box mr={"10%"} mt={"15px"} mb={"15px"}>
                    <Card elevation={3}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Link
                            to={`/Job/${j.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Box padding={"15px"}>
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
        </main>
      </div>
    </ThemeProvider>
  );
}

export default SupervisorDashboard;
