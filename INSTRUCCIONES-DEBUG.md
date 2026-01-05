# Instrucciones de Debugging y Solución

## Problemas Corregidos

### 1. ❌ "No hay menú registrado hoy" - Dashboard Nutricionista

**Problema:** El menú del día no se mostraba aunque estuviera guardado.

**Causa:** Error en el cálculo del día de la semana. JavaScript usa `getDay()` donde:
- 0 = Domingo
- 1 = Lunes
- 2 = Martes
- ...
- 6 = Sábado

El código estaba buscando "domingo", "lunes", etc., pero debería buscar "lunes", "martes", etc. (sin domingo).

**Solución Aplicada:**
- Ajustado el array de días para empezar en "lunes" (índice 0)
- Ajustado el cálculo: `diasSemana[diaActualIndex - 1]` para mapear correctamente
- Agregado manejo especial para fines de semana (sábado/domingo)

### 2. ❌ Menú no se muestra en vista de usuario

**Problema:** El menú semanal en InicioView mostraba "Sin asignar" para todos los días.

**Causa:** Los datos se guardaban correctamente pero no se mostraban porque:
1. El store necesita cargar los datos antes de usarlos
2. Los logs ayudan a verificar que los datos están disponibles

**Solución Aplicada:**
- Agregados logs de debug para verificar la carga de datos
- Asegurado que `menusStore.loadData()` se llama en `onMounted`

### 3. ❌ Alertas bloquean el sistema

**Problema:** Al hacer clic en las tarjetas de acción rápida, el sistema se bloqueaba con overlay oscuro sin mostrar el modal.

**Causa:** El modal intentaba mostrarse antes de que el DOM estuviera completamente actualizado.

**Solución Aplicada:**
- Envuelto `alertaModalInstance.show()` con `nextTick()`
- Agregado manejo de errores con notificaciones al usuario
- Verificación de que la instancia del modal existe antes de mostrarla

## Cómo Verificar que Todo Funciona

### Paso 1: Abrir la Consola del Navegador
1. Presiona **F12** o **Ctrl+Shift+I**
2. Ve a la pestaña **Console**

### Paso 2: Verificar Datos en localStorage

**En la consola del navegador, ejecuta estos comandos:**

```javascript
// Ver menús semanales guardados
console.log('Menús Semanales:', JSON.parse(localStorage.getItem('menus_semanales') || '[]'));

// Ver catálogo de comidas
console.log('Comidas:', JSON.parse(localStorage.getItem('comidas_catalogo') || '[]'));

// Ver menús personalizados
console.log('Menús Personalizados:', JSON.parse(localStorage.getItem('menus_personalizados') || '[]'));
```

### Paso 3: Verificar Logs Automáticos

**En la vista de Nutricionista (Dashboard):**
Deberías ver en la consola:
```
Dashboard - Día actual: 1 Key: lunes
Dashboard - Menu actual: {dia: 'lunes', desayuno: 123, almuerzo: 456, ...}
Dashboard - Todos los menus: [{dia: 'lunes', ...}, {dia: 'martes', ...}, ...]
```

**En la vista de Usuario (Inicio):**
Deberías ver en la consola:
```
InicioView - Todos los menus del store: [{dia: 'lunes', ...}, ...]
InicioView - Comidas disponibles: 15
InicioView - Menu para lunes: {dia: 'lunes', desayuno: 123, ...}
```

### Paso 4: Probar Funcionalidades

#### A. Crear y Guardar Menú Semanal
1. Login como nutricionista (usuario: `nutricionista1`, password: `nutricionista123`)
2. Ir a **Menú Semanal**
3. **IMPORTANTE:** Primero debes tener comidas en el catálogo:
   - Ve a **Catálogo de Comidas** (si existe) o crea comidas manualmente
   - Si no hay comidas, el menú no se puede guardar correctamente
4. Selecciona comidas para cada día y tipo de comida
5. Haz clic en **Guardar Menú Semanal**
6. Deberías ver mensaje: "Menú semanal guardado exitosamente"

#### B. Verificar Dashboard de Nutricionista
1. Ve al **Dashboard**
2. La tarjeta "Menú del Día" debe mostrar:
   - Desayuno con nombre y calorías
   - Almuerzo con nombre y calorías
   - Refrigerio con nombre y calorías
   - Total de calorías del día

#### C. Verificar Vista de Usuario
1. Login como usuario/representante
2. Ve a **Inicio**
3. La tabla "Menú Semanal" debe mostrar:
   - Todos los días de lunes a viernes
   - Cada comida con su nombre (no "Sin asignar")

#### D. Probar Alertas sin Bloqueo
1. Login como nutricionista
2. Ve a **Alertas y Notificaciones**
3. Haz clic en cualquier tarjeta de acción rápida:
   - 📅 Cambio de Menú
   - ⚠️ Alerta de Alergia
   - 🕐 Recordatorio
   - ℹ️ Información General
4. El modal debe abrirse INMEDIATAMENTE sin bloquear
5. No debe quedar una capa oscura bloqueante

## Si Sigue Sin Funcionar

### Problema: "Sin asignar" en todos los menús

**Causa posible:** No hay comidas en el catálogo.

**Solución:**
1. Abre la consola del navegador
2. Ejecuta este código para crear comidas de prueba:

```javascript
const comidasPrueba = [
  { id: 1, nombre: 'Arroz con Pollo', calorias: 450, ingredientes: ['arroz', 'pollo', 'vegetales'] },
  { id: 2, nombre: 'Ensalada César', calorias: 250, ingredientes: ['lechuga', 'pollo', 'queso'] },
  { id: 3, nombre: 'Pasta Bolognesa', calorias: 550, ingredientes: ['pasta', 'carne', 'tomate'] },
  { id: 4, nombre: 'Sopa de Verduras', calorias: 180, ingredientes: ['zanahoria', 'papa', 'apio'] },
  { id: 5, nombre: 'Jugo Natural', calorias: 120, ingredientes: ['naranja', 'agua', 'azúcar'] },
  { id: 6, nombre: 'Fruta Fresca', calorias: 80, ingredientes: ['manzana', 'banana', 'uvas'] },
  { id: 7, nombre: 'Sándwich Integral', calorias: 300, ingredientes: ['pan integral', 'jamón', 'queso'] },
  { id: 8, nombre: 'Yogurt con Granola', calorias: 200, ingredientes: ['yogurt', 'granola', 'miel'] }
];

localStorage.setItem('comidas_catalogo', JSON.stringify(comidasPrueba));
console.log('✅ Comidas de prueba creadas');
location.reload(); // Recargar la página
```

3. Luego ve a Menú Semanal y asigna las comidas

### Problema: Modal de alertas sigue bloqueando

**Verificar:**
1. Abre la consola del navegador
2. Haz clic en una tarjeta de alerta
3. Busca errores en rojo en la consola
4. Si ves "Modal no inicializado", ejecuta:

```javascript
// Reiniciar localStorage
localStorage.clear();
location.reload();
```

### Problema: Día actual no coincide

**Si hoy es lunes pero dice "No hay menú definido":**

1. Verifica el día:
```javascript
const hoy = new Date().getDay();
console.log('Día actual (0=domingo, 1=lunes):', hoy);
```

2. Verifica el menú para hoy:
```javascript
const menus = JSON.parse(localStorage.getItem('menus_semanales') || '[]');
const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const menuHoy = menus.find(m => m.dia === dias[new Date().getDay()]);
console.log('Menú de hoy:', menuHoy);
```

## Resumen de Cambios en el Código

### DashboardView.vue
- ✅ Corregido cálculo de día de la semana
- ✅ Agregado manejo para fines de semana
- ✅ Agregados logs de debug
- ✅ Array de días empieza en "lunes" (no "domingo")

### InicioView.vue
- ✅ Agregados logs de debug para verificar datos
- ✅ Confirmado que `menusStore.loadData()` se ejecuta

### AlertasView.vue
- ✅ Envuelto `show()` con `nextTick()`
- ✅ Agregado manejo de errores
- ✅ Notificaciones al usuario si hay problemas

## Estructura de Datos Esperada

### menus_semanales en localStorage:
```json
[
  {
    "id": 1702345678901,
    "dia": "lunes",
    "desayuno": 1,
    "almuerzo": 2,
    "merienda": 6,
    "updatedAt": "2024-11-15T10:30:00.000Z"
  },
  {
    "dia": "martes",
    "desayuno": 7,
    "almuerzo": 3,
    "merienda": 8,
    ...
  }
]
```

### comidas_catalogo en localStorage:
```json
[
  {
    "id": 1,
    "nombre": "Arroz con Pollo",
    "calorias": 450,
    "ingredientes": ["arroz", "pollo", "vegetales"],
    "alergenos": ["gluten"],
    ...
  }
]
```

---

**Última actualización:** Diciembre 2024
**Estado:** ✅ Correcciones aplicadas - Probar en navegador
