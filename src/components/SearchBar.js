import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    InputBase,
    IconButton,
    Paper,
    ClickAwayListener,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import '../assets/styles/SearchBar.css';

function SearchBar({ hideSearchBar }) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            hideSearchBar();
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
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
                                color: 'var(--light-pink-color);',
                                padding: '4px 8px',
                                fontSize: '1.25rem',
                                fontFamily: `var(--secondary-font);`
                            }}
                            placeholder="Search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <IconButton
                            sx={{ color: 'white', padding: '6px' }}
                            type="submit"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </div>
            </div>
        </ClickAwayListener>
    );

    return ReactDOM.createPortal(searchBarContent, document.body);
}

export default SearchBar;
