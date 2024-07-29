import React from "react";
import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "./Theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { grey } from "@mui/material/colors";
import { useNavigate, useLocation } from "react-router-dom";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { isExpired, decodeToken } from "react-jwt";
import Rating from "@mui/material/Rating";
import SendTimeExtensionOutlinedIcon from '@mui/icons-material/SendTimeExtensionOutlined';
import AddchartOutlinedIcon from '@mui/icons-material/AddchartOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import WhereToVoteOutlinedIcon from '@mui/icons-material/WhereToVoteOutlined';

const Item = ({ title, to, icon, selected, setSelected, isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display={isCollapsed ? "none" : "flex"}>
      <MenuItem
        active={selected === title}
        style={
          {
            // backgroundColor: colors.primary[400],
            color: colors.primary[300],
            // position: "sticky",
            // top: "0",
          }
        }
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
    </Box>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();
  const userDetails = decodeToken(localStorage.getItem("access_token"));
  const [allDetails, setUserDetails] = useState([{}]);
  const accessToken = localStorage.getItem("access_token");
  const [userRatings, setUserRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  // getting user details API
  const getUserDetails = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch("http://localhost:8000/api/user/profile/", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    setUserDetails(data);
  };

  // getting ratings received by user

  const getRatings = async () => {
    const token = localStorage.getItem("access_token");
    const userDetails = decodeToken(token);
    const user = userDetails.user_id;
    const response = await fetch(
      `http://localhost:8000/ratings/view/rating/${user}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setUserRatings(data);
    console.log(data);

    if (response.status === 201) {
      console.log(response);
    }

    let totalRating = 0;
    data.forEach((item) => {
      totalRating += item.overall;
    });

    const average = totalRating / data.length;
    setAverageRating(average);
  };

  React.useEffect(() => {
    getUserDetails();
    getRatings();
  }, []);

// rendering sidebar components with ratings displayed for user

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[900]} !important`,
          height: "100vh",
          // color: "#ffffff"
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
          color: "#000000"
        },
        "& .pro-inner-item": {
          padding: "10px 15px 5px 20px !important",
          color: "#000000"
        },
        "& .pro-inner-item:hover": {
          color: "#FFFFFF !important",
        },
        "& .pro-menu-item.active": {
          color: `#ffffff !important`,
        },
      }}
    >
      <div>
        <ProSidebar collapsed={isCollapsed}>
          <Box position={"fixed"}>
            {/* <Box> */}
            <Menu iconShape="square">
              <MenuItem
                onClick={() => setIsCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: "5px 0 10px 0",
                  color: colors.grey[100],
                  // color: "#FFFFFF"
                  // position: "relative",
                  // top: "0"
                }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="45px"
                    mb="0px"
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
                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>

              <Box
                paddingLeft={isCollapsed ? undefined : "15%"}
              // position={"relative"}
              // top={"0"}
              >
                {userDetails.user_type === 1 ? (
                  <Item
                    title="Dashboard"
                    to="/student-dashboard"
                    icon={<HomeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                ) : userDetails.user_type === 2 ? (
                  <Item
                    title="Dashboard"
                    to="/industrial-dashboard"
                    icon={<HomeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                ) : (
                  <Item
                    title="Dashboard"
                    to="/supervisor-dashboard"
                    icon={<HomeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                )}
                <Item
                  title="Profile"
                  to="/profile"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  isCollapsed={isCollapsed}
                />
                {userDetails.user_type === 1 ? (
                  <Item
                    title="Education"
                    to="/education"
                    icon={<SchoolOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                ) : userDetails.user_type === 2 ? (
                  <></>
                ) : (
                  <></>
                )}
                {userDetails.user_type === 1 ? (
                  <Item
                    title="Projects Applied"
                    to="/ProjectsApplied"
                    icon={<LocalMallOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                ) : userDetails.user_type === 2 ? (
                  <></>
                ) : (
                  <Item
                    title="Projects Applied"
                    to="/ProjectsApplied"
                    icon={<LocalMallOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                )}
                {userDetails.user_type === 1 ? (
                  <Item
                    title="Personal Projects"
                    to="/PersonalProjects"
                    icon={<AccountTreeIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                ) : userDetails.user_type === 2 ? (
                  <></>
                ) : (
                  <Item
                    title="Personal Projects"
                    to="/PersonalProjects"
                    icon={<AccountTreeIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                )}
                {userDetails.user_type === 1 ? (
                  <Item
                    title="Previous Experience"
                    to="/experience"
                    icon={<AddchartOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                ) : userDetails.user_type === 2 ? (
                  <></>
                ) : (
                  <Item
                    title="Previous Experience"
                    to="/experience"
                    icon={<AddchartOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                )}
                {userDetails.user_type === 1 ? (
                  <Item
                    title="Approved Applications"
                    to="/approved-projects"
                    icon={<AssignmentTurnedInOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                ) : userDetails.user_type === 2 ? (
                  <></>
                ) : (
                  <Item
                    title="Approved Applications"
                    to="/approved-projects"
                    icon={<AssignmentTurnedInOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                )}

                {userDetails.user_type === 3 ? (
                  <Item
                    title="Browse Partners"
                    to="/browse-partners"
                    icon={<AssignmentIndOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                ) : userDetails.user_type === 2 ? (
                  <></>
                ) : (
                  <></>
                )}

                {userDetails.user_type === 2 ? (
                  <Item
                    title="Browse All Projects"
                    to="/browse-all-projects"
                    icon={<LocalMallOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                ) : userDetails.user_type === 2 ? (
                  <></>
                ) : (
                  <></>
                )}

                {userDetails.user_type === 1 ? (
                  <Item
                    title="Enrolled Project"
                    to="/enrolled-project"
                    icon={<WhereToVoteOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                ) : userDetails.user_type === 2 ? (
                  <></>
                ) : (
                  <Item
                    title="Enrolled Project"
                    to="/enrolled-project"
                    icon={<WhereToVoteOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                )}

                <Item
                  title="FAQ"
                  to="/faq"
                  icon={<HelpOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  isCollapsed={isCollapsed}
                />
              </Box>
            </Menu>

            {!isCollapsed && (
              <Box>
                <Box textAlign="center" position={"relative"} top={"0"}>
                  {/* <Typography
                  variant="h4"
                  color={colors.grey[300]}
                  sx={{ m: "150% 0 0 0" }}
                >
                  {allDetails.first_name}
                </Typography> */}
                  {userDetails.user_type === 1 ? (
                    <Typography
                      variant="h5"
                      color={colors.grey[300]}
                      sx={{ m: "80% 0 0 0" }}
                    >
                      <strong>{allDetails.first_name}</strong>
                    </Typography>
                  ) : userDetails.user_type === 2 ? (
                    <Typography
                      variant="h5"
                      color={colors.grey[300]}
                      sx={{ m: "175% 0 0 0" }}
                    >
                      <strong>{allDetails.first_name}</strong>
                    </Typography>
                  ) : (
                    <Typography
                      variant="h5"
                      color={colors.grey[300]}
                      sx={{ m: "80% 0 0 0" }}
                    >
                      <strong>{allDetails.first_name}</strong>
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            {/* User Type */}
            {!isCollapsed && (
              <Box>
                <Box textAlign="center" position={"relative"} top={"0"}>
                  {userDetails.user_type === 1 ? (
                    <Box>
                      <Typography
                        variant="h5"
                        color={colors.grey[300]}
                        mt={"10px"}
                        mb={"10px"}
                      >
                        Student
                      </Typography>
                      <Rating name="read-only" value={averageRating} readOnly />
                    </Box>
                  ) : userDetails.user_type === 2 ? (
                    <Box>
                      <Typography
                        variant="h5"
                        color={colors.grey[300]}
                        mt={"10px"}
                        mb={"10px"}
                      >
                        Industry Partner
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography
                        variant="h5"
                        color={colors.grey[300]}
                        mt={"10px"}
                        mb={"10px"}
                      >
                        Academic Supervisor
                      </Typography>
                      <Rating name="read-only" value={averageRating} readOnly />
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </ProSidebar>
      </div>
    </Box>
  );
};

export default Sidebar;
