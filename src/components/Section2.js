import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/sections/Section2.css';
import '../assets/styles/new-EventCard.css';
import eventsData from '../data/events.json';
import filterImage from '../assets/images/svg/172623a0-6823-4218-934f-a84504fa1768.svg';
import bgImgEventHeader from '../assets/images/headers/section-headers-heyolivia.png';
import EventCarousel from './EventCarousel';

const Section2 = () => {
    // --- dropdown + panel state
    const [openDropdown, setOpenDropdown] = useState(null);
    const filterControlsRef = useRef(null);
    const panelRef = useRef(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // --- events + filters
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({ city: [], country: [], event: [], date: [], price: [], other: [] });

    // load events once
    useEffect(() => { setEvents(eventsData.events); }, []);

    // outside click to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            const inDesktop = filterControlsRef.current?.contains(event.target);
            const inPanel = panelRef.current?.contains(event.target);
            if (!inDesktop && !inPanel) setOpenDropdown(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // close dropdowns when clicking anywhere in mobile panel
    useEffect(() => {
        const handlePanelClick = (event) => {
            if (panelRef.current?.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        const panelEl = panelRef.current;
        if (panelEl) {
            panelEl.addEventListener('click', handlePanelClick);
        }

        return () => {
            if (panelEl) panelEl.removeEventListener('click', handlePanelClick);
        };
    }, [panelRef]);

    // dropdown helpers
    const handleDropdownToggle = (dropdownName) => setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    const handleFilterSelect = (filterType, value) => {
        setFilters((prev) => {
            const currentValues = prev[filterType] || [];
            return currentValues.includes(value)
                ? { ...prev, [filterType]: currentValues.filter((v) => v !== value) }
                : { ...prev, [filterType]: [...currentValues, value] };
        });
    };
    const handleFilterRemove = (filterType, specificValue = null) => {
        if (specificValue) setFilters((prev) => ({ ...prev, [filterType]: prev[filterType].filter((v) => v !== specificValue) }));
        else setFilters((prev) => ({ ...prev, [filterType]: [] }));
    };
    const handleClearAll = () => setFilters({ city: [], country: [], event: [], date: [], price: [], other: [] });

    // derived: dropdown data
    const generateDropdownData = () => {
        const cities = [...new Set(events.map((e) => e.city))].sort();
        const countries = [...new Set(events.map((e) => e.country))].sort();
        const eventTypes = ['Fan Project', 'Listening Party', 'Livestream'];
        const dates = ['Today', 'This Week', 'This Month', 'Next Month', '2024', '2025', 'Custom Range'];
        const prices = ['Free', '$0-25', '$26-50', '$51-100', '$101-200', '$201+', 'VIP Only'];
        const other = ['Active', 'Pending', 'Cancelled', 'Postponed', 'Expired'];
        return { city: cities, country: countries, event: eventTypes, date: dates, price: prices, other };
    };
    const dropdownData = generateDropdownData();

    // FIXED: filtering logic that maintains selection order
    const getFilteredEvents = () => {
        const baseFilteredEvents = events.filter((event) => {
            if (filters.country.length > 0 && !filters.country.includes(event.country)) return false;
            if (filters.event.length > 0 && !filters.event.includes(event.eventType)) return false;

            if (filters.date.length > 0) {
                const eventDate = new Date(event.date);
                const now = new Date();
                const currentYear = now.getFullYear();

                const matchesDate = filters.date.some((dateFilter) => {
                    switch (dateFilter) {
                        case 'Today':
                            return eventDate.toDateString() === now.toDateString();
                        case 'This Week':
                            const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay());
                            const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6);
                            return eventDate >= startOfWeek && eventDate <= endOfWeek;
                        case 'This Month':
                            return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === currentYear;
                        case 'Next Month':
                            const nextMonth = new Date(now); nextMonth.setMonth(now.getMonth() + 1);
                            return eventDate.getMonth() === nextMonth.getMonth() && eventDate.getFullYear() === nextMonth.getFullYear();
                        case '2024':
                            return eventDate.getFullYear() === 2024;
                        case '2025':
                            return eventDate.getFullYear() === 2025;
                        default:
                            return false;
                    }
                });
                if (!matchesDate) return false;
            }

            if (filters.price.length > 0) {
                const price = event.price === "FREE" ? 0 : Number(event.price);
                const matchesPrice = filters.price.some((range) => {
                    switch (range) {
                        case 'Free': return price === 0 || event.price === "FREE";
                        case '$0-25': return price >= 0 && price <= 25;
                        case '$26-50': return price >= 26 && price <= 50;
                        case '$51-100': return price >= 51 && price <= 100;
                        case '$101-200': return price >= 101 && price <= 200;
                        case '$201+': return price > 200;
                        case 'VIP Only': return event.name.toLowerCase().includes('vip');
                        default: return false;
                    }
                });
                if (!matchesPrice) return false;
            }

            if (filters.other.length > 0) {
                const statusFilters = ['active', 'pending', 'cancelled', 'postponed', 'expired'];
                const selectedStatuses = filters.other.filter((item) => statusFilters.includes(item));
                if (selectedStatuses.length > 0) {
                    const eventStatus = event.status.charAt(0).toUpperCase() + event.status.slice(1).toLowerCase();
                    if (!selectedStatuses.includes(eventStatus)) return false;
                }
            }

            return true;
        });

        if (filters.city.length === 0) return baseFilteredEvents;

        const orderedEvents = [];
        filters.city.forEach(selectedCity => {
            const cityEvents = baseFilteredEvents.filter(event => event.city === selectedCity);
            orderedEvents.push(...cityEvents);
        });

        return orderedEvents;
    };

    const filteredEvents = getFilteredEvents();

    const renderDropdown = (name, label, extraClass = '') => {
        const isOpen = openDropdown === name;
        const selectedValues = filters[name];
        return (
            <div className={`filter-dropdown ${extraClass}`} key={name}>
                <button className={`dropdown-button ${isOpen ? 'open' : ''}`} onClick={() => handleDropdownToggle(name)}>
                    {label}
                    <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}></span>
                </button>
                <div className={`dropdown-menu ${!isOpen ? 'hidden' : ''}`}>
                    {dropdownData[name].map((option, index) => (
                        <div key={index} className={`dropdown-item ${selectedValues.includes(option) ? 'selected' : ''}`} onClick={() => handleFilterSelect(name, option)}>
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="section2-container">
            <div className="events-title-container">
                <img src={bgImgEventHeader} alt="Events background decoration" className="events-title-bg" />
                <h1 className="events-title">EVENTS</h1>
            </div>

            {/* mobile trigger */}
            <div className="filter-mobile-trigger">
                <button className="filter-trigger-btn" onClick={() => setIsPanelOpen(true)}>
                    <img src={filterImage} alt="Filter Icon" className="filter-trigger-icon" />
                    <span>Filter events</span>
                </button>
            </div>

            {/* desktop controls */}
            <div className="filter-controls" ref={filterControlsRef}>
                {renderDropdown('city', 'city')}
                {renderDropdown('country', 'country')}
                {renderDropdown('event', 'event')}
                {renderDropdown('date', 'date')}
                {renderDropdown('price', 'price')}
                {renderDropdown('other', 'other')}
            </div>

            <div className="section2-content">
                {/* filter chips */}
                {Object.values(filters).some((arr) => arr.length > 0) && (
                    <div className="filter-tags">
                        {Object.entries(filters)
                            .filter(([_, arr]) => arr.length > 0)
                            .flatMap(([key, arr]) => arr.map((value) => ({ key, value })))
                            .map(({ key, value }, i) => (
                                <div key={`${key}-${value}-${i}`} className="filter-tag">
                                    <span className="filter-tag-text">{value}</span>
                                    <span className="filter-tag-close" onClick={() => handleFilterRemove(key, value)}>×</span>
                                </div>
                            ))}
                        <button className="clear-all-btn" onClick={handleClearAll}>clear all</button>
                    </div>
                )}

                {/* count */}
                <div className="results-count">
                    <p>"{filteredEvents.length}" event{filteredEvents.length !== 1 ? 's' : ''} found</p>
                </div>

                <EventCarousel events={filteredEvents} />

                <div className="event-disclaimer">
                    <p>p.s. the events listed are fan related events!!!</p>
                </div>
            </div>

            {/* mobile side panel */}
            <div className={`filter-mobile-panel ${isPanelOpen ? 'open' : ''}`} ref={panelRef} role="dialog"
                 aria-modal="true" aria-label="Filter Events">
                <div className="filter-panel-header">
                    <button className="close-btn" onClick={() => setIsPanelOpen(false)} aria-label="Close filters">close</button>
                </div>
                <div className="filter-controls-mobile">
                    {renderDropdown('city', 'city', 'mobile')}
                    {renderDropdown('country', 'country', 'mobile')}
                    {renderDropdown('event', 'event', 'mobile')}
                    {renderDropdown('date', 'date', 'mobile')}
                    {renderDropdown('price', 'price', 'mobile')}
                    {renderDropdown('other', 'other', 'mobile')}
                </div>
                {Object.values(filters).some((arr) => arr.length > 0) && (
                    <div className="filter-tags mobile">
                        {Object.entries(filters)
                            .filter(([_, arr]) => arr.length > 0)
                            .flatMap(([key, arr]) => arr.map((value) => ({ key, value })))
                            .map(({ key, value }, i) => (
                                <div key={`${key}-${value}-${i}`} className="filter-tag">
                                    <span className="filter-tag-text">{value}</span>
                                    <span className="filter-tag-close" onClick={() => handleFilterRemove(key, value)}>×</span>
                                </div>
                            ))}
                        <button className="clear-all-btn" onClick={handleClearAll}>clear all</button>
                    </div>
                )}
            </div>

            {isPanelOpen && <div className="filter-panel-backdrop" onClick={() => setIsPanelOpen(false)}></div>}
        </div>
    );
};

export default Section2;
