import { useState } from "react";
import Input, { TextFieldInput } from "./Inputs";
import SayHi from "./../images/contact.jpg"

const ContactForm = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
    };
    
    return (
        <div className="container mt-5 px-5 mb-5">
            <div className="row justify-content-center">
                <div className="col">
                    <img
                        src={SayHi} style={{ width: 500, minWidth: 200, borderRadius: 16, marginTop: 50 }}>
                    </img>
                </div>
                <div className="col">
                    <h1 className="text-start mt-4 ms-5">Contact</h1>

                    <form onSubmit={handleSubmit} className="mt-3 mb-4 ms-5" >
                        <Input
                            title="Name"
                            autoComplete="name"
                            id="name"
                            type="text"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
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
                            title="Subject"
                            id="subject"
                            type="text"
                            name="subject"
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        <TextFieldInput
                            title="Message"
                            id="message"
                            type="text"
                            name="message"
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="btn btn-submit-dark-small mt-3">Submit</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default ContactForm;