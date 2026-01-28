import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useAlert } from '../contexts/AlertContext';

interface Contribution {
  userId: string;
  username: string;
  amount: number;
  contributedAt: string;
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
  const [gifts, setGifts] = useState<GiftReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedGift, setExpandedGift] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
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
  }, [showAlert]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

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
                                Usuario
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Monto
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Fecha
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {gift.contributions.map((contribution, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center">
                                      <span className="text-pink-600 font-semibold text-sm">
                                        {contribution.username.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-gray-900">
                                        {contribution.username}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="text-sm font-semibold text-gray-900">
                                    S/ {contribution.amount.toFixed(2)}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(contribution.contributedAt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-100">
                            <tr>
                              <td colSpan={3} className="px-4 py-3 text-right">
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
    </div>
  );
};

export default ReportsPage;

