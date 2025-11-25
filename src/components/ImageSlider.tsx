import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SlideData {
  desktopImage: string;
  mobileImage: string;
  link?: string;
  alt?: string;
}

interface ImageSliderProps {
  slides: SlideData[];
  className?: string;
}

export function ImageSlider({ slides, className = '' }: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (slides.length === 0) {
    return null;
  }

  const renderSlideContent = (slide: SlideData, index: number) => {
    const image = isMobile ? slide.mobileImage : slide.desktopImage;
    const altText = slide.alt || `اسلاید ${index + 1}`;

    const imageElement = (
      <img
        src={image}
        alt={altText}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/1200x250/cccccc/999999?text=Image+Not+Found';
        }}
      />
    );

    if (slide.link) {
      return (
        <a
          href={slide.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          {imageElement}
        </a>
      );
    }

    return imageElement;
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg group ${className}`}>
      <div className={`relative ${isMobile ? 'aspect-[2/1]' : 'aspect-[24/5]'}`}>
        {/* Container اصلی */}
        <div 
          className="relative w-full h-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* اسلایدها */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {renderSlideContent(slide, index)}
            </div>
          ))}
        </div>

        {/* Navigation */}
        {slides.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
              aria-label="اسلاید قبلی"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
              aria-label="اسلاید بعدی"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white w-6' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`رفتن به اسلاید ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}