# Sistema de Nutrición Escolar - Vue.js 3

Sistema integral para la gestión nutricional en instituciones educativas, desarrollado con Vue.js 3, Vite, y cumpliendo con estándares de accesibilidad WCAG 2.1.

## 🚀 Características Implementadas

#### Características Generales
- ✅ **Responsive**: Totalmente adaptable a dispositivos móviles, tablets y desktop
- ✅ **Plantilla común**: Diseño unificado para todos los formularios
- ✅ **Cabecera completa**:
  - Logo y nombre del sistema
  - Barra de búsqueda global
  - Selector de idioma (Español/Inglés)
  - Indicador de formulario actual
  - Notificaciones
  - Menú de usuario

#### Menú y Navegación
- ✅ **Menú lateral expandible**: Se puede contraer/expandir
- ✅ **Iconos con textos**: Navegación visual mejorada
- ✅ **Atajos de menú**: Acceso rápido con teclado (Alt+H, Alt+F, etc.)
- ✅ **Submenús contextuales**: Navegación jerárquica
- ✅ **Submenú de accesibilidad**: Panel dedicado para opciones de accesibilidad

#### Cuerpo Principal
- ✅ **Bienvenida personalizada**: Según el rol del usuario
- ✅ **Novedades/noticias**: Sistema de notificaciones implementado
- ✅ **Ayuda contextual**: Disponible en cada sección
- ✅ **Modular adaptable**: Componentes reutilizables

#### Pie de Página
- ✅ **Información institucional**: Datos del sistema
- ✅ **Soporte/contacto**: Enlaces de ayuda y contacto
- ✅ **Política/términos de uso**: Enlaces a documentos legales

### 🔐 Sistema de Autenticación

- ✅ **Acceso al sistema (login)**: Formulario de inicio de sesión
- ✅ **Nuevo usuario**: Registro según perfil (admin, representante, nutricionista)
- ✅ **Ver/Editar perfil**: Gestión completa del perfil de usuario
- ✅ **Recuperar contraseña**: Flujo de recuperación por correo
- ✅ **Recordar usuario/sesión**: Opción "Recordarme"
- ✅ **Bloqueo temporal**: Después de 5 intentos fallidos (15 minutos)
- ✅ **Términos y política de privacidad**: Páginas dedicadas
- ✅ **Notificaciones seguras**: Sistema completo de alertas
- ✅ **Ayuda contextual**: En cada página
- ✅ **Tablas de usuarios (DB)**: Gestión completa de usuarios

### ♿ Accesibilidad (WCAG 2.1 Nivel AA)

- ✅ **Alto contraste**: Modo de contraste mejorado
- ✅ **Texto ampliado**: 3 niveles (Normal, Grande, Extra grande)
- ✅ **Lectura por voz**: Síntesis de voz con Web Speech API
- ✅ **Alertas visuales**: Indicadores adicionales para notificaciones
- ✅ **Atajos de teclado**: Navegación completa por teclado
- ✅ **ARIA labels**: Etiquetas semánticas completas
- ✅ **Focus visible**: Indicadores claros de enfoque

### 🌍 Internacionalización (i18n)

- ✅ Español (es) - Idioma por defecto
- ✅ Inglés (en) - Idioma alternativo
- ✅ Cambio dinámico de idioma
- ✅ Persistencia de preferencia

## 📦 Tecnologías Utilizadas

- **Vue.js 3** - Framework progresivo
- **Vite** - Build tool ultrarrápido
- **Vue Router 4** - Enrutamiento
- **Pinia** - Gestión de estado
- **Vue I18n** - Internacionalización
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Iconografía
- **Axios** - Cliente HTTP
- **VueUse** - Utilidades composables

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+ o superior
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**:
```powershell
npm install
```

2. **Iniciar servidor de desarrollo**:
```powershell
npm run dev
```

3. **Compilar para producción**:
```powershell
npm run build
```

4. **Previsualizar compilación**:
```powershell
npm run preview
```

## 🔑 Credenciales de Prueba

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`

### Representante
- **Usuario**: `representante`
- **Contraseña**: `rep123`

### Nutricionista
- **Usuario**: `nutricionista`
- **Contraseña**: `nutri123`

## 📁 Estructura del Proyecto

```
SISTEMA PARA NUTRICIÓN ESCOLAR/
├── src/
│   ├── assets/
│   │   └── css/
│   │       └── main.css
│   ├── components/
│   │   └── common/
│   │       ├── AppHeader.vue
│   │       ├── AppSidebar.vue
│   │       ├── AppFooter.vue
│   │       ├── AccessibilityPanel.vue
│   │       └── NotificationContainer.vue
│   ├── layouts/
│   │   ├── AdminLayout.vue
│   │   ├── UserLayout.vue
│   │   └── NutricionistaLayout.vue
│   ├── views/
│   │   ├── auth/
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   └── RecuperarContrasenaView.vue
│   │   ├── admin/
│   │   │   ├── DashboardView.vue
│   │   │   ├── EstudiantesView.vue
│   │   │   └── NutricionistasView.vue
│   │   └── usuario/
│   │       ├── InicioView.vue
│   │       └── PerfilView.vue
│   ├── stores/
│   │   ├── auth.js
│   │   ├── accessibility.js
│   │   └── notification.js
│   ├── locales/
│   │   ├── es.json
│   │   └── en.json
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Características Principales

### Sistema de Roles

El sistema maneja 3 roles principales:

1. **Administrador**: Gestión completa del sistema
2. **Nutricionista**: Gestión de menús y seguimiento
3. **Representante**: Visualización de información del estudiante

### Navegación Protegida

- Rutas protegidas por autenticación
- Guards de navegación por rol
- Redirección automática según permisos

### Sistema de Notificaciones

- Notificaciones toast personalizadas
- 4 tipos: Success, Error, Warning, Info
- Alertas visuales opcionales para accesibilidad
- Auto-dismiss configurable

### Panel de Accesibilidad

Acceso rápido con `Alt + A` o desde el header:
- Contraste alto
- Tamaño de texto ajustable
- Lectura por voz (Web Speech API)
- Alertas visuales
- Guía de atajos de teclado

## ⌨️ Atajos de Teclado

| Acción | Atajo |
|--------|-------|
| Ir a inicio | `Alt + H` |
| Buscar | `Alt + F` |
| Panel de accesibilidad | `Alt + A` |
| Ayuda | `F1` |
| Cerrar modal | `Esc` |

## 🔒 Seguridad

- Bloqueo temporal después de 5 intentos fallidos
- Tokens de sesión
- Validación de formularios
- Protección XSS en notificaciones
- Guards de navegación

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints de Bootstrap 5
- Menú lateral adaptativo
- Tablas responsivas

## 🌐 SEO y Accesibilidad

- Meta tags semánticos
- ARIA labels completos
- Navegación por teclado
- Landmarks HTML5
- Contraste WCAG 2.1 AA

## 🚧 Próximas Mejoras

- [ ] Integración con API backend real
- [ ] Sistema de caché con IndexedDB
- [ ] PWA capabilities
- [ ] Exportación de reportes PDF
- [ ] Chat en tiempo real con nutricionista
- [ ] Notificaciones push
- [ ] Dashboard con gráficos (Chart.js)
- [ ] Modo oscuro completo

## 📄 Licencia

Este proyecto es parte de un trabajo académico para la materia de Interfaz Humano-Computador.

## 👥 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte o consultas:
- Email: soporte@nutricionescolar.edu
- Teléfono: +593 99 999 9999

---

**Desarrollado con ❤️ para la comunidad educativa**
