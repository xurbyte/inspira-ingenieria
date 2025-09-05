# Configuración de Cloudinary

## Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env.local` (desarrollo) y en Vercel (producción):

```env
# Autenticación Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=asdasd123

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

## Pasos para Configurar Cloudinary

### 1. Crear Cuenta en Cloudinary
1. Ve a [https://cloudinary.com/](https://cloudinary.com/)
2. Regístrate con tu email
3. Verifica tu cuenta

### 2. Obtener Credenciales
1. En el Dashboard de Cloudinary, ve a "Settings" → "API Keys"
2. Copia los siguientes valores:
   - **Cloud Name**: Tu nombre de cloud único
   - **API Key**: Tu clave API pública
   - **API Secret**: Tu clave API secreta

### 3. Configurar Variables de Entorno

#### Para Desarrollo Local:
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega las variables mostradas arriba con tus valores reales

#### Para Producción (Vercel):
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega cada variable una por una:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY` 
   - `CLOUDINARY_API_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`

### 4. Funcionalidades Implementadas

- ✅ Subida automática a Cloudinary en producción
- ✅ Fallback a almacenamiento local en desarrollo
- ✅ Optimización automática de imágenes (calidad y formato)
- ✅ Redimensionamiento automático (máx. 1200x800px)
- ✅ Organización por carpetas: `inspira-ingenieria/{categoria}/{proyecto-id}/{tipo}`
- ✅ Validación de tamaño (máx. 5MB por archivo, 10MB total)
- ✅ Validación de tipos (JPEG, PNG, WebP)

### 5. Estructura de Carpetas en Cloudinary

```
inspira-ingenieria/
├── Vivienda/
│   └── proyecto-id/
│       ├── portada/
│       └── adentro/
├── Nave industrial/
│   └── proyecto-id/
│       ├── portada/
│       └── adentro/
└── Funcional/
    └── proyecto-id/
        ├── portada/
        └── adentro/
```

## Límites del Plan Gratuito de Cloudinary

- **Almacenamiento**: 25 GB
- **Ancho de banda**: 25 GB/mes
- **Transformaciones**: 25,000/mes
- **Imágenes**: Ilimitadas

Esto debería ser suficiente para la mayoría de proyectos pequeños a medianos.
