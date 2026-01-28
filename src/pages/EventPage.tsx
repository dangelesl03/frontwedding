import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import ImageCarousel from '../components/ImageCarousel';
import MapWithMarker from '../components/MapWithMarker';
import DressCodeSlider from '../components/DressCodeSlider';

interface EventData {
  title: string;
  coupleNames: string;
  weddingDate: string;
  location: string;
  address: string;
  dressCode: string;
  dressCodeDescription: string;
  bannerImageUrl?: string;
  additionalInfo?: string;
  carouselImages?: string[];
  ourStory?: {
    title?: string;
    content: string;
    images?: string[];
  };
}

// Datos de las ubicaciones con marcadores rojos
const CEREMONY_LOCATION = {
  name: 'Parroquia Nuestra Señora de Fátima',
  address: 'Parroquia Virgen de Fátima, Avenida Armendáriz, Miraflores, Perú',
  date: '28 de marzo de 2026',
  time: '03:30 p.m.',
  googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Parroquia+Virgen+de+Fátima,+Avenida+Armendáriz,+Miraflores,+Perú',
  wazeUrl: 'https://waze.com/ul?q=Parroquia+Virgen+de+Fátima,+Avenida+Armendáriz,+Miraflores,+Perú',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1159.6880699373921!2d-77.03048291691383!3d-12.131972618152284!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b7e3df33c885%3A0x34d782ed435323da!2sParroquia%20Nuestra%20Se%C3%B1ora%20de%20F%C3%A1tima!5e0!3m2!1ses!2spe!4v1769563603242!5m2!1ses!2spe'
};

const RECEPTION_LOCATION = {
  name: 'Casona Clark',
  address: 'Casona Clark, Avenida General Edmundo Aguilar Pastor, Lima, Perú',
  date: '28 de marzo de 2026',
  time: '06:00 p.m.',
  googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Casona+Clark,+Avenida+General+Edmundo+Aguilar+Pastor,+Lima,+Perú',
  wazeUrl: 'https://waze.com/ul?q=Casona+Clark,+Avenida+General+Edmundo+Aguilar+Pastor,+Lima,+Perú',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.348929794219!2d-77.0164356240361!3d-12.156630988088928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b78bcfebdfbd%3A0xe7e652e22de5e1ec!2sCasona%20Clark!5e0!3m2!1ses!2spe!4v1769563710091!5m2!1ses!2spe'
};

// Imágenes de ejemplo para Dress Code (combinadas: mujeres y hombres)
// Usando las imágenes proporcionadas por el usuario
const DRESS_CODE_EXAMPLES = [
  '/images/dress-code/ejemplo-mujer-1.png', // Vestido largo rosa/magenta elegante
  '/images/dress-code/ejemplo-mujer-2.png', // Vestido largo azul real elegante
  '/images/dress-code/ejemplo-hombre-1.png' // Terno gris elegante
];

const EventPage: React.FC = () => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [daysLeft, setDaysLeft] = useState(0);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    ubicaciones: true,
    detalles: true,
    adicional: true
  });
  const [expandedQuestions, setExpandedQuestions] = useState<{ [key: string]: boolean }>({
    ninos: true,
    estacionamiento: true
  });

  useEffect(() => {
    loadEvent();
  }, []);

  useEffect(() => {
    if (event?.weddingDate) {
      calculateDaysLeft(event.weddingDate);
    }
  }, [event]);

  const loadEvent = async () => {
    try {
      const eventData = await apiService.getEvent();
      setEvent(eventData);
    } catch (error) {
      setError('Error al cargar la información del evento');
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (weddingDate: string) => {
    const wedding = new Date(weddingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    wedding.setHours(0, 0, 0, 0);
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(Math.max(0, diffDays));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleQuestion = (question: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [question]: !prev[question]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-12 bg-white">
        <p className="text-gray-500">{error || 'No se encontró información del evento'}</p>
      </div>
    );
  }

  const carouselImages = event.carouselImages && event.carouselImages.length > 0
    ? event.carouselImages
    : event.bannerImageUrl
    ? [event.bannerImageUrl]
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      {/* Hero Section con Carrusel */}
      {carouselImages.length > 0 && (
        <div className="mb-12">
          <ImageCarousel images={carouselImages} />
        </div>
      )}

      {/* Card combinado: Banner + Información del evento */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div 
          className="relative rounded-t-lg overflow-hidden"
          style={{
            backgroundImage: 'url(/images/Imagen.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Overlay sutil para mejorar legibilidad */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(0.5px)'
            }}
          />
          
          {/* Texto sobre la imagen */}
          <h1 
            className="relative z-10 text-4xl md:text-5xl px-4 py-6"
            style={{ 
              fontFamily: '"Playfair Display", "Cormorant Garamond", "Georgia", serif',
              fontWeight: 500,
              color: '#4A3728',
              letterSpacing: '0.08em',
              lineHeight: '1.3',
              fontStyle: 'normal',
              textShadow: '2px 2px 8px rgba(255, 255, 255, 0.8), 0px 0px 20px rgba(255, 255, 255, 0.6)'
            }}
          >
            {event.coupleNames.split('&').map((name, index, array) => (
              <React.Fragment key={index}>
                <span style={{ fontWeight: 500 }}>{name.trim()}</span>
                {index < array.length - 1 && (
                  <span className="mx-3" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400, fontSize: '0.9em' }}>
                    &amp;
                  </span>
                )}
              </React.Fragment>
            ))}
          </h1>
        </div>
        
        {/* Información del evento */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-gray-700 mb-3">
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-9 4h10m-9 4h10m-5-8v12" />
              </svg>
              <span className="text-xs md:text-sm">{formatDate(event.weddingDate)}</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs md:text-sm">{event.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="text-xs md:text-sm">{event.dressCode}</span>
            </div>
          </div>
          <div className="flex items-center justify-center pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-600 mr-2">Faltan</span>
            <div className="flex gap-1.5">
              <div className="bg-purple-100 border-2 border-purple-300 rounded-lg px-3 py-1.5">
                <span className="text-xl font-bold text-purple-700">{Math.floor(daysLeft / 10)}</span>
              </div>
              <div className="bg-purple-100 border-2 border-purple-300 rounded-lg px-3 py-1.5">
                <span className="text-xl font-bold text-purple-700">{daysLeft % 10}</span>
              </div>
            </div>
            <span className="text-xs text-gray-600 ml-2">Días</span>
          </div>
        </div>
      </div>

      {/* Sección: Ubicaciones - Ceremonia y Recepción */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('ubicaciones')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'serif' }}>
            Ubicaciones
          </h2>
          <svg
            className={`w-6 h-6 text-gray-400 transition-transform ${expandedSections.ubicaciones ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.ubicaciones && (
          <div className="px-6 pb-6 pt-4">
            {/* Texto descriptivo */}
            <div className="mb-6">
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                Hemos elegido la Parroquia Virgen de Fátima para nuestra ceremonia religiosa por su significado especial y su ubicación. 
                Les pedimos puntualidad para que podamos comenzar a tiempo.
              </p>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                Les pedimos acompañarnos a Casona Clark, lugar donde se realizará la ceremonia civil auspiciada por la Municipalidad de Miraflores; para ser legalmente esposos.
              </p>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                Luego, pasaremos a celebrar con música y mucho baile <strong className="text-gray-900">(PROHIBIDO QUEDARSE SENTADO)</strong>
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Esperamos que disfruten de todo lo que hemos preparado con mucho cariño y dedicación, para que vivan junto a nosotros una noche inolvidable.
              </p>
            </div>

            {/* Mapas con información lado a lado */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Ceremonia - Izquierda */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
                {/* Información de fecha y hora - Estética mejorada */}
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Ceremonia Religiosa</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-pink-50 rounded-full p-1.5 mr-2 flex-shrink-0">
                        <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-9 4h10m-9 4h10m-5-8v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha</p>
                        <p className="text-sm font-medium text-gray-900">{CEREMONY_LOCATION.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-pink-50 rounded-full p-1.5 mr-2 flex-shrink-0">
                        <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Hora</p>
                        <p className="text-sm font-medium text-gray-900">{CEREMONY_LOCATION.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mapa */}
                <div className="flex-1">
                  <MapWithMarker
                    address={CEREMONY_LOCATION.address}
                    mapEmbedUrl={CEREMONY_LOCATION.mapEmbedUrl}
                    locationName={CEREMONY_LOCATION.name}
                    locationReference={`${CEREMONY_LOCATION.name} - Miraflores`}
                    googleMapsUrl={CEREMONY_LOCATION.googleMapsUrl}
                    wazeUrl={CEREMONY_LOCATION.wazeUrl}
                  />
                </div>
              </div>

              {/* Ceremonia Civil y Recepción - Derecha */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
                {/* Información de fecha y hora - Estética mejorada */}
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Ceremonia Civil y Recepción</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-pink-50 rounded-full p-1.5 mr-2 flex-shrink-0">
                        <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-9 4h10m-9 4h10m-5-8v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha</p>
                        <p className="text-sm font-medium text-gray-900">{RECEPTION_LOCATION.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-pink-50 rounded-full p-1.5 mr-2 flex-shrink-0">
                        <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Hora</p>
                        <p className="text-sm font-medium text-gray-900">{RECEPTION_LOCATION.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mapa */}
                <div className="flex-1">
                  <MapWithMarker
                    address={RECEPTION_LOCATION.address}
                    mapEmbedUrl={RECEPTION_LOCATION.mapEmbedUrl}
                    locationName={RECEPTION_LOCATION.name}
                    locationReference={`${RECEPTION_LOCATION.name} - Santiago de Surco`}
                    googleMapsUrl={RECEPTION_LOCATION.googleMapsUrl}
                    wazeUrl={RECEPTION_LOCATION.wazeUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección: Más detalles del evento */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('detalles')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'serif' }}>
            Más detalles del evento
          </h2>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.detalles ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.detalles && (
          <div className="px-4 pb-4 pt-3">
            {/* Dress Code */}
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Dress Code</h3>
              <div className="flex flex-col md:flex-row gap-3">
                {/* Descripción a la izquierda */}
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-700 mb-2 text-sm">
                    <strong>Tipo de vestimenta:</strong> {event.dressCode}
                  </p>
                  <div className="text-gray-700 mb-2 text-sm">
                    <p className="mb-1"><strong>Información adicional:</strong></p>
                    <div className="ml-3 space-y-1">
                      <p className="text-xs"><strong>Mujeres:</strong> Vestido largo sin estampados, evitemos el color blanco, crema, nude, dorado y plateado.</p>
                      <p className="text-xs"><strong>Hombres:</strong> Terno y zapatos, evitemos el color azul oscuro.</p>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 italic">
                      *Se limitará el ingreso a las personas que no cumplan con el dress code
                    </p>
                  </div>
                </div>

                {/* Slider de ejemplos a la derecha */}
                <div className="w-full md:w-64 flex-shrink-0">
                  <DressCodeSlider images={DRESS_CODE_EXAMPLES} />
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Información de contacto</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700 mb-1 text-sm">
                  <strong>Vive tu boda - Wedding Planner</strong>
                </p>
                <div className="flex items-center text-gray-700 text-sm">
                  <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span><strong>WhatsApp o número de teléfono:</strong> 919573907</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección: Información adicional */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('adicional')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'serif' }}>
            Información adicional
          </h2>
          <svg
            className={`w-6 h-6 text-gray-400 transition-transform ${expandedSections.adicional ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.adicional && (
          <div className="px-6 pb-6 pt-4">
            <div className="space-y-0">
              <div className="border-b border-gray-200 pb-4">
                <button 
                  onClick={() => toggleQuestion('ninos')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-gray-900 font-medium">¿Pueden asistir niños al evento?</span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedQuestions.ninos ? 'transform rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedQuestions.ninos && (
                  <p className="text-gray-700 mt-3 ml-0">
                    Para esta ocasión especial, hemos decidido que el evento sea únicamente para adultos.
                  </p>
                )}
              </div>
              <div className="border-b border-gray-200 pb-4">
                <button 
                  onClick={() => toggleQuestion('estacionamiento')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-gray-900 font-medium">¿Habrá estacionamiento disponible?</span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedQuestions.estacionamiento ? 'transform rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedQuestions.estacionamiento && (
                  <p className="text-gray-700 mt-3 ml-0">
                    El lugar donde se llevará a cabo la recepción no cuenta con estacionamiento disponible.
                  </p>
                )}
              </div>
            </div>
            {event.additionalInfo && (
              <div className="mt-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.additionalInfo}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;
