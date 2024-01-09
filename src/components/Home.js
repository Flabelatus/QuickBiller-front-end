import { Link, useOutletContext } from "react-router-dom";
import InvoiceForms from "./InvoiceForms";
import { useEffect, useState } from "react";


const Home = () => {
    const [open, setOpen] = useState(false);
    const { jwtToken } = useOutletContext();

    const toggelOpen = () => {
        if (open) {
            setOpen(!open);
        } else {
            setOpen(true);
        }
    }

    useEffect(() => {
    }, [open])

    return (
        <>
            <div className="row justify-content-center" style={{ backgroundColor: "#282c34" }}>
                <h1 style={{ color: '#99FFCC', fontFamily: 'revert', fontSize: 70, fontWeight: 800, textAlign: 'center' }}>QuickBiller</h1>
                <h5 style={{ textAlign: 'center', color: "white" }}>Simplify Your Billing Process</h5>
                <Link
                    className='btn btn-submit-light-large text-center mt-5 mb-'
                    onClick={toggelOpen}>
                    Create Invoice
                </Link>
                <div className='App mb-4' style={{ maxHeight: open ? 'max-content' : '0px', overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                    {open &&
                        <div className='mt-2 py-3 row justify-content-center'>
                            <InvoiceForms></InvoiceForms>
                        </div>
                    }
                </div>
            </div>
            {jwtToken === "" &&
                <div>
                    <div className="App">
                        <div className='mt-2 px-5 py-5 row justify-content-center'>
                            <h1 style={{ fontWeight: 600 }}>Streamline Invoicing</h1>
                            <h5 className=' mt-5 px-5 me-5 ms-5'>Create an account to seamlessly include your company information in every invoice, saving you time
                            </h5>
                            <h5 className='mb-4 px-5 me-5 ms-5'>Also,
                                track your sent invoices and earnings
                            </h5>
                            <Link to="/register" className='btn btn-submit-dark-large text-center mt-4 mb-4' >Join</Link>
                        </div>
                    </div>
                </div>
            }

        </>

    );
}

export default Home;