import { useContext, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { AppContext } from "../App";

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

        fetch(`http://localhost:8082/logged_in/logout`, requestOptions)
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
            <div className="App-header row justify-content-center">
                <header className='d-flex justify-content-center align-items-center pb-1 mb-1 mt-4'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p><Link to="/" className='mt-2 btn btn-light ' style={{ color: 'bla', fontSize: 20, fontWeight: 350, border: '2px solid #ccc', borderRadius: 25, width: 'fit-content'}}>Home</Link></p>
                        {jwtToken === "" && <Link to="/login"><p className='btn btn-submit-light-small ms-5 mt-2'>Login</p></Link>}
                        <p><Link to="#!" className='mt-2 btn btn-light ms-5' style={{ color: 'black', fontSize: 20, width: 'fit-content', border: '2px solid #ccc', borderRadius: 25, fontWeight: 350 }}>Contact</Link></p>
                        {jwtToken !== "" && <p><Link to="/user_company" className='mt-2 btn btn-light ms-5' style={{ color: 'black', fontSize: 20, width: 'fit-content', border: '2px solid #ccc', borderRadius: 25, fontWeight: 350}}>My Company Info</Link></p>}
                        {jwtToken !== "" && <p><Link onClick={handleLogout} className='mt-2 btn-light btn ms-5' style={{ color: 'black', fontSize: 20, width: 'fit-content', border: '2px solid #ccc', borderRadius: 25, textAlign: 'right', fontWeight: 350 }}>Log out</Link></p>}
                    </div>
                </header>
            </div>
        </>
    );
}