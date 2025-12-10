# Instrucciones para Configurar Información de Pago

## Configurar Datos de Pago

Para agregar tus datos reales de pago (Yape, Plin, cuenta bancaria), edita el archivo:

`frontend/src/components/PaymentModal.tsx`

Busca la sección `paymentInfo` (alrededor de la línea 16) y actualiza con tus datos:

```typescript
const paymentInfo = {
  yape: {
    number: 'TU_NUMERO_YAPE', // Ejemplo: '987654321'
    qr: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=yape://TU_NUMERO_YAPE'
  },
  plin: {
    number: 'TU_NUMERO_PLIN', // Ejemplo: '987654321'
    qr: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=plin://TU_NUMERO_PLIN'
  },
  bankAccount: {
    bank: 'TU_BANCO', // Ejemplo: 'BCP', 'BBVA', 'Interbank'
    account: 'TU_CUENTA', // Ejemplo: '191-12345678-0-00'
    cci: 'TU_CCI' // Ejemplo: '002-191-001234567890-00'
  }
};
```

## Generar QR Codes Reales

Para generar QR codes reales de Yape y Plin:

1. **Yape**: Abre la app de Yape, ve a tu perfil y genera tu código QR
2. **Plin**: Abre la app de Plin, ve a tu perfil y genera tu código QR
3. Sube las imágenes a un servicio de hosting (imgur, cloudinary, etc.)
4. Reemplaza las URLs en `paymentInfo`

O usa un servicio de generación de QR:
- https://www.qr-code-generator.com/
- Escanea tu código QR real y genera una URL

## Funcionalidad Implementada

✅ Modal de pago con QR de Yape y Plin
✅ Información de cuenta bancaria e interbancaria (CCI)
✅ Botón de confirmar que marca regalos como VENDIDOS
✅ Botón "Contribuir Parcialmente" ahora agrega al carrito
✅ Los regalos vendidos se muestran con etiqueta "VENDIDO"

## Flujo de Pago

1. Usuario agrega regalos al carrito
2. Usuario hace clic en "Proceder al Pago"
3. Se muestra modal con información de pago (QR codes, números, cuenta bancaria)
4. Usuario realiza el pago externamente
5. Usuario hace clic en "Confirmar Pago"
6. Los regalos se marcan como VENDIDOS en la base de datos
7. El carrito se limpia y la página se recarga

