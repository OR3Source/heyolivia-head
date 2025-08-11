import React from 'react';
import { FaHome, FaCalendarAlt, FaSearch, FaEllipsisH } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

function NavBar({ currentSection, setCurrentSection, scrollToTop, scrollToSection, toggleSearchBar }) {
    const navigate = useNavigate();
    const location = useLocation();

    const goToHomeAndScroll = (sectionId) => {
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTarget: sectionId } });
        } else {
            scrollToSection(sectionId);
        }
    };

    return (
        <header className="header">
            <nav className="nav">
                <div className="nav-container">
                    <div className="logo">
                        <img src="/logo.png" alt="HeyOlivia Logo" />
                    </div>
                    <div className="nav-links">
                        <button
                            onClick={() => {
                                setCurrentSection('home');
                                navigate('/');
                                scrollToTop();
                            }}
                            className={currentSection === 'home' ? 'active' : ''}
                            aria-label="Home"
                        >
                            <FaHome size={24} />
                        </button>
                        <button
                            onClick={() => {
                                setCurrentSection('events');
                                goToHomeAndScroll('section2');
                            }}
                            className={currentSection === 'events' ? 'active' : ''}
                            aria-label="Events"
                        >
                            <FaCalendarAlt size={24} />
                        </button>
                        <button
                            onClick={() => {
                                toggleSearchBar();
                                setCurrentSection('search');
                            }}
                            className={currentSection === 'search' ? 'active' : ''}
                            aria-label="Search"
                        >
                            <FaSearch size={24} />
                        </button>
                        <button
                            onClick={() => {
                                setCurrentSection('other');
                                goToHomeAndScroll('section4');
                            }}
                            className={currentSection === 'other' ? 'active' : ''}
                            aria-label="Other"
                        >
                            <FaEllipsisH size={24} />
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
