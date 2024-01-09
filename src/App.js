import './App.css';
import { Outlet } from 'react-router-dom'
import { AppBar } from './components/AppBar';
import Footer from './components/Footer';
import React, { useCallback, useEffect, useState } from 'react';
import Alert from './components/Alert'

export const AppContext = React.createContext();


function App() {

  AppContext.defaultProps = {
    jwtToken: "",
    refreshToken: ""
  };

  const [jwtToken, setJwtToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  const [tickInterval, setTickInterval] = useState();

  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");

  const toggleRefresh = useCallback((status) => {
 
    if (status) {
      let i = setInterval(() => {

        fetch(`http://localhost:5005/refresh`, {
          method: "POST",
          credentials: "include",
        })
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

      fetch(`http://localhost:5005/refresh`, {
        method: "POST",
        credentials: 'include',
      })
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
      <AppContext.Provider value={{ jwtToken, setJwtToken, toggleRefresh }}>
        <div >
          <div>
            <AppBar></AppBar>
            <div className='justify-content-center'>
              {alertMessage && (
                <Alert
                  message={alertMessage}
                  className={alertClassName}
                />
              )}
              <Outlet context={{ jwtToken, setJwtToken, setAlertClassName, setAlertMessage, refreshToken, setRefreshToken }}></Outlet>
              <Footer />
            </div>
          </div>
        </div>
      </AppContext.Provider>
    </>
  );
}

export default App;
