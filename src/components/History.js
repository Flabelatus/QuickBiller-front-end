import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';
import { Search } from "./SearchBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faDownload, faPaperPlane, faFileInvoice, faCalendar } from '@fortawesome/free-solid-svg-icons';

const HistoryDocs = () => {

    const { jwtToken } = useOutletContext();
    const [invoices, setInvoices] = useState([]);
    const [status, setStatus] = useState(false);
    const navigate = useNavigate();

    function sumArray(arr) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    };

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

        fetch(`${process.env.REACT_APP_BACKEND}/logged_in/invoices/${jwt_decode.jwtDecode(jwtToken).sub}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setInvoices(data.data);
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
        fetch(`${process.env.REACT_APP_BACKEND}/logged_in/invoice/confirm/${invoiceId}`, requestOptions).then((resposne) => resposne.json())
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

        fetch(`${process.env.REACT_APP_BACKEND}/logged_in/delete/invoice?f=${encodeURIComponent(invoiceFileName)}&id=${invoiceId}`, requestOptions).then((response) => response.json())
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

            const response = await fetch(`${process.env.REACT_APP_BACKEND}/logged_in/invoice/download?f=${encodeURIComponent(invoiceFileName)}`, requestOptions);

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

    function getCurrentPeriod() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
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

    const period = getCurrentPeriod();

    const total = invoices.reduce((total, invoice) => {
        return total + invoice.total_inclusive;
    }, 0);

    const totalExcl = invoices.reduce((total, invoice) => {
        return total + invoice.total_exclusive;
    }, 0);

    let sumVat = total - totalExcl;

    return (
        <div className="container mt-5 px-5 mb-5" style={{backgroundColor: "#e2605a40"}}>
            <div className="row justify-content-center">
                <div className="col">
                    <h1 className="mb-4 text-center mt-3">Overview</h1>
                    <div className="row justify-content-center mt-3 mb-3" style={{ border: '0px solid #ccc', borderRadius: 16, margin: 10, backgroundColor: 'white' }}>
                        <div className="col-md-3 py-3" style={{ border: '0px solid #ccc', borderRadius: 16, margin: 10 }}>
                            <h3 className="px-4 analitics" style={{ display: 'inline-flex', alignItems: 'center', color: 'white' }}>
                                <FontAwesomeIcon className="analitics" icon={faCalendar} />
                                <span className="analitics" style={{ marginLeft: '0.5rem' }}>Period</span>
                            </h3><hr />
                            <span className="px-4 analitics">Year: {period.year}</span><br />
                            <span className="px-4 analitics">Quarter: Q{period.quarter}</span><br />
                            <span className="px-4 analitics">Month: {period.month}</span>
                        </div>
                        <div className="col-md-5 py-3" style={{ border: '0px solid #ccc', borderRadius: 16, margin: 10 }}>
                            <h3 className="px-4 analitics" style={{ display: 'inline-flex', alignItems: 'center', color: 'white' }}>
                                <FontAwesomeIcon className="analitics" icon={faFileInvoice} />
                                <span className="analitics" style={{ marginLeft: '0.5rem' }}>Quarter Sales Tax</span>
                            </h3><hr />
                            <span className="px-4 analitics">Current Sales Tax: €{Array.isArray(invoices) && invoices.length > 0 && (total - totalExcl).toFixed(2)}</span>
                        </div>
                        <div className="col-md-3 py-3" style={{ border: '0px solid #ccc', borderRadius: 16, margin: 10 }}>
                            <h3 className="px-4 analitics" style={{ display: 'inline-flex', alignItems: 'center', color: 'white' }}>
                                <FontAwesomeIcon className="analitics" icon={faPaperPlane} />
                                <span className="analitics" style={{ marginLeft: '0.5rem' }}>Sent Invoices</span>
                            </h3><hr />
                            <span className="px-4 analitics">Total Incl: €{total.toFixed(2)}</span><br />
                            <span className="px-4 analitics">Total Excl: €{totalExcl.toFixed(2)}</span>
                        </div>
                    </div>
                    {/* <hr /> */}
                    <h2 className="mb-3 mt-5" style={{ color: "#888", margin: 10 }}>Invoices</h2>

                    <Search setInvoices={setInvoices} toggleStatus={toggleStatus} />
                    <div className="mb-4 mt-4" style={{ overflowY: 'auto', height: 500, border: '0px solid #ccc', borderRadius: 16, width: '100%', backgroundColor: 'white' }}>
                        {Array.isArray(invoices) && invoices.map((invoice, index) => (
                            <div className="mt-4 mb-4 px-5" key={invoice.ID}>
                                <h5 className="mb-2">{invoice.filename}</h5>

                                <div>
                                    <label className="ms-4 me-2" style={{ color: '#88f' }}>Invoice Number: {invoice.invoice_no}</label>
                                    <label className="ms-4 me-2" style={{ color: '#666' }}>|</label>
                                    <label className="ms-4 me-2" style={{ color: '#666' }}>{((dateString) => {
                                        const dateObject = new Date(dateString);
                                        const year = dateObject.getFullYear();
                                        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
                                        const day = String(dateObject.getDate()).padStart(2, '0');
                                        return `${year}-${month}-${day}`;
                                    })(invoice.CreatedAt)}</label>
                                    <label className="me-2 ms-4 mt-2" style={{ textAlign: 'right', alignItems: 'start', fontWeight: 500, fontSize: 18 }}>€
                                        {invoice.discount > 0 ? parseFloat(invoice.total_inclusive * (invoice.discount / 100)).toFixed(2) : invoice.total_inclusive}
                                    </label>

                                    <label className="me-2 ms-4 mt-2" style={{ textAlign: 'right', alignItems: 'start', fontWeight: 500, fontSize: 14, color: '#888' }}>{invoice.sent ? `SENT` : `NOT SENT`}</label>
                                    {!invoice.sent && <button onClick={() => handleConfirmSent(invoice.ID)} className="btn btn-submit-light-xsmall ms-2 me-2">Confirm Sent</button>}
                                    {!invoice.sent && <button onClick={() => handleDeleteInvoice(invoice.filename, invoice.ID)} className="btn btn-submit-dark-xsmall px-4"><FontAwesomeIcon icon={faTrash} /></button>}
                                    <button onClick={() => handleDownload(invoice.filename)} className="btn btn-submit-light-xsmall-2 ms-2 px-4"><FontAwesomeIcon icon={faDownload} /></button>
                                    <hr />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default HistoryDocs;