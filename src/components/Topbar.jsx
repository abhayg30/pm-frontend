import React from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "./Theme";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import LogoutIcon from "@mui/icons-material/Logout";
import { decodeToken } from "react-jwt";
// import Link from "@mui/material";
import { useNavigate } from "react-router-dom";

// import Typography from "@mui/material";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [allJobs, setAllJobs] = useState([]);
  const userDetails = decodeToken(localStorage.getItem("access_token"));
  const [state, setState] = useState({
    query: "",
    list: [],
  });
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

// logout function

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
// get all jobs for implementation of search
  const getAllJobs = async () => {
    const response = await fetch(
      "http://localhost:8000/partner/job/display/",
      // `http://localhost:8000/partner/job/display/${id}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();

    setAllJobs(data);
  };

// search job function

  const handleSearch = (e) => {
    console.log(e);
    const val = e.target.value;
    const results = allJobs.filter((j) => {
      if (val === "") {
        return allJobs;
      }
      return j.position.toLowerCase().includes(val.toLowerCase());
    });
    setState({
      query: val,
      list: results,
    });
  };

  React.useEffect(() => {
    getAllJobs();
  }, []);

// rendering all components like theme changer and log out button

  return (
    <Box sx={{ position: "sticky", top: "0", bottom: "0px", zIndex: "2" }}>
      <Box
        top={0}
        backgroundColor={colors.primary[500]}
        display="flex"
        justifyContent="space-between"
        p={2}
      >
        <Box
          display="flex"
          // backgroundColor={colors.primary[300]}
          borderRadius="5px"
        ></Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          ml="15px"
        >
          {userDetails.user_type === 1 ? (
            <Typography
              variant="h3"
              color={colors.grey[100]}
              onClick={() => {
                navigate("/student-dashboard");
              }}
            >
              ProjectME
            </Typography>
          ) : userDetails.user_type === 2 ? (
            <Typography
              variant="h3"
              color={colors.grey[100]}
              onClick={() => {
                navigate("/industrial-dashboard");
              }}
            >
              ProjectME
            </Typography>
          ) : (
            <Typography
              variant="h3"
              color={colors.grey[100]}
              onClick={() => {
                navigate("/supervisor-dashboard");
              }}
            >
              ProjectME
            </Typography>
          )}
        </Box>
        {/* ICONS section */}
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>

          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
