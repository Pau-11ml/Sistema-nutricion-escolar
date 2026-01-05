<template>
  <div class="reportes-view">
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1">
          <i class="bi bi-file-earmark-text me-2"></i>
          Reportes del Sistema
        </h1>
        <p class="text-muted mb-0">
          Generación de reportes operativos y estadísticos
        </p>
      </div>
    </div>

    <!-- Tipos de Reportes -->
    <div class="row g-4 mb-4">
      <!-- Reporte de Estudiantes con Alergias -->
      <div class="col-md-6 col-lg-4">
        <div class="card report-card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="icon-box bg-danger me-3">
                <i class="bi bi-exclamation-triangle-fill"></i>
              </div>
              <div>
                <h5 class="mb-0">Alergias Alimentarias</h5>
                <small class="text-muted">Reporte nutricional</small>
              </div>
            </div>
            <p class="text-muted mb-3">
              Estudiantes con alergias, restricciones alimentarias y datos del representante para contacto
            </p>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-success flex-fill" @click="generarReporte('alergias', 'excel')">
                <i class="bi bi-file-earmark-excel me-1"></i> Excel
              </button>
              <button class="btn btn-sm btn-outline-primary flex-fill" @click="generarReporte('alergias', 'csv')">
                <i class="bi bi-file-earmark-text me-1"></i> CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reporte de Estudiantes por Grado -->
      <div class="col-md-6 col-lg-4">
        <div class="card report-card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="icon-box bg-primary me-3">
                <i class="bi bi-bar-chart-fill"></i>
              </div>
              <div>
                <h5 class="mb-0">Estudiantes por Grado</h5>
                <small class="text-muted">Distribución escolar</small>
              </div>
            </div>
            <p class="text-muted mb-3">
              Cantidad de estudiantes agrupados por grado y paralelo con totales y activos
            </p>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-success flex-fill" @click="generarReporte('estudiantesGrado', 'excel')">
                <i class="bi bi-file-earmark-excel me-1"></i> Excel
              </button>
              <button class="btn btn-sm btn-outline-primary flex-fill" @click="generarReporte('estudiantesGrado', 'csv')">
                <i class="bi bi-file-earmark-text me-1"></i> CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reporte de Registros de Usuarios -->
      <div class="col-md-6 col-lg-4">
        <div class="card report-card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="icon-box bg-success me-3">
                <i class="bi bi-person-plus-fill"></i>
              </div>
              <div>
                <h5 class="mb-0">Nuevos Registros</h5>
                <small class="text-muted">Usuarios registrados</small>
              </div>
            </div>
            <p class="text-muted mb-3">
              Todos los usuarios registrados con fechas de creación y rol asignado
            </p>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-success flex-fill" @click="generarReporte('registros', 'excel')">
                <i class="bi bi-file-earmark-excel me-1"></i> Excel
              </button>
              <button class="btn btn-sm btn-outline-primary flex-fill" @click="generarReporte('registros', 'csv')">
                <i class="bi bi-file-earmark-text me-1"></i> CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reporte de Nutricionistas Activos -->
      <div class="col-md-6 col-lg-4">
        <div class="card report-card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="icon-box bg-info me-3">
                <i class="bi bi-clipboard2-pulse-fill"></i>
              </div>
              <div>
                <h5 class="mb-0">Personal Nutricional</h5>
                <small class="text-muted">Nutricionistas activos</small>
              </div>
            </div>
            <p class="text-muted mb-3">
              Lista de nutricionistas con datos de contacto, estado y fecha de incorporación
            </p>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-success flex-fill" @click="generarReporte('nutricionistas', 'excel')">
                <i class="bi bi-file-earmark-excel me-1"></i> Excel
              </button>
              <button class="btn btn-sm btn-outline-primary flex-fill" @click="generarReporte('nutricionistas', 'csv')">
                <i class="bi bi-file-earmark-text me-1"></i> CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reporte de Representantes -->
      <div class="col-md-6 col-lg-4">
        <div class="card report-card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="icon-box bg-secondary me-3">
                <i class="bi bi-person-badge-fill"></i>
              </div>
              <div>
                <h5 class="mb-0">Representantes</h5>
                <small class="text-muted">Padres y tutores</small>
              </div>
            </div>
            <p class="text-muted mb-3">
              Representantes legales con datos de contacto para comunicaciones escolares
            </p>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-success flex-fill" @click="generarReporte('representantes', 'excel')">
                <i class="bi bi-file-earmark-excel me-1"></i> Excel
              </button>
              <button class="btn btn-sm btn-outline-primary flex-fill" @click="generarReporte('representantes', 'csv')">
                <i class="bi bi-file-earmark-text me-1"></i> CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reporte Estadístico General -->
      <div class="col-md-6 col-lg-4">
        <div class="card report-card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="icon-box bg-warning me-3">
                <i class="bi bi-graph-up"></i>
              </div>
              <div>
                <h5 class="mb-0">Estadísticas Generales</h5>
                <small class="text-muted">Resumen del sistema</small>
              </div>
            </div>
            <p class="text-muted mb-3">
              Resumen estadístico: totales de estudiantes, personal y representantes
            </p>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-success flex-fill" @click="generarReporte('estadisticas', 'excel')">
                <i class="bi bi-file-earmark-excel me-1"></i> Excel
              </button>
              <button class="btn btn-sm btn-outline-primary flex-fill" @click="generarReporte('estadisticas', 'csv')">
                <i class="bi bi-file-earmark-text me-1"></i> CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de Reportes -->
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="bi bi-clock-history me-2"></i>
            Historial de Reportes Generados
          </h5>
          <button 
            v-if="reportHistory.length > 0"
            class="btn btn-sm btn-outline-danger"
            @click="limpiarHistorial"
          >
            <i class="bi bi-trash me-1"></i>
            Limpiar Historial
          </button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="reportHistoryOrdenado.length > 0" class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Registros</th>
                <th>Formato</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in reportHistoryOrdenado" :key="item.id">
                <td>
                  <i :class="item.icon" class="me-2"></i>
                  {{ item.name }}
                </td>
                <td>{{ formatearFecha(item.date) }}</td>
                <td>
                  <span class="badge bg-primary">{{ item.registros }}</span>
                </td>
                <td>
                  <span class="badge bg-secondary">{{ item.formato }}</span>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary me-2"
                    @click="descargarReporte(item)"
                    title="Descargar"
                  >
                    <i class="bi bi-download"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="eliminarReporte(item.id)"
                    title="Eliminar"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center text-muted py-4">
          <i class="bi bi-file-earmark-text" style="font-size: 3rem;"></i>
          <p class="mt-3">No se han generado reportes aún</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useNotificationStore } from "@/stores/notification";
import { useStudentsStore } from "@/stores/students";
import { useNutritionistsStore } from "@/stores/nutritionists";
import { useRepresentativesStore } from "@/stores/representatives";

const notificationStore = useNotificationStore();
const studentsStore = useStudentsStore();
const nutritionistsStore = useNutritionistsStore();
const representativesStore = useRepresentativesStore();

// Estado
const reportHistory = ref([]);

const reportHistoryOrdenado = computed(() => {
  return [...reportHistory.value].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
});

// Configuración de reportes
const tiposReporte = {
  alergias: {
    nombre: 'Estudiantes con Alergias Alimentarias',
    icon: 'bi-exclamation-triangle-fill',
    getData: () => {
      return studentsStore.allStudents.filter(e => {
        const alergias = e.alergias || e.alergiasTexto;
        return alergias && (Array.isArray(alergias) ? alergias.length > 0 : alergias.trim() !== '');
      });
    },
    columns: ['Nombres', 'Apellidos', 'Cédula', 'Grado', 'Paralelo', 'Alergias', 'Email Representante', 'Teléfono Representante']
  },
  estudiantesGrado: {
    nombre: 'Estudiantes por Grado',
    icon: 'bi-bar-chart-fill',
    getData: () => {
      const estudiantes = studentsStore.allStudents;
      const porGrado = {};
      estudiantes.forEach(e => {
        const grado = e.grado || 'Sin grado';
        if (!porGrado[grado]) porGrado[grado] = [];
        porGrado[grado].push(e);
      });
      return Object.entries(porGrado).map(([grado, lista]) => ({
        grado,
        total: lista.length,
        activos: lista.filter(e => (e.estado || 'activo') === 'activo').length,
        inactivos: lista.filter(e => e.estado === 'inactivo').length,
        porcentaje: ((lista.length / estudiantes.length) * 100).toFixed(1)
      }));
    },
    columns: ['Grado', 'Total Estudiantes', 'Activos', 'Inactivos', 'Porcentaje del Total']
  },
  registros: {
    nombre: 'Nuevos Registros de Usuarios',
    icon: 'bi-person-plus-fill',
    getData: () => {
      const estudiantes = studentsStore.allStudents.map(e => ({
        ...e,
        tipoUsuario: 'Estudiante'
      }));
      const nutricionistas = nutritionistsStore.allNutritionists.map(n => ({
        ...n,
        tipoUsuario: 'Nutricionista'
      }));
      const representantes = representativesStore.allRepresentatives.map(r => ({
        ...r,
        tipoUsuario: 'Representante'
      }));
      
      return [...estudiantes, ...nutricionistas, ...representantes].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.fechaRegistro || '2024-01-01');
        const dateB = new Date(b.createdAt || b.fechaRegistro || '2024-01-01');
        return dateB - dateA;
      });
    },
    columns: ['Tipo Usuario', 'Nombres', 'Apellidos', 'Cédula', 'Email', 'Estado', 'Fecha Registro']
  },
  nutricionistas: {
    nombre: 'Personal Nutricional Activo',
    icon: 'bi-clipboard2-pulse-fill',
    getData: () => nutritionistsStore.allNutritionists,
    columns: ['Nombres', 'Apellidos', 'Cédula', 'Email', 'Teléfono', 'Username', 'Estado', 'Fecha Registro']
  },
  representantes: {
    nombre: 'Representantes Legales',
    icon: 'bi-person-badge-fill',
    getData: () => representativesStore.allRepresentatives,
    columns: ['Nombres', 'Apellidos', 'Cédula', 'Email', 'Teléfono', 'Username', 'Estado', 'Fecha Registro']
  },
  estadisticas: {
    nombre: 'Estadísticas Generales del Sistema',
    icon: 'bi-graph-up',
    getData: () => {
      const estudiantes = studentsStore.allStudents;
      const nutricionistas = nutritionistsStore.allNutritionists;
      const representantes = representativesStore.allRepresentatives;
      
      return [
        {
          categoria: 'Estudiantes',
          total: estudiantes.length,
          activos: estudiantes.filter(e => (e.estado || 'activo') === 'activo').length,
          inactivos: estudiantes.filter(e => e.estado === 'inactivo').length,
          conAlergias: estudiantes.filter(e => {
            const alergias = e.alergias || e.alergiasTexto;
            return alergias && (Array.isArray(alergias) ? alergias.length > 0 : alergias.trim() !== '');
          }).length
        },
        {
          categoria: 'Nutricionistas',
          total: nutricionistas.length,
          activos: nutricionistas.filter(n => (n.estado || 'activo') === 'activo').length,
          inactivos: nutricionistas.filter(n => n.estado === 'inactivo').length,
          conAlergias: 'N/A'
        },
        {
          categoria: 'Representantes',
          total: representantes.length,
          activos: representantes.filter(r => (r.estado || 'activo') === 'activo').length,
          inactivos: representantes.filter(r => r.estado === 'inactivo').length,
          conAlergias: 'N/A'
        }
      ];
    },
    columns: ['Categoría', 'Total', 'Activos', 'Inactivos', 'Con Alergias']
  }
};

// Funciones
function generarReporte(tipo, formato = 'csv') {
  const config = tiposReporte[tipo];
  if (!config) return;
  
  const data = config.getData();
  
  if (!data || data.length === 0) {
    notificationStore.addNotification({
      type: 'warning',
      message: `No hay datos disponibles para generar el reporte de ${config.nombre}`
    });
    return;
  }
  
  let contenido, blob, extension, mimeType;
  
  if (formato === 'excel') {
    // Generar Excel (HTML table)
    contenido = generarExcel(data, config.columns, tipo);
    mimeType = 'application/vnd.ms-excel';
    extension = 'xls';
  } else {
    // Generar CSV
    contenido = generarCSV(data, config.columns, tipo);
    mimeType = 'text/csv;charset=utf-8;';
    extension = 'csv';
  }
  
  // Descargar archivo
  blob = new Blob([contenido], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const fecha = new Date().toISOString().split('T')[0];
  link.download = `${tipo}_${fecha}.${extension}`;
  link.click();
  
  // Agregar al historial
  reportHistory.value.push({
    id: Date.now(),
    name: config.nombre,
    icon: config.icon,
    date: new Date().toISOString(),
    registros: data.length,
    formato: formato.toUpperCase(),
    tipo: tipo,
    data: contenido,
    extension: extension
  });
  
  notificationStore.addNotification({
    type: 'success',
    message: `Reporte ${config.nombre} generado en formato ${formato.toUpperCase()}`
  });
}

function generarCSV(data, columns, tipo) {
  let csv = columns.join(',') + '\n';
  
  data.forEach(item => {
    const row = [];
    
    switch(tipo) {
      case 'alergias':
        row.push(
          item.nombres || '',
          item.apellidos || '',
          item.cedula || '',
          item.grado || '',
          item.paralelo || item.seccion || '',
          Array.isArray(item.alergias) ? item.alergias.join('; ') : (item.alergiasTexto || ''),
          item.representante?.email || item.email || '',
          item.representante?.telefono || item.telefono || ''
        );
        break;
        
      case 'estudiantesGrado':
        row.push(
          item.grado || '',
          item.total || 0,
          item.activos || 0,
          item.inactivos || 0,
          `${item.porcentaje}%`
        );
        break;
        
      case 'registros':
        row.push(
          item.tipoUsuario || '',
          item.nombres || '',
          item.apellidos || '',
          item.cedula || '',
          item.email || '',
          item.estado || 'activo',
          item.createdAt || item.fechaRegistro || ''
        );
        break;
        
      case 'nutricionistas':
      case 'representantes':
        row.push(
          item.nombres || '',
          item.apellidos || '',
          item.cedula || '',
          item.email || '',
          item.telefono || '',
          item.username || '',
          item.estado || 'activo',
          item.createdAt || item.fechaRegistro || ''
        );
        break;
        
      case 'estadisticas':
        row.push(
          item.categoria || '',
          item.total || 0,
          item.activos || 0,
          item.inactivos || 0,
          item.conAlergias || 'N/A'
        );
        break;
    }
    
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });
  
  return csv;
}

function generarExcel(data, columns, tipo) {
  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  html += '<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
  html += '<x:Name>Reporte</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>';
  html += '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
  html += '<table border="1">';
  
  // Encabezados
  html += '<thead><tr style="background-color: #0d6efd; color: white; font-weight: bold;">';
  columns.forEach(col => {
    html += `<th style="padding: 8px;">${col}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  // Datos
  data.forEach((item, index) => {
    const bgColor = index % 2 === 0 ? '#f8f9fa' : '#ffffff';
    html += `<tr style="background-color: ${bgColor};">`;
    
    switch(tipo) {
      case 'alergias':
        html += `<td style="padding: 5px;">${item.nombres || ''}</td>`;
        html += `<td style="padding: 5px;">${item.apellidos || ''}</td>`;
        html += `<td style="padding: 5px;">${item.cedula || ''}</td>`;
        html += `<td style="padding: 5px;">${item.grado || ''}</td>`;
        html += `<td style="padding: 5px;">${item.paralelo || item.seccion || ''}</td>`;
        html += `<td style="padding: 5px; color: #dc3545; font-weight: bold;">${Array.isArray(item.alergias) ? item.alergias.join(', ') : (item.alergiasTexto || '')}</td>`;
        html += `<td style="padding: 5px;">${item.representante?.email || item.email || ''}</td>`;
        html += `<td style="padding: 5px;">${item.representante?.telefono || item.telefono || ''}</td>`;
        break;
        
      case 'estudiantesGrado':
        html += `<td style="padding: 5px; font-weight: bold;">${item.grado || ''}</td>`;
        html += `<td style="padding: 5px; text-align: center;">${item.total || 0}</td>`;
        html += `<td style="padding: 5px; text-align: center; color: #198754;">${item.activos || 0}</td>`;
        html += `<td style="padding: 5px; text-align: center; color: #6c757d;">${item.inactivos || 0}</td>`;
        html += `<td style="padding: 5px; text-align: center;">${item.porcentaje}%</td>`;
        break;
        
      case 'registros':
        html += `<td style="padding: 5px;"><strong>${item.tipoUsuario || ''}</strong></td>`;
        html += `<td style="padding: 5px;">${item.nombres || ''}</td>`;
        html += `<td style="padding: 5px;">${item.apellidos || ''}</td>`;
        html += `<td style="padding: 5px;">${item.cedula || ''}</td>`;
        html += `<td style="padding: 5px;">${item.email || ''}</td>`;
        html += `<td style="padding: 5px;">${item.estado || 'activo'}</td>`;
        html += `<td style="padding: 5px;">${formatearFecha(item.createdAt || item.fechaRegistro || '')}</td>`;
        break;
        
      case 'nutricionistas':
      case 'representantes':
        html += `<td style="padding: 5px;">${item.nombres || ''}</td>`;
        html += `<td style="padding: 5px;">${item.apellidos || ''}</td>`;
        html += `<td style="padding: 5px;">${item.cedula || ''}</td>`;
        html += `<td style="padding: 5px;">${item.email || ''}</td>`;
        html += `<td style="padding: 5px;">${item.telefono || ''}</td>`;
        html += `<td style="padding: 5px;">${item.username || ''}</td>`;
        html += `<td style="padding: 5px;">${item.estado || 'activo'}</td>`;
        html += `<td style="padding: 5px;">${formatearFecha(item.createdAt || item.fechaRegistro || '')}</td>`;
        break;
        
      case 'estadisticas':
        html += `<td style="padding: 5px; font-weight: bold;">${item.categoria || ''}</td>`;
        html += `<td style="padding: 5px; text-align: center;">${item.total || 0}</td>`;
        html += `<td style="padding: 5px; text-align: center; color: #198754;">${item.activos || 0}</td>`;
        html += `<td style="padding: 5px; text-align: center; color: #6c757d;">${item.inactivos || 0}</td>`;
        html += `<td style="padding: 5px; text-align: center;">${item.conAlergias || 'N/A'}</td>`;
        break;
    }
    
    html += '</tr>';
  });
  
  html += '</tbody></table></body></html>';
  return html;
}

function formatearFecha(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function descargarReporte(item) {
  const mimeType = item.formato === 'CSV' ? 'text/csv;charset=utf-8;' : 'application/vnd.ms-excel';
  const blob = new Blob([item.data], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const fecha = new Date(item.date).toISOString().split('T')[0];
  link.download = `${item.tipo}_${fecha}.${item.extension}`;
  link.click();
  
  notificationStore.addNotification({
    type: 'success',
    message: 'Reporte descargado correctamente'
  });
}

function eliminarReporte(id) {
  const index = reportHistory.value.findIndex(r => r.id === id);
  if (index !== -1) {
    reportHistory.value.splice(index, 1);
    notificationStore.addNotification({
      type: 'success',
      message: 'Reporte eliminado del historial'
    });
  }
}

function limpiarHistorial() {
  if (confirm('¿Está seguro de que desea limpiar todo el historial de reportes?')) {
    reportHistory.value = [];
    notificationStore.addNotification({
      type: 'success',
      message: 'Historial de reportes limpiado'
    });
  }
}
</script>

<style scoped>
.report-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.report-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  border-color: #e9ecef;
}

.icon-box {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: white;
  font-size: 1.5rem;
}

.icon-box.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.icon-box.bg-success {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
}

.icon-box.bg-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.icon-box.bg-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.icon-box.bg-secondary {
  background: linear-gradient(135deg, #a8caba 0%, #5d4157 100%);
}

.icon-box.bg-danger {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}
</style>
