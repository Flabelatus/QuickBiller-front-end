import { useEffect, useState } from "react";

export const UserVerifyPage = () => {
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const paramValue = queryParams.get('uid');
        setUserId(paramValue);
        // Have a check if the confirmation is expired
        // Have a check if the user is already confirmed
        
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

                <h1 className="mt-5 mb-5">Before you can login</h1>
                <h2>We have sent you a verification link </h2>
                <h2>Please check your email to verify your account</h2>
                <br></br>
                <p className="mt-5 mb-5">If you can not find the email in your inbox, please check your spam mailbox as well. If the email was not found in
                    the spam as well, then you can click the button below</p>

                <a className="btn btn-submit-light-small px-4" style={{ height: 'fit-content', width: 'fit-content' }}> Send the verification email</a>
            </div>

        </div>
    )
}