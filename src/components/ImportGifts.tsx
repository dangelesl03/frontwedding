import React, { useState } from 'react';
import { apiService } from '../services/api';
import { useAlert } from '../contexts/AlertContext';

interface ImportGiftsProps {
  onSuccess?: () => void;
}

interface ImportResult {
  message: string;
  results: {
    created: number;
    skipped: number;
    errors: string[];
  };
}

const ImportGifts: React.FC<ImportGiftsProps> = ({ onSuccess }) => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [importMethod, setImportMethod] = useState<'url' | 'csv'>('csv');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        showAlert('warning', 'Por favor selecciona un archivo CSV');
        return;
      }
      setCsvFile(file);
    }
  };

  const loadDefaultCSV = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Intentar cargar el CSV desde public/images/regalos.csv
      const response = await fetch('/images/regalos.csv');
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo CSV por defecto');
      }
      const csvContent = await response.text();
      
      const importResponse = await apiService.importGiftsFromCSV(
        csvContent,
        category || undefined,
        undefined,
        '/images' // Base URL para imágenes públicas
      );
      setResult(importResponse);
      
      if (importResponse.results.created > 0) {
        showAlert('success', `Se importaron ${importResponse.results.created} regalo(s) exitosamente`);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        showAlert('warning', 'No se pudieron importar regalos. Verifica el formato del CSV.');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al cargar el CSV por defecto';
      showAlert('error', errorMessage);
      console.error('Error loading default CSV:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVImport = async () => {
    if (!csvFile) {
      showAlert('warning', 'Por favor selecciona un archivo CSV');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csvContent = e.target?.result as string;
          const response = await apiService.importGiftsFromCSV(
            csvContent,
            category || undefined,
            undefined,
            '/images' // Base URL para imágenes públicas
          );
          setResult(response);
          
          if (response.results.created > 0) {
            showAlert('success', `Se importaron ${response.results.created} regalo(s) exitosamente`);
            if (onSuccess) {
              onSuccess();
            }
          } else {
            showAlert('warning', 'No se pudieron importar regalos. Verifica el formato del CSV.');
          }
        } catch (error: any) {
          const errorMessage = error?.message || 'Error al importar regalos desde CSV';
          showAlert('error', errorMessage);
          console.error('Error importing gifts from CSV:', error);
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        showAlert('error', 'Error al leer el archivo CSV');
        setLoading(false);
      };
      reader.readAsText(csvFile);
    } catch (error: any) {
      showAlert('error', 'Error al procesar el archivo CSV');
      setLoading(false);
    }
  };

  const handleURLImport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      showAlert('warning', 'Por favor ingresa una URL');
      return;
    }

    // Validar que sea una URL válida
    try {
      new URL(url);
    } catch {
      showAlert('warning', 'Por favor ingresa una URL válida');
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const response = await apiService.importGiftsFromUrl(url.trim(), category || undefined);
      setResult(response);
      
      if (response.results.created > 0) {
        showAlert('success', `Se importaron ${response.results.created} regalo(s) exitosamente`);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        showAlert('warning', 'No se pudieron importar regalos. Verifica la URL y el formato de los datos.');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al importar regalos';
      showAlert('error', errorMessage);
      console.error('Error importing gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Importar Regalos</h2>
      
      {/* Selector de método */}
      <div className="mb-6 flex space-x-4 border-b border-gray-200 pb-4">
        <button
          type="button"
          onClick={() => setImportMethod('csv')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            importMethod === 'csv'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Desde CSV
        </button>
        <button
          type="button"
          onClick={() => setImportMethod('url')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            importMethod === 'url'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Desde URL
        </button>
      </div>

      {importMethod === 'csv' ? (
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">
            Selecciona un archivo CSV con la lista de regalos. El CSV debe tener las columnas: 
            <code className="bg-gray-100 px-1 rounded">numero</code>, 
            <code className="bg-gray-100 px-1 rounded">titulo</code>, 
            <code className="bg-gray-100 px-1 rounded">precio</code>, 
            <code className="bg-gray-100 px-1 rounded">imagen_local</code>
          </p>

          {/* Botón para cargar CSV por defecto */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 mb-2">
              💡 <strong>Opción rápida:</strong> Puedes importar directamente desde el CSV que está en <code className="bg-white px-1 rounded">public/images/regalos.csv</code>
            </p>
            <button
              type="button"
              onClick={loadDefaultCSV}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {loading ? 'Cargando...' : '📁 Cargar CSV por defecto'}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-4">O selecciona un archivo CSV personalizado:</p>

            <div>
              <label htmlFor="csv-file" className="block text-sm font-medium text-gray-700 mb-2">
                Archivo CSV
              </label>
              <input
                type="file"
                id="csv-file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={loading}
              />
              {csvFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Archivo seleccionado: <strong>{csvFile.name}</strong> ({(csvFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <div>
              <label htmlFor="csv-category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría (opcional)
              </label>
              <input
                type="text"
                id="csv-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: El Gran día"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={loading}
              />
            </div>

            <button
              type="button"
              onClick={handleCSVImport}
              disabled={loading || !csvFile}
              className="w-full px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Importando...' : 'Importar desde CSV'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-6">
            Ingresa la URL de una página que contenga una lista de regalos. El sistema intentará extraer 
            automáticamente la información de los regalos (nombre, precio, descripción, imagen).
          </p>

          <form onSubmit={handleURLImport} className="space-y-4">
        <div>
          <label htmlFor="import-url" className="block text-sm font-medium text-gray-700 mb-2">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="import-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://ejemplo.com/regalos"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            La URL debe contener datos de regalos en formato JSON o HTML estructurado
          </p>
        </div>

        <div>
          <label htmlFor="import-category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoría (opcional)
          </label>
          <input
            type="text"
            id="import-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ej: Luna de Miel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Si se especifica, todos los regalos importados se asignarán a esta categoría
          </p>
        </div>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="w-full px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Importando...' : 'Importar Regalos'}
            </button>
          </form>
        </div>
      )}

      {result && (
        <div className={`mt-6 p-4 rounded-lg ${
          result.results.created > 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <h3 className="font-semibold text-gray-900 mb-2">Resultado de la importación:</h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">
              <strong>✅ Creados:</strong> {result.results.created}
            </p>
            <p className="text-gray-700">
              <strong>⏭️ Omitidos:</strong> {result.results.skipped}
            </p>
            {result.results.errors.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-gray-900 mb-1">Errores:</p>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                  {result.results.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {result.results.errors.length > 5 && (
                    <li>... y {result.results.errors.length - 5} más</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Notas:</h3>
        {importMethod === 'csv' ? (
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>El CSV debe tener las columnas: <code>numero</code>, <code>titulo</code>, <code>precio</code>, <code>imagen_local</code></li>
            <li>Las imágenes deben estar en <code>public/images/imagenes_regalos/</code></li>
            <li>Los regalos duplicados (mismo nombre) se omitirán automáticamente</li>
            <li>Si especificas una categoría, todos los regalos se asignarán a esa categoría</li>
          </ul>
        ) : (
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>El sistema busca datos en formato JSON o HTML estructurado</li>
            <li>Los regalos duplicados (mismo nombre) se omitirán automáticamente</li>
            <li>Si la página usa carga infinita (scroll), es posible que necesites proporcionar la URL de la API directamente</li>
            <li>Las imágenes deben tener URLs absolutas para funcionar correctamente</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ImportGifts;
