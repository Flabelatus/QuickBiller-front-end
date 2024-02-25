import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserVerifyPage = () => {
    const [userId, setUserId] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const paramValue = queryParams.get('uid');
        setUserId(paramValue);

        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/confirmation/user/${paramValue}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.data.confirmed) {
                    setIsConfirmed(data.data.confirmed);
                };
                if (Math.floor(Date.now() / 1000) > data.data.expired_at) {
                    setIsExpired(true);
                };
            }).catch((error) => console.error(error.message));

    }, []);

    const handleSendEmail = () => {
        // Get the latest confrimation model
        // If it exists and it is not confrimed already, set it to Expired
        // If it is confrimed, raise a message that the user is already confirmed and you can go to login page
        // Otherwise, create a new confrimation model and send it as email to the user 
    }

    return (
        <div className="row justify-content-center text-center mt-5" style={{ height: 300 }}>
            <div className="col-md-5">
                <h1 style={{ color: '#e56259', fontFamily: 'revert', fontSize: 70, fontWeight: 700, textAlign: 'center', fontFamily: 'Gill Sans' }}>QuickBiller</h1>

                {!isExpired && !isConfirmed && <h2 className="mt-5">We have sent you a verification link </h2>}
                {!isExpired && !isConfirmed && <h2>Please check your email to verify your account</h2>}
                <br></br>
                {!isExpired && !isConfirmed && <p className="mt-5 mb-5">If you can not find the email in your inbox, please check your spam mailbox as well. If the email was not found in
                    the spam as well, then you can click the button below</p>}
                {isConfirmed && <h2 className="mt-5 mb-5">This user is already confirmed</h2>}
                {isConfirmed && <a className="btn btn-submit-light-small px-4" onClick={() => { navigate("/") }} style={{ height: 'fit-content', width: 'fit-content' }}> Go to application</a>}

                {isExpired && <h2 className="mt-5 mb-5">The confirmation link is expired</h2>}
                {!isConfirmed && <a className="btn btn-submit-light-small px-4" style={{ height: 'fit-content', width: 'fit-content' }}> Resend the verification email</a>}
            </div>

        </div>
    )
}