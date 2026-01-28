# 💍 WeddingGift - Frontend

Aplicación web React para gestionar regalos de boda. Permite a los invitados ver regalos, contribuir parcialmente y realizar pagos.

## 🛠️ Tecnologías

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Context API** - Gestión de estado (Autenticación, Carrito, Alertas)

## 📋 Requisitos Previos

- Node.js 16+ y npm
- Backend API corriendo (ver repositorio del backend)

## 🔧 Instalación

```bash
# Instalar dependencias
npm install
```

## ⚙️ Configuración

Crea un archivo `.env.local` en la raíz del frontend:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Para producción, configura la URL de tu backend desplegado:

```env
REACT_APP_API_URL=https://tu-backend.vercel.app/api
```

## 🚀 Ejecución

### Desarrollo
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Producción
```bash
npm run build
```

Los archivos de producción estarán en la carpeta `build/`

## 📦 Scripts Disponibles

- `npm start` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm test` - Ejecuta tests

## 🌐 Deployment en Vercel

1. Conecta tu repositorio a Vercel
2. Configura **Root Directory**: `frontend`
3. Framework Preset: **Create React App**
4. Build Command: `npm run build`
5. Output Directory: `build`
6. Agrega variable de entorno:
   - `REACT_APP_API_URL`: URL de tu backend desplegado
7. Deploy

## 📁 Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
│   ├── index.html
│   ├── images/          # Imágenes del evento
│   └── qr-codes/        # Códigos QR de pago
├── src/
│   ├── components/      # Componentes React
│   │   ├── Alert.tsx
│   │   ├── Cart.tsx
│   │   ├── DressCodeSlider.tsx
│   │   ├── ImageCarousel.tsx
│   │   ├── Login.tsx
│   │   ├── MapWithMarker.tsx
│   │   ├── Navigation.tsx
│   │   └── PaymentModal.tsx
│   ├── contexts/        # Context API
│   │   ├── AlertContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── pages/           # Páginas principales
│   │   ├── EventPage.tsx
│   │   ├── GiftsPage.tsx
│   │   └── ReportsPage.tsx
│   ├── services/        # Servicios API
│   │   └── api.ts       # Cliente API
│   ├── config.ts        # Configuración
│   └── App.tsx          # Componente principal
├── tailwind.config.js   # Configuración de Tailwind
└── tsconfig.json        # Configuración de TypeScript
```

## 🎨 Características

- **Página de Evento**: Información del evento, fecha y detalles
- **Lista de Regalos**: Visualización de regalos con imágenes y precios
- **Carrito de Compras**: Sistema de carrito para seleccionar múltiples regalos
- **Contribuciones Parciales**: Los invitados pueden contribuir montos parciales
- **Modal de Pago**: Información de pago (Yape, Plin, transferencias bancarias)
- **Panel de Reportes**: Visualización de contribuciones (requiere autenticación admin)

## 🔐 Autenticación

El frontend usa Context API para gestionar la autenticación. Los tokens JWT se almacenan en `localStorage`.

## 💳 Configuración de Pagos

Para configurar tus datos de pago (Yape, Plin, cuenta bancaria), edita:

`src/components/PaymentModal.tsx`

## 🔗 Conexión con Backend

El frontend se conecta al backend mediante la variable de entorno `REACT_APP_API_URL`. Asegúrate de que:

1. El backend esté corriendo y accesible
2. `REACT_APP_API_URL` apunte a la URL correcta del backend
3. El backend tenga CORS configurado para permitir requests del frontend

## 📝 Variables de Entorno

Las variables de React deben comenzar con `REACT_APP_` para ser accesibles en el código.

- `REACT_APP_API_URL` - URL del backend API

## 🐛 Solución de Problemas

- **Error de conexión al backend**: Verifica `REACT_APP_API_URL` en `.env.local`
- **Error de CORS**: Asegúrate de que el backend tenga configurado `FRONTEND_URL`
- **Problemas de build**: Verifica que todas las dependencias estén instaladas correctamente

## 📝 Licencia

Este proyecto es privado y está destinado para uso personal.

## 👥 Autores

Natalia & Daniel - Boda 28 de Marzo 2026
