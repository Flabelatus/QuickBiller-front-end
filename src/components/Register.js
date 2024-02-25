import { useState } from "react";
import Input from "./Inputs";
import Invoice from '.././images/invoice.png'
import { useNavigate, useOutletContext } from "react-router-dom";

const Register = () => {
    const [userName, setUserName] = useState("");
    const { setAlertClassName, setAlertMessage } = useOutletContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmatioinPassword] = useState("");


    const navigate = useNavigate();

    const showAlert = (message, className, timeout = 5000) => {
        setAlertMessage(message);
        setAlertClassName(className);

        setTimeout(() => {
            setAlertMessage("");
            setAlertClassName("");
        }, timeout);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (confirmationPassword == password) {
            let payload = {
                username: userName,
                email: email,
                password: password
            };

            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            }
            fetch(`${process.env.REACT_APP_BACKEND}/api/register`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (!data.error) {
                        console.log(data.data);
                        navigate(`/email-verification?uid=${data.data}`);
                    } else {
                        showAlert(data.message, "alert-danger", 3000);
                    }
                })
                .catch((err) => {
                    console.error(err.message);
                })
        } else {
            showAlert("Password does not match", "alert-danger", 3000);
        }

    }

    return (
        <div className="container mt-5 px-5 mb-5">
            <div className="row justify-content-center">
                <div className="col">
                    <img
                        src={Invoice} style={{ width: 500, borderRadius: 16, marginTop: 50 }}>
                    </img>
                </div>
                <div className="col">
                    <h1 className="text-start mt-4 ms-5">Register</h1>

                    <form onSubmit={handleSubmit} className="mt-3 mb-4 ms-5" >
                        <Input
                            title="Username"
                            autoComplete="user-name"
                            id="user-name"
                            type="text"
                            name="user-name"
                            onChange={(e) => setUserName(e.target.value)}
                        />
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
                        <Input
                            title="Confirm Password"
                            autoComplete="new-password"
                            id="confirm-password"
                            type="password"
                            name="confirm-password"
                            onChange={(e) => setConfirmatioinPassword(e.target.value)}
                        />
                        <button type="submit" className="btn btn-submit-dark-small mt-3">Submit</button>
                    </form>
                </div>

            </div>
        </div>
    );
};


export default Register;