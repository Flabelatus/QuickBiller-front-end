import { Link } from "react-router-dom";
import GithubImage from "./../images/github.png"
const Footer = () => {
    return (
        <>
            <div className="row mt-3" id="footer">
                <footer className="text-center container-fluid py-5 mt-5" style={{ backgroundColor: "#282c34  " }}>
                    <hr />
                    <div className="row">
                        <div className="col mt-3">
                            <p style={{ fontWeight: 600, color: '#ccc' }}>Created by Javid Jooshesh</p>
                        </div>
                        <div className="col mt-3">
                            <p style={{ fontWeight: 600, color: '#ccc' }}>Contact: jooshesh.javid@gmail.com</p>
                            <a href="!#" className=" btn" style={{ fontWeight: 600, color: '#ccc' }}>Privacy Policy and Terms & Conditions</a>
                            <br />
                        </div>
                        <div className="col mt-3">
                            <p style={{ fontWeight: 600, color: '#ccc' }}>Copyrights @ 2024 All rights reserved</p>
                            <Link className="btn" to="/contact" style={{ fontWeight: 600, color: '#ccc' }}>Contact</Link>
                            <br />
                            <a href="!#" className="btn" style={{ fontWeight: 600, color: '#ccc' }}>Support</a>
                        </div>
                        <div className="col mt-3">
                            <p style={{ fontWeight: 600, color: '#ccc' }}>Socials</p><Link to="https://github.com/Flabelatus/woodPlatformGo/tree/master" className="fa-brands fa-github" /> <br /><i className="fa-brands fa-youtube" />
                            <a href="https://github.com/Flabelatus" target="_blank"><img src={GithubImage} style={{ width: 60 }}></img></a>
                            <br />
                            <br />
                        </div>
                    </div>
                </footer>
            </div>

        </>

    )
}

export default Footer;