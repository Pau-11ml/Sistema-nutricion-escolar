<template>
  <div class="reportes-view">
    <!-- Header -->
    <div class="page-header mb-4">
      <h2>
        <i
          class="bi bi-file-earmark-bar-graph me-2"
        ></i>
        {{ $t("nav.reports") }}
      </h2>
      <p class="text-muted">
        Consulta y genera reportes del sistema
      </p>
    </div>

    <!-- Tarjetas de Tipos de Reportes -->
    <div class="row g-4 mb-4">
      <div
        class="col-md-4"
        v-for="report in reportTypes"
        :key="report.id"
      >
        <div class="card report-card h-100">
          <div class="card-body">
            <div
              class="d-flex align-items-start mb-3"
            >
              <div
                :class="`icon-box bg-${report.color}`"
              >
                <i
                  class="bi"
                  :class="report.icon"
                ></i>
              </div>
              <div class="ms-3 flex-grow-1">
                <h5 class="card-title">
                  {{ report.title }}
                </h5>
                <p
                  class="card-text text-muted small"
                >
                  {{ report.description }}
                </p>
              </div>
            </div>
            <button
              class="btn btn-outline-primary w-100"
              @click="generateReport(report.type)"
            >
              <i class="bi bi-download me-2"></i>
              Generar Reporte
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de Reportes -->
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-clock-history me-2"></i>
          Historial de Reportes Generados
        </h5>
      </div>
      <div class="card-body">
        <div
          v-if="reportHistory.length === 0"
          class="text-center text-muted py-4"
        >
          <i
            class="bi bi-inbox display-4 mb-3 d-block"
          ></i>
          <p>No hay reportes generados aún</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Tipo de Reporte</th>
                <th>Fecha de Generación</th>
                <th>Generado Por</th>
                <th class="text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in reportHistory"
                :key="item.id"
              >
                <td>
                  <i
                    class="bi"
                    :class="item.icon"
                  ></i>
                  {{ item.name }}
                </td>
                <td>{{ item.date }}</td>
                <td>{{ item.user }}</td>
                <td class="text-center">
                  <button
                    class="btn btn-sm btn-outline-primary me-1"
                  >
                    <i class="bi bi-download"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNotificationStore } from "@/stores/notification";

const notificationStore = useNotificationStore();

const reportTypes = ref([
  {
    id: 1,
    title: "Reporte de Estudiantes",
    description:
      "Listado completo de estudiantes registrados",
    icon: "bi-people-fill",
    color: "primary",
    type: "students",
  },
  {
    id: 2,
    title: "Reporte Nutricional",
    description:
      "Estadísticas y métricas nutricionales",
    icon: "bi-heart-pulse-fill",
    color: "success",
    type: "nutrition",
  },
  {
    id: 3,
    title: "Reporte de Menús",
    description:
      "Menús semanales y planificación",
    icon: "bi-calendar-week-fill",
    color: "warning",
    type: "menus",
  },
  {
    id: 4,
    title: "Reporte de Actividad",
    description:
      "Actividad del sistema y usuarios",
    icon: "bi-activity",
    color: "info",
    type: "activity",
  },
  {
    id: 5,
    title: "Reporte Financiero",
    description: "Costos y presupuestos",
    icon: "bi-cash-stack",
    color: "success",
    type: "financial",
  },
  {
    id: 6,
    title: "Reporte Personalizado",
    description:
      "Crea tu propio reporte personalizado",
    icon: "bi-sliders",
    color: "secondary",
    type: "custom",
  },
]);

const reportHistory = ref([]);

function generateReport(type) {
  notificationStore.success(
    `Generando reporte de ${type}...`
  );

  // Simular generación de reporte
  setTimeout(() => {
    notificationStore.success(
      "Reporte generado exitosamente"
    );
  }, 1500);
}
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 1rem;
}

.report-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.report-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.icon-box.bg-primary {
  background-color: #0d6efd;
}
.icon-box.bg-success {
  background-color: #198754;
}
.icon-box.bg-warning {
  background-color: #ffc107;
  color: #000;
}
.icon-box.bg-info {
  background-color: #0dcaf0;
}
.icon-box.bg-secondary {
  background-color: #6c757d;
}
</style>
