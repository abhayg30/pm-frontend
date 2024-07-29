import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import {
  CssBaseline,
  MenuItem,
  ThemeProvider,
  Autocomplete,
  useTheme,
  Typography,
  containerClasses,
} from "@mui/material";
import { useMode } from "./Theme";
import { ColorModeContext } from "./Theme";
import { Theme } from "@mui/material";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "./Header";
import parse from "date-fns/parse";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import { decodeToken } from "react-jwt";
import { tokens } from "./Theme";
import { useState } from "react";
import { Field, Form, FormikProps } from "formik";
import axios from "axios";
// import { Dropdown } from "react-native-element-dropdown";

const checkoutSchema = yup.object().shape({
  // SET validations for each field

  first_name: yup.string().required("required"),
  last_name: yup.string().required("required"),
  email: yup.string().email("Invalid email").required("required"),
  dob: yup.string(),
  // .matches(phoneRegExp, "Invalid phone number")
  // .required("required"),
  dob: yup
    .date()
    .transform((value, originalValue) =>
      parse(originalValue, "dd/MM/yyyy", new Date())
    ),
  city: yup.string(),
  // gender: yup.string(),
  zip_code: yup.string(),
  // working_rights: yup.string(),
});

const initialValues = {
  first_name: "",
  last_name: "",
  city: "",
  dob: "",
  // gender: "",
  zip_code: "",
  // working_rights: "",
};

const genders = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
  {
    value: "Other",
    label: "Other",
  },
];
const workingRights = [
  {
    value: "FULL",
    label: "Full working rights",
  },
  {
    value: "PARTIAL",
    label: "Partial working rights",
  },
  {
    value: "NO",
    label: "No working rights",
  },
];

// const Example = () => {
//   const [startDate, setStartDate] = useState(new Date());
//   return (
//     <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
//   );
// };

const Profile = () => {
  let c = 0;

  const [gender, setGender] = useState("");
  const [working_rights, setWorking_rights] = useState("");
  const genders = [
    {
      value: "Male",
      label: "Male",
    },
    {
      value: "Female",
      label: "Female",
    },
    {
      value: "Other",
      label: "Other",
    },
  ];
  const workingRights = [
    {
      value: "FULL",
      label: "Full working rights",
    },
    {
      value: "PARTIAL",
      label: "Partial working rights",
    },
    {
      value: "NO",
      label: "No working rights",
    },
  ];

  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  //   const colorMode = useMode();
  //   const theme = useTheme();
  const [profile, setProfile] = useState({});
  const [city, setCity] = useState("");
  const [city1, setCity1] = useState("");
  const colors = tokens(theme.palette.mode);
  const accessToken = localStorage.getItem("access_token");
  const userDetails = decodeToken(accessToken);
  const [resumeurl, setResumeurl] = useState("");
  const [resumestatus, setResumestatus] = useState(0);
  let { id } = useParams();
  const navigate = useNavigate();

  // handling updates in previous values

  const handleChange = (e) => {
    const { target } = e;
    setProfile((data) => ({ ...data, [target.name]: target.value }));
  };
  const getUserProfile = async () => {
    const response = await fetch(`http://localhost:8000/api/user/profile/`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    // console.log("abcd");
    console.log(data);
    setProfile(data);
    setCity1(data.city);
    setGender(data.gender);
    setWorking_rights(data.working_rights);
  };

  // updating previous values in profile with new values.

  const updateDetails = async () => {
    if (city !== "") {
      profile.city = city;
      console.log(city);
    }
    console.log(JSON.stringify(profile));
    const response = await fetch(
      `http://localhost:8000/api/user/update/profile/`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profile),
      }
    );
    const data = await response.json();
    // console.log("abcd");
    console.log(data);
    setProfile(data);
    navigate("/profile");
  };

  // API to get list of cities for dropdown

  const [list, setList] = useState([]);
  const getCity = async () => {
    let resp = await fetch("http://localhost:3000/cities.txt");
    let final = await resp.text();
    const splitSentences = final.split("\n");
    setList(splitSentences);
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // handle upload file for resume.

  const viewResume = async () => {
    if(userDetails.user_type === 1 || userDetails.user_type === 3){
      const response = await fetch(`http://localhost:8000/stusup/view/resume/`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.status === 204) {
        setResumestatus(0);
      } else if (response.status === 200) {
        setResumestatus(1);
        setResumeurl(data.resume);
      }
      console.log(data);
      setProfile(data);
      navigate("/profile");
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      let formData = new FormData();
      console.log("here");
      console.log(selectedFile);
      formData.append("pdf_file", selectedFile);
      for (var key of formData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }
      console.log(formData);
      const response = await axios.put(
        "http://localhost:8000/stusup/resume/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // const uploadFile = await response.json();
      // console.log(uploadFile)
      // console.log("Upload successful!");
      if (response.status === 200) {
        alert("Upload successful!");
        window.location.reload();
      }
    } else {
      console.log("No file selected");
    }
  };

  React.useEffect(() => {
    viewResume();
    getUserProfile();
    getCity();
  }, []);

  // rendering components for displaying and updating profile.

  return (
    // <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />

        <main className="content">
          <Topbar />
          <Box maxWidth={"1200px"}>
            <Box m="20px">
              <Header title="User Profile" subtitle="Edit your profile" />
              <Formik
                initialValues={initialValues}
                validationSchema={checkoutSchema}
              >
                {({
                  values,
                  setFieldValue,
                  errors,
                  touched,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form onSubmit={updateDetails}>
                    <Box
                      display="grid"
                      gap="30px"
                      padding="50px"
                      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                      // span - diving into 4 sections, span 4 will cover the whole area
                      sx={{
                        "& > div": {
                          gridColumn: isNonMobile ? undefined : "span 4",
                        },
                      }}
                    >
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="First Name"
                        // onBlur={handleBlur}
                        // onChange={handleChange}
                        value={profile.first_name || ""}
                        name="first_name"
                        onChange={handleChange}
                        // error={!!touched.first_name && !!errors.first_name}
                        // helperText={touched.first_name && errors.first_name}
                        sx={{ gridColumn: "span 2" }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="Last Name"
                        // onBlur={handleBlur}
                        // onChange={handleChange}
                        value={profile.last_name || ""}
                        name="last_name"
                        // error={!!touched.last_name && !!errors.last_name}
                        // helperText={touched.last_name && errors.last_name}
                        sx={{ gridColumn: "span 2" }}
                      />
                      {console.log(profile)}
                      <Autocomplete
                        style={{ gridColumn: "span 2" }}
                        freeSolo
                        autoComplete
                        autoHighlight
                        value={city1}
                        inputValue={city}
                        options={list}
                        onInputChange={(event, newInputValue) =>
                          setCity(newInputValue)
                        }
                        getOptionLabel={(options) => options}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            name="city"
                            type="text"
                            variant="outlined"
                            label="City"
                          />
                        )}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="date"
                        label="DOB"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        value={profile.date_of_birth}
                        name="date_of_birth"
                        sx={{ gridColumn: "span 2" }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="zip_code"
                        onChange={handleChange}
                        value={profile.zip_code || ""}
                        name="zip_code"
                        sx={{ gridColumn: "span 2" }}
                      />
                      <TextField
                        select
                        name="gender"
                        fullWidth
                        variant="outlined"
                        value={gender}
                        onChange={handleChange}
                      >
                        {genders.map((g) => (
                          <MenuItem value={g.value} key={g.value}>
                            {g.label}
                          </MenuItem>
                        ))}

                        {}
                      </TextField>
                      {userDetails.user_type !== 2 ? (
                        <TextField
                          select
                          name="working_rights"
                          fullWidth
                          variant="outlined"
                          value={working_rights}
                          onChange={handleChange}
                        >
                          {workingRights.map((w) => (
                            <MenuItem key={w.value} value={w.value}>
                              {w.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <></>
                      )}
                    </Box>
                    {userDetails.user_type === 1 ||
                    userDetails.user_type === 3 ? (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mt="20px"
                        ml={"50px"}
                      >
                        <div>
                          <TextField type="file" onChange={handleFileChange} />
                          <p>
                            <Button
                              color="secondary"
                              variant="contained"
                              onClick={handleUpload}
                            >
                              Upload Resume
                            </Button>
                          </p>
                          {resumestatus === 1 ? (
                            <a href={resumeurl} target="_blank">
                              Your Resume
                            </a>
                          ) : (
                            <p>No resume</p>
                          )}
                        </div>
                        <Typography mt={"35px"} mr={"50px"}>
                          <Button
                            color="secondary"
                            variant="contained"
                            onClick={updateDetails}
                          >
                            Update
                          </Button>
                        </Typography>
                      </Box>
                    ) : (
                      <></>
                    )}
                  </form>
                )}
              </Formik>
            </Box>
          </Box>
        </main>
      </div>
    </ThemeProvider>
    // </ColorModeContext.Provider>
  );
};

export default Profile;
