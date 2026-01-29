import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useAlert } from '../contexts/AlertContext';
import EditGiftForm from './EditGiftForm';
import ConfirmDialog from './ConfirmDialog';

interface Gift {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category: string;
  available: number;
  total: number;
  imageUrl?: string;
  isActive?: boolean;
  isContributed?: boolean;
  total_contributed?: number;
}

const ManageGifts: React.FC = () => {
  const { showAlert } = useAlert();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [deletingGift, setDeletingGift] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Todas las categorías');
  const [searchTerm, setSearchTerm] = useState('');

  const [categories, setCategories] = useState<string[]>(['Todas las categorías']);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiService.getCategories();
        setCategories(['Todas las categorías', ...data.map((cat: any) => cat.name)]);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback a categorías por defecto
        setCategories(['Todas las categorías', 'Luna de Miel', 'Arte y Deco', 'Otro']);
      }
    };
    loadCategories();
  }, []);

  const loadGifts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getGifts();
      setGifts(data);
    } catch (error: any) {
      showAlert('error', 'Error al cargar los regalos');
      console.error('Error loading gifts:', error);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadGifts();
  }, [loadGifts]);

  const handleEdit = (gift: Gift) => {
    setEditingGift(gift);
  };

  const handleCancelEdit = () => {
    setEditingGift(null);
  };

  const handleSaveSuccess = () => {
    setEditingGift(null);
    // Forzar recarga de regalos después de actualizar
    setTimeout(() => {
      loadGifts();
    }, 100);
  };

  const handleDeleteClick = (giftId: string) => {
    setDeletingGift(giftId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingGift) return;

    try {
      await apiService.deleteGift(deletingGift);
      showAlert('success', 'Regalo eliminado exitosamente');
      setShowDeleteDialog(false);
      setDeletingGift(null);
      loadGifts();
    } catch (error: any) {
      showAlert('error', error?.message || 'Error al eliminar el regalo');
      console.error('Error deleting gift:', error);
    }
  };

  const filteredGifts = gifts.filter(gift => {
    const matchesCategory = filterCategory === 'Todas las categorías' || gift.category === filterCategory;
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (gift.description && gift.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (editingGift) {
    return (
      <EditGiftForm
        gift={editingGift}
        onSuccess={handleSaveSuccess}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Gestionar Regalos</h2>
        
        {/* Filtros */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Total de regalos: <strong>{filteredGifts.length}</strong>
        </div>
      </div>

      {/* Lista de regalos */}
      <div className="space-y-4">
        {filteredGifts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No se encontraron regalos</p>
          </div>
        ) : (
          filteredGifts.map((gift) => (
            <div
              key={gift._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {/* Imagen */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {gift.imageUrl ? (
                    <img
                      src={gift.imageUrl.includes('data:') ? gift.imageUrl : `${gift.imageUrl}?v=${gift._id}`}
                      alt={gift.name}
                      className="w-full h-full object-cover"
                      key={`${gift._id}-${gift.imageUrl?.substring(0, 50)}`} // Forzar re-render cuando cambia la imagen
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {gift.name}
                        {!gift.isActive && (
                          <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Inactivo</span>
                        )}
                      </h3>
                      {gift.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{gift.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span><strong>Precio:</strong> {gift.currency} {gift.price.toFixed(2)}</span>
                        <span><strong>Categoría:</strong> {gift.category}</span>
                        <span><strong>Disponible:</strong> {gift.available} / {gift.total}</span>
                        {gift.total_contributed !== undefined && (
                          <span><strong>Contribuido:</strong> S/ {gift.total_contributed.toFixed(2)}</span>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(gift)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(gift._id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este regalo? Esta acción no se puede deshacer."
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setDeletingGift(null);
        }}
      />
    </div>
  );
};

export default ManageGifts;
