import { useState } from 'react';
import { InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useLocation } from 'react-router-dom';

function EmbeddedSearchBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const initialQuery = params.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError('Please enter a search term.');
            return;
        }
        setError('');
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <div style={{ width: '800px', maxWidth: '95%' }}>
                <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        width: '100%',
                        border: '2px solid rgb(162,126,194)',
                        borderRadius: '0',
                        padding: '2px 6px',
                        height: '40px'
                    }}
                >
                    <InputBase
                        sx={{
                            flex: 1,
                            color: 'rgb(228,215,243)',
                            padding: '4px 8px',
                            fontSize: '1rem',
                            fontFamily: `'American Typewriter', 'Courier New', Courier, monospace`
                        }}
                        placeholder="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <IconButton sx={{ color: 'rgb(162,126,194)', padding: '6px' }} type="submit">
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
    );
}

export default EmbeddedSearchBar;
