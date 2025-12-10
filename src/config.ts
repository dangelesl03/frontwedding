export const config = {
  API_URL: process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://backwedding.vercel.app/api'  // URL del backend en producción
      : 'http://localhost:5000/api')  // URL local para desarrollo
};
