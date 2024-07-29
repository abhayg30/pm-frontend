import React, { useState, useEffect } from "react";
import { Box, Container, Card, Paper, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Topbar from "../Topbar";
import Sidebar from "../Sidebar";
import { tokens } from "../Theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { decodeToken } from "react-jwt";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate, useParams } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Header from "../Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";

function ProgressLogs() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [progLogs, setProgressLogs] = useState([]);
  const id = useParams().id;
  const [personnelData, setPersonnelData] = useState([]);
  const [commentOnProgLog, setCommentData] = useState([]);
  const accessToken = localStorage.getItem("access_token");
  const userDetails = decodeToken(accessToken);
  const [open, setOpen] = React.useState(false);
  const [openNew, setOpenNew] = React.useState(false);
  const [openEditComment, setOpenEditComment] = React.useState(false);
  const [openNewComment, setOpenNewComment] = React.useState(false);
  const [progLogParent, setProgLogParentOnComment] = useState("");
  const [edittedProgLog, setEdittedProgLog] = useState("");
  const [edittedComment, setEdittedComment] = useState("");
  const [newProgLog, setNewLogField] = useState("");
  const [newComment, setNewCommentField] = useState("");
  const [editLogId, setLogId] = useState("");
  const [editCommentId, setCommentId] = useState("");
  const user = userDetails.user_id;
  const job = id;
  console.log(userDetails);
  const navigate = useNavigate();


// fetch progress logs for project ID and set data 
  const getProgressLogs = async () => {
    const response = await fetch(
      `http://localhost:8000/progressLogs/view/progresslogproject/${id}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();

    setProgressLogs(data);
  };
//fetch comments on each progress log element and set data
  const getCommentsOnProgressLogs = async (progressionElement) => {
    const response = await fetch(
      `http://localhost:8000/progressLogs/view/commentprogresslog/${progressionElement}`,
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

    setCommentData(data);
    setProgressLogs((progLogs) =>
      progLogs.map((log) =>
        log.id === progressionElement ? { ...log, comments: data } : log
      )
    );
    console.log(progLogs);
  };

  //on click of card/accordian create a drop down to show details..
  const handleAccordionChange = (progressLogId) => {
    getCommentsOnProgressLogs(progressLogId);
  };

  //used as utility to convert user ID to name for all approved personnel
  useEffect(() => {
    const fetchRatedOnOptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/application/view-approved-personnel/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        setPersonnelData(data);
      } catch (error) {
        console.error("Failed to fetch rated on options", error);
      }
    };

    fetchRatedOnOptions();
  }, []);

  function getFirstNameByUserId(user_id, personnelData) {
    console.log(personnelData);
    const userObject = personnelData.find((item) => item.other.user === user_id);

    if (userObject && userObject.first_name) {
      return userObject.first_name;
    }

    return null;
  }

  React.useEffect(() => {
    getProgressLogs();
  }, []);

  // format time stamps in specific format other than displaying ISO standard text.
  function formatTimestamp(timestamp) {

    const date = new Date(timestamp);


    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");


    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }

  //common close for all edit windows
  function handleClose(e) {
    e.stopPropagation();
    setOpen(false);
  }
  // user clicks on edit log
  function handleClickOpenEdit(e, progId) {
    e.stopPropagation();
    setLogId(progId);
    setOpen(true);
  }
// user clicks on edit comment
  function handleClickOpenEditComment(e, comId, progLogParentId) {
    e.stopPropagation();
    setCommentId(comId);
    setOpenEditComment(true);
    setProgLogParentOnComment(progLogParentId);
  }
  // close of edit comment dialog
  function handleCloseEditComment(e) {
    e.stopPropagation();
    setOpenEditComment(false);
  }

  //whe user clicks on add new progress log to see the dialog
  function addNewProgressLog(e) {
    e.stopPropagation();
    setOpenNew(true);
  }
  //handles close dialog for new prog log 
  function handleCloseNew(e) {
    e.stopPropagation();
    setOpenNew(false);
  }
// when supervisor clicks on add comment
  function addNewComment(e, progLogParentId) {
    e.stopPropagation();
    setOpenNewComment(true);
    setProgLogParentOnComment(progLogParentId);
  }
  // closing of new comment dialog
  function handleCloseNewComment(e) {
    e.stopPropagation();
    setOpenNewComment(false);
  }
// when student opts to delete log
  function handleDeleteProgLog(event, progLogId) {
    event.stopPropagation();
    console.log(progLogId);
    const deleteProgLog = async (progLogId) => {
      const response = await fetch(
        `http://localhost:8000/progressLogs/delete/progresslog/${progLogId}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application.json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    };
    deleteProgLog(progLogId);
    window.location.reload();
  }
// when supervisor deletes comment
  function handleDeleteComment(event, comId) {
    event.stopPropagation();
    const deleteComment = async (comId) => {
      const response = await fetch(
        `http://localhost:8000/progressLogs/delete/commentprogresslog/${comId}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application.json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    };
    deleteComment(comId);
    window.location.reload();
  }
// update backend once student edits prog logs
  function handleEditProgLog(event) {
    console.log(editLogId);

    event.stopPropagation();
    const description = edittedProgLog;
    console.log(description);
    const updateLogBackend = async () => {
      const response = await fetch(
        `http://localhost:8000/progressLogs/edit/progresslog/${editLogId}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ user, job, description }),
        }
      );
      const data = await response.json();
    };
    updateLogBackend(editLogId);
    window.location.reload();
  }
// update backend that new log is created
  function submitNewProgLog(event) {

    event.stopPropagation();
    const description = newProgLog;
    console.log(description);
    const updateLogBackend = async () => {
      const response = await fetch(
        `http://localhost:8000/progressLogs/create/progresslog/`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ user, job, description }),
        }
      );
      const data = await response.json();
    };
    updateLogBackend(editLogId);
    window.location.reload();
  }
//update backend, new comment created
  function submitNewComment(event) {

    event.stopPropagation();
    const commentDescription = newComment;
    console.log(commentDescription);
    const updateCommentBackend = async () => {
      const response = await fetch(
        `http://localhost:8000/progressLogs/create/comment/`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user,
            job,
            commentDescription,
            progLogParent,
          }),
        }
      );
      const data = await response.json();
    };
    updateCommentBackend(editLogId);
    window.location.reload();
  }
// edit of comment, PUT request
  function submitEditComment(event) {
    event.stopPropagation();
    const commentDescription = edittedComment;
    console.log(commentDescription);

    const updateCommentBackend = async () => {
      const response = await fetch(
        `http://localhost:8000/progressLogs/edit/commentprogresslog/${editCommentId}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user,
            job,
            commentDescription,
            progLogParent,
          }),
        }
      );
      const data = await response.json();
    };
    updateCommentBackend(editLogId);
    window.location.reload();
  }

// render components to add new progress log as student and add comment as supervisor

  return (
    <>
      {/* <ColorModeContext.Provider value={colorMode}> */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar></Sidebar>
          <main className="content">
            <Topbar></Topbar>
            <Box ml="60px" mt={"30px"}>
              <Header title="Progress Logs" subtitle="All progress logs" />
              <Box
                sx={{
                  "& .MuiCollapse-root": {
                    border: "none",
                  },
                }}
              >
                <Box>
                  {/* only students should see add prog log button, on click of button open dialog */}
                  {userDetails.user_type === 1 ? (
                    <Box textAlign={"right"} mr={"25px"}>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        style={{ height: "35px" }}
                        // fullWidth
                        onClick={(e) => addNewProgressLog(e)}
                      >
                        <p style={{ fontSize: 12 }}>Add Progress Log</p>
                      </Button>
                      <Dialog
                        open={openNew}
                        onClose={handleCloseNew}
                        aria-describedby="alert-dialog-slide-description"
                        fullWidth
                      >
                        <DialogContent>
                          <DialogTitle textAlign={"center"}>
                            <strong style={{ fontSize: 20 }}>Please enter new log below:</strong>
                          </DialogTitle>
                        </DialogContent>
                        <DialogActions>
                          <FormControl fullWidth>
                            <Box
                              display={"flex"}
                              flexDirection={"column"}
                              margin={"10px"}
                              mt={"-30px"}
                            >
                              <TextField
                                id="outlined-multiline-static"
                                label="New Log Description"
                                multiline
                                fullWidth
                                rows={6}
                                onChange={(e) => setNewLogField(e.target.value)}
                              />
                              <Box display={"flex"} justifyContent={"center"} margin={"10px"}>
                                <Button
                                  variant="outlined"
                                  type="submit"
                                  endIcon={<SendIcon />}
                                  style={{ marginRight: "10px" }}
                                  onClick={(e) => submitNewProgLog(e)}
                                >
                                  Submit
                                </Button>
                                <Button
                                  variant="outlined"
                                  endIcon={<CancelIcon />}
                                  onClick={(e) => handleCloseNew(e)}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </Box>
                          </FormControl>
                        </DialogActions>
                      </Dialog>
                    </Box>
                  ) : userDetails.user_type === 2 ? (
                    <></>
                  ) : (
                    <></>
                  )}
                  {/* display nothing in place for supervisor or ind partner */}
                </Box>
                {/* for each prog log element, build a new accordian card. */}
                {progLogs.map((ele) => (
                  <Card elevation={3} style={{ margin: "10px" }}>
                    <Accordion onClick={() => handleAccordionChange(ele.id)}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box>
                          <Typography
                            color={colors.greenAccent[400]}
                            variant="h4"
                          >
                            {ele.description}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              flexDirection: "column",
                            }}
                          >
                            <Typography
                              color={colors.greenAccent[400]}
                              variant="h7"
                              mt={"10px"}
                            >
                              Logged By: 
                              {getFirstNameByUserId(ele.user, personnelData)}
                            </Typography>
                            <Typography
                              color={colors.greenAccent[400]}
                              variant="h7"
                            >
                              {formatTimestamp(ele.dateEntry)}
                            </Typography>
                          </Box>
                          {/* only a student can see edit, delete option under prog logs */}
                          {userDetails.user_type === 1 ? (
                            <Box mt={"10px"}>
                              <Button
                                startIcon={<EditIcon />}
                                onClick={(e) => handleClickOpenEdit(e, ele.id)}
                                disabled={ele.user !== userDetails.user_id}
                              >
                                Edit Log
                              </Button>
                              <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-describedby="alert-dialog-slide-description"
                              >
                                <DialogContent>
                                  <DialogTitle>
                                    Please enter new log below:
                                  </DialogTitle>
                                </DialogContent>
                                <DialogActions>
                                  <TextField
                                    id="outlined-multiline-static"
                                    label="Editted Log"
                                    multiline
                                    fullWidth
                                    rows={6}
                                    onChange={(e) =>
                                      setEdittedProgLog(e.target.value)
                                    }
                                  />
                                  <Button
                                    variant="outlined"
                                    type="submit"
                                    endIcon={<SendIcon />}
                                    style={{ marginRight: "10px" }}
                                    onClick={(e) =>
                                      handleEditProgLog(e, ele.id)
                                    }
                                  >
                                    Submit
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    endIcon={<CancelIcon />}
                                    onClick={(e) => handleClose(e)}
                                  >
                                    Cancel
                                  </Button>
                                </DialogActions>
                              </Dialog>
                              <Button
                                startIcon={<DeleteForeverIcon />}
                                onClick={(e) => handleDeleteProgLog(e, ele.id)}
                                disabled={ele.user !== userDetails.user_id}
                              >
                                Delete Log
                              </Button>
                            </Box>
                          ) : userDetails.user_type === 2 ? (
                            <></>
                          ) : (
                            // Display no buttons for industry partner, display add comment button for supervisor
                            // on click of add comment, open a dialog.
                            <Box>
                              <Button
                                startIcon={<AddIcon />}
                                onClick={(e) => addNewComment(e, ele.id)}
                              >
                                Add Comment
                              </Button>
                              <Dialog
                                open={openNewComment}
                                onClose={handleCloseNewComment}
                                aria-describedby="alert-dialog-slide-description"
                              >
                                <DialogContent>
                                  <DialogTitle>
                                    Please enter new log below:
                                  </DialogTitle>
                                </DialogContent>
                                <DialogActions>
                                  <TextField
                                    id="outlined-multiline-static"
                                    label="New Comment"
                                    multiline
                                    fullWidth
                                    rows={6}
                                    onChange={(e) =>
                                      setNewCommentField(e.target.value)
                                    }
                                  />
                                  <Button
                                    variant="outlined"
                                    type="submit"
                                    endIcon={<SendIcon />}
                                    style={{ marginRight: "10px" }}
                                    onClick={(e) => submitNewComment(e)}
                                  >
                                    Submit
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    endIcon={<CancelIcon />}
                                    onClick={(e) => handleCloseNewComment(e)}
                                  >
                                    Cancel
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </Box>
                          )}
                        </Box>
                      </AccordionSummary>
                      {/* accordian details contains the comments portion... */}
                      <AccordionDetails>
                        <Box>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Typography
                              color={colors.greenAccent[400]}
                              variant="h4"
                            >
                              Comments:
                            </Typography>
                          </Box>
                          <Box>
                            {ele.comments &&
                              ele.comments.map((com) => (
                                <Box>
                                  <Box>
                                    <Typography
                                      color={colors.greenAccent[400]}
                                      variant="h7"
                                    >
                                     {com.commentDescription}
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <Typography
                                        color={colors.greenAccent[400]}
                                        variant="h7"
                                      >
                                        Comment By:{" "}
                                        {getFirstNameByUserId(
                                          com.user,
                                          personnelData
                                        )}
                                      </Typography>
                                      <Typography
                                        color={colors.greenAccent[400]}
                                        variant="h7"
                                      >
                                        {formatTimestamp(com.dateEntry)}
                                      </Typography>
                                    </Box>
                                    {/* edit and delete options are available only for supervisors */}
                                    {userDetails.user_type === 3 ? (
                                      <Box>
                                        <Button
                                          startIcon={<EditIcon />}
                                          onClick={(e) =>
                                            handleClickOpenEditComment(
                                              e,
                                              com.id,
                                              ele.id
                                            )
                                          }
                                          disabled={
                                            com.user !== userDetails.user_id
                                          }
                                        >
                                          Edit Comment
                                        </Button>
                                        <Dialog
                                          open={openEditComment}
                                          onClose={handleCloseEditComment}
                                          aria-describedby="alert-dialog-slide-description"
                                        >
                                          <DialogContent>
                                            <DialogTitle>
                                              Please enter new comment below:
                                            </DialogTitle>
                                          </DialogContent>
                                          <DialogActions>
                                            <TextField
                                              id="outlined-multiline-static"
                                              label="Editted Comment"
                                              multiline
                                              fullWidth
                                              rows={6}
                                              onChange={(e) =>
                                                setEdittedComment(
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <Button
                                              variant="outlined"
                                              type="submit"
                                              endIcon={<SendIcon />}
                                              style={{ marginRight: "10px" }}
                                              onClick={(e) =>
                                                submitEditComment(e)
                                              }
                                            >
                                              Submit
                                            </Button>
                                            <Button
                                              variant="outlined"
                                              endIcon={<CancelIcon />}
                                              onClick={(e) =>
                                                handleCloseEditComment(e)
                                              }
                                            >
                                              Cancel
                                            </Button>
                                          </DialogActions>
                                        </Dialog>
                                        <Button
                                          startIcon={<DeleteForeverIcon />}
                                          onClick={(e) =>
                                            handleDeleteComment(e, com.id)
                                          }
                                          disabled={
                                            com.user !== userDetails.user_id
                                          }
                                        >
                                          Delete comment
                                        </Button>
                                      </Box>
                                    ) : userDetails.user_type === 1 ? (
                                      <></>
                                    ) : (
                                      <></>
                                    )}
                                    {/* show nothing for students/industry partners */}
                                  </Box>
                                </Box>
                              ))}
                          </Box>
                          <Box pt={"15px"}></Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Card>
                ))}
              </Box>
            </Box>
          </main>
        </div>
      </ThemeProvider>
      {/* </ColorModeContext.Provider> */}
    </>
  );
}

export default ProgressLogs;
