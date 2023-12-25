import { Link } from "react-router-dom";

export const AppBar = () => {
    return (
        <div className="App-header">
            <header className='d-flex justify-content-between align-items-md-center pb-1 mb-1 mt-4'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p><Link to="/" className='mt-2 btn' style={{ color: 'white', fontSize: 20 }}>Home</Link></p>
                    <Link to="/login" ><p className='btn btn-submit-light-small ms-5 mt-2'>Login</p></Link>
                    <p className='ms-5 mt-2' style={{ color: 'white', fontSize: 20 }}>Contact</p>
                </div>
            </header>
        </div>

    );
}