import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AlertProvider } from './contexts/AlertContext';
import Login from './components/Login';
import Navigation from './components/Navigation';
import EventPage from './pages/EventPage';
import GiftsPage from './pages/GiftsPage';
import ReportsPage from './pages/ReportsPage';
import Cart from './components/Cart';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('evento');
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <AlertProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="py-8">
              {activeTab === 'evento' && <EventPage />}
              {activeTab === 'regalos' && <GiftsPage />}
              {activeTab === 'reportes' && <ReportsPage />}
            </main>

          <Cart />
        </div>
      </CartProvider>
    </AlertProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
