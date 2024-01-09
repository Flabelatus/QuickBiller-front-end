import { useState } from "react";
import Input from "./Inputs";
import google from '.././images/google.png'
import fb from '.././images/fb.png'
import { useNavigate, useOutletContext } from "react-router-dom";

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

        fetch(`http://localhost:8082/login`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.access_token) {
                    setJwtToken(data.access_token);
                    navigate("/");
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
                <div className="col-md-6 mx-auto">
                    <h1 className="text-center mt-4">Log in</h1>

                    <form onSubmit={handleSubmit} className="mt-4 mb-4" style={{ marginLeft: '30%' }}>
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
                        <button type="submit" className="btn btn-submit-dark-small mt-2">Submit</button>
                    </form>
                    <div className="row justify-content-center">
                        <a href="#!" style={{ textAlign: 'center' }}>Change your password</a>
                    </div>
                    <h4 className="mt-5 text-center">Or</h4>
                    <h5 className="text-center">Sign in using</h5>
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