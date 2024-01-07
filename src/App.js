import './App.css';
import { Outlet, useNavigate } from 'react-router-dom'
import { AppBar } from './components/AppBar';
import Footer from './components/Footer';
import React, { useCallback, useEffect, useState } from 'react';

export const AppContext = React.createContext();


function App() {

  AppContext.defaultProps = {
    jwtToken: "",
  };

  const [jwtToken, setJwtToken] = useState("");
  const [tickInterval, setTickInterval] = useState();

  const navigate = useNavigate();

  const logOut = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    }
    fetch(`http://localhost:5005/logout`, requestOptions)
      .catch(error => {
        console.log("error logging out", error);
      })
      .finally(() => {
        setJwtToken("");
        navigate("/");
      });
  };

  const toggleRefresh = useCallback((status) => {
    const requestOptions = {
      method: "POST",
      credentials: "include",
    }
    if (status) {
      let i = setInterval(() => {

        fetch(`http://localhost:5005/refresh`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            if (data.access_token) {
              setJwtToken(data.access_token);
            }
          })
          .catch(err => {
            console.log("user is not logged-in")
          })
      }, 720000);
      setTickInterval(i);
    } else {
      setTickInterval(null);
      clearInterval(tickInterval);
    }
  }, [tickInterval]);

  useEffect(() => {
    if (jwtToken === "") {
      const requestOptions = {
        method: "POST",
        credentials: "include",
      }
      fetch(`http://localhost:5005/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        })
        .catch(err => {
          console.log("user is not logged-in", err)
        })
    }
  }, [jwtToken, toggleRefresh]);

  return (
    <>
      <AppContext.Provider value={{ jwtToken, setJwtToken }}>
      <div >
        <div>
          <AppBar></AppBar>
          <div className='justify-content-center'>
            <Outlet context={{ jwtToken, setJwtToken }}></Outlet>
            <Footer />
          </div>
        </div>
      </div>
      </AppContext.Provider>
    </>
  );
}

export default App;
