import desktopVideo from '../assets/videos/dae550e989b047ea94c0cd74ff09c393.mp4';
import tabletVideo from '../assets/videos/4138b2f5a10d40a681d119aa1cb00a7a.mp4';
import star1 from '../assets/stars/star1.png';
import star3 from '../assets/stars/star3.png';
import '../assets/styles/sections/Section1.css';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import newsData from '../data/news-articles.json';
import cornerEye from '../assets/images/section1-images/OLIVIA-00014_C_Overlay_Eye1.png';
function Section1() {
    const [page, setPage] = useState(0);
    const [lockedHeight, setLockedHeight] = useState(0);
    const [mobileArticleIndex, setMobileArticleIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Swipe detection states
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isSwipeInProgress, setIsSwipeInProgress] = useState(false);

    const articlesPerPage = 4;
    const allArticles = newsData.sideArticles;
    const paginated = allArticles.slice(page * articlesPerPage, (page + 1) * articlesPerPage);

    const featureRef = useRef(null);
    const sideRef = useRef(null);
    const sideWrapperRef = useRef(null);

    // Swipe detection constants
    const minSwipeDistance = 50; // Minimum distance for a swipe
    const maxVerticalDistance = 100; // Maximum vertical movement to still count as horizontal swipe

    // Detect Safari and add class to html element
    if (/^((?!chrome|android).)*safari/i.test(navigator.userUser)) {
        document.documentElement.classList.add('safari');
    }

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 480);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const updateHeights = () => {
            if (window.innerWidth > 900) {
                const featureHeight = featureRef.current?.offsetHeight || 0;
                const sideHeight = sideRef.current?.offsetHeight || 0;
                const maxHeight = Math.max(featureHeight, sideHeight);
                setLockedHeight(maxHeight);
            } else {
                setLockedHeight(0);
            }
        };

        updateHeights();
        window.addEventListener('resize', updateHeights);
        return () => window.removeEventListener('resize', updateHeights);
    }, [page, paginated]);

    // Swipe handlers
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
        setIsSwipeInProgress(true);
    };

    const onTouchMove = (e) => {
        if (!touchStart || !isSwipeInProgress) return;

        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd || !isSwipeInProgress) {
            setIsSwipeInProgress(false);
            return;
        }

        const distanceX = touchStart.x - touchEnd.x;
        const distanceY = Math.abs(touchStart.y - touchEnd.y);
        const isHorizontalSwipe = Math.abs(distanceX) > minSwipeDistance && distanceY < maxVerticalDistance;

        if (isHorizontalSwipe) {
            if (isMobile) {
                // Mobile: individual article navigation
                if (distanceX > 0) {
                    // Swipe left - next article
                    setMobileArticleIndex(prev =>
                        prev < allArticles.length - 1 ? prev + 1 : prev
                    );
                } else {
                    // Swipe right - previous article
                    setMobileArticleIndex(prev =>
                        prev > 0 ? prev - 1 : prev
                    );
                }
            } else {
                // Desktop/Tablet: page navigation
                const totalPages = Math.ceil(allArticles.length / articlesPerPage);
                if (distanceX > 0) {
                    // Swipe left - next page
                    setPage(prev => prev < totalPages - 1 ? prev + 1 : prev);
                } else {
                    // Swipe right - previous page
                    setPage(prev => prev > 0 ? prev - 1 : prev);
                }
            }
        }

        setIsSwipeInProgress(false);
        setTouchStart(null);
        setTouchEnd(null);
    };

    // Mobile pagination dots (no ellipsis)
    const renderMobilePaginationDots = () => {
        return allArticles.map((_, index) => (
            <div
                key={index}
                className={`dot ${mobileArticleIndex === index ? 'active' : ''}`}
                onClick={() => setMobileArticleIndex(index)}
            />
        ));
    };

    return (
        <div className="section1-container">
            <div className="video-svg-container">
                <video className="desktop-video" autoPlay muted loop playsInline>
                    <source src={desktopVideo} type="video/mp4"/>
                </video>
                <video className="tablet-video" autoPlay muted loop playsInline>
                    <source src={tabletVideo} type="video/mp4"/>
                </video>
            </div>

            <div className="headline">
                <div className="headline-inner">
                    <p className="eyebrow">REGARDING OR3</p>
                    <h1>THE LATEST</h1>
                </div>
            </div>

            <div className="news-header">
                <span className="last-updated">
                    <FaRegCalendarAlt className="calendar-icon" />
                    Last Updated {newsData.lastModified} @ {newsData.lastModifiedTime}
                </span>
            </div>

            <div className="outline-wrapper">
                <img src={star1} alt="star" className="desktop-star star1" />
                <img src={star3} alt="star" className="desktop-star star3" />
                <img src={cornerEye} alt="corner eye" className="corner-eye" />

                <div className="news-grid">
                    <div
                        className="feature-article"
                        ref={featureRef}
                        style={{ height: lockedHeight ? `${lockedHeight}px` : 'auto' }}
                    >
                        <div className="feature-image-wrapper">
                            <img
                                src="https://pbs.twimg.com/media/G0VSbU0XQAADWnV?format=jpg&name=large"
                                alt="Feature News"
                                className="feature-image"
                            />
                        </div>

                        <div className="feature-content">
                            <h2>{newsData.featureArticle.title}</h2>
                            <p>{newsData.featureArticle.content}</p>
                        </div>
                    </div>

                    {/* Side articles + dots wrapper WITH SWIPE FUNCTIONALITY */}
                    <div
                        className="side-articles-wrapper"
                        ref={sideWrapperRef}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        style={{ touchAction: 'pan-y' }} // Allow vertical scrolling but handle horizontal swipes
                    >
                        <div
                            className="side-articles"
                            ref={sideRef}
                            style={{ height: lockedHeight ? `${lockedHeight}px` : 'auto' }}
                        >
                            {isMobile ? (
                                allArticles.map((article, index) => (
                                    <div
                                        key={index}
                                        className={`side-article ${
                                            index === mobileArticleIndex ? 'mobile-visible' : 'mobile-hidden'
                                        }`}
                                    >
                                        <img src={article.img} alt="News" />
                                        <div>
                                            <h3>{article.title}</h3>
                                            <p>{article.desc}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                paginated.map((article, index) => (
                                    <div className="side-article" key={index}>
                                        <img src={article.img} alt="News" />
                                        <div>
                                            <h3>{article.title}</h3>
                                            <p>{article.desc}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Mobile pagination dots */}
                        {isMobile && (
                            <div className="mobile-pagination-dots">
                                {renderMobilePaginationDots()}
                            </div>
                        )}

                        {/* Desktop/Tablet pagination dots */}
                        {!isMobile && allArticles.length > articlesPerPage && (
                            <div className="pagination-dots">
                                {[...Array(Math.ceil(allArticles.length / articlesPerPage))].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`dot ${page === i ? 'active' : ''}`}
                                        onClick={() => setPage(i)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Section1;