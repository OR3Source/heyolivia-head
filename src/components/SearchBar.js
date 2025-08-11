import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import {
    InputBase,
    IconButton,
    Paper,
    ClickAwayListener,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function SearchBar({ hideSearchBar }) {
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError('Please enter a search term.');
            return;
        }
        setError('');
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    };

    const searchBarContent = (
        <ClickAwayListener onClickAway={hideSearchBar}>
            <div className="search-bar-wrapper">
                <div style={{ position: 'relative', width: '800px', maxWidth: '95%' }}>
                    <Paper
                        component="form"
                        id="search-form"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            width: '100%',
                            border: '2px solid white',
                            borderRadius: '0',
                            padding: '2px 6px',
                            height: '40px'
                        }}
                        onSubmit={handleSubmit}
                    >
                        <InputBase
                            sx={{
                                flex: 1,
                                color: 'rgb(162,126,194)',
                                padding: '4px 8px',
                                fontSize: '1rem',
                                fontFamily: `'American Typewriter', 'Courier New', Courier, monospace`
                            }}
                            placeholder="Search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onDoubleClick={hideSearchBar}
                        />
                        <IconButton
                            sx={{ color: 'white', padding: '6px' }}
                            type="submit"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    {error && (
                        <div style={{
                            color: '#ef8181',
                            fontSize: '0.85rem',
                            marginTop: '5px',
                            fontFamily: `'American Typewriter', 'Courier New', Courier, monospace`
                        }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </ClickAwayListener>
    );

    return ReactDOM.createPortal(searchBarContent, document.body);
}

export default SearchBar;
