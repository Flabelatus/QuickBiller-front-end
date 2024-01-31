import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';
import Loader from 'react-spinners/SyncLoader'
import Input from "./Inputs";
import { UploadImage } from "./UploadImage";

const UserCompany = () => {
    const [sender, setSender] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [editmode, setEditmode] = useState(false);
    const { jwtToken } = useOutletContext();
    const [submitted, setSubmitted] = useState(false);
    const [modifying, setModifying] = useState(false);

    const [logo, setLogo] = useState({})
    const [imageData, setImageData] = useState(null);
    const [imageName, setImageName] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return;
        }
        const requestOptions = {
            method: "GET",
            headers: { "Authorization": "Bearer " + jwtToken, "Content-Type": "application/json" },
        }
        if (!editmode) {
            fetch(`http://localhost:8082/logged_in/sender_data/user/${jwt_decode.jwtDecode(jwtToken).sub}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setSender(data.data);
                    fetch(`http://localhost:8082/logged_in/logo/${jwt_decode.jwtDecode(jwtToken).sub}`, requestOptions)
                        .then((resp) => resp.json())
                        .then((d) => {
                            setLogo(d.data);
                            setImageName(d.data.filename)
                        })
                        .catch((err) => console.log(err.message))
                })
                .catch((error) => {
                    console.error(error.message);
                })
        }

    }, [jwtToken, editmode, submitted, modifying, imageData]);

    useEffect(() => {
        const loadImage = async (filename) => {
            const imageUrl = await fetchImage(filename);
            setImageSrc(imageUrl);
            setIsLoading(false);
        };
        loadImage(imageName);
    }, [imageData, imageName]);

    const fetchImage = async (filename) => {
        try {
            const response = await fetch(`http://localhost:8082/logged_in/image/${filename}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwtToken
                }
            });

            if (!response.ok) {
                throw new Error('failed to fetch image');
            }

            const blob = await response.blob();
            const imageDataUrl = URL.createObjectURL(blob);

            return imageDataUrl; // Return the URL of the fetched image
        } catch (error) {
            console.error('Error fetching image:', error.message);
            return null; // Return null or handle the error as needed
        }
    };


    const handleSwitchEditmode = () => {
        setEditmode(true);
    };

    const handleSwitchModifyingMode = () => {
        setEditmode(true);
        setModifying(true);
    }

    const handleSenderChange = (field, value) => {
        setSender(senderData => ({
            ...senderData,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (e.nativeEvent.submitter && e.nativeEvent.submitter.name === 'modify') {
            return;
        };

        if (
            !sender.company_name ||
            !sender.email ||
            !sender.contact_name ||
            !sender.iban ||
            !sender.coc_no ||
            !sender.street ||
            !sender.postcode ||
            !sender.city ||
            !sender.country ||
            !sender.vat_no
        ) {
            alert('Please fill in all fields before submitting.');
            return;
        };

        var payload = sender;
        payload.user_id = jwt_decode.jwtDecode(jwtToken).sub;

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + jwtToken },
            body: JSON.stringify(payload)
        };

        fetch(`http://localhost:8082/logged_in/sender_data`, requestOptions)
            .then((response) => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error.message))
            .finally(() => {
                setSubmitted(true);
                setEditmode(false);
            });
    };

    const handleModifyData = (e) => {
        e.preventDefault();

        var payload = sender;
        payload.user_id = jwt_decode.jwtDecode(jwtToken).sub;
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + jwtToken },
            body: JSON.stringify(payload)
        };

        fetch(`http://localhost:8082/logged_in/sender_data`, requestOptions)
            .then((response) => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error.message))
            .finally(() => {
                setSender(sender);
                setModifying(false);
                setEditmode(false);
            });
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <h1 className="h1 mt-4 mb-4" style={{ fontWeight: 700, color: '#06186860' }}>Loading Sender Data</h1>
                <div className='row justify-content-center'>
                    <Loader className='mt-4' color="#06186860" size={20} loading={isLoading}></Loader>
                </div>
            </div>
        )
    } else {
        return (

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {editmode &&
                    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center mt-5">
                        <form className="form-container" onSubmit={handleSubmit}>
                            <div className="d-flex flex-column align-items-center">
                                <h3 className="mb-5 text-center" style={{ color: '#061868' }}>
                                    Enter Your Company Information
                                </h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Input
                                            title="Company Name"
                                            id="company-name"
                                            type="text"
                                            name="company-name"
                                            onChange={(e) => handleSenderChange("company_name", e.target.value)}
                                            value={sender.company_name}
                                        />
                                        <Input
                                            title="Email Address"
                                            id="company-email"
                                            type="email"
                                            name="company-email"
                                            onChange={(e) => handleSenderChange("email", e.target.value)}
                                            value={sender.email}
                                        />
                                        <Input
                                            title="Contact Name"
                                            id="contact-name"
                                            type="text"
                                            name="contact-name"
                                            onChange={(e) => handleSenderChange("contact_name", e.target.value)}
                                            value={sender.contact_name}
                                        />
                                        <Input
                                            title="IBAN"
                                            id="iban"
                                            type="text"
                                            name="iban"
                                            onChange={(e) => handleSenderChange("iban", e.target.value)}
                                            value={sender.iban}
                                        />
                                        <Input
                                            title="CoC No"
                                            id="coc"
                                            type="text"
                                            name="coc"
                                            onChange={(e) => handleSenderChange("coc_no", e.target.value)}
                                            value={sender.coc_no}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Input
                                            title="Street and House No."
                                            id="street"
                                            type="text"
                                            name="street"
                                            onChange={(e) => handleSenderChange("street", e.target.value)}
                                            value={sender.street}
                                        />
                                        <Input
                                            title="Postcode"
                                            id="postcode"
                                            type="text"
                                            name="postcode"
                                            onChange={(e) => handleSenderChange("postcode", e.target.value)}
                                            value={sender.postcode}
                                        />
                                        <Input
                                            title="City"
                                            id="city"
                                            type="text"
                                            name="city"
                                            onChange={(e) => handleSenderChange("city", e.target.value)}
                                            value={sender.city}
                                        />
                                        <Input
                                            title="Country"
                                            id="country"
                                            type="text"
                                            name="country"
                                            onChange={(e) => handleSenderChange("country", e.target.value)}
                                            value={sender.country}
                                        />
                                        <Input
                                            title="VAT No"
                                            id="vat"
                                            type="text"
                                            name="vat"
                                            onChange={(e) => handleSenderChange("vat_no", e.target.value)}
                                            value={sender.vat_no}
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-center mt-4">
                                    {!modifying && <button className="btn btn-submit-light-small">Submit</button>}
                                    {modifying && <button className="btn btn-submit-light-small" name='modify' onClick={handleModifyData}>Update</button>}
                                    <button className="btn btn-submit-dark-small ms-4" onClick={() => setEditmode(false)}>Cancel</button>
                                </div>
                                <p className="text-center mb-4 mt-5" style={{ color: '#e56259', fontSize: 18 }}>
                                    The information you enter will be used as the sender information in the documents
                                </p>
                            </div>
                        </form>
                    </div>

                }

                {!editmode &&
                    <div>
                        {sender.company_name === ""
                            ?
                            <div className="row justify-content-center mt-4 mb-5">
                                <div className="px-4 py-5 text-center">
                                    <p className="mb-4 text-center mt-5" style={{ fontWeight: 700, fontSize: 22, color: "#e56259" }}>Looks like you have not yet entered your company data</p>
                                </div>
                                <button className="btn btn-submit-light-small mt-5" style={{ width: 'fit-content' }} onClick={handleSwitchEditmode}>Enter Your Company Information</button>
                            </div>
                            :
                            <div className="row justify-content-center mt-4 mb-5">
                                <div className="px-4 py-4" style={{ backgroundColor: "#FFF", borderRadius: 8, border: "1px solid #eee" }}>
                                    <lable className="mt-2" style={{ fontWeight: 700, fontSize: 22, display: 'flex', color: "#e56259" }}><span>{sender.company_name}</span></lable>
                                    <br />
                                    <lable className="mt-2" style={{ fontWeight: 700, fontSize: 18, display: 'flex', color: "#061868" }}><span className="ms-2">{sender.contact_name}</span></lable>
                                    <br />
                                    <lable className="mt-2" style={{ fontWeight: 400, fontSize: 18, display: 'flex', color: "#061868" }}><span className="ms-2">{sender.email}</span></lable>
                                    <lable className="mt-2" style={{ fontWeight: 400, fontSize: 18, display: 'flex', color: "#061868" }}><span className="ms-2">{sender.street}, {sender.postcode}</span></lable>
                                    <lable className="mt-2" style={{ fontWeight: 400, fontSize: 18, display: 'flex', color: "#061868" }}><span className="ms-2">{sender.city}, {sender.country}</span></lable>
                                    <br />
                                    <lable className="mt-2 ms-2" style={{ fontWeight: 400, fontSize: 18, display: 'flex', color: "#061868" }}>IBAN: <span className="ms-2">{sender.iban}</span></lable>
                                    <lable className="mt-2 ms-2" style={{ fontWeight: 400, fontSize: 18, display: 'flex', color: "#061868" }}>VAT No: <span className="ms-2">{sender.vat_no}</span></lable>
                                    <lable className="mt-2 ms-2" style={{ fontWeight: 400, fontSize: 18, display: 'flex', color: "#061868" }}>CoC No: <span className="ms-2">{sender.coc_no}</span></lable>

                                    <button className="btn btn-submit-light-small mt-5" onClick={handleSwitchModifyingMode}>Modify</button>

                                    <UploadImage setImageData={setImageData} setImageName={setImageName} />
                                    <img className="mt-5 mb-3" src={imageSrc} style={{ height: 80 }}></img>

                                </div>
                            </div>
                        }
                    </div>
                }

            </div>
        );
    }

}

export default UserCompany;