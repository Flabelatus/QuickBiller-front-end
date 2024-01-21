import { useEffect, useState } from "react";
import Input from "./Inputs";
import { useOutletContext } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';
import { faDownload, faUser } from '@fortawesome/fontawesome-free';
import { CreateForm } from "./PDFUtils";
import { FontAwesomeIcon } from '@fortawesome/fontawesome-free';


const InvoiceForms = () => {
    const defaultVatValue = 21;

    const { jwtToken } = useOutletContext();

    const [company, setCompany] = useState({});
    const [sender, setSender] = useState({});

    const [jobs, setJobs] = useState([]);
    const [costs, setCosts] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const [jobType, setJobType] = useState('Service');
    const [jobTariefTitle, setJobTariefTitle] = useState('');
    const [jobNumberOfHoursTitle, setJobNumberOfHoursTitle] = useState('');

    const [inEU, setInEU] = useState(true);
    const [isZeroVat, setIsZeroVat] = useState(false);
    const [inCountry, setInCountry] = useState(true);
    const [vatPercentage, setVatPercentage] = useState(defaultVatValue);
    const [discount, setDiscount] = useState(0);

    const [user, setUser] = useState(0);
    const [companyList, setCompanyList] = useState([]);

    const [toggle, setToggle] = useState(true);

    const handleOptionChange = (event) => {
        setJobType(event.target.value);
    };

    const flipToggle = () => {
        if (toggle) {
            setToggle(false);
        } else {
            setToggle(true);
        }
    }

    const getComapnyDataList = (user_id) => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken,
            }
        };

        fetch(`http://localhost:8082/logged_in/client_list/${user_id}`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                setCompanyList(data.data);
            })
            .catch((error) => {
                console.error(error.message);
            })
    };

    const populateData = () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        };

        fetch(`http://localhost:8082/logged_in/client/${selectedOption}`, requestOptions)
            .then((resp) => resp.json())
            .then((data) => {
                setCompany(data.data);
            })
            .catch(err => {
                console.error(err.message);
            });
    };

    useEffect(() => {
        if (jobType !== "Service") {
            setJobNumberOfHoursTitle("Amount");
            setJobTariefTitle("Price");
        } else {
            setJobNumberOfHoursTitle("Number of Hours");
            setJobTariefTitle("Hour rate");
        }

        if (jwtToken !== "") {
            const requestOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + jwtToken },
                credentials: "include"
            };

            fetch(`http://localhost:8082/logged_in/user/${jwt_decode.jwtDecode(jwtToken).sub}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setUser(data);
                    getComapnyDataList(data.ID);
                    fetch(`http://localhost:8082/logged_in/sender_data/user/${jwt_decode.jwtDecode(jwtToken).sub}`, requestOptions)
                        .then((resp) => resp.json())
                        .then((dat) => setSender(dat))
                        .catch((err) => console.error(err.message))
                })
                .catch((error) => {
                    console.error(error.message);
                })
        };

    }, [refresh, jwtToken, company, jobs, costs, jobType, toggle]);

    const handleRefreshPage = () => {
        if (!refresh) {
            setRefresh(true);
        } else {
            setRefresh(false);
        }
        setIsSubmitted(false);
        setSelectedOption("");
        handleClearForm();
    };

    const handleClearForm = () => {
        if (jwtToken === "") {
            document.querySelectorAll('input').forEach(input => {
                input.value = ''; // Resets input fields directly
            });
        };

        setCompany({});
        setJobs([]);
        setCosts([]);
        setIsZeroVat(false);
        setInEU(true);
        setInCountry(true);
        setVatPercentage(0);
        setDiscount(0);
        setJobType("Service");
        setSender({});
        flipToggle();
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

    const handleSenderChange = (field, value) => {
        setSender(senderData => ({
            ...senderData,
            [field]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (event.nativeEvent.submitter && event.nativeEvent.submitter.name === 'clearFormButton') {
            return;
        };
        if (company.company_name !== undefined && jobs.length !== 0) {
            jobs.map((job) => {
                if (job.jobItem !== "") {
                    inserNewCompany(company.company_name);
                    setIsSubmitted(true);
                } else {
                    let msg = `Form Incomplete\nJob data incomplete`
                    alert(msg);
                };
            });
        } else {
            let msg = `Form Incomplete\nEither client data or job data or both are incomplete`
            alert(msg);
        };
    };

    const serializeDocument = () => {
        const invoicePayload = {
            jobs: jobs,
            costs: costs,
            vat_free: isZeroVat,
            in_eu: inEU,
            in_country: inCountry,
            vat_percent: vatPercentage,
            company: company,
            discount: discount,
            sender: sender,
        };
        return invoicePayload;
    };

    const inserNewCompany = (name) => {
        if (jwtToken !== "") {
            const exists = companyList.some(item => item.company_name === name);

            let payload = {
                company_name: company.company_name,
                contact_name: company.contact_name,
                email: company.email,
                street: company.street,
                postcode: company.postcode,
                city: company.city,
                country: company.country,
                user_id: user.ID
            };

            if (!exists && payload.company_name !== undefined) {
                const requestOpts = {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + jwtToken },
                    body: JSON.stringify(payload)
                };

                fetch(`http://localhost:8082/logged_in/add_client`, requestOpts)
                    .catch((error) => console.error(error.message))
            };
        };
    };

    const handleMakeInvoice = () => {
        let docs = serializeDocument();
        console.log(docs);
        CreateForm(docs, "Invoice");
    };

    const handleMakeQuote = () => {
        let docs = serializeDocument();
        CreateForm(docs, "Quote");
    };

    return (
        <div className="justify-content-center">
            {jwtToken !== "" && <hr className="mt-5 mb-5" style={{ color: "#061868", width: "100vw", margin: "0 auto" }} />}
            <form onSubmit={handleSubmit} className="mb-5">
                {/* sender data */}
                {jwtToken === "" &&
                    <div className="row mt- justify-content-center container-fluid py-5" style={{ backgroundColor: "#e5625930" }}>
                        <div className="row justify-content-center" style={{ width: 'fit-content' }}>
                            <h3 className="mb-5" style={{ color: '#061868' }}>Your Company Information</h3>
                            <div className="col-md-4">
                                <Input
                                    title="Company Name"
                                    id="company-name"
                                    type="text"
                                    className="me-4"
                                    name="company-name"
                                    onChange={(e) => handleSenderChange("company_name", e.target.value)}
                                    value={sender.company_name}
                                />
                                <Input
                                    title="Email Address"
                                    id="company-email"
                                    type="email"
                                    className="me-4"
                                    name="company-email"
                                    onChange={(e) => handleSenderChange("email", e.target.value)}
                                    value={sender.email}
                                />
                                <Input
                                    title="Contact Name"
                                    id="contact-name"
                                    type="text"
                                    className="me-4"
                                    name="contact-name"
                                    onChange={(e) => handleSenderChange("contact_name", e.target.value)}
                                    value={sender.contact_name}
                                />
                                <Input
                                    title="IBAN"
                                    id="iban"
                                    type="text"
                                    className="me-4"
                                    name="iban"
                                    onChange={(e) => handleSenderChange("iban", e.target.value)}
                                    value={sender.iban}
                                />
                                <Input
                                    title="CoC No"
                                    id="coc"
                                    type="text"
                                    className="me-4"
                                    name="coc"
                                    onChange={(e) => handleSenderChange("coc", e.target.value)}
                                    value={sender.coc}
                                />
                            </div>
                            <div className="col-md-3 justify-content-end">
                                <Input
                                    title="Street and House No."
                                    id="street"
                                    type="text"
                                    className="me-4"
                                    name="street"
                                    onChange={(e) => handleSenderChange("street", e.target.value)}
                                    value={sender.street}
                                />
                                <Input
                                    title="Postcode"
                                    id="postcode"
                                    type="text"
                                    className="me-4"
                                    name="postcode"
                                    onChange={(e) => handleSenderChange("postcode", e.target.value)}
                                    value={sender.postcode}
                                />
                                <Input
                                    title="City"
                                    id="city"
                                    type="text"
                                    className="me-4"
                                    name="city"
                                    onChange={(e) => handleSenderChange("city", e.target.value)}
                                    value={sender.city}
                                />
                                <Input
                                    title="Country"
                                    id="country"
                                    type="text"
                                    className="me-4"
                                    name="country"
                                    onChange={(e) => handleSenderChange("country", e.target.value)}
                                    value={sender.country}
                                />
                                <Input
                                    title="VAT No"
                                    id="vat"
                                    type="text"
                                    className="me-4"
                                    name="vat"
                                    onChange={(e) => handleSenderChange("vat", e.target.value)}
                                    value={sender.vat}
                                />
                            </div>
                        </div>
                    </div>
                }
                {/* company data selection */}
                {jwtToken !== "" &&
                    <div>
                        <h1 className="mb-5" style={{ color: '#061868', fontWeight: 700 }}>Document Data</h1>
                        <div >
                            <select
                                className="btn btn-light mb-2"
                                style={{ width: 'fit-content', fontSize: 20, border: "1px solid #ccc", height: 50 }}
                                onChange={handleSelectChange}
                                value={selectedOption}
                            >
                                <option value="">Select an option</option>
                                {companyList.map((opt) => (
                                    <option key={opt.ID} value={opt.ID}>{opt.company_name}</option>
                                ))}
                            </select>

                        </div>
                        <a className="btn btn-submit-dark-small mt-3" style={{ fontSize: 20, width: 150 }} onClick={populateData}>Select</a>
                    </div>
                }

                {/* company info */}
                <div className="row mt-5 justify-content-center container-fluid py-4">
                    <div className="row justify-content-center" style={{ width: 'fit-content' }}>
                        <h3 className="mb-5" style={{ color: '#e56259' }}>Recipient Company Information</h3>
                        <div className="col-md-4">
                            <Input
                                title="Company Name"
                                id="company-name"
                                type="text"
                                className="me-4"
                                name="company-name"
                                onChange={(e) => handleCompanyChange("company_name", e.target.value)}
                                value={company.company_name}
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
                                onChange={(e) => handleCompanyChange("contact_name", e.target.value)}
                                value={company.contact_name}
                            />
                            <Input
                                title="Project Specific Info"
                                id="project"
                                type="text"
                                className="me-4"
                                name="project"
                                onChange={(e) => handleCompanyChange("project", e.target.value)}
                                value={company.project}
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
                                onChange={(e) => handleCompanyChange("postcode", e.target.value)}
                                value={company.postcode}
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

                <div className="mt-3 container-fluid py-4" style={{ width: 'fit-content', boxShadow: '1px 1px 10px #ddd', borderRadius: 16 }}>
                    {/* jobs */}
                    <div className="mt-3 container-fluid py-4" style={{ width: 'fit-content', boxShadow: '1px 1px 10px #fff', borderRadius: 16 }}>
                        <div className="row justify-content-center">
                            <div className="mb-4 radio-container">
                                <label className="me-5 radio-label" style={{ fontSize: 20 }}>
                                    <input
                                        type="radio"
                                        className="me-2 form-check-input"
                                        value="Product"
                                        checked={jobType === 'Product'}
                                        onChange={handleOptionChange}
                                    />
                                    <span className="radio-text">Product</span>
                                </label>
                                <label className="radio-label" style={{ fontSize: 20 }}>
                                    <input
                                        type="radio"
                                        className="me-2 form-check-input"
                                        value="Service"
                                        checked={jobType === 'Service'}
                                        onChange={handleOptionChange}
                                    />
                                    <span className="radio-text">Service</span>
                                </label>
                            </div>
                            <h3 className="mb-4" style={{ color: '#e56259' }}>Add Job Items</h3>
                            <div className="col-md-8" style={{ width: 'fit-content' }}>
                                {jobs.map((job, index) => (
                                    <div key={index} className="row">
                                        <div className="col-md-4 col-sm-12 mb-2">
                                            <Input
                                                title={`${index + 1}. Description`}
                                                type="text"
                                                value={job.jobItem}
                                                onChange={(e) => handleJobInputChange(index, "jobItem", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4 col-sm-12 mb-2">
                                            <Input
                                                title={jobTariefTitle}
                                                type="number"
                                                value={job.hourRate}
                                                onChange={(e) => handleJobInputChange(index, "hourRate", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4 col-sm-12 mb-2">
                                            <Input
                                                title={jobNumberOfHoursTitle}
                                                type="number"
                                                value={job.numberOfHours}
                                                onChange={(e) => handleJobInputChange(index, "numberOfHours", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="row">
                                    <div className="col-md-12 col-sm-12 mt-4">
                                        {jobs.length === 0 && <p style={{ color: '#999', fontWeight: 500 }}>Click here to add a Job field</p>}
                                        <a className="btn btn-submit-light-small" style={{ width: 45 }} onClick={handleAddJob}>
                                            +
                                        </a>
                                        {jobs.length > 0 && (
                                            <a className="btn btn-submit-light-small ms-2" style={{ width: 45 }} onClick={() => handleRemoveJob(jobs.length - 1)}>
                                                -
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {/* checkboxes */}
                    <div className=" mt-5 container-fluid py-4" style={{ width: 'fit-content', boxShadow: '1px 1px 10px #fff', borderRadius: 16 }}>
                        <div className="row justify-content-center"  >
                            <h3 className="mb-4" style={{ color: '#e56259' }}>VAT Information</h3>
                            <div className="col">

                                <input
                                    className="form-check-input checkbox-custom"
                                    type="checkbox"
                                    onChange={(e) => setIsZeroVat(e.target.checked)}
                                ></input>
                                <label style={{ fontSize: 20, marginLeft: 10, fontWeight: 400, color: "#00000090" }}>VAT Free</label>

                                <input
                                    className="form-check-input checkbox-custom ms-4"
                                    type="checkbox"
                                    defaultChecked={true}
                                    onChange={(e) => setInEU(e.target.checked)}
                                ></input>
                                <label style={{ fontSize: 20, marginLeft: 10, fontWeight: 400, color: "#00000090" }}>Within EU</label>

                                <input
                                    className="form-check-input checkbox-custom ms-4"
                                    type="checkbox"
                                    defaultChecked={true}
                                    onChange={(e) => setInCountry(e.target.checked)}
                                ></input>
                                <label style={{ fontSize: 20, marginLeft: 10, fontWeight: 400, color: "#00000090" }}>Within Country</label>

                                <input
                                    className="ms-4"
                                    type="text"
                                    style={{ width: 40, fontWeight: 400, color: "#00000090", border: "2px solid #ccc", borderRadius: 4 }}
                                    value={21}
                                    onChange={(e) => setVatPercentage(e.target.value)}
                                ></input>
                                <label style={{ fontSize: 20, marginLeft: 10, fontWeight: 400, color: "#00000090" }}> VAT %</label>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {/* costs */}
                    <div className="mt-5 container-fluid py-4 px-5 justify-content-center" style={{ width: 'fit-content', borderRadius: 16, boxShadow: '1px 1px 10px #fff' }}>
                        <div className="col-md-8" style={{ width: 'fit-content' }}>
                            <h3 className="mb-4" style={{ color: '#e56259' }}>Add Costs Items</h3>
                            {costs.map((cost, index) => (
                                <div key={index} className="row">
                                    <div className="col-md-6 col-sm-12 mb-2">
                                        <Input
                                            title={`Item ${index + 1}`}
                                            type="text"
                                            value={cost.info}
                                            onChange={(e) => handleCostInputChange(index, "info", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6 col-sm-12 mb-2">
                                        <Input
                                            title={`Cost ${index + 1}`}
                                            type="number"
                                            value={cost.costs}
                                            onChange={(e) => handleCostInputChange(index, "costs", e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="row justify-content-center mt-4">
                                <div className="col-md-12 col-sm-12">
                                    {costs.length === 0 && <p style={{ color: '#999', fontWeight: 500 }}>Click here to add a Cost field</p>}

                                    <a className="btn btn-submit-light-small" style={{ width: 45 }} onClick={handleAddCost}>
                                        +
                                    </a>
                                    {costs.length > 0 && (
                                        <a className="btn btn-submit-light-small ms-2" style={{ width: 45 }} onClick={() => handleRemoveCost(costs.length - 1)}>
                                            -
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {/* discount */}
                    <div>
                        <div className="row mt-5">
                            <Input
                                title="Discount"
                                type="number"
                                name="discount"
                                value={0}
                                onChange={(e) => setDiscount(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* buttons */}
                {!isSubmitted && <button type="submit" className="btn btn-submit-light-small mt-5" style={{ fontSize: 20, width: 150 }}>Submit</button>}
                {isSubmitted && <button className="btn btn-submit-light-small mt-5" onClick={handleMakeInvoice} style={{ width: 250 }}>Download Invoice</button>}
                {isSubmitted && <button className="btn btn-submit-dark-small mt-5 ms-4" onClick={handleMakeQuote} style={{ width: 250 }}>Download Quote</button>}
                {isSubmitted && <button className="btn btn-secondary mt-5 ms-4" style={{ fontSize: 20, width: 150 }} onClick={handleRefreshPage}>Refresh</button>}
                {!isSubmitted && <button className="btn btn-secondary mt-5 ms-4" name="clearFormButton" style={{ fontSize: 20, width: 150 }} onClick={handleClearForm}>Clear Forms</button>}
            </form >
        </div >
    );
}

export default InvoiceForms;