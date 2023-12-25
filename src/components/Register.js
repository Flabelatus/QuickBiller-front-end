import { useState } from "react";
import Input from "./Inputs";
import Invoice from '.././images/invoice.png'

const Register = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmatioinPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submitted');
    }

    return (
        <div className="container mt-5 px-5">
            <div className="row justify-content-center">
                <div className="col">
                    <h1 className="text-center mt-4">Register</h1>

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
                <div className="col">
                    <img
                        src={Invoice} style={{ height: 450, borderRadius: 16, marginTop: 50 }}>
                    </img>

                </div>
            </div>
        </div>
    );
};


export default Register;