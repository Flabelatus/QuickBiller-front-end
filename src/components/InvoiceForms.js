import { useEffect, useState } from "react";
import Input from "./Inputs";
import { useOutletContext } from "react-router-dom";

const InvoiceForms = () => {
    const { jwtToken } = useOutletContext();
    const companyModel = {
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        street: "",
        postCode: "",
        city: "",
        country: ""
    }

    const [company, setCompany] = useState(companyModel);
    const [jobs, setJobs] = useState([{ jobItem: "", hourRate: 0, numberOfHours: 0 }]);
    const [costs, setCosts] = useState([{ costs: 0, info: "" }])
    const [selectedOption, setSelectedOption] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const testOptions = [
        { id: 1, data: "company 1" },
        { id: 2, data: "company 2" },
        { id: 3, data: "company 3" }
    ]

    useEffect(() => {
    }, [company, refresh]);

    const handleRefreshPage = () => {
        if (!refresh) {
            setRefresh(true);
        } else {
            setRefresh(false);
        }

        setIsSubmitted(false);
        handleClearForm();
    }

    const handleClearForm = () => {
        setCompany({ companyModel });
        document.querySelectorAll('input').forEach(input => {
            input.value = ''; // Resets input fields directly
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitted(true);
    };

    const handleAddJob = () => {
        setJobs([...jobs, { jobItem: "", hourRate: 0, numberOfHours: 0 }]);
    };

    const handleRemoveJob = (index) => {
        const updatedJobs = [...jobs];
        updatedJobs.splice(index, 1);
        setJobs(updatedJobs);
    };

    const handleAddCost = () => {
        setCosts([...costs, { costs: 0, info: "" }])
    };

    const handleRemoveCost = (index) => {
        const updatedCosts = [...costs];
        updatedCosts.splice(index, 1);
        setCosts(updatedCosts);
    };

    const handleJobInputChange = (index, field, value) => {
        const updatedJobs = [...jobs];
        updatedJobs[index][field] = value;
        setJobs(updatedJobs);
    };

    const handleCostInputChange = (index, field, value) => {
        const updatedCosts = [...costs];
        updatedCosts[index][field] = value;
        setCosts(updatedCosts);
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleCompanyChange = (field, value) => {
        setCompany(prevCompany => ({
            ...prevCompany,
            [field]: value
        }));
    };

    return (
        <div className="justify-content-center">
            <hr className="mt-4" style={{ color: "#ccc", width: "50vw", margin: "0 auto" }} />
            <form onSubmit={handleSubmit} className="mb-5 mt-5">

                {jwtToken !== "" &&
                    <div>
                        <h1 className="mb-5" style={{ color: '#ccc', fontWeight: 700 }}>Document Data</h1>
                        <div >
                            <select

                                className="btn btn-light mb-2"
                                style={{ width: 'fit-content' }}
                                onChange={handleSelectChange}
                                value={selectedOption}
                            >
                                <option value="">Select an option</option>
                                {testOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>{opt.data}</option>
                                ))}
                            </select>

                        </div>
                        <a className="btn btn-secondary mt-3" style={{ fontSize: 20, width: 150 }}>Select</a>
                        <hr className="mt-5 mb-5" style={{ color: "#ccc", width: "50vw", margin: "0 auto" }} />
                    </div>
                }

                <div className="row- mt-5 justify-content-center container py-4">
                    <div className="row justify-content-center">
                        <h3 className="mb-5" style={{ color: '#00994C' }}>Company Information</h3>
                        <div className="col-md-3">
                            <Input
                                title="Company Name"
                                id="company-name"
                                type="text"
                                className="me-4"
                                name="company-name"
                                onChange={(e) => handleCompanyChange("companyName", e.target.value)}
                                value={company.companyName}
                            />
                            <Input
                                title="Email Address"
                                id="company-email"
                                type="email"
                                className="me-4"
                                name="company-email"
                                onChange={(e) => handleCompanyChange("email", e.target.value)}
                                value={company.email}
                            />
                            <Input
                                title="Contact Name"
                                id="contact-name"
                                type="text"
                                className="me-4"
                                name="contact-name"
                                onChange={(e) => handleCompanyChange("contactName", e.target.value)}
                                value={company.contactName}
                            />
                            <Input
                                title="Phone"
                                id="phone"
                                type="phone"
                                className="me-4"
                                name="phone"
                                onChange={(e) => handleCompanyChange("phone", e.target.value)}
                                value={company.phone}
                            />
                        </div>
                        <div className="col-md-3 justify-content-end">
                            <Input
                                title="Street and House No."
                                id="street"
                                type="text"
                                className="me-4"
                                name="street"
                                onChange={(e) => handleCompanyChange("street", e.target.value)}
                                value={company.street}
                            />
                            <Input
                                title="Postcode"
                                id="postcode"
                                type="text"
                                className="me-4"
                                name="postcode"
                                onChange={(e) => handleCompanyChange("postCode", e.target.value)}
                                value={company.postCode}
                            />
                            <Input
                                title="City"
                                id="city"
                                type="text"
                                className="me-4"
                                name="city"
                                onChange={(e) => handleCompanyChange("city", e.target.value)}
                                value={company.city}
                            />
                            <Input
                                title="Country"
                                id="country"
                                type="text"
                                className="me-4"
                                name="country"
                                onChange={(e) => handleCompanyChange("country", e.target.value)}
                                value={company.country}
                            />
                        </div>
                    </div>

                </div>
                <div className=" mt-5 justify-content-center d-flex container py-4">
                    <div className="row justify-content-center d-flex">
                        <h3 className="mb-4" style={{ color: '#00994C' }}>Job Information</h3>

                        <div className="col-md-4">
                            {jobs.map((job, index) => (
                                <div key={index} className="d-flex justify-content-center">
                                    <Input
                                        title={`Job Item Description ${index + 1}`}
                                        type="text"
                                        className="me-4"
                                        value={job.jobItem}
                                        onChange={(e) => handleJobInputChange(index, "jobItem", e.target.value)}
                                    />
                                    <Input
                                        title={`Hour Rate for Job ${index + 1}`}
                                        type="number"
                                        className=""
                                        value={job.hourRate}
                                        onChange={(e) => handleJobInputChange(index, "hourRate", e.target.value)}
                                    />
                                    <Input
                                        title={`Number of Hours`}
                                        type="number"
                                        className="ms-4"
                                        value={job.hourRate}
                                        onChange={(e) => handleJobInputChange(index, "hourRate", e.target.value)}
                                    />

                                    <a className="btn btn-submit-light-small mt-2 mb-2 ms-4 mr-4" style={{ width: 40, height: 40 }} onClick={() => handleRemoveJob(index)}>
                                        -
                                    </a>
                                </div>
                            ))}
                            <a className="btn btn-submit-light-small mt-2" style={{ width: 40 }} onClick={handleAddJob}>
                                +
                            </a>
                        </div>
                    </div>

                </div>

                <div className=" mt-5 justify-content-center container py-4">
                    <div className="row justify-content-center">
                        <h3 className="mb-4" style={{ color: '#00994C' }}>VAT Information</h3>
                        <div className="col">

                            <input
                                className="form-check-input checkbox-custom"
                                type="checkbox"
                            ></input>
                            <label style={{ fontSize: 20, marginLeft: 10, fontWeight: 400, color: "#00000090" }}>VAT Free</label>

                            <input
                                className="form-check-input checkbox-custom ms-4"
                                type="checkbox"
                                defaultChecked={true}
                            ></input>
                            <label style={{ fontSize: 20, marginLeft: 10, fontWeight: 400, color: "#00000090" }}>Within EU</label>

                            <input
                                className="form-check-input checkbox-custom ms-4"
                                type="checkbox"
                                defaultChecked={true}
                            ></input>
                            <label style={{ fontSize: 20, marginLeft: 10, fontWeight: 400, color: "#00000090" }}>Within Country</label>

                            <input
                                className="ms-4"
                                type="text"
                                style={{ width: 40, fontWeight: 400, color: "#00000090", border: "2px solid #00994C70", borderRadius: 4 }}
                                value={21}
                            ></input>
                            <label style={{ fontSize: 20, marginLeft: 10, fontWeight: 400, color: "#00000090" }}> VAT %</label>
                        </div>
                    </div>
                </div>

                <div className="mt-5 justify-content-center d-flex container py-4">
                    <div className="row justify-content-center">
                        <h3 className="mb-4" style={{ color: '#00994C' }}>Costs Items</h3>

                        <div className="col-md-4">
                            {costs.map((cost, index) => (
                                <div key={index} className="justify-content-center d-flex">
                                    <Input
                                        title={`Item ${index + 1}`}
                                        type="text"
                                        className="me-4"
                                        value={cost.info}
                                        onChange={(e) => handleCostInputChange(index, "info", e.target.value)}
                                    />
                                    <Input
                                        title={`Cost ${index + 1}`}
                                        type="number"
                                        className=""
                                        value={cost.costs}
                                        onChange={(e) => handleCostInputChange(index, "costs", e.target.value)}
                                    />
                                    <a className="btn btn-submit-light-small mt-2 mb-2 ms-4 mr-4" style={{ width: 40, height: 40 }} onClick={() => handleRemoveCost(index)}>
                                        -
                                    </a>
                                </div>
                            ))}
                            <a className="btn btn-submit-light-small mt-2 mb-2 ms-4 mr-4" style={{ width: 40 }} onClick={handleAddCost}>
                                +
                            </a>
                        </div>
                    </div>

                </div>
                {!isSubmitted && <button type="submit" className="btn btn-light mt-5" style={{ fontSize: 20, width: 150 }}>Submit</button>}
                {isSubmitted && <button className="btn btn-submit-light-small mt-5" onClick={handleClearForm}>Make Invoice</button>}
                {isSubmitted && <button className="btn btn-submit-dark-small mt-5 ms-4" onClick={handleClearForm}>Make Quote</button>}
                {isSubmitted && <button className="btn btn-secondary mt-5 ms-4" style={{ fontSize: 20, width: 150 }} onClick={handleRefreshPage}>Refresh</button>}
                {!isSubmitted && <button className="btn btn-secondary mt-5 ms-4" style={{ fontSize: 20, width: 150 }} onClick={handleClearForm}>Clear Forms</button>}
            </form >
        </div >
    );
}

export default InvoiceForms;