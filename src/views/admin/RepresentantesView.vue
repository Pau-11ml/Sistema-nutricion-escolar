<template>
  <div class="representantes-view">
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1">
          <i class="bi bi-person-badge-fill me-2"></i>
          Gestión de Representantes
        </h1>
        <p class="text-muted mb-0">
          Administra los representantes legales de los estudiantes
        </p>
      </div>
      <button class="btn btn-primary" @click="goToRegistro">
        <i class="bi bi-plus-circle me-2"></i>
        Nuevo Representante
      </button>
    </div>

    <!-- Estadísticas -->
    <div class="row g-3 mb-4">
      <div class="col-md-6">
        <div class="stat-card">
          <div class="stat-icon bg-success">
            <i class="bi bi-person-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalRepresentantes }}</div>
            <div class="stat-label">Total Representantes</div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="stat-card">
          <div class="stat-icon bg-primary">
            <i class="bi bi-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ representantesActivos }}</div>
            <div class="stat-label">Activos</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label for="buscarRepresentante" class="form-label">
              <i class="bi bi-search me-1"></i>
              Buscar
            </label>
            <input
              id="buscarRepresentante"
              type="text"
              class="form-control"
              placeholder="Buscar por nombre, apellidos, cédula o email..."
              v-model="searchTerm"
            />
          </div>
          <div class="col-md-3">
            <label for="filtroEstado" class="form-label">Estado</label>
            <select id="filtroEstado" class="form-select" v-model="filtroEstado">
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="form-label d-block">&nbsp;</span>
              <button
                class="btn btn-outline-secondary w-100"
                @click="limpiarFiltros"
                :disabled="!hayFiltrosActivos"
              >
                <i class="bi bi-x-circle me-1"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de representantes -->
    <div class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary" @click="exportarCSV">
              <i class="bi bi-download me-1"></i>
              Exportar CSV
            </button>
            <button class="btn btn-sm btn-outline-success" @click="exportarExcel">
              <i class="bi bi-file-earmark-excel me-1"></i>
              Exportar Excel
            </button>
          </div>
          <div class="text-muted">
            Mostrando {{ representantesFiltrados.length }} de {{ representantes.length }} representantes
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th class="sortable" @click="ordenar('apellidos')">
                  Apellidos y Nombres
                  <i
                    v-if="ordenColumna === 'apellidos'"
                    :class="ordenDireccion === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"
                    class="bi ms-1"
                  ></i>
                </th>
                <th>Cédula</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="representante in representantesPaginados" :key="representante.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div
                      class="avatar-circle me-2"
                      :style="{ backgroundColor: getAvatarColor(representante.id) }"
                    >
                      {{ getInitials(representante) }}
                    </div>
                    <div>
                      <strong>{{ representante.apellidos }}, {{ representante.nombres }}</strong>
                    </div>
                  </div>
                </td>
                <td>{{ representante.cedula }}</td>
                <td>
                  <i class="bi bi-telephone me-1"></i>
                  {{ representante.telefono }}
                </td>
                <td>
                  <i class="bi bi-envelope me-1"></i>
                  {{ representante.email }}
                </td>
                <td>
                  <code>{{ representante.username }}</code>
                </td>
                <td>
                  <span
                    :class="[
                      'badge',
                      representante.estado === 'activo' ? 'bg-success' : 'bg-secondary'
                    ]"
                  >
                    {{ representante.estado }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-info"
                      @click="verDetalle(representante)"
                      title="Ver detalles"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="confirmarEliminar(representante)"
                      title="Eliminar"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="representantesFiltrados.length === 0">
                <td colspan="7" class="text-center text-muted py-4">
                  <i class="bi bi-inbox display-4 d-block mb-2"></i>
                  No se encontraron representantes
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div
          v-if="totalPaginas > 1"
          class="d-flex justify-content-between align-items-center mt-3"
        >
          <div>
            <select v-model="itemsPorPagina" class="form-select form-select-sm" style="width: auto">
              <option :value="10">10 por página</option>
              <option :value="25">25 por página</option>
              <option :value="50">50 por página</option>
            </select>
          </div>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                <button class="page-link" @click="cambiarPagina(paginaActual - 1)">Anterior</button>
              </li>
              <li
                v-for="pagina in paginasVisibles"
                :key="pagina"
                class="page-item"
                :class="{ active: pagina === paginaActual }"
              >
                <button class="page-link" @click="cambiarPagina(pagina)">{{ pagina }}</button>
              </li>
              <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
                <button class="page-link" @click="cambiarPagina(paginaActual + 1)">Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal Ver/Editar Representante -->
    <Teleport to="body">
      <div
        v-if="representanteSeleccionado"
        class="modal fade show d-block"
        tabindex="-1"
        @click.self="cerrarModal"
      >
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-person-badge me-2"></i>
                {{ modoEdicion ? 'Editar Representante' : 'Información del Representante' }}
              </h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-4 text-center mb-3">
                  <div class="avatar-lg avatar-placeholder mx-auto mb-3">
                    {{ getInitials(representanteEditado) }}
                  </div>

                  <!-- Modo Vista -->
                  <template v-if="!modoEdicion">
                    <h5>{{ representanteEditado.nombres }} {{ representanteEditado.apellidos }}</h5>
                    <span
                      class="badge"
                      :class="representanteEditado.estado === 'activo' ? 'bg-success' : 'bg-secondary'"
                    >
                      {{ representanteEditado.estado }}
                    </span>
                  </template>

                  <!-- Modo Edición -->
                  <template v-else>
                    <div class="mb-2">
                      <label class="form-label small">Estado</label>
                      <select v-model="representanteEditado.estado" class="form-select form-select-sm">
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  </template>
                </div>

                <div class="col-md-8">
                  <!-- Modo Vista -->
                  <template v-if="!modoEdicion">
                    <h6 class="border-bottom pb-2 mb-3">Información Personal</h6>
                    <dl class="row">
                      <dt class="col-sm-4">Nombres:</dt>
                      <dd class="col-sm-8">{{ representanteEditado.nombres }}</dd>

                      <dt class="col-sm-4">Apellidos:</dt>
                      <dd class="col-sm-8">{{ representanteEditado.apellidos }}</dd>

                      <dt class="col-sm-4">Cédula:</dt>
                      <dd class="col-sm-8">{{ representanteEditado.cedula }}</dd>

                      <dt class="col-sm-4">Teléfono:</dt>
                      <dd class="col-sm-8">{{ representanteEditado.telefono }}</dd>

                      <dt class="col-sm-4">Email:</dt>
                      <dd class="col-sm-8">{{ representanteEditado.email }}</dd>
                    </dl>

                    <h6 class="border-bottom pb-2 mb-3">Credenciales de Acceso</h6>
                    <dl class="row">
                      <dt class="col-sm-4">Usuario:</dt>
                      <dd class="col-sm-8">
                        <code>{{ representanteEditado.username }}</code>
                      </dd>

                      <dt class="col-sm-4">Contraseña:</dt>
                      <dd class="col-sm-8">••••••••</dd>
                    </dl>
                    <p class="text-muted small mb-0">
                      <i class="bi bi-info-circle me-1"></i>
                      Estas credenciales se usan para el acceso al sistema
                    </p>
                  </template>

                  <!-- Modo Edición -->
                  <template v-else>
                    <h6 class="border-bottom pb-2 mb-3">Información Personal</h6>
                    <div class="row g-3 mb-4">
                      <div class="col-md-6">
                        <label class="form-label">Nombres</label>
                        <input
                          v-model="representanteEditado.nombres"
                          type="text"
                          class="form-control"
                          required
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Apellidos</label>
                        <input
                          v-model="representanteEditado.apellidos"
                          type="text"
                          class="form-control"
                          required
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Cédula</label>
                        <input
                          v-model="representanteEditado.cedula"
                          type="text"
                          class="form-control"
                          required
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Teléfono</label>
                        <input
                          v-model="representanteEditado.telefono"
                          type="tel"
                          class="form-control"
                          required
                        />
                      </div>
                      <div class="col-md-12">
                        <label class="form-label">Email</label>
                        <input
                          v-model="representanteEditado.email"
                          type="email"
                          class="form-control"
                          required
                        />
                      </div>
                    </div>

                    <h6 class="border-bottom pb-2 mb-3">Credenciales de Acceso</h6>
                    <p class="text-muted small mb-3">
                      <i class="bi bi-info-circle me-1"></i>
                      Estas credenciales se usarán para el acceso al sistema
                    </p>
                    <div class="row g-3">
                      <div class="col-md-12">
                        <label class="form-label">Usuario</label>
                        <input
                          v-model="representanteEditado.username"
                          type="text"
                          class="form-control"
                          required
                        />
                      </div>
                      <div class="col-md-12">
                        <label class="form-label">Contraseña</label>
                        <input
                          v-model="representanteEditado.password"
                          type="password"
                          class="form-control"
                          placeholder="Mínimo 8 caracteres, incluya mayúsculas, minúsculas y números"
                        />
                        <small class="text-muted">Dejar en blanco para mantener la contraseña actual</small>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <template v-if="!modoEdicion">
                <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
                <button type="button" class="btn btn-primary" @click="activarModoEdicion">
                  <i class="bi bi-pencil me-1"></i>
                  Editar
                </button>
              </template>
              <template v-else>
                <button type="button" class="btn btn-secondary" @click="cancelarEdicion">Cancelar</button>
                <button type="button" class="btn btn-success" @click="guardarEdicion">
                  <i class="bi bi-check-lg me-1"></i>
                  Guardar Cambios
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div v-if="representanteSeleccionado" class="modal-backdrop fade show"></div>
    </Teleport>

    <!-- Modal de confirmación de eliminación -->
    <Teleport to="body">
      <div
        v-if="representanteAEliminar"
        class="modal fade show d-block"
        tabindex="-1"
        @click.self="cancelarEliminar"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Confirmar Eliminación
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="cancelarEliminar"
              ></button>
            </div>
            <div class="modal-body">
              <p>¿Está seguro que desea eliminar al representante?</p>
              <div class="alert alert-warning">
                <strong>{{ representanteAEliminar.nombres }} {{ representanteAEliminar.apellidos }}</strong>
                <br />
                Cédula: {{ representanteAEliminar.cedula }}
              </div>
              <p class="text-muted mb-0">
                <small>Esta acción no se puede deshacer.</small>
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cancelarEliminar">Cancelar</button>
              <button type="button" class="btn btn-danger" @click="eliminarRepresentante">
                <i class="bi bi-trash me-1"></i>Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="representanteAEliminar" class="modal-backdrop fade show"></div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/stores/notification";
import { useRepresentativesStore } from "@/stores/representatives";

const router = useRouter();
const notificationStore = useNotificationStore();
const representativesStore = useRepresentativesStore();

// Obtener representantes del store con estado por defecto
const representantes = computed(() =>
  representativesStore.allRepresentatives.map((r) => ({
    ...r,
    estado: r.estado || "activo",
  }))
);

// Filtros
const searchTerm = ref("");
const filtroEstado = ref("");

// Ordenamiento
const ordenColumna = ref("apellidos");
const ordenDireccion = ref("asc");

// Paginación
const paginaActual = ref(1);
const itemsPorPagina = ref(10);

// Modales
const representanteSeleccionado = ref(null);
const representanteAEliminar = ref(null);
const modoEdicion = ref(false);
const representanteEditado = ref({});
const representanteOriginal = ref({});

// Estadísticas
const totalRepresentantes = computed(() => representantes.value.length);

const representantesActivos = computed(
  () => representantes.value.filter((r) => r.estado === "activo").length
);

// Verificar si hay filtros activos
const hayFiltrosActivos = computed(() => {
  return searchTerm.value !== "" || filtroEstado.value !== "";
});

// Función para limpiar filtros
function limpiarFiltros() {
  searchTerm.value = "";
  filtroEstado.value = "";
  paginaActual.value = 1;
  notificationStore.addNotification({
    type: "info",
    message: "Filtros limpiados",
  });
}

// Filtrado
const representantesFiltrados = computed(() => {
  let resultado = representantes.value;

  // Filtro de búsqueda
  if (searchTerm.value) {
    const termino = searchTerm.value.toLowerCase();
    resultado = resultado.filter(
      (r) =>
        r.nombres.toLowerCase().includes(termino) ||
        r.apellidos.toLowerCase().includes(termino) ||
        r.cedula.includes(termino) ||
        r.email.toLowerCase().includes(termino)
    );
  }

  // Filtro por estado
  if (filtroEstado.value) {
    resultado = resultado.filter((r) => r.estado === filtroEstado.value);
  }

  // Ordenamiento
  resultado.sort((a, b) => {
    let valorA = a[ordenColumna.value];
    let valorB = b[ordenColumna.value];

    if (typeof valorA === "string") {
      valorA = valorA.toLowerCase();
      valorB = valorB.toLowerCase();
    }

    if (ordenDireccion.value === "asc") {
      return valorA > valorB ? 1 : -1;
    }
    return valorA < valorB ? 1 : -1;
  });

  return resultado;
});

// Paginación
const totalPaginas = computed(() =>
  Math.ceil(representantesFiltrados.value.length / itemsPorPagina.value)
);

const representantesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value;
  const fin = inicio + itemsPorPagina.value;
  return representantesFiltrados.value.slice(inicio, fin);
});

const paginasVisibles = computed(() => {
  const paginas = [];
  const maxPaginas = 5;
  let inicio = Math.max(1, paginaActual.value - Math.floor(maxPaginas / 2));
  let fin = Math.min(totalPaginas.value, inicio + maxPaginas - 1);

  if (fin - inicio < maxPaginas - 1) {
    inicio = Math.max(1, fin - maxPaginas + 1);
  }

  for (let i = inicio; i <= fin; i++) {
    paginas.push(i);
  }

  return paginas;
});

// Funciones
function ordenar(columna) {
  if (ordenColumna.value === columna) {
    ordenDireccion.value = ordenDireccion.value === "asc" ? "desc" : "asc";
  } else {
    ordenColumna.value = columna;
    ordenDireccion.value = "asc";
  }
}

function cambiarPagina(pagina) {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina;
  }
}

function getAvatarColor(id) {
  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
  ];
  return colors[id % colors.length];
}

function getInitials(representante) {
  return (
    representante.nombres.charAt(0).toUpperCase() +
    representante.apellidos.charAt(0).toUpperCase()
  );
}

function goToRegistro() {
  router.push({ name: "admin-registro-representante" });
}

function verDetalle(representante) {
  representanteSeleccionado.value = representante;
  representanteEditado.value = { ...representante };
  representanteOriginal.value = { ...representante };
  modoEdicion.value = false;
}

function activarModoEdicion() {
  modoEdicion.value = true;
}

function cancelarEdicion() {
  representanteEditado.value = { ...representanteOriginal.value };
  modoEdicion.value = false;
}

function guardarEdicion() {
  // Validar campos requeridos
  if (
    !representanteEditado.value.nombres ||
    !representanteEditado.value.apellidos ||
    !representanteEditado.value.cedula ||
    !representanteEditado.value.email ||
    !representanteEditado.value.telefono ||
    !representanteEditado.value.username
  ) {
    notificationStore.addNotification({
      type: "error",
      message: "Por favor complete todos los campos requeridos",
    });
    return;
  }

  // Validar contraseña si se proporciona una nueva
  if (representanteEditado.value.password && representanteEditado.value.password.length > 0) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(representanteEditado.value.password)) {
      notificationStore.addNotification({
        type: "error",
        message: "La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas y números",
      });
      return;
    }
  } else {
    // Si no se proporciona contraseña, eliminar el campo para no actualizarlo
    delete representanteEditado.value.password;
  }

  // Actualizar en el store
  representativesStore.updateRepresentative(
    representanteEditado.value.id,
    representanteEditado.value
  );

  notificationStore.addNotification({
    type: "success",
    message: "Representante actualizado correctamente",
  });

  modoEdicion.value = false;
  representanteOriginal.value = { ...representanteEditado.value };
}

function cerrarModal() {
  representanteSeleccionado.value = null;
  representanteEditado.value = {};
  representanteOriginal.value = {};
  modoEdicion.value = false;
}

function confirmarEliminar(representante) {
  representanteAEliminar.value = representante;
}

function eliminarRepresentante() {
  if (representanteAEliminar.value) {
    representativesStore.deleteRepresentative(representanteAEliminar.value.id);
    notificationStore.addNotification({
      type: "success",
      message: "Representante eliminado correctamente",
    });
  }
  representanteAEliminar.value = null;
}

function cancelarEliminar() {
  representanteAEliminar.value = null;
}

function exportarCSV() {
  notificationStore.addNotification({
    type: "info",
    message: "Exportando a CSV...",
  });
}

function exportarExcel() {
  notificationStore.addNotification({
    type: "info",
    message: "Exportando a Excel...",
  });
}
</script>

<style scoped>
.representantes-view {
  padding: 0;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.avatar-lg {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.avatar-lg.avatar-placeholder {
  font-size: 2rem;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.modal.show {
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #ffffff !important;
  color: #212529 !important;
}

.modal-header,
.modal-body,
.modal-footer {
  color: #212529 !important;
}

.modal-header.bg-danger {
  background-color: #dc3545 !important;
  color: #ffffff !important;
}

.modal-header.bg-danger .modal-title,
.modal-header.bg-danger i {
  color: #ffffff !important;
}

.btn-group .btn {
  color: #212529 !important;
}

.btn-outline-info {
  color: #0dcaf0 !important;
  border-color: #0dcaf0 !important;
}

.btn-outline-info:hover {
  color: #ffffff !important;
  background-color: #0a5c75 !important;
  border-color: #0a5c75 !important;
}

.btn-outline-primary {
  color: #0d6efd !important;
  border-color: #0d6efd !important;
}

.btn-outline-primary:hover {
  color: #ffffff !important;
  background-color: #0d6efd !important;
}

.btn-outline-danger {
  color: #dc3545 !important;
  border-color: #dc3545 !important;
}

.btn-outline-danger:hover {
  color: #ffffff !important;
  background-color: #dc3545 !important;
}

.btn-outline-secondary {
  color: #6c757d !important;
  border-color: #6c757d !important;
}

.btn-outline-secondary:hover {
  color: #ffffff !important;
  background-color: #6c757d !important;
}

.btn-outline-success {
  color: #198754 !important;
  border-color: #198754 !important;
}

.btn-outline-success:hover {
  color: #ffffff !important;
  background-color: #198754 !important;
}

.table {
  color: #212529 !important;
}

.table thead th {
  color: #212529 !important;
  background-color: #f8f9fa;
}

.table tbody td {
  color: #212529 !important;
}

.card {
  background-color: #ffffff !important;
  color: #212529 !important;
}

.card-body {
  color: #212529 !important;
}

.form-label,
label {
  color: #212529 !important;
}

.form-control,
.form-select {
  color: #212529 !important;
  background-color: #ffffff !important;
}

dl dt {
  font-weight: 600;
  color: #212529 !important;
}

dl dd {
  color: #495057 !important;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: #212529 !important;
}

p {
  color: #212529 !important;
}

.text-muted {
  color: #6c757d !important;
}

/* Estilos para el offcanvas */
.offcanvas {
  position: fixed;
  bottom: 0;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  color: #212529;
  visibility: hidden;
  background-color: #fff;
  background-clip: padding-box;
  outline: 0;
  transition: transform 0.3s ease-in-out;
}

.offcanvas.show {
  transform: none;
}

.offcanvas-end {
  top: 0;
  right: 0;
  border-left: 1px solid rgba(0, 0, 0, 0.2);
  transform: translateX(100%);
}

.offcanvas-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.offcanvas-title {
  margin: 0;
  line-height: 1.5;
}

.offcanvas-body {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
}

.offcanvas-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

.offcanvas-backdrop.show {
  opacity: 0.5;
}

</style>