import React, { useState, useEffect, useCallback } from 'react';

const Carousel2 = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState(children.length);
  const [touchPosition, setTouchPosition] = useState(null);

  useEffect(() => {
    setLength(children.length);
  }, [children]);

  const next = useCallback(() => {
    if (currentIndex < (length - 1)) {
      setCurrentIndex(prevState => prevState + 1);
    } else {
      setCurrentIndex(0);
    }
  }, [currentIndex, length]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prevState => prevState - 1);
    } else {
      setCurrentIndex(length - 1);
    }
  }, [currentIndex, length]);

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [next]);

  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  }

  const handleTouchMove = (e) => {
    const touchDown = touchPosition;

    if(touchDown === null) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      next();
    }

    if (diff < -5) {
      prev();
    }

    setTouchPosition(null);
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {React.Children.map(children, (child, index) => (
            <div className="w-full flex-shrink-0 flex-grow" key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={prev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={next}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Carousel2;