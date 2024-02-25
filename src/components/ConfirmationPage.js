import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ConfirmationPage = () => {
    const [userId, setUserId] = useState("");
    const [clicked, setClicked] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Get the URLSearchParams object from the current URL
        const queryParams = new URLSearchParams(window.location.search);

        // Get the value of a specific query parameter
        const paramValue = queryParams.get('id');
        setUserId(paramValue);
    }, [clicked]);

    const handleConfirmAccount = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/confirmation/${userId}`, requestOptions)
            .then((response) => response.json())
            .then((resp) => {
                if (!resp.error) {
                    setMessage("User successfully verified! You can now go to login");
                    setClicked(true);
                } else {
                    console.log(resp.data);
                    setError(true);
                    setMessage(resp.message);
                    setClicked(true);
                }
            })
            .catch((error) => {
                console.error(error.message);
            })
    };

    const handleNavigateLogin = () => {
        navigate("/login");
    }

    return (
        <div className="row justify-content-center text-center mt-5" style={{ height: 500 }}>
            <h1 style={{ color: '#e56259', fontFamily: 'revert', fontSize: 70, fontWeight: 700, textAlign: 'center', fontFamily: 'Gill Sans' }}>QuickBiller</h1>

            <h3>User Confirmation Page</h3>
            <a className="btn btn-submit-dark-large px-5" style={{ height: 'fit-content', width: 'fit-content' }} onClick={handleConfirmAccount}>Verify Your Account</a>
            <p>By clicking this button, your new account will be verified</p>
            <h5>{message}</h5>
            {!error && clicked && <a className="btn btn-submit-light-small px-4" onClick={handleNavigateLogin} style={{ height: 'fit-content', width: 'fit-content' }}> Go to Login</a>}
        </div>
    )
}