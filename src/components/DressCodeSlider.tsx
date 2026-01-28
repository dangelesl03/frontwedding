import React, { useState } from 'react';

interface DressCodeSliderProps {
  images: string[];
}

const DressCodeSlider: React.FC<DressCodeSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ height: '200px' }}>
        {/* Imagen principal */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Ejemplo dress code ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-pink-200/90 hover:bg-pink-300 text-gray-800 rounded-full p-1 shadow-lg transition-all duration-200 z-10"
              aria-label="Imagen anterior"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-pink-200/90 hover:bg-pink-300 text-gray-800 rounded-full p-1 shadow-lg transition-all duration-200 z-10"
              aria-label="Siguiente imagen"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Indicadores */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-4 bg-pink-500'
                    : 'w-1.5 bg-pink-300 hover:bg-pink-400'
                }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DressCodeSlider;
