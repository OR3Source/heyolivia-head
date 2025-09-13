import desktopVideo from '../assets/videos/dae550e989b047ea94c0cd74ff09c393.mp4';
import tabletVideo from '../assets/videos/4138b2f5a10d40a681d119aa1cb00a7a.mp4';
import star1 from '../assets/stars/star1.png';
import star3 from '../assets/stars/star3.png';
import '../assets/styles/sections/Section1.css';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';

const allArticles = [
    {
        img: 'https://i.pinimg.com/736x/3e/4c/42/3e4c4226351f82ce4c9e963ad12ccfd5.jpg',
        title: 'QUICK UPDATE',
        desc: 'Short insight into what\'s happening behind the scenes.'
    },
    {
        img: 'https://i.pinimg.com/1200x/db/b6/e4/dbb6e417db99e98d827b708595d9859a.jpg',
        title: 'IS CASE YOU MISSED IT',
        desc: 'A recap of recent highlights and ongoing stories.'
    },
    {
        img: 'https://i.pinimg.com/1200x/12/52/5b/12525b5474d7c0e458747f0ab00f5245.jpg',
        title: 'COMING SOON',
        desc: 'What\'s next on the horizon — a sneak peek ahead.'
    },
    {
        img: 'https://i.pinimg.com/1200x/64/49/03/644903da18b91d4f84b4f229653eafc1.jpg',
        title: 'BEHIND THE CURTAIN',
        desc: 'Exclusive look at what\'s brewing internally.'
    },
    {
        img: 'https://i.pinimg.com/736x/0d/1b/7b/0d1b7b6ea4d99b26a34d7671432cbc4c.jpg',
        title: 'FAN REACTIONS',
        desc: 'How the community is responding to the latest drop.'
    },
    {
        img: 'https://i.pinimg.com/736x/32/66/c6/3266c624ea7b165cd603327413e4c50b.jpg',
        title: 'NEXT STEPS',
        desc: 'Where things are headed from here.'
    },
];

function Section1() {
    const [page, setPage] = useState(0);
    const [lockedHeight, setLockedHeight] = useState(0);
    const [mobileArticleIndex, setMobileArticleIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const articlesPerPage = 4;
    const paginated = allArticles.slice(page * articlesPerPage, (page + 1) * articlesPerPage);

    const featureRef = useRef(null);
    const sideRef = useRef(null);

    // Detect Safari and add class to html element
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
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
                    Last Updated 09/05/2025 @ 8:30 PM
                </span>
            </div>

            <div className="outline-wrapper">

                        <img src={star1} alt="star" className="desktop-star star1" />
                        <img src={star3} alt="star" className="desktop-star star3" />


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
                            <h2>GUTS 2-YEAR ANNIVERSARY!!!</h2>
                            <p>
                                A major development has just been revealed. Dive into the full story and explore the
                                details shaping what comes next.
                            </p>
                        </div>
                    </div>

                    {/* Side articles + dots wrapper */}
                    <div className="side-articles-wrapper">
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
