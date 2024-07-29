import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens, useMode } from "./Theme";
import Header from "./Header";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import ThemeProvider from "@mui/material/CssBaseline";
import CssBaseline from "@mui/material/CssBaseline";
import { ColorModeContext } from "./Theme";
import { useState } from "react";
import React from "react";

function BrowsePartners() {
  // const [theme, colorMode] = useMode();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [tempData, setTempData] = useState([]);
  const [rows, setRows] = useState([]);
  const accessToken = localStorage.getItem("access_token");
  const columns = [
    {
      field: "first_name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderHeader: () => (
        <strong>
          {'First Name '}
        </strong>
      ),
    },
    {
      field: "last_name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderHeader: () => (
        <strong>
          {'Last Name '}
        </strong>
      ),
    },
    {
      field: "company",
      flex: 1,
      cellClassName: "name-column--cell",
      renderHeader: () => (
        <strong>
          {'Company'}
        </strong>
      ),
    },
    {
      field: "email",
      flex: 1,
      renderHeader: () => (
        <strong>
          {'Email'}
        </strong>
      ),
    },
    {
      field: "inviteButton",
      renderHeader: () => (
        <strong>
          {'Invite'}
        </strong>
      ),
      renderCell: (params) => (
        <Button
          onClick={() => handleInvite(params.row.email)}
          variant="contained"
        >
          Invite
        </Button>
      ),
    },
  ];

  const getUserProfile = async () => {
    const response = await fetch(
      `http://localhost:8000/stusup/partner-detail/`,
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
  const handleInvite = async (email) => {
    const response = await fetch(`http://localhost:8000/stusup/send-email/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email: email,
        subject: "this is a test email",
        body: "abcd body",
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      console.log(data);
      alert('Email sent to industry partner successfully')
    } else if (response.status !== 200) {
      console.log(data.errors);
    }
  };
  // setRows(tempData);
  React.useEffect(() => {
    getUserProfile();
  }, []);
  const columns1 = Object.keys(rows[0] || {}).map((key) => ({
    field: key,
    headerName: key,
    flex: 1,
  }));

  return (
    // <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Box m="20px">
            <Header
              title="Browse Industry Partners"
              subtitle="Invite industry partners for a project"
            />
            <Box
              m="40px 0 0 0"
              height="75vh"
              // width="100%"
              padding={"75px"}
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  fontVariant: theme.typography.fontFamily["h1"],
                  // borderBottom: "none",
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
                  // backgroundColor: colors.blueAccent[700],
                },
                "& .MuiCheckbox-root": {
                  color: `${colors.greenAccent[200]} !important`,
                },
              }}
            >
              <DataGrid
                rows={tempData}
                style={{ fontSize: '16px' }}
                columns={columns}
                getRowId={(row) => row.email}
                autoHeight
                {...rows}
                sx={{ color: '#1a3e72' }}
              />
            </Box>
          </Box>
        </main>
      </div>
    </ThemeProvider>
    // </ColorModeContext.Provider>
  );
}

export default BrowsePartners;
