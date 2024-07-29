import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Wrapper from './components/Wrapper';
// import { ColorModeContext, useMode } from './theme';
import { ColorModeContext, useMode } from './components/Theme';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Topbar from './components/Topbar';



function App() {

  return (
      <Router className="App">
        <Wrapper/>
      </Router>
  )
}

export default App;
