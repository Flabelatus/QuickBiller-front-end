import { Link } from "react-router-dom";
import GithubImage from "./../images/github.png"
const Footer = () => {
    return (
        <>
            <div className="container-fluid mt-3" id="footer">
                <footer className="text-center py-5 mt-5" style={{ backgroundColor: "#282c34", minHeight: 270 }}>
                    {/* <hr className="mb-4" /> */}
                    <div className="row">
                        <div className="col-md-3 col-sm-6 mt-3">
                            <p style={{ fontWeight: 600, color: '#ccc' }}>Created by Javid Jooshesh</p>
                        </div>
                        <div className="col-md-3 col-sm-6 mt-3">
                            <p style={{ fontWeight: 600, color: '#ccc' }}>Contact: jooshesh.javid@gmail.com</p>
                            <a href="!#" className="btn  " style={{ fontWeight: 600, color: '#ccc' }}>Privacy Policy and Terms & Conditions</a>
                        </div>
                        <div className="col-md-3 col-sm-6 mt-3">
                            <p style={{ fontWeight: 600, color: '#ccc' }}>Copyrights @ 2024 All rights reserved</p>
                            <Link className="btn " to="/contact" style={{ fontWeight: 600, color: '#ccc' }}>Contact</Link>
                            <a href="!#" className="btn " style={{ fontWeight: 600, color: '#ccc' }}>Support</a>
                        </div>
                        <div className="col-md-3 col-sm-6 mt-3">
                            <p style={{ fontWeight: 600, color: '#ccc' }}>Socials</p>
                            <a href="https://github.com/Flabelatus/woodPlatformGo/tree/master" target="_blank" style={{ color: "#eee" }} className="btn btn-link">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="https://github.com/Flabelatus" target="_blank" className="btn btn-link-">
                                <img src={GithubImage} alt="GitHub Image" style={{ width: 60 }} />
                            </a>
                        </div>
                    </div>
                </footer>
            </div>


        </>

    )
}

export default Footer;