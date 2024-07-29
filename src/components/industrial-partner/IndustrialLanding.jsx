import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";
import Topbar from "../Topbar";

function IndustrialLanding() {
  const accessToken = localStorage.getItem("access_token");
  const [isPartner, setIsPartner] = useState(false);
  const [isCompanyAdded, setIsCompanyAdded] = useState(false);
  const [company, setCompany] = useState("");
  const [errorCompany, setCompanyError] = useState(false);
  const userDetails = decodeToken(accessToken);
  const user = userDetails.user_id;
  const navigate = useNavigate();
  console.log(decodeToken(accessToken));
  const handleCompany = (e) => {
    const val = e.target.value;
    setCompany(val);
    if (val.length < 0) {
      setCompanyError(true);
    } else {
      setCompanyError(false);
    }
  };

  // Using POST to create a new industrial partner
  // letting user know that they will be approved as supervisor by admin and will be notified by email.
  const makePartner = async () => {
    const token = localStorage.getItem("access_token");
    const response = await fetch("http://localhost:8000/partner/create/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user,
        company,
      }),
    });
    const data = response.json();
    if (response.status === 201) {
      setIsPartner(true);
      console.log(data);
      setIsCompanyAdded(true);
      alert('Registeration is complete. Please wait for approval. You will receive an email once approved.')
      navigate('/')
      localStorage.clear();

      const closeWindowTimeout = setTimeout(() => {
        window.close();
      }, 3000);
      return () => clearTimeout(closeWindowTimeout);
    }
  };

  React.useEffect(() => {
    if (userDetails.status === 1) {
      navigate("/industrial-dashboard");
    }
  }, []);

  return (
    <>
      <Topbar />
      <Container>
        <Box>
          <Box>
            <Typography variant="h3">Welcome!</Typography>
            {isCompanyAdded ? (
              <Typography variant="h5">
                Your application to be industrial partner is under review.
                Please wait for approval.
              </Typography>
            ) : (
              <Typography variant="h5">
                Your application to be industrial partner is under review.
                Meanwhile enter your company details
              </Typography>
            )}
          </Box>
          <Box>
            {isPartner ? (
              <>{console.log(isPartner)}</>
            ) : (
              <Box ml={"10%"} mr={"10%"}>
                <Paper
                  style={{
                    margin: 40,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    label="Company"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={company}
                    onChange={handleCompany}
                    error={errorCompany}
                    helperText={errorCompany ? "Enter valid company name" : ""}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={makePartner}
                    style={{ marginTop: 16 }}
                  >
                    Add Company
                  </Button>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default IndustrialLanding;
