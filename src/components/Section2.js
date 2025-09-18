import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../assets/styles/sections/Section2.css';
import '../assets/styles/new-EventCard.css';
import eventsData from '../data/events.json';
import filterImage from '../assets/images/svg/172623a0-6823-4218-934f-a84504fa1768.svg';
import bgImgEventHeader from '../assets/images/headers/section-headers-heyolivia.png';
import star2 from '../assets/stars/star2.png';
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

    // Memoized dropdown data - only recalculate when events change
    const dropdownData = useMemo(() => {
        const cities = [...new Set(events.map((e) => e.city))].sort();
        const countries = [...new Set(events.map((e) => e.country))].sort();
        const eventTypes = ['Fan Project', 'Listening Party', 'Livestream'];
        const dates = ['Today', 'This Week', 'This Month', 'Next Month'];
        const prices = ['Free', '$0-25', '$26-50'];
        const other = ['Active', 'Pending', 'Cancelled', 'Postponed', 'Expired'];
        return { city: cities, country: countries, event: eventTypes, date: dates, price: prices, other };
    }, [events]);

    // Memoized date calculations - calculate once per render
    const dateHelpers = useMemo(() => {
        const now = new Date();
        const currentYear = now.getFullYear();

        // Calculate week boundaries
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // Calculate next month
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);

        // Today string for comparison
        const todayString = now.toDateString();

        return {
            now,
            currentYear,
            startOfWeek,
            endOfWeek,
            nextMonth,
            todayString
        };
    }, []);

    // Create filter checker functions - avoid recreating in every filter iteration
    const createDateChecker = (dateFilter, helpers) => {
        const { now, currentYear, startOfWeek, endOfWeek, nextMonth, todayString } = helpers;

        switch (dateFilter) {
            case 'Today':
                return (eventDate) => eventDate.toDateString() === todayString;
            case 'This Week':
                return (eventDate) => eventDate >= startOfWeek && eventDate <= endOfWeek;
            case 'This Month':
                return (eventDate) => eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === currentYear;
            case 'Next Month':
                return (eventDate) => eventDate.getMonth() === nextMonth.getMonth() && eventDate.getFullYear() === nextMonth.getFullYear();
            default:
                return () => false;
        }
    };

    const createPriceChecker = (range) => {
        switch (range) {
            case 'Free':
                return (price, originalPrice) => price === 0 || originalPrice === "FREE";
            case '$0-25':
                return (price) => price >= 0 && price <= 25;
            case '$26-50':
                return (price) => price >= 26 && price <= 50;
            default:
                return () => false;
        }
    };

    // Optimized filtering logic with early returns and memoization
    const filteredEvents = useMemo(() => {
        // If no filters are applied, return all events
        const hasFilters = Object.values(filters).some(arr => arr.length > 0);
        if (!hasFilters) return events;

        // Pre-calculate filter sets for O(1) lookups
        const countrySet = new Set(filters.country);
        const eventTypeSet = new Set(filters.event);
        const otherSet = new Set(filters.other.map(item => item.toLowerCase()));

        // Pre-calculate date and price checkers
        const dateCheckers = filters.date.map(dateFilter => createDateChecker(dateFilter, dateHelpers));
        const priceCheckers = filters.price.map(createPriceChecker);

        const baseFilteredEvents = events.filter((event) => {
            // Country filter - O(1) lookup
            if (countrySet.size > 0 && !countrySet.has(event.country)) return false;

            // Event type filter - O(1) lookup
            if (eventTypeSet.size > 0 && !eventTypeSet.has(event.eventType)) return false;

            // Date filter - only parse date if needed
            if (dateCheckers.length > 0) {
                const eventDate = new Date(event.date);
                const matchesDate = dateCheckers.some(checker => checker(eventDate));
                if (!matchesDate) return false;
            }

            // Price filter - only parse price if needed
            if (priceCheckers.length > 0) {
                const price = event.price === "FREE" ? 0 : Number(event.price);
                const matchesPrice = priceCheckers.some(checker => checker(price, event.price));
                if (!matchesPrice) return false;
            }

            // Status filter - O(1) lookup
            if (otherSet.size > 0) {
                const eventStatus = event.status.toLowerCase();
                if (!otherSet.has(eventStatus)) return false;
            }

            return true;
        });

        // City ordering optimization - only if city filters exist
        if (filters.city.length === 0) return baseFilteredEvents;

        // Use Map for O(1) city event grouping
        const eventsByCity = new Map();
        baseFilteredEvents.forEach(event => {
            if (!eventsByCity.has(event.city)) {
                eventsByCity.set(event.city, []);
            }
            eventsByCity.get(event.city).push(event);
        });

        // Build ordered result
        const orderedEvents = [];
        filters.city.forEach(selectedCity => {
            const cityEvents = eventsByCity.get(selectedCity);
            if (cityEvents) {
                orderedEvents.push(...cityEvents);
            }
        });

        return orderedEvents;
    }, [events, filters, dateHelpers]);

    // Memoized active filter tags to avoid recalculating on every render
    const activeFilterTags = useMemo(() => {
        return Object.entries(filters)
            .filter(([_, arr]) => arr.length > 0)
            .flatMap(([key, arr]) => arr.map((value) => ({ key, value })));
    }, [filters]);

    const hasActiveFilters = activeFilterTags.length > 0;

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
                {hasActiveFilters && (
                    <div className="filter-tags">
                        {activeFilterTags.map(({key, value}, i) => (
                            <div key={`${key}-${value}-${i}`} className="filter-tag">
                                <span className="filter-tag-text">{value}</span>
                                <span className="filter-tag-close"
                                      onClick={() => handleFilterRemove(key, value)}>×</span>
                            </div>
                        ))}
                        <button className="clear-all-btn" onClick={handleClearAll}>clear all</button>
                    </div>
                )}

                {/* count */}
                <div className="results-count">
                    <p>"{filteredEvents.length}" event{filteredEvents.length !== 1 ? 's' : ''} found</p>
                </div>

                <EventCarousel events={filteredEvents}/>
                <div className="button-controller">
                <button className="event-creation-form">SUBMIT UR EVENT</button>
                </div>
                <div className="event-disclaimer">
                    <p>p.s. the events listed are fan related events!!!</p>
                </div>
                <img src={star2} alt="star" className="ending-star"/>
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
                {hasActiveFilters && (
                    <div className="filter-tags mobile">
                        {activeFilterTags.map(({ key, value }, i) => (
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