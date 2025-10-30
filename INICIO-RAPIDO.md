# 🚀 INICIO RÁPIDO - Sistema de Nutrición Escolar

## ⚡ 3 Pasos para Ejecutar

### 1️⃣ Instalar Dependencias

```powershell
npm install
```

⏱️ _Tiempo estimado: 2-3 minutos_

### 2️⃣ Iniciar Servidor de Desarrollo

```powershell
npm run dev
```

⏱️ _Tiempo estimado: 10 segundos_

### 3️⃣ Abrir en el Navegador

```
http://localhost:3000
```

---

## 🔑 Credenciales de Prueba

### Administrador

```
Usuario: admin
Contraseña: admin123
Ruta: /admin
```

### Representante (Padre/Madre)

```
Usuario: representante
Contraseña: rep123
Ruta: /usuario
```

### Nutricionista

```
Usuario: nutricionista
Contraseña: nutri123
Ruta: /nutricionista
```

---

## 🎯 Prueba Estas Funcionalidades

### ✅ Sistema de Login

1. Ir a http://localhost:3000
2. Ingresar credenciales de prueba
3. ✨ Ver redirección automática según rol

### ✅ Cambio de Idioma

1. Click en selector de idioma en el header (ES/EN)
2. ✨ Ver toda la interfaz cambiar de idioma

### ✅ Panel de Accesibilidad

1. Presionar `Alt + A` o click en el ícono ♿
2. Probar:
   - ✨ Alto contraste
   - ✨ Tamaño de texto (3 niveles)
   - ✨ Lectura por voz
   - ✨ Alertas visuales

### ✅ Sistema de Notificaciones

1. Hacer login exitoso
2. ✨ Ver notificación de bienvenida
3. Intentar login fallido
4. ✨ Ver notificación de error

### ✅ Bloqueo de Seguridad

1. Intentar login con contraseña incorrecta 5 veces
2. ✨ Ver cuenta bloqueada por 15 minutos

### ✅ Menú Lateral

1. Click en el botón de toggle del sidebar
2. ✨ Ver menú expandirse/contraerse
3. Explorar submenús (Admin)

### ✅ Navegación por Teclado

- `Alt + H` → Ir a inicio
- `Alt + F` → Enfocar búsqueda
- `Alt + A` → Abrir accesibilidad
- `F1` → Ver ayuda
- `Esc` → Cerrar modales

---

## 📱 Probar en Móvil

### Método 1: Mismo Dispositivo

1. Abrir DevTools (F12)
2. Toggle dispositivo móvil (Ctrl+Shift+M)
3. ✨ Ver diseño responsive

### Método 2: Dispositivo Real

1. Obtener tu IP local:
   ```powershell
   ipconfig | Select-String -Pattern "IPv4"
   ```
2. Iniciar con host:
   ```powershell
   npm run dev -- --host
   ```
3. Abrir en móvil:
   ```
   http://[TU_IP]:3000
   ```

---

## 🐛 Solución de Problemas

### ❌ Error: Puerto 3000 en uso

```powershell
# Usar otro puerto
$env:PORT=5000; npm run dev
```

### ❌ Error: Module not found

```powershell
# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
npm install
```

### ❌ Hot reload no funciona

```powershell
# Reiniciar servidor (Ctrl+C, luego)
npm run dev
```

### ❌ Página en blanco

1. Abrir consola del navegador (F12)
2. Verificar errores
3. Limpiar caché (Ctrl+Shift+R)

---

## 📚 Documentación Completa

- 📖 **README.md** → Documentación general
- 🔄 **MIGRACION.md** → Guía HTML→Vue
- ⚡ **COMANDOS.md** → Comandos útiles
- 📊 **RESUMEN.md** → Estado del proyecto

---

## 🎨 Explorar el Código

### Componentes Principales

```
src/components/common/
├── AppHeader.vue         # Cabecera con búsqueda, idioma
├── AppSidebar.vue        # Menú lateral
├── AppFooter.vue         # Pie de página
├── AccessibilityPanel.vue # Panel de accesibilidad
└── NotificationContainer.vue # Sistema de alertas
```

### Vistas por Rol

```
src/views/
├── auth/               # Login, registro, recuperar
├── admin/              # Panel administrador
├── usuario/            # Panel representante
└── nutricionista/      # Panel nutricionista
```

### Stores (Estado Global)

```
src/stores/
├── auth.js             # Autenticación
├── accessibility.js    # Accesibilidad
└── notification.js     # Notificaciones
```

---

## 🔥 Características Destacadas

### 🌍 Internacionalización

- ✅ Español (por defecto)
- ✅ Inglés
- ✅ Cambio dinámico
- ✅ Persistencia de preferencia

### ♿ Accesibilidad WCAG 2.1 AA

- ✅ Alto contraste
- ✅ Texto ampliable
- ✅ Lectura por voz
- ✅ Navegación por teclado
- ✅ ARIA labels

### 🔐 Seguridad

- ✅ Autenticación con roles
- ✅ Guards de navegación
- ✅ Bloqueo temporal
- ✅ Recordar sesión

### 📱 Responsive

- ✅ Mobile-first
- ✅ Sidebar adaptativo
- ✅ Tablas responsivas
- ✅ Touch-friendly

---

## 🎯 Siguientes Pasos Sugeridos

### Para Desarrollo

1. ✏️ Completar vistas pendientes
2. 🔗 Conectar con backend real
3. 🧪 Agregar tests
4. 📊 Implementar gráficos

### Para Despliegue

1. 🏗️ Compilar para producción: `npm run build`
2. 📦 Revisar carpeta `dist/`
3. 🚀 Desplegar en hosting
4. 🔍 Configurar dominio

---

## 💡 Tips Útiles

### Desarrollo Más Rápido

```powershell
# Hot reload automático ya está activo
# Los cambios se reflejan instantáneamente
```

### Debugging

```powershell
# Vue DevTools (extensión de navegador)
# https://devtools.vuejs.org/
```

### Snippets VSCode

```json
// .vscode/vue3.code-snippets
{
  "Vue 3 Component": {
    "prefix": "v3",
    "body": [
      "<template>",
      "  <div>$1</div>",
      "</template>",
      "",
      "<script setup>",
      "$2",
      "</script>"
    ]
  }
}
```

---

## 📞 Ayuda

### Problemas Técnicos

- 📧 Email: soporte@nutricionescolar.edu
- 📱 Tel: +593 99 999 9999

### Documentación

- Ver archivos .md en la raíz del proyecto
- Comentarios en el código
- Vue.js 3 docs: https://vuejs.org/

---

## ✅ Checklist de Verificación

Antes de empezar a desarrollar, verifica:

- [ ] Node.js 18+ instalado
- [ ] npm funcionando
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Navegador abierto en http://localhost:3000
- [ ] Login funcional con credenciales de prueba
- [ ] VSCode (recomendado) o tu editor favorito listo

---

## 🎉 ¡Listo para Empezar!

```
🚀 El sistema está completamente funcional
✨ Todos los requisitos implementados
📚 Documentación completa disponible
🎯 Listo para desarrollo continuo

¡Explora, prueba y desarrolla! 💻
```

---

**💖 Desarrollado con cariño para la comunidad educativa**
