import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useAlert } from '../contexts/AlertContext';
import { useAuth } from '../contexts/AuthContext';
import { config } from '../config';

interface Contribution {
  userId: string;
  username: string;
  amount: number;
  contributedAt: string;
  receiptFile?: string | null;
  note?: string | null;
}

interface GiftReport {
  giftId: string;
  giftName: string;
  giftPrice: number;
  isContributed: boolean;
  totalContributed: number;
  contributions: Contribution[];
}

const ReportsPage: React.FC = () => {
  const { showAlert } = useAlert();
  const { user } = useAuth();
  const [gifts, setGifts] = useState<GiftReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedGift, setExpandedGift] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // Verificar si es admin
  const isAdmin = user?.role === 'admin';

  const loadReports = useCallback(async () => {
    if (!isAdmin) return; // No cargar si no es admin
    
    try {
      setLoading(true);
      const data = await apiService.getContributionsReport();
      setGifts(data);
      setError('');
    } catch (error: any) {
      setError('Error al cargar los reportes');
      showAlert('error', `Error al cargar los reportes: ${error.message || 'Error desconocido'}`);
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  }, [showAlert, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadReports();
    }
  }, [loadReports, isAdmin]);

  // Verificar acceso después de los hooks
  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Acceso Denegado</h2>
          <p className="text-red-600">Solo los administradores pueden acceder a los reportes.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = (gift: GiftReport) => {
    if (gift.giftPrice === 0) return 0;
    return Math.min((gift.totalContributed / gift.giftPrice) * 100, 100);
  };

  const toggleExpand = (giftId: string) => {
    setExpandedGift(expandedGift === giftId ? null : giftId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reporte de Contribuciones
        </h1>
        <p className="text-gray-600">
          Detalle de aportes realizados a cada regalo
        </p>
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Resumen General</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-pink-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total de Regalos</p>
            <p className="text-2xl font-bold text-pink-600">{gifts.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Regalos Completados</p>
            <p className="text-2xl font-bold text-green-600">
              {gifts.filter(g => g.isContributed || g.totalContributed >= g.giftPrice).length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Contribuido</p>
            <p className="text-2xl font-bold text-blue-600">
              S/ {gifts.reduce((sum, g) => sum + g.totalContributed, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de regalos */}
      <div className="space-y-4">
        {gifts.map((gift) => (
          <div key={gift.giftId} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header del regalo */}
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand(gift.giftId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {gift.giftName}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Precio: <strong className="text-gray-900">S/ {gift.giftPrice.toFixed(2)}</strong></span>
                    <span>Contribuido: <strong className="text-gray-900">S/ {gift.totalContributed.toFixed(2)}</strong></span>
                    <span>Faltante: <strong className="text-gray-900">S/ {(gift.giftPrice - gift.totalContributed).toFixed(2)}</strong></span>
                  </div>
                  {/* Barra de progreso */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{Math.round(getProgressPercentage(gift))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${getProgressPercentage(gift)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-4">
                  {/* Estado */}
                  {gift.isContributed || gift.totalContributed >= gift.giftPrice ? (
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-semibold">
                      VENDIDO
                    </span>
                  ) : (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
                      Disponible
                    </span>
                  )}
                  {/* Icono de expandir */}
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${
                      expandedGift === gift.giftId ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Detalle de contribuciones (expandible) */}
            {expandedGift === gift.giftId && (
              <div className="border-t bg-gray-50">
                <div className="p-6">
                  {gift.contributions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>Este regalo aún no tiene contribuciones</p>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Contribuciones ({gift.contributions.length})
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Nota
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Monto
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Comprobante
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Fecha
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {gift.contributions.map((contribution, index) => {
                              // Construir URL del comprobante
                              let receiptUrl: string | null = null;
                              if (contribution.receiptFile) {
                                if (contribution.receiptFile.startsWith('http')) {
                                  // URL absoluta
                                  receiptUrl = contribution.receiptFile;
                                } else {
                                  // URL relativa - construir URL completa
                                  // En desarrollo, usar localhost:5000, en producción usar la URL del backend
                                  const isDevelopment = process.env.NODE_ENV === 'development';
                                  const baseUrl = isDevelopment 
                                    ? 'http://localhost:5000'
                                    : config.API_URL.replace('/api', '');
                                  receiptUrl = `${baseUrl}${contribution.receiptFile}`;
                                }
                              }
                              
                              return (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900">
                                      {contribution.note || contribution.username || 'Sin nota'}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-gray-900">
                                      S/ {contribution.amount.toFixed(2)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    {receiptUrl ? (
                                      <div className="flex items-center space-x-2">
                                        <img
                                          src={receiptUrl}
                                          alt="Comprobante"
                                          className="w-16 h-16 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity shadow-sm"
                                          onClick={() => receiptUrl && setSelectedReceipt(receiptUrl)}
                                          onError={(e) => {
                                            // Si la imagen falla, mostrar texto alternativo
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent && receiptUrl) {
                                              const link = document.createElement('a');
                                              link.href = receiptUrl;
                                              link.target = '_blank';
                                              link.className = 'text-pink-600 hover:text-pink-700 text-sm font-medium';
                                              link.textContent = 'Ver comprobante';
                                              parent.appendChild(link);
                                            }
                                          }}
                                        />
                                        <button
                                          onClick={() => receiptUrl && setSelectedReceipt(receiptUrl)}
                                          className="text-pink-600 hover:text-pink-700 text-xs font-medium"
                                        >
                                          Ver completo
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-sm text-gray-400 italic">Sin comprobante</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(contribution.contributedAt)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot className="bg-gray-100">
                            <tr>
                              <td colSpan={4} className="px-4 py-3 text-right">
                                <span className="text-sm font-semibold text-gray-900">
                                  Total: S/ {gift.totalContributed.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {gifts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay regalos para mostrar</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Modal para ver comprobante completo */}
      {selectedReceipt && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Comprobante de Pago</h3>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedReceipt}
                alt="Comprobante completo"
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const link = document.createElement('a');
                    link.href = selectedReceipt;
                    link.target = '_blank';
                    link.className = 'text-pink-600 hover:text-pink-700 text-lg font-medium block text-center py-8';
                    link.textContent = 'Ver comprobante en nueva ventana';
                    parent.appendChild(link);
                  }
                }}
              />
              <div className="mt-4 text-center">
                <a
                  href={selectedReceipt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                >
                  Abrir en nueva ventana
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;

