import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

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
}

const EventPage: React.FC = () => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [daysLeft, setDaysLeft] = useState(0);

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
    // Resetear horas para comparar solo fechas
    today.setHours(0, 0, 0, 0);
    wedding.setHours(0, 0, 0, 0);
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(Math.max(0, diffDays));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error || 'No se encontró información del evento'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {event.title}
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          {event.coupleNames}
        </p>
      </div>

      {/* Información del evento */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Fecha y lugar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-9 4h10m-9 4h10m-5-8v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium">
                  {new Date(event.weddingDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lugar</p>
                <p className="font-medium">{event.location}</p>
                {event.address && (
                  <p className="text-sm text-gray-600">{event.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contador de días */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-pink-600 mb-2">
              {daysLeft > 0 ? daysLeft : 0}
            </div>
            <p className="text-gray-600 mb-4">
              {daysLeft === 1 ? 'Día' : 'Días'} faltantes
            </p>
            <p className="text-sm text-gray-500">
              {daysLeft > 0 ? '¡Estamos contando los días!' : '¡El día llegó!'}
            </p>
          </div>
        </div>
      </div>

      {/* Dress Code */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Dress Code</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Tipo de Vestimenta</h4>
            <p className="text-gray-600">{event.dressCode}</p>
          </div>
          {event.dressCodeDescription && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Información Adicional</h4>
              <p className="text-gray-600">{event.dressCodeDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      {event.additionalInfo && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Información Adicional</h3>
          <p className="text-gray-600">{event.additionalInfo}</p>
        </div>
      )}
    </div>
  );
};

export default EventPage;
