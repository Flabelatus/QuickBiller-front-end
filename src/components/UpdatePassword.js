import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';
import Input from "./Inputs";

export const UpdatePassword = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setRepeatPassword] = useState("");
    const [update, setUpdate] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { jwtToken, setAlertMessage, setAlertClassName } = useOutletContext();
    const navigate = useNavigate();

    const toggleUpdate = () => {
        if (!update) {
            setUpdate(true);
        } else {
            setUpdate(false);
        };
    };

    const showAlert = (message, className, timeout = 5000) => {
        setAlertMessage(message);
        setAlertClassName(className);

        setTimeout(() => {
            setAlertMessage("");
            setAlertClassName("");
        }, timeout);
    };

    useEffect(() => {

        const queryParams = new URLSearchParams(window.location.search);
        const paramValue = queryParams.get('uid');
        setUserId(paramValue);

    }, [update, isSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();
        var payload = {
            user_id: userId,
            new_password: password
        }
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            },
            body: JSON.stringify(payload)
        };

        fetch(`${process.env.REACT_APP_BACKEND}/logged_in/user/password_reset/${userId}`, requestOptions)
            .then((response) => response.json()).then((data) => {
                if (data.error) {
                    showAlert(data.message, "alert-danger", 3000);
                } else {
                    showAlert(data.message, "alert-success", 3000);
                    setIsSuccess(true);
                };
                setPassword("");
                setRepeatPassword("");
                document.querySelectorAll('input').forEach(input => {
                    input.value = '';
                });
                toggleUpdate();
            }).catch((error) => {
                showAlert(error.message, "alert-danger", 3000);
                console.error(error.message);
            })
    }
    return (
        <div className=" mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4 mx-auto container">
                    <h1 className="text-center mt-5 mb-5">{!isSuccess ? "Password Update" : "Password Updated"}</h1>
                    {!isSuccess ?
                        <form onSubmit={handleSubmit} className="mt-4 mb-4 text-center" style={{ marginLeft: '' }}>
                            <Input
                                title="New Password"
                                id="password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Input
                                title="Repeat New Password"
                                id="repeat-password"
                                type="password"
                                name="repeat-password"
                                value={newPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                            />
                            <button type="submit" className="btn btn-submit-dark-small mt-4" style={{ width: 250 }}>Update Password</button>
                        </form>

                        :
                        <div className="row justify-content-center">
                            <p className="text-center px-5">Your password is successfully updated</p>
                            <Link onClick={() => navigate("-1")} className="btn btn-submit-dark-small mt-4 text-center ms-4 mt-4 mb-4 me-4" style={{ width: 250 }}>Go back</Link>
                        </div>

                    }

                </div>
            </div>
        </div>
    );
};

export const PasswordResetRequest = () => {
    const [isSent, setIsSent] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {

    }, [isSent]);

    const handleSendLink = () => {

        setIsSent(true);
    };

    return (
        <div className="row justify-content-center text-center mt-5" style={{ height: 300 }}>
            <div className="col-md-5 container px-4 py-4">
                <button className="btn btn-light mb-5 px-4" style={{ color: 'black', fontSize: 20, width: 'fit-content', border: '1px solid #ccc', borderRadius: 25, fontWeight: 350 }} onClick={() => navigate(-1)}>Back</button>

                {!isSent && <h5 className="px-5 py-5">If you want to proceed with reseting your password, you would need to try through the link via email</h5>}
                {!isSent && <a onClick={handleSendLink} className="btn btn-submit-light-small px-4" style={{ height: 'fit-content', width: 'fit-content' }}> Send the password reset link</a>}
                {isSent && <h5 className="px-5 py-5 container" style={{ backgroundColor: "#e56259", color: "white" }}>The link to reset your password is sent to your email <br />Please check your email and proceed from there</h5>}
            </div>

        </div>
    );
};

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

    };

    return (
        <div className="row justify-content-center text-center mt-5" style={{ height: 300 }}>

            <div className="col-md-5 container px-4 py-4">
                <button className="btn btn-light mb-5 px-4" style={{ color: 'black', fontSize: 20, width: 'fit-content', border: '1px solid #ccc', borderRadius: 25, fontWeight: 350 }} onClick={() => navigate("/login")}>Back</button>
                <form onSubmit={handleSubmit}>
                    <Input
                        title="Enter your email address"
                        value={email}
                        name='email'
                        type='email'
                        id='email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="btn btn-submit-dark-small px-4 mt-4" style={{ width: 'fit-content' }}>Send the password reset link</button>
                </form>
            </div>

        </div>
    );
};