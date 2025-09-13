import React, { useRef, useState, useEffect } from 'react';
import '../assets/styles/new-EventCard.css';

const EventCarousel = ({ events }) => {
    const carouselRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateArrows = () => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const { scrollLeft, scrollWidth, clientWidth } = carousel;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const handleLoad = () => updateArrows();
        const imgs = carousel.querySelectorAll('img');
        imgs.forEach(img => img.addEventListener('load', handleLoad));

        carousel.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);

        const timer = setTimeout(updateArrows, 100);

        return () => {
            imgs.forEach(img => img.removeEventListener('load', handleLoad));
            carousel.removeEventListener('scroll', updateArrows);
            window.removeEventListener('resize', updateArrows);
            clearTimeout(timer);
        };
    }, [events]);

    const scroll = (direction) => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const cardWidth = carousel.querySelector('.event-card').offsetWidth + 20;
        carousel.scrollBy({
            left: direction === 'left' ? -cardWidth : cardWidth,
            behavior: 'smooth'
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return (price === "FREE" || price === 0) ? 'FREE' : `$${price}`;
    };

    const getStatusClass = (status) => {
        const statusMap = {
            active: 'status-active',
            pending: 'status-pending',
            cancelled: 'status-cancelled',
            postponed: 'status-postponed',
            expired: 'status-expired'
        };
        return statusMap[status.toLowerCase()] || 'status-default';
    };

    return (
        <div className="event-carousel-container">
            <button
                className="carousel-arrow carousel-arrow-left"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                style={{
                    opacity: canScrollLeft ? 1 : 0.3,
                    pointerEvents: canScrollLeft ? 'auto' : 'none'
                }}
            />

            <div className="event-cards-carousel" ref={carouselRef}>
                {events.map((event, index) => (
                    <div key={index} className="event-card">
                        <div className="event-card-image-container">
                            <img
                                src={event.image}
                                alt={event.name}
                                className="event-card-image"
                            />
                            <div className={`event-status-badge ${getStatusClass(event.status)}`}>
                                {event.status.toLowerCase()}
                            </div>
                        </div>

                        <div className="event-card-content">
                            <h3 className="event-card-title">{event.name}</h3>

                            <div className="event-card-details">
                                <div className="event-detail-item">
                                    <span className="event-detail-label">Date:</span>
                                    <span className="event-detail-value">{formatDate(event.date)}</span>
                                </div>

                                <div className="event-detail-item">
                                    <span className="event-detail-label">Location:</span>
                                    <span className="event-detail-value">
                                        {event.city},<br />{event.country}
                                    </span>
                                </div>

                                <div className="event-detail-item">
                                    <span className="event-detail-label">Price:</span>
                                    <span className="event-detail-value event-price">{formatPrice(event.price)}</span>
                                </div>
                            </div>

                            <div className="event-card-actions">
                                <a
                                    className="event-card-btn event-card-btn-primary"
                                    href={event.refLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="carousel-arrow carousel-arrow-right"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                style={{
                    opacity: canScrollRight ? 1 : 0.3,
                    pointerEvents: canScrollRight ? 'auto' : 'none'
                }}
            />
        </div>
    );
};

export default EventCarousel;