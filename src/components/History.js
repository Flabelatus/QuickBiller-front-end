import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';
import { Search } from "./SearchBar";
import Loader from 'react-spinners/SyncLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload, faPaperPlane, faFileInvoice, faCalendar, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const HistoryDocs = () => {
    const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter().quarter);
    const [selectedYear, setSelectedYear] = useState(getCurrentQuarter().year);
    const [timelineList, setTimelineList] = useState([]);
    const quarters = [1, 2, 3, 4];
    const { jwtToken } = useOutletContext();
    const [isLoading, setIsLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [status, setStatus] = useState(false);

    const navigate = useNavigate();

    function getCurrentQuarter() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        let quarter;
        if (month >= 1 && month <= 3) {
            quarter = 1;
        } else if (month >= 4 && month <= 6) {
            quarter = 2;
        } else if (month >= 7 && month <= 9) {
            quarter = 3;
        } else {
            quarter = 4;
        }

        return {
            year: year.toString(),
            quarter: quarter.toString()
        };
    }

    const handleChangeYear = (event) => {
        setSelectedYear(event.target.value);
        toggleStatus();
    }

    const handleChangeQuarter = (event) => {
        setSelectedQuarter(event.target.value);
        toggleStatus();
    }

    const toggleStatus = () => {
        if (!status) {
            setStatus(true);
        } else {
            setStatus(false);
        };
    };

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return;
        };

        const requestOptions = {
            methdo: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/logged_in/invoices_by_number?u=${jwt_decode.jwtDecode(jwtToken).sub}&q=${selectedQuarter}&y=${selectedYear}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setInvoices(data.data);
                fetch(`${process.env.REACT_APP_BACKEND}/api/logged_in/list_years_and_quarters?u=${jwt_decode.jwtDecode(jwtToken).sub}`, requestOptions)
                    .then((resp) => resp.json())
                    .then((dat) => {
                        setTimelineList(dat.data.years);
                    })
                    .catch((err) => console.error(err.message))
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
            })
    }, [jwtToken, status]);

    const handleConfirmSent = (invoiceId) => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + jwtToken }
        };
        fetch(`${process.env.REACT_APP_BACKEND}/api/logged_in/invoice/confirm/${invoiceId}`, requestOptions).then((resposne) => resposne.json())
            .then(() => { toggleStatus() }).catch(error => console.error(error.message));
    }

    const handleDeleteInvoice = (invoiceFileName, invoiceId) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/logged_in/delete/invoice?f=${encodeURIComponent(invoiceFileName)}&id=${invoiceId}`, requestOptions).then((response) => response.json())
            .then(() => toggleStatus()).catch(error => console.error(error.message));
    };

    const handleDownload = async (invoiceFileName) => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/pdf',
                'Authorization': 'Bearer ' + jwtToken
            }
        }
        try {

            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/logged_in/invoice/download?f=${encodeURIComponent(invoiceFileName)}`, requestOptions);

            if (!response.ok) {
                const errorMsg = await response.json();
                throw new Error(`${errorMsg.message}`);
            };

            // Get the blob object containing the PDF data
            const pdfBlob = await response.blob();

            // Create a URL for the blob object
            const url = window.URL.createObjectURL(pdfBlob);

            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = `${invoiceFileName}.pdf`; // Set the default download filename
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading PDF:', error.message);
        }
    };

    function getCurrentPeriod(date) {

        const currentYear = date.getFullYear();
        let currentMonth = date.getMonth() + 1;
        const currentQuarter = Math.ceil(currentMonth / 3);

        // Pad the month with a leading zero if it's a single digit
        if (currentMonth < 10) {
            currentMonth = '0' + currentMonth;
        }

        return {
            year: currentYear,
            quarter: currentQuarter,
            month: currentMonth
        };
    }

    const currentDate = new Date();
    const period = getCurrentPeriod(currentDate);

    const total = invoices.reduce((total, invoice) => {
        const invocieDate = getCurrentPeriod(new Date(invoice.CreatedAt));
        if (period.year === invocieDate.year && period.quarter === invocieDate.quarter) {
            return total + (invoice.total_inclusive);
        }
    }, 0);

    const totalExcl = invoices.reduce((total, invoice) => {
        const invocieDate = getCurrentPeriod(new Date(invoice.CreatedAt));

        if (period.year === invocieDate.year && period.quarter === invocieDate.quarter) {
            return total + invoice.total_exclusive;
        }
    }, 0);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <h1 className="h1 mt-4 mb-4" style={{ fontWeight: 700, color: '#06186860' }}>Loading Data</h1>
                <div className='row justify-content-center'>
                    <Loader className='mt-4' color="#06186860" size={20} loading={isLoading}></Loader>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container mt-5 px-5 mb-5" style={{ backgroundColor: "#e2605a20" }}>
                <div className="row justify-content-center">
                    <div className="col">
                        {/* <h1 className="mb-4 text-center mt-3">Overview</h1> */}

                        <div className="row justify-content-center mt-3 mb-3" style={{ border: '0px solid #ccc', borderRadius: 16, margin: 10, backgroundColor: 'white' }}>
                            <div className="col-md-3 py-3" style={{ border: '0px solid #ccc', borderRadius: 16, margin: 10 }}>

                                <h3 className="px-4 analitics" style={{ display: 'inline-flex', alignItems: 'center', color: 'white' }}>
                                    <FontAwesomeIcon className="analitics" icon={faCalendar} />
                                    <span className="analitics" style={{ marginLeft: '0.5rem' }}>Period</span>
                                </h3>

                                <hr />

                                <select value={selectedYear} onChange={handleChangeYear} className="me-2 px-3 py-2 mb-2" style={{ border: '0px solid #ccc', borderRadius: 8, color: 'white', backgroundColor: "#061868" }}>
                                    {timelineList.length > 0 && timelineList.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    )
                                    )}
                                </select>
                                <select className="px-3 py-2" value={selectedQuarter} onChange={handleChangeQuarter} style={{ border: '0px solid #ccc', borderRadius: 8, color: 'white', backgroundColor: "#e56259" }}>
                                    {quarters.length > 0 && quarters.map((quarter) => (
                                        <option key={quarter} value={quarter}>
                                            Quarter {quarter}
                                        </option>
                                    )
                                    )}
                                </select>
                                {/* <span className="px-4 analitics" style={{ fontWeight: 700 }}>Year: {selectedYear}</span><br />
                                <span className="px-4 analitics">Quarter: Q{selectedQuarter}</span><br /> */}
                                {/* <span className="px-4 analitics">Month: {period.month}</span> */}
                            </div>
                            <div className="col-md-5 py-3" style={{ border: '0px solid #ccc', borderRadius: 16, margin: 10 }}>
                                <h3 className="px-4 analitics" style={{ display: 'inline-flex', alignItems: 'center', color: 'white' }}>
                                    <FontAwesomeIcon className="analitics" icon={faFileInvoice} />
                                    <span className="analitics" style={{ marginLeft: '0.5rem' }}>Quarter Sales Tax</span>
                                </h3><hr />
                                <span className="px-4 analitics" style={{ fontWeight: 700 }}>Current Sales Tax: €{Array.isArray(invoices) && invoices.length > 0 && total !== undefined ? (total - totalExcl).toFixed(2) : Number(0).toFixed(2)}</span>
                            </div>
                            <div className="col-md-3 py-3" style={{ border: '0px solid #ccc', borderRadius: 16, margin: 10 }}>
                                <h3 className="px-4 analitics" style={{ display: 'inline-flex', alignItems: 'center', color: 'white' }}>
                                    <FontAwesomeIcon className="analitics" icon={faPaperPlane} />
                                    <span className="analitics" style={{ marginLeft: '0.5rem' }}>Sent Invoices</span>
                                </h3><hr />
                                <span className="px-4 analitics" >Total Incl: €{total !== undefined ? total.toFixed(2) : Number(0).toFixed(2)}</span><br />
                                <span className="px-4 analitics" style={{ fontWeight: 700 }}>Total Excl: €{totalExcl !== undefined ? totalExcl.toFixed(2) : Number(0).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="row justify-content-center mt-5">
                            <Link className="d-flex btn btn-submit-dark-small px-4" to="/create-new-invoice" style={{ width: 'fit-content' }}>Create a New Document</Link>
                        </div>
                        {/* <hr /> */}
                        <h2 className="mb-3 mt-5" style={{ color: "#888", margin: 10 }}>Invoices</h2>

                        <Search setInvoices={setInvoices} toggleStatus={toggleStatus} />
                        <div className="mb-4 mt-4 px-4" style={{ overflowY: 'auto', height: 800, border: '0px solid #ccc', borderRadius: 16, width: '100%', backgroundColor: 'white' }}>
                            {Array.isArray(invoices) && invoices.map((invoice, index) => (
                                <div className="mt-4 mb-4 px-5 container invoice py-4" key={invoice.ID}>
                                    <h5 className="mb-4 mt-3 px-3 py-3 text-center" style={{ color: "#333", fontWeight: 400, fontSize: 18, backgroundColor: "#7777ee30", maxWidth: "100%", wordWrap: "break-word", borderRadius: 8 }}>{invoice.filename}</h5>
                                    <div>
                                        <label className="ms-4 me-2" style={{ color: '#88f' }}>Invoice Number: {invoice.invoice_no}</label>
                                        <label className="ms-4 me-2" style={{ color: '#666' }}>|</label>
                                        <label className="ms-4 me-2" style={{ color: '#666' }}>Invoice Date: {((dateString) => {
                                            const dateObject = new Date(dateString);
                                            const year = dateObject.getFullYear();
                                            const month = String(dateObject.getMonth() + 1).padStart(2, '0');
                                            const day = String(dateObject.getDate()).padStart(2, '0');
                                            return `${year}-${month}-${day}`;
                                        })(invoice.CreatedAt)}</label>
                                        <label className="ms-4 me-2" style={{ color: '#666' }}>
                                            Client Name: {invoice.client_name}
                                        </label>
                                        <hr />

                                        <div className=" mt-4 mb-4">
                                            <span className="me-2 ms-4 mt-2" style={{ textAlign: 'right', alignItems: 'start', fontWeight: 400, fontSize: 15 }}> Subtotal: <span className="ms-3">€
                                                {invoice.discount > 0 ? parseFloat(invoice.total_inclusive * (invoice.discount / 100)).toFixed(2) : invoice.total_exclusive}</span>
                                            </span><br />
                                            <span className="me-2 ms-4 mt-2" style={{ textAlign: 'right', alignItems: 'start', fontWeight: 400, fontSize: 15 }}> Costs:<span className="ms-5 text-right">
                                                {invoice.costs > 0 ? " €" + parseFloat((invoice.costs)).toFixed(2) : "€ 0.00"}</span>
                                            </span><br />
                                            <span className="me-2 ms-4 mt-2" style={{ textAlign: 'right', alignItems: 'start', fontWeight: 400, fontSize: 15 }}> VAT: <span className="ms-5 text-right">€
                                                {invoice.discount > 0 ? parseFloat((invoice.total_inclusive - invoice.total_exclusive) * (invoice.discount / 100)).toFixed(2) : (invoice.total_inclusive - invoice.total_exclusive).toFixed(2)}</span>
                                            </span>
                                            <hr style={{ width: '30%' }}></hr>
                                            <span className="me-2 ms-4 mt-2" style={{ textAlign: 'right', alignItems: 'start', fontWeight: 600, fontSize: 18 }}> Total: <span className="ms-3 text-right">€
                                                {invoice.discount > 0 ? parseFloat(invoice.total_inclusive * (invoice.discount / 100)).toFixed(2) : invoice.total_inclusive.toFixed(2)}</span>
                                            </span><br />

                                        </div>
                                        {invoice.sent ? <label className="me-5 container- badge px-4 mb-4" style={{ width: 'fit-content', backgroundColor: "#55dd5550", fontSize: 16, border: "1px solid #4a4" }}><span style={{ fontWeight: 400, color: "#333" }}> Invoice Sent</span> <FontAwesomeIcon className="ms-3" fontSize="16" icon={faCheck} color="#2A2" /></label>
                                            : <label className="me-5 container- badge px-4 mb-4" style={{ width: 'fit-content', backgroundColor: "#dd555530", fontSize: 16, border: "1px solid #a44" }}><span style={{ fontWeight: 400, color: "#333" }}>Invoice Not Sent</span><FontAwesomeIcon className="ms-3" fontSize="16" icon={faXmark} color="#A22" /></label>}
                                        {/* <label className="me-2 ms-4 mt-2" style={{ textAlign: 'right', alignItems: 'start', fontWeight: 500, fontSize: 14, color: '#888' }}>{invoice.sent ? `SENT` : `NOT SENT`}</label> */}
                                        {!invoice.sent && <button onClick={() => handleConfirmSent(invoice.ID)} className="btn btn-submit-light-xsmall ms-2 me-2">Confirm Sent</button>}
                                        {!invoice.sent && <button onClick={() => handleDeleteInvoice(invoice.filename, invoice.ID)} className="btn btn-submit-dark-xsmall px-4"><FontAwesomeIcon icon={faTrash} /></button>}
                                        <button onClick={() => handleDownload(invoice.filename)} className="btn btn-submit-light-xsmall-2 ms-2 px-4"><FontAwesomeIcon icon={faDownload} /></button>
                                        {/* <hr /> */}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        );
    };
}

export default HistoryDocs;