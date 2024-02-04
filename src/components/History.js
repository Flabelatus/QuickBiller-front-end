import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';

const HistoryDocs = () => {

    const { jwtToken } = useOutletContext();
    const [invoices, setInvoices] = useState([]);
    const navigate = useNavigate();

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
                console.log(data.data);
            })
            .catch((error) => {
                console.log(error.message);
            })
    }, [jwtToken]);

    return (
        <div className="container mt-5 px-5 mb-5">
            <div className="row justify-content-center">
                <div className="col">
                    <h1 className="mb-5 mt-5">Invoice History</h1>
                    <div className="mb-4" style={{ overflowY: 'auto', height: 500 }}>
                        {Array.isArray(invoices) && invoices.map((invoice, index) => (
                            <div className="mt-4 mb-4 px-5 py-5 invoice" key={invoice.ID}>
                                <h5 className="mb-4">{invoice.filename}</h5>
                                <div>
                                    <label className="ms-4 me-2">Invoice Number: {invoice.invoice_no}</label>
                                    <label className="ms-4 me-2">Invoice Date: {((dateString) => {
                                        const dateObject = new Date(dateString);
                                        const year = dateObject.getFullYear();
                                        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
                                        const day = String(dateObject.getDate()).padStart(2, '0');
                                        return `${year}-${month}-${day}`;
                                    })(invoice.CreatedAt)}</label>

                                    <label className="ms-4 me-2">Client Name: {invoice.client_name}</label>
                                    <label className="ms-4 me-2">Costs: €{invoice.costs}</label>
                                    <label className="ms-4 me-2">Total Exclusive VAT: €{invoice.total_exclusive}</label>
                                    <label className="ms-4 me-2">Total Inclusive VAT: €{invoice.total_inclusive}</label>
                                    <label className="ms-4 me-2">VAT Percentage: %{invoice.vat_percent}</label>
                                </div>
                                <button className="btn mt-4 btn-submit-light-small">
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default HistoryDocs;