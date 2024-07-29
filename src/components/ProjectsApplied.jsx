import React from "react";
import StdThemeChanger from "./stdThemeChanger";
import Header from "./Header";
import { Box, Card, Typography, Button } from "@mui/material";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useMode } from "./Theme";
import { ColorModeContext } from "./Theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
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
import { useTheme } from "@emotion/react";

const ProjectsApplied = () => {
  let { id } = useParams();
  // const [theme, colorMode] = useMode();
  const theme = useTheme();

  const [allJobs, setAllJobs] = useState([{}]);
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  // const position = allJobs.position;
  const getAllJobs = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(
      "http://localhost:8000/application/view/projects/",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();

    setAllJobs(data.projects);
  };

  React.useEffect(() => {
    getAllJobs();
  }, []);

  // const columns = [{ field: { position }, headerName: "Project" }];

  // const rows = [{field: { allJobs.id }}]

  return (
    // <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Box ml="60px" mt={"30px"}>
            <Header title="Your Applications" />
            <Box
              sx={{
                "& .MuiCollapse-root": {
                  border: "none",
                },
              }}
            >
              {allJobs.map((j) => (
                <>
                  <Box mr={"10%"} ml={"10%"} mt={"15px"} mb={"15px"}>
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

export default ProjectsApplied;
