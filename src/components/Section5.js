import React, { useState, useRef, useEffect, createRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../assets/styles/sections/Section5.css';
import bgImgEventHeader from "../assets/images/headers/section-headers-heyolivia.png";
import plusIcon from "../assets/images/section5-images/NavPlus.png";
import minusIcon from "../assets/images/section5-images/NavMinus.png";
const prepItems = [
    { number: "01.", text: "WHAT TO WEAR?", font: "American Typewriter" },
    { number: "02.", text: "WHAT TO BRING?", font: "Typeka" },
    { number: "03.", text: "FINAL REMINDERS", font: "Barlow" }
];

const Section5 = () => {
    const [expandedItem, setExpandedItem] = useState(null);

    // Create refs for each CSSTransition to fix React 18 findDOMNode error
    const nodeRefs = prepItems.map(() => createRef());

    const handleItemClick = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = 'https://i.pinimg.com/736x/ab/e0/ad/abe0add0f873ac62ae7911364d573102.jpg';
        link.download = 'olivia-rodrigo-lockscreen-wallpaper.jpg';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handle clicks outside of prep-list
    const prepListRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (prepListRef.current && !prepListRef.current.contains(event.target)) {
                setExpandedItem(null);
            }
        };

        if (expandedItem !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [expandedItem]);

    return (
        <div id="section5" className="section5-container">
            {/* Header */}
            <div className="events-title-container">
                <img
                    src={bgImgEventHeader}
                    alt="Events background decoration"
                    className="events-title-bg"
                />
                <h1 className="events-title">T-PREP</h1>
            </div>

            {/* Prep List */}
            <div className="prep-list" ref={prepListRef}>
                {prepItems.map((item, index) => (
                    <div key={index} className="prep-item-wrapper">
                        <div
                            className="prep-item clickable"
                            onClick={() => handleItemClick(index)}
                        >
                            <span className="prep-number">{item.number}</span>
                            <span
                                className="prep-text"
                                style={{ fontFamily: item.font }}
                            >
                                {item.text}
                            </span>
                            <img
                                src={expandedItem === index ? minusIcon : plusIcon}
                                alt={expandedItem === index ? "Collapse" : "Expand"}
                                className="prep-icon"
                            />
                        </div>

                        {/* CSSTransition wrapper with nodeRef */}
                        <CSSTransition
                            in={expandedItem === index}
                            timeout={300}
                            classNames="slide"
                            unmountOnExit
                            nodeRef={nodeRefs[index]}
                        >
                            <div ref={nodeRefs[index]} className="expanded-content">
                                <div className="expanded-content-inner">
                                    {index === 0 && (
                                        <>
                                            <div className="content-left">
                                                <h3 className="content-title">WHAT TO WEAR</h3>
                                            </div>
                                            <div className="content-right">
                                                <iframe
                                                    src="https://petracoding.github.io/pinterest/board.html?link=elizabethharty389/guts-world-tour-outfit-ideas/&hideHeader=1&hideFooter=1&transparent=1"
                                                    title="Olivia Rodrigo Concert Outfits"
                                                    className="pinterest-iframe"
                                                ></iframe>
                                            </div>
                                        </>
                                    )}

                                    {index === 1 && (
                                        <>
                                            <div className="content-left">
                                                <h3 className="content-title">WHAT TO BRING</h3>
                                                <div className="tour-prep-sections">
                                                    <div className="mini-prep-item">
                                                        <div className="mini-prep-number">01. VENUE ESSENTIALS</div>
                                                        <div className="mini-prep-text">Clear bag, lanyard, & ID</div>
                                                    </div>
                                                    <div className="mini-prep-item">
                                                        <div className="mini-prep-number">02. SURVIVAL KIT</div>
                                                        <div className="mini-prep-text">Snacks, cash, & medicine</div>
                                                    </div>
                                                    <div className="mini-prep-item">
                                                        <div className="mini-prep-number">03. COMFORT</div>
                                                        <div className="mini-prep-text">Hat, sunglasses, & portable fan</div>
                                                    </div>
                                                    <div className="mini-prep-item">
                                                        <div className="mini-prep-number">04. MEMORY</div>
                                                        <div className="mini-prep-text">Camera, disposable film, & notebook</div>
                                                    </div>
                                                    <div className="mini-prep-item">
                                                        <div className="mini-prep-number">05. SAFETY</div>
                                                        <div className="mini-prep-text">Buddy plan & emergency whistle</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="content-right wallpaper-section">
                                                <div className="wallpaper-image">
                                                    <img
                                                        src="https://i.pinimg.com/736x/0c/71/48/0c71486941a6d025684913d38960083e.jpg"
                                                        alt="Olivia Rodrigo Tour Lockscreen Wallpaper"
                                                    />
                                                </div>
                                                <div className="download-section" onClick={handleDownload}>
                                                    <div className="download-title">Download Tour</div>
                                                    <div className="download-subtitle">Lockscreen Wallpapers</div>
                                                    <div className="download-hint">Click to download</div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {index === 2 && (
                                        <>
                                            <div className="content-left">
                                                <h3 className="content-title">FINAL REMINDERS</h3>
                                            </div>
                                            <div className="content-right etiquette-section">
                                                <p>
                                                    Please remember to have your best concert etiquette. <br/><br/>
                                                    You are representing Olivia and should be on your best behavior.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CSSTransition>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Section5;
