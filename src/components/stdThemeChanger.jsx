import React from "react";
import { ColorModeContext, useMode } from "./Theme";
import Topbar from "./Topbar";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import Sidebar from "./Sidebar";
import FAQ from "./FAQ";
import Profile from "./profile";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./student/studentDashboard";
import Box from "@mui/material";
import Header from "./Header";

const StdThemeChanger = () => {
  const [theme, colorMode] = useMode();
  return (

    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <header>
          <Topbar />
        </header>
        <div >
          <Sidebar />
          <div>
            <Routes>
              <Route path="student-dashboard" element={<StudentDashboard />} />
              {/* <Route path="/PostNewJob" element = {<PostNewJob />} /> */}
              <Route path="/Profile" element={<Profile />} />
              {/* <Route path="/Analytics" element = {<Analytics />} /> */}
              {/* <Route path="/Calender" element = {<Calender />} /> */}
              <Route path="/FAQ" element={<FAQ />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default StdThemeChanger;
