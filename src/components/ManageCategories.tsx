import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useAlert } from '../contexts/AlertContext';
import ConfirmDialog from './ConfirmDialog';

interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const ManageCategories: React.FC = () => {
  const { showAlert } = useAlert();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getCategories(true); // Incluir inactivas
      setCategories(data);
    } catch (error: any) {
      showAlert('error', 'Error al cargar las categorías');
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showAlert('warning', 'El nombre de la categoría es requerido');
      return;
    }

    setLoading(true);
    try {
      if (editingCategory) {
        await apiService.updateCategory(editingCategory.id.toString(), {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          isActive: formData.isActive
        });
        showAlert('success', 'Categoría actualizada exitosamente');
      } else {
        await apiService.createCategory({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          isActive: formData.isActive
        });
        showAlert('success', 'Categoría creada exitosamente');
      }
      
      setShowAddForm(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', isActive: true });
      loadCategories();
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al guardar la categoría';
      showAlert('error', errorMessage);
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.is_active
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', isActive: true });
  };

  const handleDeleteClick = (categoryId: number) => {
    setDeletingCategory(categoryId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;

    try {
      await apiService.deleteCategory(deletingCategory.toString());
      showAlert('success', 'Categoría eliminada exitosamente');
      setShowDeleteDialog(false);
      setDeletingCategory(null);
      loadCategories();
    } catch (error: any) {
      showAlert('error', error?.message || 'Error al eliminar la categoría');
      console.error('Error deleting category:', error);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aqua-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Gestionar Categorías</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-aqua-600 text-white rounded-md hover:bg-aqua-700 transition-colors font-medium"
          >
            + Agregar Categoría
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aqua-500"
                placeholder="Ej: Electrónica"
              />
            </div>

            <div>
              <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="category-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aqua-500"
                placeholder="Descripción opcional de la categoría"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Categoría activa (visible para los usuarios)</span>
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-aqua-600 text-white rounded-md hover:bg-aqua-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Guardando...' : editingCategory ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Lista de categorías */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay categorías registradas</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    {!category.is_active && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Inactiva</span>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  )}
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category.id)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    Eliminar
                  </button>
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
        message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer. Si hay regalos usando esta categoría, no se podrá eliminar."
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setDeletingCategory(null);
        }}
      />
    </div>
  );
};

export default ManageCategories;
