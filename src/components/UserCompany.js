import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const UserCompany = () => {
    const [companyName, setCompanyName] = useState("");
    const [contactName, setContactName] = useState("");
    const [email, setEmail] = useState("");
    const [street, setStreet] = useState("");
    const [postcode, setCpostcode] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [iban, setIban] = useState("");
    const [vat_number, setVatnumber] = useState("");
    const [coc_number, setCocNumber] = useState("");

    const { jwtToken } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return;
        }
        const requestOptions = {
            method: "GET",
            headers: { "Authorization": "Bearer " + jwtToken, "Content-Type": "application/json" },
        }
        fetch(`http://localhost:5005/user_company`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setCompanyName(data.company_name);
                setContactName(data.contact_name);
                setEmail(data.email);
                setStreet(data.street);
                setCpostcode(data.postcode);
                setCity(data.city);
                setCountry(data.country);
                setIban(data.iban);
                setVatnumber(data.vat_number);
                setCocNumber(data.coc_number);

            })
            .catch((error) => {
                console.error(error.message);
            })
    })
    return (
        <div className="row justify-content-center mt-4 mb-5">
            <div className="col-md-4 offset-md-3 px-4 py-4" style={{backgroundColor: "#EEE", borderRadius: 8}}>
                <p style={{fontWeight: 600, fontSize: 16}}>Contact Name: {contactName}</p>
                <p style={{fontWeight: 600, fontSize: 16}}>Email: {email}</p>
                <p style={{fontWeight: 600, fontSize: 16}}>Street: {street}</p>
                <p style={{fontWeight: 600, fontSize: 16}}>Postcode: {postcode}</p>
                <p style={{fontWeight: 600, fontSize: 16}}>City: {city}</p>
                <p style={{fontWeight: 600, fontSize: 16}}>Country: {country}</p>
                <p style={{fontWeight: 600, fontSize: 16}}>IBAN: {iban}</p>
                <p style={{fontWeight: 600, fontSize: 16}}>VAT No: {vat_number}</p>
                <p style={{fontWeight: 600, fontSize: 16}}>CoC No: {coc_number}</p>
            </div>

        </div>
    );
}

export default UserCompany;