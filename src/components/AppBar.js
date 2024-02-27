import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faSignOut, faSignIn, faUser } from '@fortawesome/free-solid-svg-icons';



export const AppBar = () => {
    const { jwtToken, setJwtToken, toggleRefresh } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {

    }, [jwtToken]);

    const handleLogout = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + jwtToken },
            credentials: 'include'
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/logged_in/logout`, requestOptions)
            .then((response) => response.json())
            .catch(error => {
                console.error(error.message);
            })
            .finally(() => {
                setJwtToken("");
                navigate("/");
                toggleRefresh(false);
            });
    };
    return (
        <>
            <div className="App-header row justify-content-center" style={{minWidth: 400}}>
                <header className='d-flex justify-content-center align-items-center pb-1 mb-1 mt-4 px-5'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p><Link to="/" className='mt-2 btn btn-light-' style={{ color: '#888', fontSize: 26, fontWeight: 350, }}><i className="fa-solid fa-house"></i><FontAwesomeIcon icon={faHome} /></Link></p>

                        {/* <p><Link to="/contact" className='mt-2 btn btn-light ms-5' style={{ color: 'black', fontSize: 16, width: 'fit-content', border: '2px solid #ccc', borderRadius: 25, fontWeight: 350 }}>Contact</Link></p> */}
                        {jwtToken === "" && <Link to="/login"><p className='btn btn-submit-light-small ms-5 mt-2'><FontAwesomeIcon icon={faSignIn} className="me-2"></FontAwesomeIcon>Login</p></Link>}
                        {jwtToken === "" && <Link to="/register"><p className='btn btn-submit-dark-small ms-5 mt-2'><FontAwesomeIcon icon={faUser} className="me-2" />Sign Up</p></Link>}
                        {jwtToken !== "" && <p><Link to="/user_company" className='mt-2 btn btn-light ms-3 px-4' style={{ color: 'black', fontSize: 20, width: 'fit-content', minWidth: 120, border: '1px solid #ccc', borderRadius: 25, fontWeight: 350 }}>My Info</Link></p>}
                        {jwtToken !== "" && <p><Link to="/history" className='mt-2 btn btn-light ms-3 px-4' style={{ color: 'black', fontSize: 20, width: 'fit-content', border: '1px solid #ccc', borderRadius: 25, fontWeight: 350 }}>Overview</Link></p>}
                        {jwtToken !== "" && <p><Link onClick={handleLogout} className='mt-2 btn btn-light- btn ms-3' style={{ color: '#888', fontSize: 20, }}><FontAwesomeIcon icon={faSignOut} className="me-2" />Logout</Link></p>}
                    </div>
                </header>
            </div>
        </>
    );
}