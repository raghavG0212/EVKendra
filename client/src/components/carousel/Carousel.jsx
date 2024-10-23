import React, { useState, useEffect } from "react";
import "./carousel.css";

const images = [
  "/Carousel/1.jpeg",
  "/Carousel/2.jpeg",
  "/Carousel/3.jpeg",
  "/Carousel/4.jpeg",
  "/Carousel/5.jpeg",
  "/Carousel/6.jpeg",
  "/Carousel/7.jpeg",
  "/Carousel/8.jpeg",
];

const Carousel = () => {
  const [currentFig, setCurrentFig] = useState(1);
  const [currentDeg, setCurrentDeg] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentFig((prev) => (prev === 8 ? 1 : prev + 1));
      setCurrentDeg((prev) => prev - 45);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentFig, currentDeg]);

  return (
    <div>
      <div className="carousel-container">
        <div
          className="carousel"
          style={{
            transform: `rotateY(${currentDeg}deg)`,
          }}
        >
          {images.map((img, index) => (
            <figure
              key={index}
              id={`fig${index + 1}`}
              className={currentFig === index + 1 ? "show" : ""}
              style={{
                transform: `rotateY(${index * 45}deg) translateZ(300px)`,
              }}
            >
              <img src={img} alt={`Carousel ${index + 1}`} />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
