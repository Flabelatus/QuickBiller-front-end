import React, { useEffect } from 'react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faS, faSearch } from '@fortawesome/free-solid-svg-icons';

export const Search = ({ setInvoices, toggleStatus }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { jwtToken } = useOutletContext();

    const onSearch = (searchPhrase) => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        };

        fetch(`${process.env.REACT_APP_BACKEND}/logged_in/invoice/search?q=${encodeURIComponent(searchPhrase)}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setInvoices(data.data);
            })
            .catch((error) => error.message);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <>
            <header className='search-bar'>
                <form className='' onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', width: '45%' }}>
                    <input
                        className='form-control'
                        style={{ border: '0px solid #ccc', borderRadius: 8, backgroundColor: "#F5F5F5", color: '#666', height: 40 }}
                        id='search'
                        type='text'
                        placeholder='Search for client names or invoice number'
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <button className='btn btn-submit-light-small ms-4 px-4' type='submit' value='Search' style={{ width: 'fit-content' }}><FontAwesomeIcon icon={faSearch} /></button>
                </form>
            </header>
        </>
    );
};