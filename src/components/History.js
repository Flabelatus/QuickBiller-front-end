import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';
import { Search } from "./SearchBar";

const HistoryDocs = () => {

    const { jwtToken } = useOutletContext();
    const [invoices, setInvoices] = useState([]);
    const [status, setStatus] = useState(false);
    const navigate = useNavigate();

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

    const handleDeleteInvoice = (invoiceId) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        };

        fetch(`${process.env.REACT_APP_BACKEND}/logged_in/invoice/${invoiceId}`, requestOptions).then((response) => response.json())
            .then(() => toggleStatus()).catch(error => console.error(error.message));
    }

    return (
        <div className="container mt-5 px-5 mb-5">
            <div className="row justify-content-center">
                <div className="col">
                    <h1 className="mb-5 mt-5">Overview</h1>
                    <h2 className="mb-5 mt-5">Invoices</h2>
                    <Search />
                    <div className="mb-4 mt-4" style={{ overflowY: 'auto', height: 500, border: '1px solid #ccc', borderRadius: 16, width: '100%' }}>
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
                                    <label className="me-2 ms-4 mt-2" style={{ textAlign: 'right', alignItems: 'start', fontWeight: 500, fontSize: 18 }}>€ {parseFloat(invoice.total_inclusive).toFixed(2)}</label>
                                    <label className="me-2 ms-4 mt-2" style={{ textAlign: 'right', alignItems: 'start', fontWeight: 500, fontSize: 14, color: '#888' }}>{invoice.sent ? `SENT` : `NOT SENT`}</label>
                                    {!invoice.sent && <button onClick={() => handleConfirmSent(invoice.ID)} className="btn btn-submit-light-xsmall ms-2 me-2">Confirm Sent</button>}
                                    {!invoice.sent && <button onClick={() => handleDeleteInvoice(invoice.ID)} className="btn btn-submit-dark-xsmall">Delete</button>}
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