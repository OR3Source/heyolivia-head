import React from 'react';
import '../assets/styles/sections/Section4.css';
import bgImgEventHeader from "../assets/images/headers/section-headers-heyolivia.png";

const Section4 = () => {
    return (
        <div id="section4" className="section4-container">
            {/* Header */}
            <div className="events-title-container">
                <img
                    src={bgImgEventHeader}
                    alt="Events background decoration"
                    className="events-title-bg"
                />
                <h1 className="events-title">T-PREP</h1>
            </div>
        </div>
    );
};

export default Section4;
