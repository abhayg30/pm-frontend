import { Box, useTheme } from "@mui/material";
import Header from "./Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "./Theme";
import { useMode } from "./Theme";
import { ColorModeContext } from "./Theme";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/CssBaseline";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const FAQ = () => {
  const theme = useTheme();
  // const [theme, colorMode] = useMode()
  const colors = tokens(theme.palette.mode);

  return (
    // <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Box m="20px">
            <Header title="FAQ" subtitle="Frequently Asked Questions Page" />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography color={colors.greenAccent[600]} variant="h4">
                  How can I update my Visa status?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Navigate to the 'Profile' page and update your required
                  details.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </main>
      </div>
    </ThemeProvider>
    // </ColorModeContext.Provider>
  );
};

export default FAQ;
