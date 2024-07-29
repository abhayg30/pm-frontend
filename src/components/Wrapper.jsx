import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import StudentRegister from "./student/StudentRegister";
import IndustrialRegister from "./industrial-partner/IndustrialRegister";
import SupervisorRegister from "./supervisor/SupervisorRegister";
import RegisterPage from "./RegisterPage";
import StudentDashboard from "./student/studentDashboard";
import { isExpired, decodeToken } from "react-jwt";
import Profile from "./profile";
import IndustrialDashboard from "./industrial-partner/IndustrialDashboard";
import ViewProjectPage from "./industrial-partner/ViewProjectPage";
import AddNewProject from "./industrial-partner/AddNewProject";
import EditProject from "./industrial-partner/EditProject";
import IndustrialLanding from "./industrial-partner/IndustrialLanding";
import FeedbackForm from "./rating.jsx";
import ProgressLogs from "./student/progressLogs.jsx";
import { useMode } from "./Theme";
import { ColorModeContext } from "./Theme";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import FAQ from "./FAQ";
import Job from "./Job";
import SupervisorDashboard from "./supervisor/SupervisorDashboard";
import SupervisorLanding from "./supervisor/SupervisorLanding";
import EducationDetails from "./educationDetails";
import AddEducation from "./AddEducation";
import ViewEducation from "./ViewEducation";
import EditEducation from "./EditEducation";
import ApprovedProjects from "./ApprovedProjects";
import ProjectsApplied from "./ProjectsApplied";
import PersonalProjects from "./PersonalProjects";
import AddPreviousProjects from "./AddPreviousProjects";
import ReviewInformation from "./ReviewInformation";
import ExperienceDetails from "./Experience.jsx";
import BrowsePartners from "./BrowsePartners.jsx";
import ApplicantsInfo from "./industrial-partner/ApplicantsInfo.jsx";
import BrowseAllProjects from "./industrial-partner/BrowseAllProjects.jsx";
import ApplicantDetail from "./industrial-partner/ApplicantDetail";
import AddExperience from "./AddExperience.jsx";
import EditExperience from "./EditExperience.jsx";
import EnrolledProject from "./EnrolledProject.jsx";
import EditPrevProject from "./EditPrevProject";

function Wrapper() {
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [accessToken, setAccessToken] = React.useState(
    localStorage.getItem("access_token")
  );
  const [refreshToken, setRefreshToken] = React.useState(
    localStorage.getItem("refresh_token")
  );

  let refresh = false;
  
  const getAccessToken = async () => {
    refresh = true;
    const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setAccessToken(localStorage.getItem("access_token"));
      setRefreshToken(localStorage.getItem("refresh_token"));
    } else {
      throw new Error("Invalid access");
    }
  };

// conditions for navigating upon refreshing page.

  React.useEffect(() => {
    if (localStorage.getItem("refresh_token") === null) {
      navigate("/");
    } else if (isExpired(accessToken)) {
      getAccessToken();
    } else if (!isExpired(accessToken)) {
      setAccessToken(localStorage.getItem("access_token"));
      const myDecodedToken = decodeToken(localStorage.getItem("access_token"));

      if (myDecodedToken.user_type === 1) {
        if (location.pathname !== '/') {
          navigate(location.pathname);
        }
        else {
          navigate('/student-dashboard')
        }

      } else if (myDecodedToken.user_type === 2) {
        console.log(myDecodedToken);
        if (myDecodedToken.status === 1) {
          // use location.pathname to navigate to solve refresh pg problem
          if (location.pathname !== '/') {
            navigate(location.pathname);
          }
          else {
            navigate('/industrial-dashboard')
          }
        } else {
          navigate("/industrial-landing");
        }
      } else if (myDecodedToken.user_type === 3) {
        console.log(myDecodedToken);
        if (myDecodedToken.status === 1) {
          if (location.pathname !== '/') {
            if (location.pathname === '/supervisor-landing') {
              navigate('/supervisor-dashboard');
            }
          }
          else {
            navigate('/supervisor-dashboard')
          }
        }
      }
    }
  }, [accessToken]);

  return (
    // returning components based on the paths in address bar.
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          
          <main className="content">
            <Routes>
              <Route path="/" element={<LandingPage />}></Route>
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/register/studentRegister"
                element={<StudentRegister />}
              ></Route>
              <Route
                path="/register/industrialRegister"
                element={<IndustrialRegister />}
              />
              <Route
                path="/register/supervisorRegister"
                element={<SupervisorRegister />}
              />
              <Route
                path="/student-dashboard/*"
                element={<StudentDashboard accessToken={accessToken} />}
              />
              <Route
                path="/industrial-dashboard"
                element={<IndustrialDashboard accessToken={accessToken} />}
              />
              <Route
                path="/view-project/:id/*"
                element={<ViewProjectPage />}
              ></Route>
              <Route
                path="/view-education/:id/*"
                element={<ViewEducation />}
              ></Route>
              <Route
                path="/industrial-dashboard/add-new-project"
                element={<AddNewProject />}
              ></Route>
              <Route path="/profile/*" element={<Profile />}></Route>
              <Route
                path="/ProjectsApplied/*"
                element={<ProjectsApplied />}
              ></Route>
              <Route
                path="/PersonalProjects/*"
                element={<PersonalProjects />}
              ></Route>
              <Route
                path="/view-project/:id/edit-job"
                element={<EditProject />}
              ></Route>
              <Route
                path="/view-project/:id/edit-project"
                element={<EditPrevProject />}
              ></Route>
              <Route
                path="/view-education/:id/edit-education"
                element={<EditEducation />}
              ></Route>

              <Route path="/FAQ/*" element={<FAQ />}></Route>
              <Route path="/Job/:id/*" element={<Job />}></Route>
              <Route
                path="/review-info/:id"
                element={<ReviewInformation />}
              ></Route>
              <Route
                path="/industrial-landing"
                element={<IndustrialLanding />}
              ></Route>
              <Route
                path="/supervisor-landing"
                element={<SupervisorLanding />}
              ></Route>
              <Route
                path="/supervisor-dashboard"
                element={<SupervisorDashboard />}
              ></Route>
              <Route path="/education/*" element={<EducationDetails />}></Route>
              <Route
                path="/student-dashboard/add-new-education"
                element={<AddEducation />}
              ></Route>
              <Route
                path="/student-dashboard/add-new-project"
                element={<AddPreviousProjects />}
              ></Route>
              <Route
                path="/rating/:id/"
                element={<FeedbackForm />}
              ></Route>
              <Route
                path="/progress_logs/:id/"
                element={<ProgressLogs />}
              ></Route>
              <Route path="/experience" element={<ExperienceDetails />}></Route>
              <Route path="/browse-partners" element={<BrowsePartners />}></Route>
              {/* APPLICANTS INFO */}
              <Route path="/applicants-info/:id" element={<ApplicantsInfo />}></Route>
              <Route path="/browse-all-projects" element={<BrowseAllProjects />}></Route>
              <Route path="/applicant-detail/:data" element={<ApplicantDetail />}></Route>
              <Route path="/approved-projects" element={<ApprovedProjects />}></Route>
              <Route path="/enrolled-project" element={<EnrolledProject />}></Route>
              <Route path="/add-new-experience" element={<AddExperience />}></Route>
              <Route
                path="/view-experience/:id/edit-experience"
                element={<EditExperience />}
              ></Route>
            </Routes>

            {/* </> */}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Wrapper;
