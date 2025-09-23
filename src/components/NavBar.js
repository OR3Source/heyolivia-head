import React, { useState, useEffect } from 'react';
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

    // Update active state
    useEffect(() => {
        if (showSearchBar) return setActive('search');
        if (location.pathname.includes('search')) setActive('search');
        else if (location.pathname === '/') setActive('home');
        else setActive('other');
    }, [location.pathname, showSearchBar]);

    // Observe Section2 visibility
    useEffect(() => {
        if (location.pathname !== '/') return;
        const section2 = document.getElementById('section2');
        if (!section2) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (showSearchBar || location.pathname.includes('search')) return;
                setActive(entry.isIntersecting ? 'events' : 'home');
            },
            { threshold: 0.3 }
        );

        observer.observe(section2);
        return () => observer.disconnect();
    }, [location.pathname, showSearchBar]);

    // Dynamically measure header height AFTER images/fonts load
    useEffect(() => {
        const header = document.querySelector('.header');
        const bottomDiv = document.querySelector('.header-bottom-fixed');

        if (!header || !bottomDiv) return;

        const updateHeaderHeight = () => {
            const height = header.getBoundingClientRect().height;
            document.documentElement.style.setProperty('--header-height', `${height}px`);
            bottomDiv.style.top = `${height}px`; // stick torn paper exactly to bottom

            // Debugging Motorola 360x511
            if (window.innerWidth === 360 && window.innerHeight === 511) {
                console.log(`Motorola 360x511 - header height: ${height}px`);
            }
        };

        // Run after images/fonts are loaded
        window.addEventListener('load', updateHeaderHeight);
        window.addEventListener('resize', updateHeaderHeight);

        return () => {
            window.removeEventListener('load', updateHeaderHeight);
            window.removeEventListener('resize', updateHeaderHeight);
        };
    }, []);

    // Handlers
    const handleHomeClick = () => {
        setActive('home'); setShowSearchBar(false);
        if (location.pathname !== '/') navigate('/');
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleEventsClick = () => {
        setActive('events'); setShowSearchBar(false);
        if (location.pathname !== '/') navigate('/', { state: { scrollToSection2: true } });
        else document.getElementById('section2')?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleSearchClick = () => {
        setActive('search');
        if (!isOnSearchPage) setShowSearchBar(true);
    };

    return (
        <>
            <header className="header">
                <nav className="nav">
                    <div className="nav-container">
                        <div className="logo">
                            <img src={logoIcon} alt="HeyOlivia Logo" />
                        </div>
                        <div className="nav-links">
                            <button className={active==='home'?'active':''} onClick={handleHomeClick}><FaHome size={24}/></button>
                            <button className={active==='events'?'active':''} onClick={handleEventsClick}><FaCalendarAlt size={24}/></button>
                            <button className={active==='search'?'active':''} onClick={handleSearchClick}><FaSearch size={24}/></button>
                            <button className={active==='other'?'active':''} disabled><FaEllipsisH size={24}/></button>
                        </div>
                    </div>
                </nav>
                <div className="header-bottom-fixed">
                    <img src={headerPaper} alt="TornPaper"/>
                </div>
            </header>

            {showSearchBar && !isOnSearchPage && (
                <SearchBar hideSearchBar={() => setShowSearchBar(false)} />
            )}
        </>
    );
}

export default NavBar;
