import React from "react";
import logo from '../logo.svg'
// import logo from '../Sharingan_triple.svg'
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@mui/material";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <header>
        <nav>
          <div style={{ display: 'flex', justifyContent: 'right' }}>

            <div style={{ display: 'flex' }}>
              {!['/'].includes(location.pathname)
                ?
                <>
                  <Link to={'/'} onClick={() => { }}>Logout</Link>
                </>
                :
                <>
                  <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                    <Link style={{ textDecoration: 'None', color: 'white' }} to={'/register'} onClick={() => { navigate('/register') }}>Register</Link>
                  </Button>

                </>
              }
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;