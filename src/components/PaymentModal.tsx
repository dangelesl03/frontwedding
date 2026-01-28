import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAlert } from '../contexts/AlertContext';
import { apiService } from '../services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { items, totalPrice, clearCart } = useCart();
  const { showAlert } = useAlert();
  const [isProcessing, setIsProcessing] = useState(false);

  // Información de pago
  // Función helper para obtener la URL del QR (intenta varias rutas)
  const getQRImage = (type: 'yape' | 'plin'): string => {
    // Intentar diferentes rutas posibles
    const paths = [
      `/qr-codes/${type}-qr.png`,
      `/qr-codes/${type}-qr.jpg`,
      `/qr-codes/${type}-qr.jpeg`,
      `/images/${type}-qr.png`,
      `/images/${type}-qr.jpg`
    ];
    
    // Por ahora usar las rutas públicas, puedes cambiar esto cuando subas las imágenes
    return paths[0]; // Retornar la primera ruta por defecto
  };

  const paymentInfo = {
    yape: {
      number: '986506367',
      qr: getQRImage('yape')
    },
    plin: {
      number: '986506367',
      qr: getQRImage('plin')
    },
    bankAccount: {
      bank: 'BCP',
      account: '191-12345678-0-00',
      cci: '002-191-001234567890-00'
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      // Obtener IDs de los regalos del carrito y los montos pagados
      const giftIds = items.map(item => item._id);
      const amounts = items.map(item => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        const quantity = item.quantity || 1;
        return price * quantity;
      });
      
      // Confirmar pago en el backend con los montos específicos
      await apiService.confirmPayment(
        giftIds,
        'Transferencia', // Puedes cambiar esto según el método seleccionado
        `Pago confirmado - ${new Date().toISOString()}`,
        amounts // Enviar los montos pagados
      );
      
      // Limpiar carrito después de confirmar
      clearCart();
      onConfirm();
      onClose();
      
      showAlert('success', '¡Pago confirmado! Tu contribución ha sido registrada. Gracias por tu aporte.', 4000);
      
      // Guardar la pestaña activa en localStorage antes de recargar
      // para mantener la pestaña de regalos después del reload
      localStorage.setItem('activeTab', 'regalos');
      
      // Recargar la página para actualizar el estado de los regalos después de un breve delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Error procesando pago:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al procesar el pago. Por favor intenta nuevamente.';
      showAlert('error', errorMessage, 6000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Información de Pago</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Resumen */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Resumen de tu compra:</h3>
            <div className="space-y-1">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>S/ {((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
              <span>Total:</span>
              <span>S/ {(typeof totalPrice === 'string' ? parseFloat(totalPrice) : totalPrice).toFixed(2)}</span>
            </div>
          </div>

          {/* Métodos de pago */}
          <div className="space-y-6">
            {/* Yape */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-2">YAPE</span>
                Número: {paymentInfo.yape.number}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="bg-white p-2 rounded border flex-shrink-0">
                  <img
                    src={paymentInfo.yape.qr}
                    alt="QR Yape"
                    className="w-40 h-40 object-contain"
                    onError={(e) => {
                      // Si la imagen no se encuentra, usar QR genérico
                      const target = e.target as HTMLImageElement;
                      target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentInfo.yape.number}&margin=10`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Escanea el código QR con la app de Yape o transfiere al número:
                  </p>
                  <p className="text-lg font-mono font-bold">{paymentInfo.yape.number}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(paymentInfo.yape.number);
                      alert('Número de Yape copiado al portapapeles');
                    }}
                    className="mt-2 text-sm text-pink-600 hover:text-pink-700"
                  >
                    📋 Copiar número
                  </button>
                </div>
              </div>
            </div>

            {/* Plin */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">PLIN</span>
                Número: {paymentInfo.plin.number}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="bg-white p-2 rounded border flex-shrink-0">
                  <img
                    src={paymentInfo.plin.qr}
                    alt="QR Plin"
                    className="w-40 h-40 object-contain"
                    onError={(e) => {
                      // Si la imagen no se encuentra, usar QR genérico
                      const target = e.target as HTMLImageElement;
                      target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentInfo.plin.number}&margin=10`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Escanea el código QR con la app de Plin o transfiere al número:
                  </p>
                  <p className="text-lg font-mono font-bold">{paymentInfo.plin.number}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(paymentInfo.plin.number);
                      alert('Número de Plin copiado al portapapeles');
                    }}
                    className="mt-2 text-sm text-pink-600 hover:text-pink-700"
                  >
                    📋 Copiar número
                  </button>
                </div>
              </div>
            </div>

            {/* Cuenta Bancaria */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Transferencia Bancaria</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Banco:</span>
                  <p className="font-semibold">{paymentInfo.bankAccount.bank}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Cuenta:</span>
                  <p className="font-mono font-semibold">{paymentInfo.bankAccount.account}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">CCI (Interbancario):</span>
                  <p className="font-mono font-semibold">{paymentInfo.bankAccount.cci}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(paymentInfo.bankAccount.cci);
                      alert('CCI copiado al portapapeles');
                    }}
                    className="mt-1 text-sm text-pink-600 hover:text-pink-700"
                  >
                    📋 Copiar CCI
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de confirmar */}
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
            >
              {isProcessing ? 'Procesando...' : '✓ Confirmar Pago'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Al confirmar, marcarás estos regalos como pagados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
