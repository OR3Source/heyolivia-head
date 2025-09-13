import React, { useState } from 'react';
import logoIcon from '../assets/images/navbar/logo.png';
import headerPaper from '../assets/images/navbar/header-paper-purple.png';
import { FaHome, FaCalendarAlt, FaSearch, FaEllipsisH } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';

function NavBar() {
    const [active, setActive] = useState('home');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isOnSearchPage = location.pathname.includes('/search');

    // ----------------------------------------------------
    // Location observer logic (search always trumps)
    // ----------------------------------------------------
    React.useEffect(() => {
        if (location.pathname.includes('search')) {
            setActive('search');
            setShowSearchBar(false);
        } else if (!showSearchBar && location.pathname === '/') {
            // scroll/observer handles home/events
        } else if (!showSearchBar) {
            setActive('');
        }
    }, [location.pathname, showSearchBar]);

    // ----------------------------------------------------
    // Intersection observer for events/home
    // ----------------------------------------------------
    React.useEffect(() => {
        if (location.pathname !== '/') return;

        const section2 = document.getElementById('section2');
        if (!section2) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (showSearchBar || active === 'search') return;

                if (entry.isIntersecting) {
                    setActive('events');
                } else {
                    setActive('home');
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(section2);

        return () => observer.disconnect();
    }, [location.pathname, showSearchBar, active]);

    // ----------------------------------------------------
    // Click handlers
    // ----------------------------------------------------
    const handleHomeClick = () => {
        setActive('home');
        setShowSearchBar(false);
        if (location.pathname !== '/') navigate('/');
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEventsClick = () => {
        setActive('events');
        setShowSearchBar(false);
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollToSection2: true } });
        } else {
            document.getElementById('section2')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSearchClick = () => {
        setActive('search');
        if (!isOnSearchPage) setShowSearchBar(true);
    };

    const handleOtherClick = () => {
        setActive('other');
        setShowSearchBar(false);
    };

    return (
        <>
            <header className="header">
                <nav className="nav">
                    <div className="nav-container">
                        <div className="logo">
                            <img src={logoIcon} alt="HeyOlivia Logo"/>
                        </div>

                        <div className="nav-links">
                            <button className={active === 'home' ? 'active' : ''} onClick={handleHomeClick}>
                                <FaHome size={24}/>
                            </button>

                            <button className={active === 'events' ? 'active' : ''} onClick={handleEventsClick}>
                                <FaCalendarAlt size={24}/>
                            </button>

                            <button className={active === 'search' ? 'active' : ''} onClick={handleSearchClick}>
                                <FaSearch size={24}/>
                            </button>

                            <button className={active === 'other' ? 'active' : ''} onClick={handleOtherClick}>
                                <FaEllipsisH size={24}/>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            <div className="header-bottom-fixed">
                <img src={headerPaper} alt="TornPaper"/>
            </div>

            {showSearchBar && !isOnSearchPage && (
                <SearchBar hideSearchBar={() => setShowSearchBar(false)} />
            )}
        </>
    );
}

export default NavBar;
