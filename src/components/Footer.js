import React from "react";
import footerTop from '../assets/images/footer/footer-top-new.png';
import { spotifyLogo, tiktokLogo, twitterLogo, youtubeLogo, instagramLogo, mailLogo } from '../assets/brands';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top-divider">
                <img src={footerTop} alt="Footer Divider" />
            </div>

            <div className="footer-top">
                <h1>HAVE ANY QUESTIONS?</h1>
                <p>stay updated with the latest news and updates on <br />olivia <span>+</span> livies!</p>
                <div className="footer-email">
                    <img src={mailLogo} alt="Mail Icon" className="footer-mail-icon" draggable="false" />
                    <a href="mailto:heyoliviaofficial@gmail.com" draggable="false">HEYOLIVIAOFFICIAL</a>
                </div>
            </div>

            <hr />

            <div className="footer-middle">
                <div className="social-media-icons" draggable="false">
                    <img src={spotifyLogo} alt="Spotify" className="icon" draggable="false" onClick={() => window.open("https://open.spotify.com/artist/1McMsnEElThX1knmY4oliG", "_blank")} />
                    <img src={youtubeLogo} alt="YouTube" className="icon" draggable="false" onClick={() => window.open("https://www.youtube.com/channel/UCy3zgWom-5AGypGX_FVTKpg", "_blank")} />
                    <img src={twitterLogo} alt="Twitter" className="icon" draggable="false" onClick={() => window.open("https://twitter.com/oliviarodrigo", "_blank")} />
                    <img src={tiktokLogo} alt="TikTok" className="icon" draggable="false" onClick={() => window.open("https://www.tiktok.com/@livbedumb", "_blank")} />
                    <img src={instagramLogo} alt="Instagram" className="icon igicon" draggable="false" onClick={() => window.open("https://www.instagram.com/oliviarodrigo", "_blank")} />
                </div>
            </div>

            <p> © 2025 heyolivia | we're not affiliated with olivia rodrigo </p>
        </footer>
    );
};

export default Footer;
