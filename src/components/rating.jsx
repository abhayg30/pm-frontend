import React, { useState, useEffect } from "react";
import { Container, Paper, useTheme, Box } from "@mui/material";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { decodeToken } from "react-jwt";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate, useParams } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Header from "./Header";

function FeedbackForm() {
  // const [theme, colorMode] = useMode();
  const theme = useTheme();
  const id = useParams().id;
  const [ratingOn, setSupervisorName] = useState("");
  const [overall, setOverallRating] = useState(0);
  const [deliverables, setDeliverablesRating] = useState(0);
  const [communication, setCommunicationRating] = useState(0);
  const [description, setAdditionalComments] = useState("");
  const navigate = useNavigate();
  const [ratedOnOptions, setRatedOnOptions] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // fetches all related personnel info for populating dropdown box
  useEffect(() => {
    const fetchRatedOnOptions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://localhost:8000/application/view-approved-personnel/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ); 
        const data = await response.json();
        console.log(data);
        setRatedOnOptions(data);
      } catch (error) {
        console.error("Failed to fetch rated on options", error);
      }
    };

    fetchRatedOnOptions();
  }, []);
// on submit form -->
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("access_token");
    const userDetails = decodeToken(token);
    const user = userDetails.user_id;
    const response = await fetch(
      "http://localhost:8000/ratings/create/rating/",
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user,
          ratingOn,
          overall,
          deliverables,
          communication,
          description,
        }),
      }
    );
    if (response.status === 201) {
      console.log(response);
      setSubmitSuccess(true);
    }
  };
  //navigate back in case of cancel
  const handleCancel = () => {
    navigate("/industrial-dashboard");
  };

  const labelStyle = {
    display: "inline-block",
    minWidth: "150px",
    verticalAlign: "top",
  };
  const ratingStyle = { display: "inline-block" };

  //form structure shows star rating system for delvierables, communication and overall rating, 
  // text field for additional comments, and drop down for name selection
  // confirm and cancel button. Backend api call of PUT request done on confirm.. this ensures 1 review only!
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Box ml="60px" mt={"30px"}>
            <Header title="Your Applications" />
            <Container component="main" maxWidth="xs">
              <Paper
                elevation={4}
                style={{
                  margin: 40,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <form onSubmit={handleSubmit}>
                  <FormControl fullWidth style={{ marginBottom: "10px" }}>
                    <Typography style={labelStyle}>Rating On:</Typography>
                    <Select
                      labelId="rated-on-label"
                      id="rated-on-select"
                      value={ratingOn}
                      onChange={(e) => setSupervisorName(e.target.value)}
                    >
                      {ratedOnOptions.map((option) => (
                        <MenuItem key={option.id} value={option.other.user}>
                          {option.first_name}{" "}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <div style={{ marginBottom: "10px" }}>
                    <div style={ratingStyle}>
                      <Typography component="legend">Overall:</Typography>
                      <Rating
                        name="simple-controlled"
                        overall={overall}
                        size="large"
                        onChange={(event, newValue) => {
                          setOverallRating(newValue);
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <div style={ratingStyle}>
                      <Typography component="legend">Deliverables:</Typography>
                      <Rating
                        name="simple-controlled"
                        value={deliverables}
                        size="large"
                        onChange={(event, newValue) => {
                          setDeliverablesRating(newValue);
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <div style={ratingStyle}>
                      <Typography component="legend">Communication:</Typography>
                      <Rating
                        name="simple-controlled"
                        value={communication}
                        size="large"
                        onChange={(event, newValue) => {
                          setCommunicationRating(newValue);
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <TextField
                      id="outlined-multiline-static"
                      label="Additional Comments:"
                      multiline
                      fullWidth
                      rows={6}
                      onChange={(e) => setAdditionalComments(e.target.value)}
                    />
                  </div>

                  <Button
                    variant="outlined"
                    type="submit"
                    endIcon={<SendIcon />}
                    style={{ marginRight: "10px" }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>

                  {submitSuccess && (
                    <Typography color="green" style={{ margin: "10px 0" }}>
                      Rating Submitted
                    </Typography>
                  )}
                </form>
              </Paper>
            </Container>
          </Box>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default FeedbackForm;
