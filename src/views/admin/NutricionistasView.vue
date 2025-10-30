<template>
  <div class="nutricionistas-view">
    <!-- Encabezado -->
    <div
      class="d-flex justify-content-between align-items-center mb-4"
    >
      <div>
        <h1 class="h3 mb-1">
          <i
            class="bi bi-clipboard2-pulse-fill me-2"
          ></i>
          {{ $t("admin.nutricionistas.titulo") }}
        </h1>
        <p class="text-muted mb-0">
          {{
            $t("admin.nutricionistas.subtitulo")
          }}
        </p>
      </div>
      <button
        class="btn btn-primary"
        @click="goToRegistro"
      >
        <i class="bi bi-plus-circle me-2"></i>
        {{
          $t(
            "admin.nutricionistas.nuevoNutricionista"
          )
        }}
      </button>
    </div>

    <!-- Estadísticas -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-success">
            <i class="bi bi-person-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ totalNutricionistas }}
            </div>
            <div class="stat-label">
              Total Nutricionistas
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-primary">
            <i class="bi bi-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ nutricionistasActivos }}
            </div>
            <div class="stat-label">Activos</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-info">
            <i class="bi bi-calendar-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ menusCreados }}
            </div>
            <div class="stat-label">
              Menús Creados
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div
            class="stat-icon bg-warning text-dark"
          >
            <i class="bi bi-people"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ estudiantesAsignados }}
            </div>
            <div class="stat-label">
              Estudiantes Asignados
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label
              for="buscarNutricionista"
              class="form-label"
            >
              <i class="bi bi-search me-1"></i>
              Buscar
            </label>
            <input
              id="buscarNutricionista"
              v-model="searchTerm"
              type="text"
              class="form-control"
              :placeholder="
                $t(
                  'admin.nutricionistas.buscarPlaceholder'
                )
              "
            />
          </div>
          <div class="col-md-3">
            <label
              for="filtroEstado"
              class="form-label"
            >
              Estado
            </label>
            <select
              id="filtroEstado"
              v-model="filtroEstado"
              class="form-select"
            >
              <option value="">Todos</option>
              <option value="activo">
                Activo
              </option>
              <option value="inactivo">
                Inactivo
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="form-label d-block"
                >&nbsp;</span
              >
              <button
                class="btn btn-outline-secondary w-100"
                @click="limpiarFiltros"
              >
                <i
                  class="bi bi-x-circle me-1"
                ></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de nutricionistas -->
    <div class="card">
      <div class="card-body">
        <div
          class="d-flex justify-content-between align-items-center mb-3"
        >
          <div class="d-flex gap-2">
            <button
              class="btn btn-sm btn-outline-primary"
              @click="exportarCSV"
            >
              <i class="bi bi-download me-1"></i>
              Exportar CSV
            </button>
            <button
              class="btn btn-sm btn-outline-success"
              @click="exportarExcel"
            >
              <i
                class="bi bi-file-earmark-excel me-1"
              ></i>
              Exportar Excel
            </button>
          </div>
          <div class="text-muted">
            Mostrando
            {{ nutricionistasFiltrados.length }}
            de
            {{ nutricionistas.length }}
            nutricionistas
          </div>
        </div>

        <div class="table-responsive">
          <table
            class="table table-hover align-middle"
          >
            <thead>
              <tr>
                <th>Foto</th>
                <th
                  class="sortable"
                  @click="ordenarPor('nombres')"
                >
                  Nombres
                  <i
                    v-if="
                      ordenColumna === 'nombres'
                    "
                    :class="
                      ordenDireccion === 'asc'
                        ? 'bi-sort-up'
                        : 'bi-sort-down'
                    "
                    class="bi ms-1"
                  ></i>
                </th>
                <th
                  class="sortable"
                  @click="ordenarPor('apellidos')"
                >
                  Apellidos
                  <i
                    v-if="
                      ordenColumna === 'apellidos'
                    "
                    :class="
                      ordenDireccion === 'asc'
                        ? 'bi-sort-up'
                        : 'bi-sort-down'
                    "
                    class="bi ms-1"
                  ></i>
                </th>
                <th>Cédula</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estudiantes Asignados</th>
                <th>Menús Creados</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="nutricionista in nutricionistasPaginados"
                :key="nutricionista.id"
              >
                <td>
                  <div class="avatar-sm">
                    <img
                      v-if="nutricionista.foto"
                      :src="nutricionista.foto"
                      :alt="nutricionista.nombres"
                      class="rounded-circle"
                    />
                    <div
                      v-else
                      class="avatar-placeholder"
                    >
                      {{
                        getIniciales(
                          nutricionista.nombres,
                          nutricionista.apellidos
                        )
                      }}
                    </div>
                  </div>
                </td>
                <td>
                  {{ nutricionista.nombres }}
                </td>
                <td>
                  {{ nutricionista.apellidos }}
                </td>
                <td>
                  {{ nutricionista.cedula }}
                </td>
                <td>{{ nutricionista.email }}</td>
                <td>
                  {{ nutricionista.telefono }}
                </td>
                <td class="text-center">
                  <span class="badge bg-info">
                    {{
                      nutricionista.estudiantesAsignados
                    }}
                  </span>
                </td>
                <td class="text-center">
                  <span class="badge bg-success">
                    {{
                      nutricionista.menusCreados
                    }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="
                      nutricionista.estado ===
                      'activo'
                        ? 'bg-success'
                        : 'bg-secondary'
                    "
                  >
                    {{ nutricionista.estado }}
                  </span>
                </td>
                <td>
                  <div
                    class="btn-group btn-group-sm"
                  >
                    <button
                      class="btn btn-outline-info"
                      :title="
                        $t(
                          'admin.nutricionistas.ver'
                        )
                      "
                      @click="
                        verNutricionista(
                          nutricionista
                        )
                      "
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      class="btn btn-outline-primary"
                      :title="
                        $t(
                          'admin.nutricionistas.editar'
                        )
                      "
                      @click="
                        editarNutricionista(
                          nutricionista
                        )
                      "
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      :title="
                        $t(
                          'admin.nutricionistas.eliminar'
                        )
                      "
                      @click="
                        confirmarEliminar(
                          nutricionista
                        )
                      "
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
        <div
          class="d-flex justify-content-between align-items-center mt-3"
        >
          <div>
            <select
              v-model="itemsPorPagina"
              class="form-select form-select-sm"
              style="width: auto"
            >
              <option :value="10">
                10 por página
              </option>
              <option :value="25">
                25 por página
              </option>
              <option :value="50">
                50 por página
              </option>
            </select>
          </div>
          <nav>
            <ul
              class="pagination pagination-sm mb-0"
            >
              <li
                class="page-item"
                :class="{
                  disabled: paginaActual === 1,
                }"
              >
                <button
                  class="page-link"
                  @click="
                    cambiarPagina(
                      paginaActual - 1
                    )
                  "
                >
                  Anterior
                </button>
              </li>
              <li
                v-for="pagina in paginasVisibles"
                :key="pagina"
                class="page-item"
                :class="{
                  active: pagina === paginaActual,
                }"
              >
                <button
                  class="page-link"
                  @click="cambiarPagina(pagina)"
                >
                  {{ pagina }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{
                  disabled:
                    paginaActual === totalPaginas,
                }"
              >
                <button
                  class="page-link"
                  @click="
                    cambiarPagina(
                      paginaActual + 1
                    )
                  "
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal Ver Nutricionista -->
    <Teleport to="body">
      <div
        v-if="nutricionistaSeleccionado"
        class="modal fade show d-block"
        tabindex="-1"
        @click.self="cerrarModal"
      >
        <div
          class="modal-dialog modal-lg modal-dialog-scrollable"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i
                  class="bi bi-person-circle me-2"
                ></i>
                Información del Nutricionista
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="cerrarModal"
              ></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div
                  class="col-md-4 text-center mb-3"
                >
                  <div
                    v-if="
                      nutricionistaSeleccionado.foto
                    "
                    class="avatar-lg mx-auto mb-3"
                  >
                    <img
                      :src="
                        nutricionistaSeleccionado.foto
                      "
                      :alt="
                        nutricionistaSeleccionado.nombres
                      "
                      class="rounded-circle w-100"
                    />
                  </div>
                  <div
                    v-else
                    class="avatar-lg avatar-placeholder mx-auto mb-3"
                  >
                    {{
                      getIniciales(
                        nutricionistaSeleccionado.nombres,
                        nutricionistaSeleccionado.apellidos
                      )
                    }}
                  </div>
                  <h5>
                    {{
                      nutricionistaSeleccionado.nombres
                    }}
                    {{
                      nutricionistaSeleccionado.apellidos
                    }}
                  </h5>
                  <span
                    class="badge"
                    :class="
                      nutricionistaSeleccionado.estado ===
                      'activo'
                        ? 'bg-success'
                        : 'bg-secondary'
                    "
                  >
                    {{
                      nutricionistaSeleccionado.estado
                    }}
                  </span>
                </div>
                <div class="col-md-8">
                  <h6
                    class="border-bottom pb-2 mb-3"
                  >
                    Información Personal
                  </h6>
                  <dl class="row">
                    <dt class="col-sm-4">
                      Cédula:
                    </dt>
                    <dd class="col-sm-8">
                      {{
                        nutricionistaSeleccionado.cedula
                      }}
                    </dd>

                    <dt class="col-sm-4">
                      Email:
                    </dt>
                    <dd class="col-sm-8">
                      {{
                        nutricionistaSeleccionado.email
                      }}
                    </dd>

                    <dt class="col-sm-4">
                      Teléfono:
                    </dt>
                    <dd class="col-sm-8">
                      {{
                        nutricionistaSeleccionado.telefono
                      }}
                    </dd>
                  </dl>

                  <h6
                    class="border-bottom pb-2 mb-3"
                  >
                    Información Profesional
                  </h6>
                  <dl class="row">
                    <dt class="col-sm-4">
                      Título:
                    </dt>
                    <dd class="col-sm-8">
                      {{
                        nutricionistaSeleccionado.titulo
                      }}
                    </dd>

                    <dt class="col-sm-4">
                      Registro Profesional:
                    </dt>
                    <dd class="col-sm-8">
                      {{
                        nutricionistaSeleccionado.registroProfesional
                      }}
                    </dd>

                    <dt class="col-sm-4">
                      Años de Experiencia:
                    </dt>
                    <dd class="col-sm-8">
                      {{
                        nutricionistaSeleccionado.aniosExperiencia
                      }}
                    </dd>
                  </dl>

                  <h6
                    class="border-bottom pb-2 mb-3"
                  >
                    Estadísticas
                  </h6>
                  <dl class="row mb-0">
                    <dt class="col-sm-4">
                      Estudiantes Asignados:
                    </dt>
                    <dd class="col-sm-8">
                      <span
                        class="badge bg-info"
                        >{{
                          nutricionistaSeleccionado.estudiantesAsignados
                        }}</span
                      >
                    </dd>

                    <dt class="col-sm-4">
                      Menús Creados:
                    </dt>
                    <dd class="col-sm-8">
                      <span
                        class="badge bg-success"
                        >{{
                          nutricionistaSeleccionado.menusCreados
                        }}</span
                      >
                    </dd>

                    <dt class="col-sm-4">
                      Fecha de Ingreso:
                    </dt>
                    <dd class="col-sm-8">
                      {{
                        formatearFecha(
                          nutricionistaSeleccionado.fechaIngreso
                        )
                      }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="cerrarModal"
              >
                Cerrar
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="
                  editarNutricionista(
                    nutricionistaSeleccionado
                  )
                "
              >
                <i class="bi bi-pencil me-1"></i>
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="nutricionistaSeleccionado"
        class="modal-backdrop fade show"
      ></div>
    </Teleport>

    <!-- Modal Confirmar Eliminar -->
    <Teleport to="body">
      <div
        v-if="nutricionistaAEliminar"
        class="modal fade show d-block"
        tabindex="-1"
        @click.self="cancelarEliminar"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div
              class="modal-header bg-danger text-white"
            >
              <h5 class="modal-title">
                <i
                  class="bi bi-exclamation-triangle me-2"
                ></i>
                Confirmar Eliminación
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="cancelarEliminar"
              ></button>
            </div>
            <div class="modal-body">
              <p>
                ¿Está seguro que desea eliminar al
                nutricionista?
              </p>
              <div class="alert alert-warning">
                <strong
                  >{{
                    nutricionistaAEliminar.nombres
                  }}
                  {{
                    nutricionistaAEliminar.apellidos
                  }}</strong
                >
                <br />
                Cédula:
                {{
                  nutricionistaAEliminar.cedula
                }}
              </div>
              <p class="text-muted mb-0">
                <small
                  >Esta acción no se puede
                  deshacer.</small
                >
              </p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="cancelarEliminar"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="eliminarNutricionista"
              >
                <i class="bi bi-trash me-1"></i>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="nutricionistaAEliminar"
        class="modal-backdrop fade show"
      ></div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/stores/notification";

const router = useRouter();
const notificationStore = useNotificationStore();

// Datos de ejemplo
const nutricionistas = ref([
  {
    id: 1,
    nombres: "Patricia Elena",
    apellidos: "Morales Sánchez",
    cedula: "0912345678",
    email: "patricia.morales@nutricion.com",
    telefono: "0998765432",
    titulo: "Licenciada en Nutrición",
    registroProfesional: "MSP-2023-12345",
    aniosExperiencia: 8,
    estudiantesAsignados: 45,
    menusCreados: 12,
    fechaIngreso: "2023-01-15",
    estado: "activo",
    foto: null,
  },
  {
    id: 2,
    nombres: "Carlos Alberto",
    apellidos: "Jiménez Torres",
    cedula: "0923456789",
    email: "carlos.jimenez@nutricion.com",
    telefono: "0987654322",
    titulo: "Magíster en Nutrición Clínica",
    registroProfesional: "MSP-2022-23456",
    aniosExperiencia: 12,
    estudiantesAsignados: 38,
    menusCreados: 15,
    fechaIngreso: "2022-08-01",
    estado: "activo",
    foto: null,
  },
  {
    id: 3,
    nombres: "Ana Cristina",
    apellidos: "Vargas Mendoza",
    cedula: "0934567890",
    email: "ana.vargas@nutricion.com",
    telefono: "0976543211",
    titulo: "Licenciada en Nutrición",
    registroProfesional: "MSP-2024-34567",
    aniosExperiencia: 5,
    estudiantesAsignados: 32,
    menusCreados: 8,
    fechaIngreso: "2024-02-10",
    estado: "activo",
    foto: null,
  },
]);

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
const nutricionistaSeleccionado = ref(null);
const nutricionistaAEliminar = ref(null);

// Estadísticas
const totalNutricionistas = computed(
  () => nutricionistas.value.length
);

const nutricionistasActivos = computed(
  () =>
    nutricionistas.value.filter(
      (n) => n.estado === "activo"
    ).length
);

const menusCreados = computed(() =>
  nutricionistas.value.reduce(
    (total, n) => total + n.menusCreados,
    0
  )
);

const estudiantesAsignados = computed(() =>
  nutricionistas.value.reduce(
    (total, n) => total + n.estudiantesAsignados,
    0
  )
);

// Filtrado
const nutricionistasFiltrados = computed(() => {
  let resultado = nutricionistas.value;

  // Filtro de búsqueda
  if (searchTerm.value) {
    const termino =
      searchTerm.value.toLowerCase();
    resultado = resultado.filter(
      (n) =>
        n.nombres
          .toLowerCase()
          .includes(termino) ||
        n.apellidos
          .toLowerCase()
          .includes(termino) ||
        n.cedula.includes(termino) ||
        n.email.toLowerCase().includes(termino)
    );
  }

  // Filtro por estado
  if (filtroEstado.value) {
    resultado = resultado.filter(
      (n) => n.estado === filtroEstado.value
    );
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
  Math.ceil(
    nutricionistasFiltrados.value.length /
      itemsPorPagina.value
  )
);

const nutricionistasPaginados = computed(() => {
  const inicio =
    (paginaActual.value - 1) *
    itemsPorPagina.value;
  const fin = inicio + itemsPorPagina.value;
  return nutricionistasFiltrados.value.slice(
    inicio,
    fin
  );
});

const paginasVisibles = computed(() => {
  const paginas = [];
  const maxPaginas = 5;
  let inicio = Math.max(
    1,
    paginaActual.value -
      Math.floor(maxPaginas / 2)
  );
  const fin = Math.min(
    totalPaginas.value,
    inicio + maxPaginas - 1
  );

  if (fin - inicio < maxPaginas - 1) {
    inicio = Math.max(1, fin - maxPaginas + 1);
  }

  for (let i = inicio; i <= fin; i++) {
    paginas.push(i);
  }

  return paginas;
});

// Funciones
function limpiarFiltros() {
  searchTerm.value = "";
  filtroEstado.value = "";
}

function ordenarPor(columna) {
  if (ordenColumna.value === columna) {
    ordenDireccion.value =
      ordenDireccion.value === "asc"
        ? "desc"
        : "asc";
  } else {
    ordenColumna.value = columna;
    ordenDireccion.value = "asc";
  }
}

function cambiarPagina(pagina) {
  if (
    pagina >= 1 &&
    pagina <= totalPaginas.value
  ) {
    paginaActual.value = pagina;
  }
}

function getIniciales(nombres, apellidos) {
  const inicialesNombre =
    nombres.split(" ")[0][0] || "";
  const inicialesApellido =
    apellidos.split(" ")[0][0] || "";
  return (
    inicialesNombre + inicialesApellido
  ).toUpperCase();
}

function formatearFecha(fecha) {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function goToRegistro() {
  router.push({
    name: "admin-registro-nutricionista",
  });
}

function verNutricionista(nutricionista) {
  nutricionistaSeleccionado.value = nutricionista;
}

function editarNutricionista(nutricionista) {
  cerrarModal();
  router.push({
    name: "admin-registro-nutricionista",
    params: { id: nutricionista.id },
  });
}

function confirmarEliminar(nutricionista) {
  nutricionistaAEliminar.value = nutricionista;
}

function eliminarNutricionista() {
  const index = nutricionistas.value.findIndex(
    (n) =>
      n.id === nutricionistaAEliminar.value.id
  );
  if (index !== -1) {
    nutricionistas.value.splice(index, 1);
    notificationStore.addNotification({
      type: "success",
      message:
        "Nutricionista eliminado correctamente",
    });
  }
  nutricionistaAEliminar.value = null;
}

function cancelarEliminar() {
  nutricionistaAEliminar.value = null;
}

function cerrarModal() {
  nutricionistaSeleccionado.value = null;
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
.nutricionistas-view {
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
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
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
</style>
