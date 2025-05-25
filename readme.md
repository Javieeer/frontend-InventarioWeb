# Inventario EB

Sistema web de inventario para la Salsamentaria Bedoya, desarrollado con React, Vite y Supabase.

## Características

- **Autenticación de usuarios** (admin y empleados)
- **Gestión de empleados**: crear, editar, eliminar y buscar empleados (solo admin)
- **Gestión de productos**: crear, editar, eliminar, buscar y actualizar stock de productos
- **Configuración de perfil**: edición de datos personales y contraseña
- **Notificaciones** mediante Snackbar
- **Interfaz moderna** con Material UI

## Estructura del proyecto

├── public # Archivos estáticos (favicon, etc.)\
├── src/\
├ ├── components/ # Componentes reutilizables (menú lateral, saludo)\
├ ├── context/ # Contextos de autenticación y mensajes 
├ ├── pages/ # Vistas principales (dashboard, empleados, productos, login, perfil)\
├ ├── styles/ # Archivos de estilos (CSS y JS)\
├ ├── app.jsx # Componente principal de rutas\
├ └── main.jsx # Punto de entrada de React\
├── supabaseClient.js # Configuración de Supabase\
├── index.html # HTML principal\
├── package.json # Dependencias y scripts\
├── vite.config.js # Configuración de Vite


## Instalación

1. Clona el repositorio y entra al directorio `frontend`:

   ```sh
   git clone <repo-url>
   cd frontend
2. Instala las dependencias:

    ```sh
    npm install
3. Configura las variables de entorno en .env (ya incluido un ejemplo):

    ```sh
    VITE_SUPABASE_URL=...
    VITE_SUPABASE_ANON_KEY=...
    VITE_API_URL=...
4. Inicia el servidor de desarrollo:

    ```sh
    npm run dev
5. Accede a http://localhost:5173 en tu navegador.

## Dependencias principales

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [Material UI](https://mui.com/)
- [React Router DOM](https://reactrouter.com/)

## Notas

- Solo los usuarios con rol admin pueden gestionar empleados y ver precios de compra.
- El backend para algunas operaciones (como eliminar usuarios) está definido en la variable VITE_API_URL.

---
Desarrollado por Javier Zapata.