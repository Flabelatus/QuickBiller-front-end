import React from 'react'
import { useState } from 'react'

export const Search = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
        console.log('Search submitted:', searchTerm);
    };

    return (
        <>
            <header className='search-bar'>
                <form className='' onSubmit={handleSubmit} style={{display: 'flex', alignItems: 'center'}}>
                    <input
                        className='form-control'
                        style={{border: '1px solid #ccc', borderRadius: 10}}
                        id='search'
                        type='text'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <input className='btn btn-submit-light-small ms-2' type='submit' value='Search'></input>
                </form>
            </header>
        </>
    );
};