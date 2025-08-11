import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmbeddedSearchBar from './EmbeddedSearchBar';
import keywordMap from '../data/sites.json';
import '../assets/styles/SearchResults.css';

function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('q')?.trim().toLowerCase() || '';

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const matchedRoutes = Object.entries(keywordMap)
        .filter(([_, data]) => data.keywords.some(k => query.includes(k)))
        .map(([route, data]) => ({ route, ...data }));

    return (
        <div className="search-page">
            <EmbeddedSearchBar />
            <div className="search-content">
                <h2 className="search-heading">Results for: {query}</h2>

                {matchedRoutes.length > 0 ? (
                    <div className="search-results">
                        {matchedRoutes.map(({ route, title, description, image }) => (
                            <div
                                key={route}
                                className="search-card"
                                onClick={() => navigate(`/${route}`)}
                            >
                                <img src={image} alt={title} className="search-card-image" />
                                <div className="search-card-text">
                                    <div className="search-card-title">{title}</div>
                                    <div className="search-card-description">{description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="search-no-results">
                        no results found for “{query}”. check the spelling or use a different word or phrase.
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchResults;
