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
    userMode: "",
  };

  const [jwtToken, setJwtToken] = useState("");

  const [tickInterval, setTickInterval] = useState();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");

  const toggleRefresh = useCallback((status) => {

    if (status) {
      console.log("turning on ticking");
      let i = setInterval(() => {

        const requestOptions = {
          method: "POST",
          credentials: "include",
        }

        fetch(`${process.env.REACT_APP_BACKEND}/api/refresh`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            if (data.access_token) {
              setJwtToken(data.access_token);
            }
          })
          .catch(error => {
            console.error(error.message);
          })
      }, 800000);
      setTickInterval(i);
    } else {

      setTickInterval(null);
      clearInterval(tickInterval);
    }
  }, [tickInterval])

  useEffect(() => {
    if (jwtToken === "") {
      const requestOptions = {
        method: "POST",
        credentials: "include",
      };

      fetch(`${process.env.REACT_APP_BACKEND}/api/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        })
        .catch(error => {
          console.error(error.message);
        })
    };

  }, [jwtToken, toggleRefresh]);

  return (
    <>
      <AppContext.Provider value={{ jwtToken, setJwtToken, toggleRefresh }}>
        <div style={{ maxWidth: '100%', minWidth: 500 }}>
          <div>
            <AppBar></AppBar>
            <div className='justify-content-center'>
              {alertMessage && (
                <Alert
                  message={alertMessage}
                  className={alertClassName}
                />
              )}
              <Outlet context={{ jwtToken, setJwtToken, setAlertClassName, setAlertMessage }}></Outlet>
              <Footer />
            </div>
          </div>
        </div>
      </AppContext.Provider>
    </>
  );
}

export default App;
