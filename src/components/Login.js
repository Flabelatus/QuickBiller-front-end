import { useState } from "react";
import Input from "./Inputs";
import google from '.././images/google.png'
import fb from '.././images/fb.png'
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setJwtToken, setAlertClassName, setAlertMessage, setRefreshToken } = useOutletContext();

    const navigate = useNavigate();

    const showAlert = (message, className, timeout = 5000) => {
        setAlertMessage(message);
        setAlertClassName(className);

        setTimeout(() => {
            setAlertMessage("");
            setAlertClassName("");
        }, timeout);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let payload = {
            email: email,
            password: password,
        }

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(payload),
        }

        fetch(`${process.env.REACT_APP_BACKEND}/api/login`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.access_token) {
                    
                    let userID = jwt_decode.jwtDecode(data.access_token).sub;
                    fetch(`${process.env.REACT_APP_BACKEND}/api/confirmation/user/${userID}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }).then((resp) => resp.json()).then((confirmation) => {
                        if (confirmation.data.confirmed === true) {
                            setJwtToken(data.access_token);
                            navigate("/");
                        } else {
                            setJwtToken("");
                            navigate("/email-verification");
                        };
                    }).catch((err) => console.error(err.message))

                } else {
                    showAlert(data.message, "alert-danger", 3000);
                }
            })
            .catch(error => {
                console.error(error);
            })
    };

    return (
        <div className=" mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4 mx-auto container">
                    <h1 className="text-center mt-5 mb-5">Sign in to QuickBiller</h1>

                    <form onSubmit={handleSubmit} className="mt-4 mb-4 text-center" style={{ marginLeft: '' }}>
                        <Input
                            title="Email"
                            autoComplete="email"
                            id="email"
                            type="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            title="Password"
                            autoComplete="new-password"
                            id="password"
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="btn btn-submit-dark-small mt-4" style={{ width: 250 }}>Sign In</button>
                    </form>
                    <div className="row justify-content-center mb-5">
                        <Link to="/forgot-password" style={{ textAlign: 'center' }}>Forgot your password?</Link>
                    </div>

                    <h4 className="mt-5 text-center d-flex px-5"><hr style={{ width: '50%' }}></hr><span className="ms-4 me-4">Or</span><hr style={{ width: '50%' }}></hr></h4>
                    {/* <h5 className="text-center">Sign in using</h5> */}
                    <div className="text-center mt-3 mb-4">
                        <button className="btn btn-light text-center me-2" style={{ backgroundColor: '#FFFFFF00' }}><img src={google} style={{ height: 35 }}></img></button>
                        <button className="btn btn-light text-center" style={{ backgroundColor: '#FFFFFF00' }}><img src={fb} style={{ height: 35 }}></img></button>
                    </div>

                </div>
            </div>
        </div>
    );

}

export default Login;