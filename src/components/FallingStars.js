// FallingStars.js
import React, { useEffect, useState } from 'react';
import star1 from '../assets/stars/star1.png';
import star2 from '../assets/stars/star2.png';
import star3 from '../assets/stars/star3.png';
import star4 from '../assets/stars/star4.png';
import star6 from '../assets/stars/star6.png';
import star7 from '../assets/stars/star7.png';
import '../assets/styles/FallingStars.css';

const starImages = [star1, star2, star3, star4, star6, star7];

function FallingStars({ enabled = true }) {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        if (!enabled) {
            setStars([]);
            return;
        }

        const spawnInterval = setInterval(() => {
            setStars(prev => {
                const now = Date.now();
                // keep stars longer (extra buffer)
                const activeStars = prev.filter(star => now - star.spawnTime < (star.duration + 5) * 1000);

                // spawn new star (max 10 on screen)
                if (activeStars.length < 10 && Math.random() < 0.7) {
                    const newStar = {
                        id: now + Math.random(),
                        image: starImages[Math.floor(Math.random() * starImages.length)],
                        left: Math.pow(Math.random(), 0.8) * 100, // spread across screen
                        size: Math.random() * 15 + 20, // bigger stars
                        duration: Math.random() * 10 + 18, // slower, longer fall
                        rotate: Math.random() * 60 - 30,
                        opacity: Math.random() * 0.3 + 0.5,
                        spawnTime: now
                    };
                    return [...activeStars, newStar];
                }

                return activeStars;
            });
        }, 1200); // faster spawn cycle

        return () => clearInterval(spawnInterval);
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div className="falling-stars-container">
            {stars.map((star) => (
                <img
                    key={star.id}
                    src={star.image}
                    alt=""
                    className="falling-star"
                    style={{
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDuration: `${star.duration}s`,
                        transform: `rotate(${star.rotate}deg)`,
                        opacity: star.opacity,
                    }}
                />
            ))}
        </div>
    );
}

export default FallingStars;
