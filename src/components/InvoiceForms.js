import { useEffect, useState } from "react";
import Input from "./Inputs";
import { useOutletContext } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';
import { CreatePDFDoc } from "./PDFUtils";

const InvoiceForms = () => {
    const vatDefault = 21;
    const { jwtToken } = useOutletContext();

    const [company, setCompany] = useState({ vat_percent: vatDefault });
    const [sender, setSender] = useState({});
    const [logo, setLogo] = useState({});

    const [jobs, setJobs] = useState([]);
    const [costs, setCosts] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [jobType, setJobType] = useState('Service');
    const [jobTariefTitle, setJobTariefTitle] = useState('');
    const [jobNumberOfHoursTitle, setJobNumberOfHoursTitle] = useState('');

    const [inEU, setInEU] = useState(true);
    const [isZeroVat, setIsZeroVat] = useState(false);
    const [inCountry, setInCountry] = useState(true);
    const [vatPercentage, setVatPercentage] = useState(21);
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

                    fetch(`http://localhost:8082/logged_in/logo/${jwt_decode.jwtDecode(jwtToken).sub}`, requestOptions)
                        .then(r => r.json()).then(dat => setLogo(dat.data)).catch(err => console.error(err.message))
                })
                .catch((error) => {
                    console.error(error.message);
                })
        };

    }, [jwtToken, toggle]);

    useEffect(() => {
        if (jobType !== "Service") {
            setJobNumberOfHoursTitle("Amount");
            setJobTariefTitle("Price");
        } else {
            setJobNumberOfHoursTitle("Number of Hours");
            setJobTariefTitle("Hour rate");
        }

    }, [company, jobs, costs, jobType])

    const handleRefreshPage = () => {
        window.location.reload();
    };

    const handleClearForm = () => {
        if (jwtToken === "") {
            document.querySelectorAll('input').forEach(input => {
                input.value = ''; // Resets input fields directly
            });
        };

        setCompany({ vat_percent: vatDefault });
        setJobs([]);
        setCosts([]);
        setIsZeroVat(false);
        setInEU(true);
        setInCountry(true);
        setVatPercentage(vatDefault);
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
        setCosts([...costs, { info: "", costs: 0 }])
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
        flipToggle();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (event.nativeEvent.submitter && event.nativeEvent.submitter.name === 'clearFormButton') {
            return;
        };
        if (company.company_name !== undefined && jobs.length !== 0) {
            jobs.map((job) => {
                if (job.jobItem !== "") {
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
            vat_percent: String(vatPercentage),
            company: company,
            discount: discount,
            sender: sender,
        };
        return invoicePayload;
    };

    const inserNewCompany = (name) => {
        const exists = companyList.some(item => item.company_name === name);

        if (jwtToken !== "") {
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

    function sumArray(arr) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    };

    const prepareData = () => {
        let docs = serializeDocument();
        const updatedJobs = docs.jobs.map((job) => ({
            ...job,
            totalAmount: job.hourRate * job.numberOfHours,
        }));
        const updatedCosts = docs.costs.map((c) => ({
            ...c,
            numberOfCosts: "N/A",
            totalAmout: parseFloat(c.costs)
        }));
        const preppedJobs = updatedJobs.map((job) => Object.values(job));
        const preppedCosts = updatedCosts.map((cost) => Object.values(cost));

        // Invoice number calculations
        const totalJobs = sumArray(preppedJobs.map((job) => job[job.length - 1]));
        const totalCosts = sumArray(preppedCosts.map((c) => c[c.length - 1]));
        const subTotal = totalJobs + totalCosts
        const leanVAT = totalJobs * vatPercentage / 100;
        const totalInclVAT = subTotal + leanVAT;

        return {
            totalJobs: totalJobs,
            totalCosts: totalCosts,
            subTotal: subTotal,
            leanVAT: leanVAT,
            totalInclVAT: totalInclVAT,
            docs: docs
        };
    }

    function generateShortUniqueId(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }

    const handleMakeInvoice = () => {

        const preppedData = prepareData();

        // Invoice number calculations
        const totalCosts = preppedData.totalCosts;
        const subTotal = preppedData.subTotal
        const totalInclVAT = preppedData.totalInclVAT;
        let docs = preppedData.docs;

        let senderDoc = {};
        if (jwtToken === "") {
            senderDoc = sender;
            CreatePDFDoc(docs, "Invoice", senderDoc, logo, "", generateShortUniqueId(10));

        } else {
            senderDoc = sender.data;

            let invoicePayload = {
                user_id: jwt_decode.jwtDecode(jwtToken).sub,
                total_inclusive: totalInclVAT,
                total_exclusive: subTotal,
                costs: totalCosts,
                client_name: company.company_name,
                vat_percent: vatPercentage
            };

            // send Api call
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + jwtToken },
                body: JSON.stringify(invoicePayload)
            };
            fetch(`http://localhost:8082/logged_in/create_invoice`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    CreatePDFDoc(docs, "Invoice", senderDoc, logo, data.data.filename, data.data.invoice_no);
                    inserNewCompany(docs.company.company_name);
                })
                .catch((error) => console.error(error.message))
        };
    };

    const handleMakeQuote = () => {
        const preppedData = prepareData();

        // Invoice number calculations
        const totalCosts = preppedData.totalCosts;
        const subTotal = preppedData.subTotal
        const totalInclVAT = preppedData.totalInclVAT;
        let docs = preppedData.docs;

        let senderDoc = {};

        if (jwtToken === "") {
            senderDoc = sender;
            CreatePDFDoc(docs, "Quote", senderDoc, logo, "", generateShortUniqueId(10));
        } else {
            senderDoc = sender.data;

            let quotePayload = {
                user_id: jwt_decode.jwtDecode(jwtToken).sub,
                total_inclusive: totalInclVAT,
                total_exclusive: subTotal,
                costs: totalCosts,
                client_name: company.company_name,
                vat_percent: vatPercentage
            };

            // send Api call
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + jwtToken },
                body: JSON.stringify(quotePayload)
            };
            fetch(`http://localhost:8082/logged_in/create_quote`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    CreatePDFDoc(docs, "Quote", senderDoc, logo, data.data.filename, data.data.quote_no);
                    inserNewCompany(docs.company.company_name);
                })
                .catch((error) => console.error(error.message))
        };
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
                                    onChange={(e) => handleSenderChange("coc_no", e.target.value)}
                                    value={sender.coc_no}
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
                                    onChange={(e) => handleSenderChange("vat_no", e.target.value)}
                                    value={sender.vat_no}
                                />
                            </div>
                        </div>
                    </div>
                }
                {/* company data selection */}
                {jwtToken !== "" &&
                    <div>
                        <h1 className="mb-5" style={{ color: '#061868', fontWeight: 700 }}>Document Data</h1>
                        <h3 className="mb-3" style={{ color: '#e56259' }}>Client List</h3>
                        <div >
                            <select
                                className="btn btn-light mb-2"
                                style={{ width: 'fit-content', fontSize: 20, border: "1px solid #ccc", height: 50 }}
                                onChange={handleSelectChange}
                                value={selectedOption}
                            >
                                <option value="">Select Your Client</option>
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
                                        <a className="btn btn-submit-light-small" style={{ width: 80 }} onClick={handleAddJob}>
                                            +
                                        </a>
                                        {jobs.length > 0 && (
                                            <a className="btn btn-submit-dark-small ms-2" style={{ width: 80 }} onClick={() => handleRemoveJob(jobs.length - 1)}>
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
                                    value={vatPercentage}
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

                                    <a className="btn btn-submit-light-small" style={{ width: 80 }} onClick={handleAddCost}>
                                        +
                                    </a>
                                    {costs.length > 0 && (
                                        <a className="btn btn-submit-dark-small ms-2" style={{ width: 80 }} onClick={() => handleRemoveCost(costs.length - 1)}>
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
                {isSubmitted && <button className="btn btn-submit-light-small mt-5" onClick={handleMakeInvoice} style={{ width: 250, fontSize: 20, }}>Download as Invoice</button>}
                {isSubmitted && <button className="btn btn-submit-dark-small mt-5 ms-4" onClick={handleMakeQuote} style={{ width: 250, fontSize: 20 }}>Download as Quote</button>}
                {isSubmitted && <button className="btn btn-submit-dark-small mt-5 ms-4 px-5" style={{ width: 'fit-content', borderRadius: 25, fontSize: 20, backgroundColor: "#999" }} onClick={handleRefreshPage}>Make a New Document</button>}
                {!isSubmitted && <button className="btn btn-submit-dark-small mt-5 ms-4" name="clearFormButton" style={{ fontSize: 20, width: 150, borderRadius: 25, backgroundColor: "#999" }} onClick={handleClearForm}>Clear Forms</button>}
            </form >
        </div >
    );
}

export default InvoiceForms;