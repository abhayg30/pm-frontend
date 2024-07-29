import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../Theme";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import ThemeProvider from "@mui/material/CssBaseline";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import React from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

function ApplicantsInfo() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tempData, setTempData] = useState([]);
  const [rows, setRows] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  // Defining the columns used for the data grid table
  const columns = [
    {
      field: "first_name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderHeader: () => <strong>{"First Name "}</strong>,
    },
    {
      field: "last_name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderHeader: () => <strong>{"Last Name "}</strong>,
    },
    {
      field: "url",
      flex: 1,
      cellClassName: "name-column--cell",
      renderHeader: () => <strong>{"Resume"}</strong>,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {"Applicant's Resume"}
        </a>
      ),
    },
    {
      field: "email",
      flex: 1,
      renderHeader: () => <strong>{"Email"}</strong>,
    },
    // Creating the show applicant's details button
    {
      field: "inviteButton",
      renderHeader: () => <strong>{"Show Details"}</strong>,
      renderCell: (params) => (
        <Button
          onClick={() =>
            showDetails(
              params.row.other,
              params.row.email,
              params.row.other.user,
              params.row.status
            )
          }
          variant="contained"
        >
          Show Details
        </Button>
      ),
    },
  ];

  // Fetching the applicant users' info
  const getUserProfile = async () => {
    const response = await fetch(
      `http://localhost:8000/application/view-applicants/${id}/`,
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
    setTempData(data);
  };
  const showDetails = (other, email, user, status) => {
    other.job_id = id;
    other.email = email;
    other.user = user;
    other.status = status;
    console.log(other);
    other = JSON.stringify(other);
    // Opening applicant's detailed info in a new page
    window.open(
      `http://localhost:3000/applicant-detail/${encodeURIComponent(other)}/`,
      "_blank"
    );
    navigate(`/view-project/${id}`)
  };

  React.useEffect(() => {
    getUserProfile();
  }, []);

  return (
    // Importing the global theme, side bar, top bar and header (for title and subtitle of the page)
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Box m="20px">
            <Header
              title="Browse Applicants"
              subtitle="Applicants for this project"
            />
            <Box
              m="40px 0 0 0"
              height="75vh"
              padding={"75px"}
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  fontVariant: theme.typography.fontFamily["h1"],
                },
                "& .name-column--cell": {
                  fontVariant: theme.typography.fontFamily["h1"],
                  color: colors.greenAccent[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                  fontVariant: theme.typography.fontFamily["h1"],
                  backgroundColor: colors.primary[900],

                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                },
                "& .MuiCheckbox-root": {
                  color: `${colors.greenAccent[200]} !important`,
                },
              }}
            >
              {console.log(tempData)}
              <DataGrid
                rows={tempData}
                style={{ fontSize: "16px" }}
                columns={columns}
                getRowId={(row) => row.email}
                autoHeight
                {...rows}
                sx={{ color: "#1a3e72" }}
              />
            </Box>
          </Box>
        </main>
      </div>
    </ThemeProvider>
  );
}
export default ApplicantsInfo;
