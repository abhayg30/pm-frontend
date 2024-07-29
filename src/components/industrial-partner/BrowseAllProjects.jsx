import React from "react";
import Header from "../Header";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
  useTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import Topbar from "../Topbar";
import Sidebar from "../Sidebar";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { Link } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../Theme";

const BrowseAllProjects = (accessToken) => {
  const theme = useTheme();
  const [allJobs, setAllJobs] = useState([{}]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryRecord, setCategoryRecord] = useState([]);
  const colors = tokens(theme.palette.mode);

  // Fetching all the projects to display
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
    console.log(data);
    setAllJobs(data);
  };

  // Fetching the list of categories for the search bar
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
  // Fetching the projects that fall under the searched category
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
    // Importing the global theme, side bar, and top bar.
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Box ml="60px" mt={"30px"}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Header
                title="Browse Projects"
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
                        "& fieldset": { border: "none", p: 0.5, mb: 1 },
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
            <Box
              sx={{
                "& .MuiCollapse-root": {
                  border: "none",
                },
              }}
            >
              {/* Mapping the elements of project containers and displaying the relevant information */}
              {allJobs.map((j) => (
                <>
                  <Box mr={"10%"} mt={"10px"} mb={"15px"}>
                    <Card elevation={3}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Link
                            to={`/Job/${j.id}`}
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
        </main>
      </div>
    </ThemeProvider>
  );
};

export default BrowseAllProjects;
