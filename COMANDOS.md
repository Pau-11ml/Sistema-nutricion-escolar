# 🚀 Comandos Útiles - Sistema de Nutrición Escolar

## 📦 Gestión de Dependencias

```powershell
# Instalar todas las dependencias
npm install

# Instalar una dependencia específica
npm install nombre-paquete

# Instalar dependencia de desarrollo
npm install --save-dev nombre-paquete

# Actualizar dependencias
npm update

# Verificar dependencias obsoletas
npm outdated

# Limpiar caché de npm
npm cache clean --force

# Reinstalar node_modules desde cero
Remove-Item -Recurse -Force node_modules; npm install
```

---

## 🛠️ Desarrollo

```powershell
# Iniciar servidor de desarrollo (puerto 3000)
npm run dev

# Iniciar en puerto específico
$env:PORT=5000; npm run dev

# Compilar para producción
npm run build

# Previsualizar compilación de producción
npm run preview

# Limpiar y reconstruir
Remove-Item -Recurse -Force dist; npm run build
```

---

## 🔍 Depuración

```powershell
# Ver errores de compilación detallados
npm run dev -- --debug

# Analizar bundle size
npm run build -- --report

# Verificar sintaxis de archivos Vue
npm run lint

# Formatear código
npm run format
```

---

## 📂 Gestión de Archivos

```powershell
# Crear nuevo componente
New-Item -Path "src/components/MiComponente.vue" -ItemType File

# Crear nueva vista
New-Item -Path "src/views/MiVista.vue" -ItemType File

# Crear nuevo store
New-Item -Path "src/stores/miStore.js" -ItemType File

# Crear estructura completa de módulo
New-Item -Path "src/modules/miModulo" -ItemType Directory
New-Item -Path "src/modules/miModulo/components" -ItemType Directory
New-Item -Path "src/modules/miModulo/views" -ItemType Directory
New-Item -Path "src/modules/miModulo/store.js" -ItemType File
```

---

## 🗂️ Git

```powershell
# Ver estado
git status

# Agregar cambios
git add .

# Commit
git commit -m "Descripción del cambio"

# Push
git push origin master

# Pull
git pull origin master

# Crear nueva rama
git checkout -b feature/nueva-caracteristica

# Ver ramas
git branch -a

# Cambiar de rama
git checkout nombre-rama

# Merge
git merge nombre-rama

# Ver historial
git log --oneline --graph --all

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (eliminar cambios)
git reset --hard HEAD~1

# Ver diferencias
git diff

# Stash (guardar cambios temporalmente)
git stash
git stash pop
git stash list
```

---

## 🧪 Testing (cuando se implemente)

```powershell
# Ejecutar tests unitarios
npm run test:unit

# Ejecutar tests E2E
npm run test:e2e

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

---

## 📊 Análisis y Optimización

```powershell
# Analizar tamaño del bundle
npm run build
npx vite-bundle-visualizer

# Verificar performance
npm run build
npx lighthouse http://localhost:3000 --view

# Analizar dependencias no utilizadas
npx depcheck

# Verificar vulnerabilidades de seguridad
npm audit

# Arreglar vulnerabilidades automáticamente
npm audit fix
```

---

## 🌐 Despliegue

```powershell
# Build de producción
npm run build

# Verificar archivos generados
Get-ChildItem -Path dist -Recurse

# Servir archivos estáticos localmente
npx serve dist

# Desplegar a GitHub Pages (si está configurado)
npm run deploy
```

---

## 🔧 Configuración y Utilidades

```powershell
# Ver versión de Node.js
node --version

# Ver versión de npm
npm --version

# Ver versión de Vue
npm list vue

# Limpiar todo (node_modules + dist)
Remove-Item -Recurse -Force node_modules,dist; npm install

# Verificar puerto en uso
netstat -ano | findstr :3000

# Matar proceso en puerto específico (PowerShell como Admin)
$port = 3000
Get-NetTCPConnection -LocalPort $port | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

---

## 📝 Scripts Personalizados

Puedes agregar estos scripts a `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js",
    "format": "prettier --write \"src/**/*.{js,vue,css}\"",
    "clean": "rimraf node_modules dist",
    "reinstall": "npm run clean && npm install"
  }
}
```

---

## 🐛 Solución de Problemas Comunes

### Error: Puerto 3000 en uso

```powershell
# Opción 1: Usar otro puerto
$env:PORT=5000; npm run dev

# Opción 2: Matar proceso en puerto 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Error: Module not found

```powershell
# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
npm install
```

### Error: EACCES permissions

```powershell
# Limpiar caché npm
npm cache clean --force

# Reinstalar con privilegios
npm install
```

### Vite no se reconoce

```powershell
# Instalar Vite globalmente (opcional)
npm install -g vite

# O usar npx
npx vite
```

### Hot reload no funciona

```powershell
# Reiniciar servidor
# Ctrl + C para detener
npm run dev
```

---

## 🔄 Actualización del Proyecto

```powershell
# Actualizar Vue a última versión
npm install vue@latest

# Actualizar Vue Router
npm install vue-router@latest

# Actualizar Pinia
npm install pinia@latest

# Actualizar todas las dependencias (con precaución)
npm update

# Ver qué se actualizará
npm outdated
```

---

## 📱 Testing en Dispositivos Móviles

```powershell
# Obtener IP local
ipconfig | Select-String -Pattern "IPv4"

# Iniciar servidor accesible en red local
npm run dev -- --host

# Acceder desde móvil:
# http://[TU_IP]:3000
```

---

## 🎨 Generación de Assets

```powershell
# Optimizar imágenes (si imagemin está instalado)
npx imagemin src/assets/images/* --out-dir=dist/assets/images

# Generar iconos de diferentes tamaños
# (requiere sharp o similar)
```

---

## 📚 Documentación

```powershell
# Generar documentación de componentes (si JSDoc está configurado)
npm run docs

# Ver documentación generada
npm run docs:serve
```

---

## 🔐 Variables de Entorno

```powershell
# Crear archivo .env
New-Item -Path ".env" -ItemType File

# Contenido de ejemplo:
# VITE_API_URL=http://localhost:8000/api
# VITE_APP_TITLE=Sistema Nutrición Escolar
```

---

## 🎯 Atajos de VSCode

- `Ctrl + P` - Búsqueda rápida de archivos
- `Ctrl + Shift + P` - Paleta de comandos
- ` Ctrl + ``  ` - Terminal integrado
- `Alt + Click` - Múltiples cursores
- `Ctrl + /` - Comentar/descomentar
- `F2` - Renombrar símbolo
- `Ctrl + Shift + F` - Buscar en todos los archivos

---

## 🚀 Shortcuts del Navegador

- `Ctrl + Shift + I` - Abrir DevTools
- `Ctrl + Shift + C` - Inspeccionar elemento
- `F12` - Consola
- `Ctrl + Shift + M` - Toggle dispositivo móvil
- `Ctrl + Shift + R` - Recarga forzada (bypass cache)

---

**💡 Tip**: Crea aliases en PowerShell para comandos frecuentes:

```powershell
# En tu perfil de PowerShell
Set-Alias -Name dev -Value "npm run dev"
Set-Alias -Name build -Value "npm run build"
```

---

**📖 Documentación Completa**: Consulta README.md y MIGRACION.md para más información.
