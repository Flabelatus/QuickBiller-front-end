import { useState } from "react";
import Input from "./Inputs";

const InvoiceForms = () => {
    const [company, setCompany] = useState("");
    const [jobs, setJobs] = useState([{ jobItem: "", hourRate: 0 }]);
    const [costs, setCosts] = useState([{ costs: 0, info: "" }])

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("form submitted");
    };

    const handleAddJob = () => {
        setJobs([...jobs, { jobItem: "", hourRate: 0 }]);
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

    return (
        <div >
            <form onSubmit={handleSubmit}>
                <h1 style={{ color: '#00994C', fontWeight: 700 }}>Invoice Data</h1>
                <a className="btn btn-submit-dark-small" style={{ width: 'fit-content' }}>Load Company From List</a>

                <div className="row mt-5 justify-content-center container-invoice py-4">
                    <h3 className="mb-5" style={{ color: '#00994C' }}>Company Information</h3>
                    <div className="col-md-3">
                        <Input
                            title="Company Name"
                            id="company-name"
                            type="text"
                            className="me-4"
                            name="company-name"
                        />
                        <Input
                            title="Email Address"
                            id="company-email"
                            type="email"
                            className="me-4"
                            name="company-email"
                        />
                        <Input
                            title="Contact Name"
                            id="contact-name"
                            type="text"
                            className="me-4"
                            name="contact-name"
                        />
                        <Input
                            title="Phone"
                            id="phone"
                            type="phone"
                            className="me-4"
                            name="phone"
                        />
                    </div>
                    <div className="col-md-3 justify-content-end">
                        <Input
                            title="Street"
                            id="street"
                            type="text"
                            className="me-4"
                            name="street"
                        />
                        <Input
                            title="Postcode"
                            id="postcode"
                            type="text"
                            className="me-4"
                            name="postcode"
                        />
                        <Input
                            title="City"
                            id="city"
                            type="text"
                            className="me-4"
                            name="city"
                        />
                        <Input
                            title="Country"
                            id="country"
                            type="text"
                            className="me-4"
                            name="country"
                        />
                    </div>
                </div>
                <div className="row mt-5 justify-content-center d-flex container-invoice py-4">
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

                <div className="row mt-5 justify-content-center container-invoice py-4">
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
                        <label style={{ fontSize: 20, marginLeft: 10, fontWeight: 400, color: "#00000090" }}>Inside EU</label>

                        <input
                            className="form-check-input checkbox-custom ms-4"
                            type="checkbox"
                            defaultChecked={true}
                        ></input>
                        <label style={{ fontSize: 20, marginLeft: 10, fontWeight: 400, color: "#00000090" }}>Inside Netherlands</label>

                        <input
                            className="ms-4"
                            type="text"
                            style={{ width: 40, fontWeight: 400, color: "#00000090", border: "2px solid #00994C70", borderRadius: 4 }}
                            value={21}
                        ></input>
                        <label style={{ fontSize: 20, marginLeft: 10, fontWeight: 400, color: "#00000090" }}> VAT %</label>

                    </div>
                </div>

                <div className="row mt-5 justify-content-center d-flex container-invoice py-4">
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
                <a className="btn btn-submit-light-small mt-5">Submit</a>
            </form >
        </div >
    );
}

export default InvoiceForms;