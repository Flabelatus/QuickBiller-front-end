import React, { useEffect } from 'react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom';

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
                <form className='' onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', width: '35%' }}>
                    <input
                        className='form-control'
                        style={{ border: '1px solid #ccc', borderRadius: 10 }}
                        id='search'
                        type='text'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <input className='btn btn-submit-light-small ms-4' type='submit' value='Search'></input>
                </form>
            </header>
        </>
    );
};