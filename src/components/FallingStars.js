import React, { useEffect, useState } from "react";
import star1 from "../assets/stars/star1.png";
import star2 from "../assets/stars/star2.png";
import star3 from "../assets/stars/star3.png";
import star4 from "../assets/stars/star4.png";
import star6 from "../assets/stars/star6.png";
import star7 from "../assets/stars/star7.png";
import "../assets/styles/FallingStars.css";

const starImages = [star1, star2, star3, star4, star6, star7];

function FallingStars({ enabled = true }) {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        // If disabled, clear stars and stop spawning
        if (!enabled) {
            setStars([]);
            return;
        }

        const maxStars = 5;
        const spawnIntervalMs = 600;

        const interval = setInterval(() => {
            setStars((prev) => {
                const now = Date.now();

                // Filter out expired stars
                const active = prev.filter(
                    (star) => now - star.spawnTime < star.duration * 1000
                );

                // Limit the total number of active stars
                if (active.length >= maxStars) return active;

                // Generate a new random star
                const newStar = {
                    id: now + Math.random(),
                    image: starImages[Math.floor(Math.random() * starImages.length)],
                    left: Math.random() * 100,
                    size: Math.random() * 15 + 20,
                    duration: 6 + Math.random() * 2,
                    rotate: Math.random() * 60 - 30,
                    opacity: Math.random() * 0.3 + 0.6,
                    drift: Math.random() * 40 - 20,
                    spawnTime: now,
                };

                return [...active, newStar];
            });
        }, spawnIntervalMs);

        return () => clearInterval(interval);
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
                        "--drift": `${star.drift}px`,
                    }}
                />
            ))}
        </div>
    );
}

export default FallingStars;
