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
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isSwipeInProgress, setIsSwipeInProgress] = useState(false);

    const articlesPerPage = 4;
    const allArticles = newsData.sideArticles;
    const paginated = allArticles.slice(page * articlesPerPage, (page + 1) * articlesPerPage);

    const featureRef = useRef(null);
    const sideRef = useRef(null);
    const sideWrapperRef = useRef(null);

    const minSwipeDistance = 50;
    const maxVerticalDistance = 100;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 480);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const updateHeights = () => {
            // Only apply height locking for proper desktop screens
            // iPad landscape (1024px) should not be locked
            if (window.innerWidth > 1200 && window.innerHeight > 600) {
                const featureHeight = featureRef.current?.offsetHeight || 0;
                const sideHeight = sideRef.current?.offsetHeight || 0;
                setLockedHeight(Math.max(featureHeight, sideHeight));
            } else {
                setLockedHeight(0); // Remove height lock for tablets and smaller screens
            }
        };
        
        // Add a small delay to ensure DOM is ready after rotation
        const timeoutId = setTimeout(updateHeights, 100);
        
        window.addEventListener('resize', updateHeights);
        return () => {
            window.removeEventListener('resize', updateHeights);
            clearTimeout(timeoutId);
        };
    }, [page, paginated]);

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
        setIsSwipeInProgress(true);
    };

    const onTouchMove = (e) => {
        if (!touchStart || !isSwipeInProgress) return;
        setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
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
                if (distanceX > 0) setMobileArticleIndex(prev => Math.min(prev + 1, allArticles.length - 1));
                else setMobileArticleIndex(prev => Math.max(prev - 1, 0));
            } else {
                const totalPages = Math.ceil(allArticles.length / articlesPerPage);
                if (distanceX > 0) setPage(prev => Math.min(prev + 1, totalPages - 1));
                else setPage(prev => Math.max(prev - 1, 0));
            }
        }

        setIsSwipeInProgress(false);
        setTouchStart(null);
        setTouchEnd(null);
    };

    const renderMobilePaginationDots = () => allArticles.map((_, index) => (
        <div
            key={index}
            className={`dot ${mobileArticleIndex === index ? 'active' : ''}`}
            onClick={() => setMobileArticleIndex(index)}
        />
    ));

    return (
        <div className="section1-container">
            <div className="video-svg-container">
                <video className="desktop-video" autoPlay muted loop playsInline>
                    <source src={desktopVideo} type="video/mp4" />
                </video>
                <video className="tablet-video" autoPlay muted loop playsInline>
                    <source src={tabletVideo} type="video/mp4" />
                </video>
            </div>

            <div className="headline">
                <div className="headline-inner">
                    <p className="eyebrow">ALL THINGS OLIVIA</p>
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
                            <img src={newsData.featureArticle.img} alt="Feature News" className="feature-image" />
                        </div>
                        <div className="feature-content">
                            <h2>{newsData.featureArticle.title}</h2>
                            <p>{newsData.featureArticle.content}</p>
                        </div>
                    </div>

                    <div
                        className="side-articles-wrapper"
                        ref={sideWrapperRef}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        style={{ touchAction: 'pan-y' }}
                    >
                        <div className="side-articles" ref={sideRef} style={{ height: lockedHeight ? `${lockedHeight}px` : 'auto' }}>
                            {isMobile
                                ? allArticles.map((article, index) => (
                                    <div
                                        key={index}
                                        className={`side-article ${index === mobileArticleIndex ? 'mobile-visible' : 'mobile-hidden'}`}
                                    >
                                        <img src={article.img} alt="News" />
                                        <div>
                                            <h3>{article.title}</h3>
                                            <p>{article.desc}</p>
                                        </div>
                                    </div>
                                ))
                                : paginated.map((article, index) => (
                                    <div className="side-article" key={index}>
                                        <img src={article.img} alt="News" />
                                        <div>
                                            <h3>{article.title}</h3>
                                            <p>{article.desc}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {isMobile && <div className="mobile-pagination-dots">{renderMobilePaginationDots()}</div>}

                        {!isMobile && allArticles.length > articlesPerPage && (
                            <div className="pagination-dots">
                                {[...Array(Math.ceil(allArticles.length / articlesPerPage))].map((_, i) => (
                                    <div key={i} className={`dot ${page === i ? 'active' : ''}`} onClick={() => setPage(i)} />
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