import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import AddGiftForm from '../components/AddGiftForm';
import ManageGifts from '../components/ManageGifts';
import ManageCategories from '../components/ManageCategories';
import ManageUsers from '../components/ManageUsers';
import ImportGifts from '../components/ImportGifts';
import ConfirmDialog from '../components/ConfirmDialog';
import { apiService } from '../services/api';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [activeSection, setActiveSection] = useState<'add-gift' | 'manage-gifts' | 'gift-cards' | 'categories' | 'users' | 'import'>('add-gift');
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Verificar si es admin
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Acceso Denegado</h2>
          <p className="text-red-600">Solo los administradores pueden acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  const handleGiftCreated = () => {
    showAlert('success', 'Regalo creado exitosamente. Puedes verlo en la sección de Regalos.');
  };

  const handleCreateGiftCardsClick = () => {
    setShowConfirmDialog(true);
  };

  const handleCreateGiftCards = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    try {
      // Configuración de gift cards desde el backend
      const giftCardConfig = {
        amounts: [200, 400, 600],
        quantities: {
          200: 15,
          400: 10,
          600: 5
        },
        themes: [
          { name: 'Fútbol', emoji: '⚽', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { name: 'Hello Kitty', emoji: '🎀', imageUrl: 'https://cdn.pixabay.com/photo/2016/03/28/12/35/cat-1285341_1280.jpg' },
          { name: 'Avengers', emoji: '🦸', imageUrl: 'https://images.unsplash.com/photo-1618945372299-c952c377ed44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { name: 'Star Wars', emoji: '⭐', imageUrl: 'https://images.unsplash.com/photo-1472457847783-3d10540b03d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { name: 'Derecho', emoji: '⚖️', imageUrl: 'https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' }
        ]
      };

      const response = await apiService.createGiftCards(giftCardConfig);

      showAlert('success', `Se crearon ${response.created} gift cards exitosamente.`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al crear las gift cards';
      showAlert('error', errorMessage);
      console.error('Error creating gift cards:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Gestiona regalos y gift cards
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveSection('add-gift')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'add-gift'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Agregar Regalo
          </button>
          <button
            onClick={() => setActiveSection('manage-gifts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'manage-gifts'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Gestionar Regalos
          </button>
          <button
            onClick={() => setActiveSection('gift-cards')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'gift-cards'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Gift Cards
          </button>
          <button
            onClick={() => setActiveSection('categories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'categories'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Categorías
          </button>
          <button
            onClick={() => setActiveSection('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'users'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveSection('import')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'import'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Importar Regalos
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeSection === 'add-gift' && (
        <AddGiftForm onSuccess={handleGiftCreated} />
      )}

      {activeSection === 'manage-gifts' && (
        <ManageGifts />
      )}

      {activeSection === 'gift-cards' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Crear Gift Cards</h2>
          <p className="text-gray-600 mb-6">
            Crea gift cards automáticamente con las configuraciones predefinidas:
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Configuración:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• <strong>S/ 200:</strong> 15 unidades (3 por cada tema)</li>
              <li>• <strong>S/ 400:</strong> 10 unidades (2 por cada tema)</li>
              <li>• <strong>S/ 600:</strong> 5 unidades (1 por cada tema)</li>
              <li className="mt-3"><strong>Temas:</strong> Fútbol ⚽, Hello Kitty 🎀, Avengers 🦸, Star Wars ⭐, Derecho ⚖️</li>
            </ul>
          </div>

          <button
            onClick={handleCreateGiftCardsClick}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Creando Gift Cards...' : 'Crear Gift Cards'}
          </button>

          <p className="mt-4 text-xs text-gray-500">
            Nota: Las gift cards se crearán según la configuración en <code className="bg-gray-100 px-1 rounded">backend/gift-cards-config.js</code>
          </p>
        </div>
      )}

      {activeSection === 'categories' && (
        <ManageCategories />
      )}

      {activeSection === 'users' && (
        <ManageUsers />
      )}

      {activeSection === 'import' && (
        <ImportGifts onSuccess={() => {
          showAlert('success', 'Regalos importados exitosamente. Puedes verlos en la sección de Regalos.');
        }} />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirmar Creación de Gift Cards"
        message="¿Estás seguro de crear las gift cards configuradas? Esto creará múltiples regalos en la base de datos."
        confirmText="Sí, Crear"
        cancelText="Cancelar"
        onConfirm={handleCreateGiftCards}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </div>
  );
};

export default AdminPage;
