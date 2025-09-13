
import React from "react";
import footerTop from '../assets/images/footer/footer-top-new.png';
import { spotifyLogo, tiktokLogo, twitterLogo, youtubeLogo, instagramLogo, mailLogo } from '../assets/brands';

const Footer = () => {
    return (
        <footer className="footer">
            {/* Divider Image */}
            <div className="footer-top-divider">
                <img src={footerTop} alt="Footer Divider" />
            </div>

            {/* Email */}
            <div className="footer-email">
                <img
                    src={mailLogo}
                    alt="Mail Icon"
                    className="footer-mail-icon"
                    draggable="false"
                />
                <a href="mailto:heyoliviaofficial@gmail.com" draggable="false">
                    heyoliviaofficial<span>@</span>gmail.com
                </a>
            </div>

            <hr />

            {/* Social Links */}
            <div className="footer-middle">
                <div className="social-media-icons" draggable="false">
                    <img src={spotifyLogo} alt="Spotify" className="icon" draggable="false" />
                    <img src={youtubeLogo} alt="YouTube" className="icon" draggable="false" />
                    <img src={twitterLogo} alt="Twitter" className="icon" draggable="false" />
                    <img src={tiktokLogo} alt="TikTok" className="icon" draggable="false" />
                    <img src={instagramLogo} alt="Instagram" className="icon igicon" draggable="false" />
                </div>
            </div>

            {/* Footer Note */}
            <p>© 2024 heyolivia | we're not affiliated with Olivia Rodrigo</p>
        </footer>
    );
};

export default Footer;
