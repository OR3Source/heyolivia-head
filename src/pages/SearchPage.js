// src/pages/SearchPage.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import eventsData from '../data/events.json';
import '../assets/styles/SearchPage.css';
import footerTop from '../assets/images/footer/footer-top-new.png';



function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchPage() {
    const urlQuery = useQuery().get('q');
    const [query, setQuery] = useState(urlQuery || '');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const matchingEntries = urlQuery
        ? Object.entries(eventsData).filter(([key, value]) =>
            Array.isArray(value.keywords) &&
            value.keywords.some((kw) =>
                kw.toLowerCase().includes(urlQuery.toLowerCase())
            )
        )
        : [];


    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        } else {
            setError('Please enter a search term');
        }
    };

    return (
        <div className="main-search">
            {/* Embedded search bar */}
            <div className="embedded-search-container">
                <div className="embedded-search-wrapper">
                    <form className="embedded-search-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="embedded-search-input"
                            placeholder=""
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="embedded-search-button">
                            <SearchIcon />
                        </button>
                    </form>
                    {error && (
                        <div className="search-error">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Search results */}
            <div className="search-results">
                {urlQuery ? (
                    matchingEntries.length > 0 ? (
                        <div className="results-wrapper">
                            <h2>Entries matching "{urlQuery}": {matchingEntries.length} found</h2>
                            <div className="results-grid">
                                {matchingEntries.map(([key, value]) => (
                                    <div key={key} className="result-entry">
                                        <img src={value.image} alt={value.title} className="result-image"/>
                                        <div className="result-text">
                                            <h3 className="result-title">{value.title}</h3>
                                            <p className="result-description">{value.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <h2>No entries found for "{urlQuery}"</h2>
                    )
                ) : (
                    <h2>No search query provided.</h2>
                )}
            </div>

        </div>
    );
}

export default SearchPage;