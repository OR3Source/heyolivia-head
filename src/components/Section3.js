import React from 'react';
import '../assets/styles/sections/Section3.css';
import bgImgEventHeader from '../assets/images/headers/section-headers-heyolivia.png';

const Section3 = () => {

    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        document.documentElement.classList.add('safari');
    }

    return (
        <div id="section3" className="section3-container">
            {/* Header */}
            <div className="events-title-container">
                <img
                    src={bgImgEventHeader}
                    alt="Events background decoration"
                    className="events-title-bg"
                />
                <h1 className="events-title">UPDATES</h1>
            </div>

            {/* Content Layout */}
            <div className="section3-content">
                {/* LEFT */}
                <div className="section3-left">
                    <div className="section3-left-wrapper">
                        <span className="section3-subtitle">Livie's faves</span>
                        <span className="section3-main">STAY UP TO DATE WITH OLIVIA</span>
                        <span className="section3-subtitle">via X.</span>
                    </div>
                </div>


                {/* RIGHT */}
                <div className="section3-right">
                    {[1, 2, 3, 4,5].map((num) => (
                        <div key={num} className={`news-block block-${num}`}>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Section3;
