import React, { createContext, useContext, useState, ReactNode } from 'react';
import Alert from '../components/Alert';

interface AlertContextType {
  showAlert: (type: 'success' | 'error' | 'info' | 'warning', message: string, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
  } | null>(null);

  const showAlert = (type: 'success' | 'error' | 'info' | 'warning', message: string, duration = 5000) => {
    setAlert({ type, message, duration });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}
    </AlertContext.Provider>
  );
};

