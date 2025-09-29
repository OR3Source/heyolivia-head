import React, { useState, useEffect } from 'react'
import logoIcon from '../assets/images/navbar/logo.png'
import headerPaper from '../assets/images/navbar/header-paper-purple.png'
import { FaHome, FaCalendarAlt, FaSearch, FaEllipsisH } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import SearchBar from './SearchBar'

function NavBar() {
    const [active, setActive] = useState('home')
    const [showSearchBar, setShowSearchBar] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const isOnSearchPage = location.pathname.includes('/search')

    // Handle route changes and search bar state
    useEffect(() => {
        if (showSearchBar || isOnSearchPage) {
            setActive('search')
        } else if (location.pathname === '/') {
            // Don't automatically set to 'home' here - let intersection observer handle it
            // Only set to home if we're not already tracking section visibility
        } else {
            setActive('other')
        }
    }, [location.pathname, showSearchBar, isOnSearchPage])

    // Handle intersection observer for section2
    useEffect(() => {
        if (location.pathname !== '/' || showSearchBar || isOnSearchPage) return

        const section2 = document.getElementById('section2')
        if (!section2) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Only update if we're on home page and not showing search
                if (location.pathname === '/' && !showSearchBar && !isOnSearchPage) {
                    setActive(entry.isIntersecting ? 'events' : 'home')
                }
            },
            { threshold: 0.3 }
        )

        observer.observe(section2)

        // Initial check when component mounts
        const rect = section2.getBoundingClientRect()
        const isVisible = rect.top <= window.innerHeight * 0.7 && rect.bottom >= window.innerHeight * 0.3
        setActive(isVisible ? 'events' : 'home')

        return () => observer.disconnect()
    }, [location.pathname, showSearchBar, isOnSearchPage])

    // Handle header height updates
    useEffect(() => {
        const header = document.querySelector('.header')
        const bottomDiv = document.querySelector('.header-bottom-fixed')
        if (!header || !bottomDiv) return

        const updateHeaderHeight = () => {
            const height = header.getBoundingClientRect().height
            document.documentElement.style.setProperty('--header-height', `${height}px`)
            bottomDiv.style.top = `${height}px`
        }

        const timeoutId = setTimeout(updateHeaderHeight, 0)
        window.addEventListener('resize', updateHeaderHeight)

        return () => {
            clearTimeout(timeoutId)
            window.removeEventListener('resize', updateHeaderHeight)
        }
    }, [])

    const handleHomeClick = () => {
        if (showSearchBar) {
            setShowSearchBar(false)
            return
        }
        if (location.pathname !== '/') {
            navigate('/')
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleEventsClick = () => {
        if (showSearchBar) {
            setShowSearchBar(false)
            return
        }
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollToSection2: true } })
        } else {
            const section2 = document.getElementById('section2')
            if (section2) {
                const rect = section2.getBoundingClientRect()
                const offsetTop = window.pageYOffset + rect.top - 180
                window.scrollTo({ top: offsetTop, behavior: 'smooth' })
            }
        }
        setActive('events')
    }

    const handleSearchClick = () => {
        if (isOnSearchPage) return
        if (active === 'search' && showSearchBar) {
            setShowSearchBar(false)
        } else {
            setShowSearchBar(true)
        }
    }

    const handleOtherClick = () => {
        if (active === 'search') return false
        return false
    }

    const hideSearchBar = () => {
        setShowSearchBar(false)
    }

    return (
        <>
            <header className="header">
                <nav className="nav">
                    <div className="nav-container">
                        <div className="logo">
                            <img src={logoIcon} alt="HeyOlivia Logo" />
                        </div>
                        <div className="nav-links">
                            <button className={active === 'home' ? 'active' : ''} onClick={handleHomeClick} type="button">
                                <FaHome size={24} />
                            </button>
                            <button className={active === 'events' ? 'active' : ''} onClick={handleEventsClick} type="button">
                                <FaCalendarAlt size={24} />
                            </button>
                            <button className={active === 'search' ? 'active' : ''} onClick={handleSearchClick} type="button">
                                <FaSearch size={24} />
                            </button>
                            <button className={active === 'other' ? 'active' : ''} onClick={handleOtherClick} type="button" style={{ cursor: 'default' }}>
                                <FaEllipsisH size={24} />
                            </button>
                        </div>
                    </div>
                </nav>
                <div className="header-bottom-fixed">
                    <img src={headerPaper} alt="TornPaper" />
                </div>
            </header>
            {showSearchBar && !isOnSearchPage && <SearchBar hideSearchBar={hideSearchBar} />}
        </>
    )
}

export default NavBar;