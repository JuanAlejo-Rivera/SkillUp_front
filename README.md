# SkillUp - Plataforma de Capacitación Interna

## Descripción General
SkillUp es una plataforma web de capacitación interna diseñada para empresas. Permite a administradores, managers y usuarios gestionar cursos, departamentos, secciones y lecciones, facilitando el desarrollo profesional y la formación continua dentro de la organización.

## Características Principales
- **Gestión de Usuarios:**
  - Registro, inicio de sesión y recuperación de contraseña.
  - Protección de flujo mediante JWT para garantizar la seguridad.
- **Gestión de Cursos:**
  - Creación de cursos con descripciones detalladas.
  - Organización de cursos en secciones y lecciones.
- **Interfaz Moderna:**
  - Diseñada con TailwindCSS, incluye transiciones suaves, gradientes y un estilo visual atractivo.
- **Drag and Drop:**
  - Organización interactiva de secciones y lecciones utilizando la librería dnd-kit.

## Gestión de Roles
- Los administradores tienen acceso exclusivo a un modal dedicado para gestionar roles de usuario.
- Los roles determinan los permisos y accesos dentro de la plataforma.

## Organización de Cursos, Secciones y Lecciones
- Los cursos pueden contener múltiples secciones.
- Cada sección puede incluir varias lecciones.
- Las secciones y lecciones se pueden reorganizar fácilmente mediante drag and drop.

## Tecnologías Utilizadas
- **Frontend:** React, TypeScript, TailwindCSS.
- **Backend:** Node.js, Express.
- **Base de Datos:** MongoDB.
- **Autenticación:** JSON Web Tokens (JWT).
- **Interactividad:** dnd-kit para drag and drop.

## Vista Previa
SkillUp ofrece una interfaz moderna y responsiva que permite a los usuarios gestionar cursos y contenido de capacitación de manera eficiente. Los administradores pueden gestionar roles y departamentos desde modales dedicados, mientras que los usuarios disfrutan de una experiencia fluida y visualmente atractiva.

## Instalación y Ejecución
1. Clona este repositorio:
   ```bash
   git clone https://github.com/JuanAlejo-Rivera/SkillUp_front.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd SkillUp_front
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre tu navegador en `http://localhost:3000` para ver la aplicación.

## Estructura General del Proyecto
- **src/**
  - **api/**: Lógica para interactuar con el backend.
  - **components/**: Componentes reutilizables de la interfaz.
  - **hooks/**: Hooks personalizados para manejar lógica de estado.
  - **layouts/**: Diseños generales de la aplicación.
  - **types/**: Definiciones de tipos para TypeScript.
  - **utils/**: Funciones auxiliares y utilidades.
  - **views/**: Vistas principales de la aplicación.

## Notas Finales
SkillUp está diseñado para ser una solución integral de capacitación interna en empresas. Con su interfaz moderna y funcionalidades avanzadas, es ideal para organizaciones que buscan potenciar el aprendizaje y desarrollo profesional de sus equipos. 
