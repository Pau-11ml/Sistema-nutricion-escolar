<template>
  <div class="estudiantes-view">
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1">
          <i class="bi bi-people-fill me-2"></i>
          {{ $t("admin.estudiantes.titulo") }}
        </h1>
        <p class="text-muted mb-0">
          {{ $t("admin.estudiantes.subtitulo") }}
        </p>
      </div>
      <button class="btn btn-primary" @click="goToRegistro">
        <i class="bi bi-plus-circle me-2"></i>
        {{ $t("admin.estudiantes.nuevoEstudiante") }}
      </button>
    </div>

    <!-- Estadísticas -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-primary">
            <i class="bi bi-people"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalEstudiantes }}</div>
            <div class="stat-label">Total Estudiantes</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-success">
            <i class="bi bi-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ estudiantesActivos }}</div>
            <div class="stat-label">Activos</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-warning">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ estudiantesAlergias }}</div>
            <div class="stat-label">Con Alergias</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-info">
            <i class="bi bi-mortarboard"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalGrados }}</div>
            <div class="stat-label">Grados</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label for="buscarEstudiante" class="form-label">
              <i class="bi bi-search me-1"></i>
              Buscar
            </label>
            <input
              id="buscarEstudiante"
              v-model="searchTerm"
              type="text"
              class="form-control"
              :placeholder="$t('admin.estudiantes.buscarPlaceholder')"
            />
          </div>
          <div class="col-md-2">
            <label for="filtroGrado" class="form-label">
              <i class="bi bi-funnel me-1"></i>
              Grado
            </label>
            <select id="filtroGrado" v-model="filtroGrado" class="form-select">
              <option value="">Todos</option>
              <option v-for="grado in grados" :key="grado" :value="grado">
                {{ grado }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label for="filtroParalelo" class="form-label">Paralelo</label>
            <select id="filtroParalelo" v-model="filtroParalelo" class="form-select">
              <option value="">Todos</option>
              <option v-for="paralelo in paralelos" :key="paralelo" :value="paralelo">
                {{ paralelo }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label for="filtroEstado" class="form-label">Estado</label>
            <select id="filtroEstado" v-model="filtroEstado" class="form-select">
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div class="col-md-2">
            <div class="d-flex flex-column">
              <span class="form-label d-block">&nbsp;</span>
              <button class="btn btn-outline-secondary w-100" @click="limpiarFiltros">
                <i class="bi bi-x-circle me-1"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de estudiantes -->
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
            Mostrando {{ estudiantesFiltrados.length }} de {{ estudiantes.length }} estudiantes
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th>
                  <input
                    v-model="seleccionarTodos"
                    type="checkbox"
                    class="form-check-input"
                    @change="toggleSeleccionarTodos"
                  />
                </th>
                <th>Foto</th>
                <th class="sortable" @click="ordenarPor('nombres')">
                  Nombres
                  <i
                    v-if="ordenColumna === 'nombres'"
                    :class="ordenDireccion === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"
                    class="bi ms-1"
                  ></i>
                </th>
                <th class="sortable" @click="ordenarPor('apellidos')">
                  Apellidos
                  <i
                    v-if="ordenColumna === 'apellidos'"
                    :class="ordenDireccion === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"
                    class="bi ms-1"
                  ></i>
                </th>
                <th>Cédula</th>
                <th class="sortable" @click="ordenarPor('grado')">
                  Grado
                  <i
                    v-if="ordenColumna === 'grado'"
                    :class="ordenDireccion === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"
                    class="bi ms-1"
                  ></i>
                </th>
                <th>Paralelo</th>
                <th>Alergias</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="estudiante in estudiantesPaginados" :key="estudiante.id">
                <td>
                  <input
                    v-model="estudiantesSeleccionados"
                    type="checkbox"
                    class="form-check-input"
                    :value="estudiante.id"
                  />
                </td>
                <td>
                  <div class="avatar-sm">
                    <img
                      v-if="estudiante.foto"
                      :src="estudiante.foto"
                      :alt="estudiante.nombres"
                      class="rounded-circle"
                    />
                    <div v-else class="avatar-placeholder">
                      {{ getIniciales(estudiante.nombres, estudiante.apellidos) }}
                    </div>
                  </div>
                </td>
                <td>{{ estudiante.nombres }}</td>
                <td>{{ estudiante.apellidos }}</td>
                <td>{{ estudiante.cedula }}</td>
                <td>
                  <span class="badge bg-primary">{{ estudiante.grado }}</span>
                </td>
                <td>{{ estudiante.paralelo }}</td>
                <td>
                  <span
                    v-if="estudiante.alergias && estudiante.alergias.length > 0"
                    class="badge bg-warning text-dark"
                  >
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    {{ estudiante.alergias.length }}
                  </span>
                  <span v-else class="text-muted">Ninguna</span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="estudiante.estado === 'activo' ? 'bg-success' : 'bg-secondary'"
                  >
                    {{ estudiante.estado }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-info"
                      :title="$t('admin.estudiantes.ver')"
                      @click="verEstudiante(estudiante)"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      :title="$t('admin.estudiantes.eliminar')"
                      @click="confirmarEliminar(estudiante)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div>
            <select v-model="itemsPorPagina" class="form-select form-select-sm" style="width: auto">
              <option :value="10">10 por página</option>
              <option :value="25">25 por página</option>
              <option :value="50">50 por página</option>
              <option :value="100">100 por página</option>
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

    <!-- Modal Ver/Editar Estudiante -->
    <Teleport to="body">
      <div
        v-if="estudianteSeleccionado"
        class="modal fade show d-block"
        tabindex="-1"
        @click.self="cerrarModal"
      >
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-person-circle me-2"></i>
                {{ modoEdicion ? 'Editar Estudiante' : 'Información del Estudiante' }}
              </h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <!-- Modo Vista -->
              <div v-if="!modoEdicion" class="row">
                <div class="col-md-4 text-center mb-3">
                  <div v-if="estudianteSeleccionado.foto" class="avatar-lg mx-auto mb-3">
                    <img
                      :src="estudianteSeleccionado.foto"
                      :alt="estudianteSeleccionado.nombres"
                      class="rounded-circle w-100"
                    />
                  </div>
                  <div v-else class="avatar-lg avatar-placeholder mx-auto mb-3">
                    {{ getIniciales(estudianteSeleccionado.nombres, estudianteSeleccionado.apellidos) }}
                  </div>
                  <h5>
                    {{ estudianteSeleccionado.nombres }} {{ estudianteSeleccionado.apellidos }}
                  </h5>
                  <span
                    class="badge"
                    :class="estudianteSeleccionado.estado === 'activo' ? 'bg-success' : 'bg-secondary'"
                  >
                    {{ estudianteSeleccionado.estado }}
                  </span>
                </div>
                <div class="col-md-8">
                  <h6 class="border-bottom pb-2 mb-3">Información Personal</h6>
                  <dl class="row">
                    <dt class="col-sm-4">Cédula:</dt>
                    <dd class="col-sm-8">{{ estudianteSeleccionado.cedula }}</dd>
                    <dt class="col-sm-4">Fecha de Nacimiento:</dt>
                    <dd class="col-sm-8">{{ estudianteSeleccionado.fechaNacimiento }}</dd>
                    <dt class="col-sm-4">Edad:</dt>
                    <dd class="col-sm-8">{{ calcularEdad(estudianteSeleccionado.fechaNacimiento) }} años</dd>
                    <dt class="col-sm-4">Género:</dt>
                    <dd class="col-sm-8">{{ estudianteSeleccionado.genero }}</dd>
                  </dl>

                  <h6 class="border-bottom pb-2 mb-3">Información Académica</h6>
                  <dl class="row">
                    <dt class="col-sm-4">Grado:</dt>
                    <dd class="col-sm-8">{{ estudianteSeleccionado.grado }}</dd>
                    <dt class="col-sm-4">Paralelo:</dt>
                    <dd class="col-sm-8">{{ estudianteSeleccionado.paralelo }}</dd>
                    <dt class="col-sm-4">Año Lectivo:</dt>
                    <dd class="col-sm-8">{{ estudianteSeleccionado.anioLectivo }}</dd>
                  </dl>

                  <h6 class="border-bottom pb-2 mb-3">Información de Salud</h6>
                  <dl class="row">
                    <dt class="col-sm-4">Alergias:</dt>
                    <dd class="col-sm-8">
                      <span v-if="estudianteSeleccionado.alergias && estudianteSeleccionado.alergias.length > 0">
                        <span
                          v-for="(alergia, index) in estudianteSeleccionado.alergias"
                          :key="index"
                          class="badge bg-warning text-dark me-1"
                        >
                          {{ alergia }}
                        </span>
                      </span>
                      <span v-else class="text-muted">Ninguna registrada</span>
                    </dd>
                    <dt class="col-sm-4">Observaciones:</dt>
                    <dd class="col-sm-8">{{ estudianteSeleccionado.observaciones || 'Sin observaciones' }}</dd>
                  </dl>

                  <h6 class="border-bottom pb-2 mb-3">Representante</h6>
                  <dl class="row mb-0">
                    <dt class="col-sm-4">Nombre:</dt>
                    <dd class="col-sm-8">{{ estudianteSeleccionado.representante?.nombre }}</dd>
                  </dl>
                </div>
              </div>

              <!-- Modo Edición -->
              <div v-else>
                <form @submit.prevent="guardarCambios">
                  <h6 class="border-bottom pb-2 mb-3">Información Personal</h6>
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Nombres *</label>
                      <input v-model="formEdicion.nombres" type="text" class="form-control" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Apellidos *</label>
                      <input v-model="formEdicion.apellidos" type="text" class="form-control" required />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Cédula *</label>
                      <input v-model="formEdicion.cedula" type="text" class="form-control" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Fecha de Nacimiento *</label>
                      <input v-model="formEdicion.fechaNacimiento" type="date" class="form-control" required />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Género *</label>
                      <select v-model="formEdicion.genero" class="form-select" required>
                        <option value="">Seleccione...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Estado *</label>
                      <select v-model="formEdicion.estado" class="form-select" required>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>

                  <h6 class="border-bottom pb-2 mb-3">Información Académica</h6>
                  <div class="row mb-3">
                    <div class="col-md-4">
                      <label class="form-label">Grado *</label>
                      <select v-model="formEdicion.grado" class="form-select" required>
                        <option value="">Seleccione...</option>
                        <option value="1ro">1ro</option>
                        <option value="2do">2do</option>
                        <option value="3ro">3ro</option>
                        <option value="4to">4to</option>
                        <option value="5to">5to</option>
                        <option value="6to">6to</option>
                        <option value="7mo">7mo</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Paralelo *</label>
                      <select v-model="formEdicion.paralelo" class="form-select" required>
                        <option value="">Seleccione...</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Año Lectivo *</label>
                      <input v-model="formEdicion.anioLectivo" type="text" class="form-control" placeholder="2024-2025" required />
                    </div>
                  </div>

                  <h6 class="border-bottom pb-2 mb-3">Información de Salud</h6>
                  <div class="row mb-3">
                    <div class="col-12">
                      <label class="form-label">Alergias</label>
                      <input
                        v-model="formEdicion.alergiasTexto"
                        type="text"
                        class="form-control"
                        placeholder="Separar por comas (ej: Mani, Lactosa)"
                      />
                      <small class="text-muted">Ingrese las alergias separadas por comas</small>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-12">
                      <label class="form-label">Observaciones</label>
                      <textarea
                        v-model="formEdicion.observaciones"
                        class="form-control"
                        rows="3"
                        placeholder="Observaciones adicionales..."
                      ></textarea>
                    </div>
                  </div>

                  <h6 class="border-bottom pb-2 mb-3">Representante</h6>
                  <div class="row mb-3">
                    <div class="col-12">
                      <label class="form-label">Nombre del Representante *</label>
                      <input v-model="formEdicion.representante.nombre" type="text" class="form-control" required />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="modal-footer">
              <button v-if="!modoEdicion" type="button" class="btn btn-secondary" @click="cerrarModal">
                Cerrar
              </button>
              <button v-if="!modoEdicion" type="button" class="btn btn-primary" @click="activarModoEdicion">
                <i class="bi bi-pencil me-1"></i>
                Editar
              </button>
              <button v-if="modoEdicion" type="button" class="btn btn-secondary" @click="cancelarEdicion">
                Cancelar
              </button>
              <button v-if="modoEdicion" type="button" class="btn btn-primary" @click="guardarCambios">
                <i class="bi bi-save me-1"></i>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="estudianteSeleccionado" class="modal-backdrop fade show"></div>
    </Teleport>

    <!-- Modal Confirmar Eliminar -->
    <Teleport to="body">
      <div
        v-if="estudianteAEliminar"
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
              <button type="button" class="btn-close btn-close-white" @click="cancelarEliminar"></button>
            </div>
            <div class="modal-body">
              <p>¿Está seguro que desea eliminar al estudiante?</p>
              <div class="alert alert-warning">
                <strong>{{ estudianteAEliminar.nombres }} {{ estudianteAEliminar.apellidos }}</strong>
                <br />
                Cédula: {{ estudianteAEliminar.cedula }}
              </div>
              <p class="text-muted mb-0">
                <small>Esta acción no se puede deshacer.</small>
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cancelarEliminar">Cancelar</button>
              <button type="button" class="btn btn-danger" @click="eliminarEstudiante">
                <i class="bi bi-trash me-1"></i>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="estudianteAEliminar" class="modal-backdrop fade show"></div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/stores/notification";
import { useStudentsStore } from "@/stores/students";

const router = useRouter();
const notificationStore = useNotificationStore();
const studentsStore = useStudentsStore();

const estudiantes = computed(() => studentsStore.allStudents);

const searchTerm = ref("");
const filtroGrado = ref("");
const filtroParalelo = ref("");
const filtroEstado = ref("");

const ordenColumna = ref("apellidos");
const ordenDireccion = ref("asc");

const paginaActual = ref(1);
const itemsPorPagina = ref(10);

const seleccionarTodos = ref(false);
const estudiantesSeleccionados = ref([]);

const estudianteSeleccionado = ref(null);
const estudianteAEliminar = ref(null);
const modoEdicion = ref(false);
const formEdicion = ref({
  nombres: '',
  apellidos: '',
  cedula: '',
  fechaNacimiento: '',
  genero: '',
  estado: '',
  grado: '',
  paralelo: '',
  anioLectivo: '',
  alergiasTexto: '',
  observaciones: '',
  representante: { nombre: '' }
});

const grados = computed(() => {
  const gradosUnicos = new Set(estudiantes.value.map((e) => e.grado));
  return Array.from(gradosUnicos).sort();
});

const paralelos = computed(() => {
  const paralelosUnicos = new Set(estudiantes.value.map((e) => e.seccion || e.paralelo));
  return Array.from(paralelosUnicos).sort();
});

const totalEstudiantes = computed(() => estudiantes.value.length);

const estudiantesActivos = computed(() =>
  estudiantes.value.filter((e) => (e.estado || 'activo') === "activo").length
);

const estudiantesAlergias = computed(() =>
  estudiantes.value.filter((e) => 
    e.alergias && (Array.isArray(e.alergias) ? e.alergias.length > 0 : e.alergias.trim().length > 0)
  ).length
);

const totalGrados = computed(() => grados.value.length);

const estudiantesFiltrados = computed(() => {
  let resultado = estudiantes.value;

  if (searchTerm.value) {
    const termino = searchTerm.value.toLowerCase();
    resultado = resultado.filter((e) => {
      const nombreCompleto = `${e.nombres} ${e.apellidos}`.toLowerCase();
      const cedula = e.cedula || '';
      const grado = (e.grado || '').toLowerCase();
      
      let tieneAlergia = false;
      if (e.alergias) {
        if (Array.isArray(e.alergias)) {
          tieneAlergia = e.alergias.some(a => a.toLowerCase().includes(termino));
        } else if (typeof e.alergias === 'string') {
          tieneAlergia = e.alergias.toLowerCase().includes(termino);
        }
      }
      
      return nombreCompleto.includes(termino) || cedula.includes(termino) || grado.includes(termino) || tieneAlergia;
    });
  }

  if (filtroGrado.value) {
    resultado = resultado.filter((e) => e.grado === filtroGrado.value);
  }

  if (filtroParalelo.value) {
    resultado = resultado.filter((e) => (e.paralelo || e.seccion) === filtroParalelo.value);
  }

  if (filtroEstado.value) {
    resultado = resultado.filter((e) => (e.estado || 'activo') === filtroEstado.value);
  }

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

const totalPaginas = computed(() =>
  Math.ceil(estudiantesFiltrados.value.length / itemsPorPagina.value)
);

const estudiantesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value;
  const fin = inicio + itemsPorPagina.value;
  return estudiantesFiltrados.value.slice(inicio, fin);
});

const paginasVisibles = computed(() => {
  const paginas = [];
  const maxPaginas = 5;
  let inicio = Math.max(1, paginaActual.value - Math.floor(maxPaginas / 2));
  const fin = Math.min(totalPaginas.value, inicio + maxPaginas - 1);

  if (fin - inicio < maxPaginas - 1) {
    inicio = Math.max(1, fin - maxPaginas + 1);
  }

  for (let i = inicio; i <= fin; i++) {
    paginas.push(i);
  }

  return paginas;
});

function limpiarFiltros() {
  searchTerm.value = "";
  filtroGrado.value = "";
  filtroParalelo.value = "";
  filtroEstado.value = "";
}

function ordenarPor(columna) {
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

function toggleSeleccionarTodos() {
  if (seleccionarTodos.value) {
    estudiantesSeleccionados.value = estudiantesPaginados.value.map((e) => e.id);
  } else {
    estudiantesSeleccionados.value = [];
  }
}

function getIniciales(nombres, apellidos) {
  const inicialesNombre = nombres.split(" ")[0][0] || "";
  const inicialesApellido = apellidos.split(" ")[0][0] || "";
  return (inicialesNombre + inicialesApellido).toUpperCase();
}

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

function goToRegistro() {
  router.push({ name: "admin-registro-estudiante" });
}

function verEstudiante(estudiante) {
  estudianteSeleccionado.value = estudiante;
  modoEdicion.value = false;
}

function activarModoEdicion() {
  modoEdicion.value = true;
  
  let alergiasTexto = '';
  if (estudianteSeleccionado.value.alergias) {
    if (Array.isArray(estudianteSeleccionado.value.alergias)) {
      alergiasTexto = estudianteSeleccionado.value.alergias.join(', ');
    } else if (typeof estudianteSeleccionado.value.alergias === 'string') {
      alergiasTexto = estudianteSeleccionado.value.alergias;
    }
  }
  
  formEdicion.value = {
    nombres: estudianteSeleccionado.value.nombres || '',
    apellidos: estudianteSeleccionado.value.apellidos || '',
    cedula: estudianteSeleccionado.value.cedula || '',
    fechaNacimiento: estudianteSeleccionado.value.fechaNacimiento || '',
    genero: estudianteSeleccionado.value.genero || '',
    estado: estudianteSeleccionado.value.estado || 'activo',
    grado: estudianteSeleccionado.value.grado || '',
    paralelo: estudianteSeleccionado.value.paralelo || '',
    anioLectivo: estudianteSeleccionado.value.anioLectivo || '',
    alergiasTexto: alergiasTexto,
    observaciones: estudianteSeleccionado.value.observaciones || '',
    representante: {
      nombre: estudianteSeleccionado.value.representante?.nombre || ''
    }
  };
}

function cancelarEdicion() {
  modoEdicion.value = false;
}

function guardarCambios() {
  const alergiasArray = formEdicion.value.alergiasTexto
    .split(',')
    .map(a => a.trim())
    .filter(a => a.length > 0);
  
  const index = estudiantes.value.findIndex(e => e.id === estudianteSeleccionado.value.id);
  
  if (index !== -1) {
    estudiantes.value[index] = {
      ...estudiantes.value[index],
      nombres: formEdicion.value.nombres,
      apellidos: formEdicion.value.apellidos,
      cedula: formEdicion.value.cedula,
      fechaNacimiento: formEdicion.value.fechaNacimiento,
      genero: formEdicion.value.genero,
      estado: formEdicion.value.estado,
      grado: formEdicion.value.grado,
      paralelo: formEdicion.value.paralelo,
      anioLectivo: formEdicion.value.anioLectivo,
      alergias: alergiasArray,
      observaciones: formEdicion.value.observaciones,
      representante: {
        nombre: formEdicion.value.representante.nombre
      }
    };
    
    estudianteSeleccionado.value = estudiantes.value[index];
    
    notificationStore.addNotification({
      type: 'success',
      message: 'Estudiante actualizado correctamente'
    });
    
    modoEdicion.value = false;
  }
}

function confirmarEliminar(estudiante) {
  estudianteAEliminar.value = estudiante;
}

function eliminarEstudiante() {
  const index = estudiantes.value.findIndex(e => e.id === estudianteAEliminar.value.id);
  if (index !== -1) {
    estudiantes.value.splice(index, 1);
    notificationStore.addNotification({
      type: "success",
      message: "Estudiante eliminado correctamente",
    });
  }
  estudianteAEliminar.value = null;
}

function cancelarEliminar() {
  estudianteAEliminar.value = null;
}

function cerrarModal() {
  estudianteSeleccionado.value = null;
  modoEdicion.value = false;
}

function exportarCSV() {
  const headers = ['Nombres', 'Apellidos', 'Cédula', 'Grado', 'Edad', 'Email', 'Teléfono', 'Estado'];
  const rows = estudiantesFiltrados.value.map(e => [
    e.nombres,
    e.apellidos,
    e.cedula,
    e.grado,
    e.edad,
    e.email || 'N/A',
    e.telefono || 'N/A',
    e.estado
  ]);
  
  let csvContent = headers.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `estudiantes_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  notificationStore.addNotification({
    type: "success",
    message: "CSV exportado correctamente",
  });
}

function exportarExcel() {
  const headers = ['Nombres', 'Apellidos', 'Cédula', 'Grado', 'Edad', 'Email', 'Teléfono', 'Estado'];
  const rows = estudiantesFiltrados.value.map(e => [
    e.nombres,
    e.apellidos,
    e.cedula,
    e.grado,
    e.edad,
    e.email || 'N/A',
    e.telefono || 'N/A',
    e.estado
  ]);
  
  let htmlTable = '<table border="1"><thead><tr>';
  headers.forEach(h => {
    htmlTable += `<th>${h}</th>`;
  });
  htmlTable += '</tr></thead><tbody>';
  
  rows.forEach(row => {
    htmlTable += '<tr>';
    row.forEach(cell => {
      htmlTable += `<td>${cell}</td>`;
    });
    htmlTable += '</tr>';
  });
  htmlTable += '</tbody></table>';
  
  const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `estudiantes_${new Date().toISOString().split('T')[0]}.xls`;
  link.click();
  
  notificationStore.addNotification({
    type: "success",
    message: "Excel exportado correctamente",
  });
}
</script>

<style scoped>
.estudiantes-view {
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

.avatar-sm {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: linear-gradient(135deg, #3e46a6 0%, #47246f 100%);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
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

.table-responsive {
  overflow-x: auto;
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
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
  background-color: #087990 !important;
  border-color: #087990 !important;
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
</style>