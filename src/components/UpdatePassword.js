import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';
import Input from "./Inputs";

export const PasswordResetRequest = () => {
    const [isSent, setIsSent] = useState(false);
    const [user, setUser] = useState(null);

    const { jwtToken } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return;
        };
        fetch(`${process.env.REACT_APP_BACKEND}/api/logged_in/user/${jwt_decode.jwtDecode(jwtToken).sub}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        }).then((response) => response.json()).then((data) => {
            setUser(data);
        }).catch(error => console.error(error.message))

    }, [isSent]);

    const handleSendLink = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            },
            body: JSON.stringify({ user_id: user.ID })
        }
        fetch(`${process.env.REACT_APP_BACKEND}/api/logged_in/user/send_password_email/${jwt_decode.jwtDecode(jwtToken).sub}`, requestOptions)
            .then((response) => response.json()).then((data) => console.log(data)).catch((error) => console.error(error.message))
        setIsSent(true);
    };

    return (
        <div className="row" style={{ height: 500 }}>
            <div className="row justify-content-center text-center mt-5" style={{ height: 300 }}>
                <div className="col-md-5 container px-4 py-4">
                    <button className="btn btn-light mb-3 px-4" style={{ color: 'black', fontSize: 20, width: 'fit-content', border: '1px solid #ccc', borderRadius: 25, fontWeight: 350 }} onClick={() => navigate(-1)}>Back</button>

                    {!isSent && <h5 className="px-5 py-5">If you want to proceed with reseting your password, you would need to try through the link via email</h5>}
                    {!isSent && <a onClick={handleSendLink} className="btn btn-submit-light-small px-4 mb-3" style={{ height: 'fit-content', width: 'fit-content' }}> Send the password reset link</a>}
                    {isSent && <h5 className="px-5 py-3 mt-5 container" style={{ backgroundColor: "#e56259", color: "white", width: 'fit-content' }}>The link to reset your password is sent to your email <br />Please check your email and proceed from there</h5>}
                </div>
            </div>
        </div>

    );
};

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);

    useEffect(() => {

    }, [isSent]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let payload = {
            email: email
        };

        fetch(
            `${process.env.REACT_APP_BACKEND}/api/send_password_email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }
        ).then((response) => {

            if (response.ok) {
                setIsSent(true);
            } else {
                alert(response.message);
            }
        }).catch((error) => console.error(error.message));

    };

    return (
        <div className="row justify-content-center text-center mt-5" style={{ height: 300 }}>

            <div className="col-md-5 container px-4 py-4">
                <button className="btn btn-light mb-5 px-4" style={{ color: 'black', fontSize: 20, width: 'fit-content', border: '1px solid #ccc', borderRadius: 25, fontWeight: 350 }} onClick={() => navigate("/login")}>Back</button>
                {!isSent ? <form onSubmit={handleSubmit}>
                    <Input
                        title="Enter your email address"
                        value={email}
                        name='email'
                        type='email'
                        id='email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="btn btn-submit-dark-small px-4 mt-4" style={{ width: 'fit-content' }}>Send the password reset link</button>
                </form> : <h3 className="text-center">A password reset link is sent</h3>}
            </div>

        </div>
    );
};

export const UpdatePasswordNoAuth = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setRepeatPassword] = useState("");
    const [update, setUpdate] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [isUsed, setIsUsed] = useState(false);
    const { setAlertMessage, setAlertClassName } = useOutletContext();
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

    function isTokenExpired(expired_at, created_at) {
        // Convert expired_at minutes to milliseconds
        var expirationTime = expired_at * 60 * 1000 + created_at; // Convert minutes to milliseconds

        // Get the current time in milliseconds
        var currentTime = new Date().getTime();

        // Check if the current time is greater than the expiration time
        return currentTime > expirationTime;
    }

    useEffect(() => {

        const queryParams = new URLSearchParams(window.location.search);
        const paramValue = queryParams.get('id');
        setUserId(paramValue);

        fetch(
            `${process.env.REACT_APP_BACKEND}/api/user/password_reset/token/${paramValue}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            }
        ).then((response) => response.json()).then((data) => {
            if (data.data.token_used) {
                console.log(data.data);
                setIsUsed(true);
                console.log(data.data.token_used, "Something")
            };
            if (isTokenExpired(data.data.expired_at, data.data.created_at)) {
                setIsExpired(true);
                console.log(isTokenExpired(data.data.expired_at));
            };
        }).catch(error => console.error(error.message))

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
            },
            body: JSON.stringify(payload)
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/user/password_reset/${userId}`, requestOptions)
            .then((response) => response.json()).then((data) => {
                if (data.error) {
                    showAlert(data.message, "alert-danger", 3000);
                } else {
                    showAlert(data.message, "alert-success", 3000);
                    setIsSuccess(true);
                    // set the token to used
                    fetch(
                        `${process.env.REACT_APP_BACKEND}/api/user/password_reset/token/use/${userId}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                    ).then((resp) => resp.json()).then((d) => {
                        console.log(d.data)
                    }).catch(err => console.error(err.message))
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
    };
    return (
        <div className=" mt-5">
            <div className="row justify-content-center">
                {
                    !isUsed && !isExpired &&
                    <div className="col-md-4 mx-auto container">
                        <h1 className="text-center mt-5 mb-5">{!isSuccess ? "Password Update" : "Password Updated"}</h1>
                        {!isSuccess &&
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
                        }

                    </div>
                }
                {
                    isSuccess &&
                    <div className="col-md-4 mx-auto container" style={{ height: 500 }}>
                        <h1 className="text-center mt-5 mb-5">{!isSuccess ? "Password Update" : "Password Updated"}</h1>
                        <div className="row justify-content-center">
                            <p className="text-center px-5">Your password is successfully updated</p>
                            <Link onClick={() => navigate("-1")} className="btn btn-submit-dark-small mt-4 text-center ms-4 mt-4 mb-4 me-4" style={{ width: 250 }}>Go back</Link>
                        </div>
                    </div>
                }
                {
                    isUsed && !isSuccess &&
                    <div className="col-md-4 mx-auto container" style={{ height: 500 }}>
                        <h1 className="text-center mt-5 mb-5">{!isSuccess ? "Password Update" : "Password Updated"}</h1>
                        <div className="row justify-content-center">
                            <h5 className="text-center px-5">This password reset token is already used</h5>
                        </div>
                    </div>
                }
                {
                    isExpired &&
                    <div className="col-md-4 mx-auto container" style={{ height: 500 }}>
                        <h1 className="text-center mt-5 mb-5">{!isSuccess ? "Password Update" : "Password Updated"}</h1>
                        <div className="row justify-content-center">
                            <h5 className="text-center px-5">This password reset token is expired</h5>
                        </div>
                    </div>
                }

            </div>
        </div>
    );
};