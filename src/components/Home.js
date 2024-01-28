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
            <div className="row justify-content-center" style={{ backgroundColor: "#ffffff" }}>
                <h1 style={{ color: '#e56259', fontFamily: 'revert', fontSize: 70, fontWeight: 700, textAlign: 'center', fontFamily: 'Gill Sans' }}>QuickBiller</h1>
                <h5 className="mb-5" style={{ textAlign: 'center', color: "black", fontFamily: 'Gill Sans' }}>Simplify Your Billing Process with an Intuitive and Easy to Use Invoicing Tool</h5>
                <Link
                    className='btn btn-submit-light-large text-center mt-5 mb-2 px-4'

                    onClick={toggelOpen} style={{ width: 'fit-content', backgroundColor: open && "#888" }}>
                    {open ? "Complete the Form" : "Create a New Document"}
                </Link>
                <h5 className="text-center mt-2 mb-5" style={{ color: "#666" }}>{open ? "Follow the steps below and complete in the form" : "Create an invoice or price quote document in matter of seconds"}</h5>
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
                    <div className="App" style={{ backgroundColor: "#d2d6db" }}>
                        <div className='mt-2 px-5 py-5 row justify-content-center'>
                            <h1 style={{ fontSize: 40, fontWeight: 600, fontFamily: "revert", color: "#061868", fontFamily: 'Gill Sans' }}>Streamline Invoicing</h1>
                            <h5 className=' mt-5 px-5 me-5 ms-5' style={{ color: "#061868", fontFamily: 'Gill Sans' }}>
                                Create an account to seamlessly include your company information in every invoice, saving you time
                            </h5>
                            <Link to="/register" className='btn btn-submit-dark-large text-center mt-4 mb-4' ><label>Join</label></Link>
                        </div>
                    </div>
                </div >
            };
        </>

    );
}

export default Home;