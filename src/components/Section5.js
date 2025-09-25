import React, { useState, useRef, useEffect, createRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../assets/styles/sections/Section5.css';
import bgImgEventHeader from "../assets/images/headers/section-headers-heyolivia.png";
import plusIcon from "../assets/images/section5-images/NavPlus.png";
import minusIcon from "../assets/images/section5-images/NavMinus.png";

const prepItems = [
    { number: "01.", text: "WHAT TO WEAR?", font: "var(--tertiary-font)" },
    { number: "02.", text: "WHAT TO BRING?", font: "var(--secondary-font)" },
    { number: "03.", text: "FINAL REMINDERS", font: "var(--primary-font)" }
];

const Section5 = () => {
    const [expandedItem, setExpandedItem] = useState(null);
    const nodeRefs = prepItems.map(() => createRef());
    const prepListRef = useRef(null);

    const handleItemClick = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };

    const handleDownload = () => {
        window.open(
            "https://drive.google.com/drive/folders/1aH2_vscCi5QSGrckKhpj-0xrTg5tAL5K?usp=drive_link",
            "_blank"
        );
    };

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
            <div className="events-title-container">
                <img
                    src={bgImgEventHeader}
                    alt="Events background decoration"
                    className="events-title-bg"
                />
                <h1 className="events-title">T-PREP</h1>
            </div>

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
                                                <div className="tour-prep-sections">
                                                    <div className="mini-prep-item">
                                                        <div className="mini-prep-number">CREATED BY:</div>
                                                        <div className="mini-prep-text">@username via ____</div>
                                                    </div>
                                                </div>
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
                                                        <div className="mini-prep-text">Clear bag* & ID</div>
                                                    </div>
                                                    <div className="mini-prep-item">
                                                        <div className="mini-prep-number">02. SURVIVAL NEEDS</div>
                                                        <div className="mini-prep-text">Snacks, cash, water, & medicine</div>
                                                    </div>
                                                    <div className="mini-prep-item">
                                                        <div className="mini-prep-number">03. COMFORT</div>
                                                        <div className="mini-prep-text">Hat, sunglasses, & portable fan</div>
                                                    </div>
                                                    <div className="mini-prep-item">
                                                        <div className="mini-prep-number">04. SAFE KEEP</div>
                                                        <div className="mini-prep-text">Camera, markers, pens, & notebook</div>
                                                    </div>
                                                    <div className="mini-prep-item">
                                                        <div className="mini-prep-number">05. SAFETY</div>
                                                        <div className="mini-prep-text">portable charger & buddy system</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="content-right wallpaper-section">
                                                <div className="wallpaper-image">
                                                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                                                    <img
                                                        src="https://i.pinimg.com/736x/0c/71/48/0c71486941a6d025684913d38960083e.jpg"
                                                        alt="Download Image Icon"
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
                                                    Please remember to have your best concert etiquette. <br /><br />
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
