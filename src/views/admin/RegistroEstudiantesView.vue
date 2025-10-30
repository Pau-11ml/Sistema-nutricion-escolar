<template>
  <div class="registro-estudiantes">
    <div class="page-header mb-4">
      <h2>
        <i
          class="bi bi-person-plus-fill me-2"
        ></i>
        Registro de Estudiantes
      </h2>
      <p class="text-muted">
        Gestión completa de estudiantes del
        sistema de nutrición escolar
      </p>
    </div>

    <!-- Formulario maestro -->
    <MasterForm
      form-title="Datos del Estudiante"
      form-icon="bi bi-person-badge"
      :fields="formFields"
      :available-filters="availableFilters"
      :initial-data="selectedStudent"
      @save="handleSave"
      @cancel="handleCancel"
      @filter="handleFilter"
    />

    <!-- Tabla de estudiantes -->
    <div class="card mt-4">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5 class="mb-0">
          <i class="bi bi-table me-2"></i>
          Lista de Estudiantes
        </h5>
        <div class="d-flex gap-2">
          <button
            class="btn btn-sm btn-outline-primary"
            @click="exportData"
          >
            <i class="bi bi-download me-1"></i>
            Exportar
          </button>
          <button
            class="btn btn-sm btn-outline-secondary"
            @click="refreshData"
          >
            <i
              class="bi bi-arrow-clockwise me-1"
            ></i>
            Actualizar
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- Búsqueda rápida -->
        <div class="mb-3">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar por nombre, cédula, grado..."
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Tabla -->
        <div class="table-responsive">
          <table
            class="table table-hover align-middle"
          >
            <thead class="table-light">
              <tr>
                <th>Cédula</th>
                <th>Nombre Completo</th>
                <th>Grado</th>
                <th>Representante</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="
                  filteredStudents.length === 0
                "
              >
                <td
                  colspan="6"
                  class="text-center text-muted py-4"
                >
                  <i
                    class="bi bi-inbox display-6"
                  ></i>
                  <p class="mt-2">
                    No se encontraron estudiantes
                  </p>
                </td>
              </tr>
              <tr
                v-for="student in paginatedStudents"
                :key="student.id"
              >
                <td>
                  <code>{{
                    student.cedula
                  }}</code>
                </td>
                <td>
                  <strong
                    >{{ student.nombres }}
                    {{
                      student.apellidos
                    }}</strong
                  >
                  <br />
                  <small class="text-muted">{{
                    student.email
                  }}</small>
                </td>
                <td>
                  <span class="badge bg-info">
                    {{ student.grado }}
                    {{ student.paralelo }}
                  </span>
                </td>
                <td>
                  {{ student.representante }}
                </td>
                <td>
                  <span
                    class="badge"
                    :class="
                      student.activo
                        ? 'bg-success'
                        : 'bg-secondary'
                    "
                  >
                    {{
                      student.activo
                        ? "Activo"
                        : "Inactivo"
                    }}
                  </span>
                </td>
                <td>
                  <div
                    class="btn-group btn-group-sm"
                  >
                    <button
                      class="btn btn-outline-primary"
                      @click="
                        editStudent(student)
                      "
                      title="Editar"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-outline-info"
                      @click="
                        viewStudent(student)
                      "
                      title="Ver detalles"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="
                        deleteStudent(student)
                      "
                      title="Eliminar"
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
          <div class="text-muted">
            Mostrando {{ startIndex + 1 }} -
            {{ endIndex }} de
            {{
              filteredStudents.length
            }}
            estudiantes
          </div>
          <nav>
            <ul class="pagination mb-0">
              <li
                class="page-item"
                :class="{
                  disabled: currentPage === 1,
                }"
              >
                <button
                  class="page-link"
                  @click="
                    changePage(currentPage - 1)
                  "
                >
                  <i
                    class="bi bi-chevron-left"
                  ></i>
                </button>
              </li>
              <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{
                  active: page === currentPage,
                }"
              >
                <button
                  class="page-link"
                  @click="changePage(page)"
                >
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{
                  disabled:
                    currentPage === totalPages,
                }"
              >
                <button
                  class="page-link"
                  @click="
                    changePage(currentPage + 1)
                  "
                >
                  <i
                    class="bi bi-chevron-right"
                  ></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useNotificationStore } from "@/stores/notification";
import { useUsabilityStore } from "@/stores/usability";
import MasterForm from "@/components/common/MasterForm.vue";

const notificationStore = useNotificationStore();
const usabilityStore = useUsabilityStore();

// Definición de campos del formulario
const formFields = ref([
  {
    name: "cedula",
    label: "Cédula de Identidad",
    type: "text",
    placeholder: "0000000000",
    required: true,
    maxLength: 10,
    minLength: 10,
    colClass: "col-md-4",
    autocomplete: true,
    validate: (value) => {
      if (!/^\d{10}$/.test(value)) {
        return "La cédula debe tener exactamente 10 dígitos";
      }
      return null;
    },
    helpText:
      "Ingrese la cédula de identidad del estudiante (10 dígitos)",
  },
  {
    name: "nombres",
    label: "Nombres",
    type: "text",
    placeholder: "Juan Carlos",
    required: true,
    maxLength: 50,
    colClass: "col-md-4",
    autocomplete: true,
    helpText: "Nombres completos del estudiante",
  },
  {
    name: "apellidos",
    label: "Apellidos",
    type: "text",
    placeholder: "García López",
    required: true,
    maxLength: 50,
    colClass: "col-md-4",
    autocomplete: true,
    helpText:
      "Apellidos completos del estudiante",
  },
  {
    name: "fechaNacimiento",
    label: "Fecha de Nacimiento",
    type: "date",
    required: true,
    colClass: "col-md-4",
    max: new Date().toISOString().split("T")[0],
    helpText:
      "Fecha de nacimiento del estudiante",
  },
  {
    name: "genero",
    label: "Género",
    type: "select",
    required: true,
    colClass: "col-md-4",
    options: [
      { value: "M", label: "Masculino" },
      { value: "F", label: "Femenino" },
      { value: "O", label: "Otro" },
    ],
    placeholder: "Seleccione género",
  },
  {
    name: "tipoSangre",
    label: "Tipo de Sangre",
    type: "select",
    required: true,
    colClass: "col-md-4",
    options: [
      { value: "A+", label: "A+" },
      { value: "A-", label: "A-" },
      { value: "B+", label: "B+" },
      { value: "B-", label: "B-" },
      { value: "AB+", label: "AB+" },
      { value: "AB-", label: "AB-" },
      { value: "O+", label: "O+" },
      { value: "O-", label: "O-" },
    ],
    placeholder: "Seleccione tipo de sangre",
  },
  {
    name: "email",
    label: "Correo Electrónico",
    type: "email",
    placeholder: "estudiante@ejemplo.com",
    maxLength: 100,
    colClass: "col-md-6",
    autocomplete: true,
    helpText:
      "Correo electrónico del estudiante (opcional)",
  },
  {
    name: "telefono",
    label: "Teléfono",
    type: "text",
    placeholder: "0999999999",
    maxLength: 10,
    colClass: "col-md-6",
    validate: (value) => {
      if (value && !/^\d{9,10}$/.test(value)) {
        return "El teléfono debe tener 9 o 10 dígitos";
      }
      return null;
    },
  },
  {
    name: "grado",
    label: "Grado/Año",
    type: "select",
    required: true,
    colClass: "col-md-4",
    options: [
      { value: "1ro", label: "1ro de Básica" },
      { value: "2do", label: "2do de Básica" },
      { value: "3ro", label: "3ro de Básica" },
      { value: "4to", label: "4to de Básica" },
      { value: "5to", label: "5to de Básica" },
      { value: "6to", label: "6to de Básica" },
      { value: "7mo", label: "7mo de Básica" },
      { value: "8vo", label: "8vo de Básica" },
      { value: "9no", label: "9no de Básica" },
      { value: "10mo", label: "10mo de Básica" },
    ],
    placeholder: "Seleccione grado",
  },
  {
    name: "paralelo",
    label: "Paralelo",
    type: "select",
    required: true,
    colClass: "col-md-4",
    options: [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" },
      { value: "D", label: "D" },
    ],
    placeholder: "Seleccione paralelo",
  },
  {
    name: "jornada",
    label: "Jornada",
    type: "select",
    required: true,
    colClass: "col-md-4",
    options: [
      { value: "matutina", label: "Matutina" },
      {
        value: "vespertina",
        label: "Vespertina",
      },
    ],
    placeholder: "Seleccione jornada",
  },
  {
    name: "direccion",
    label: "Dirección",
    type: "textarea",
    placeholder: "Ingrese la dirección completa",
    rows: 2,
    maxLength: 200,
    colClass: "col-md-12",
    helpText:
      "Dirección domiciliaria del estudiante",
  },
  {
    name: "representante",
    label: "Nombre del Representante",
    type: "text",
    placeholder: "María López",
    required: true,
    maxLength: 100,
    colClass: "col-md-6",
    autocomplete: true,
  },
  {
    name: "telefonoRepresentante",
    label: "Teléfono del Representante",
    type: "text",
    placeholder: "0999999999",
    required: true,
    maxLength: 10,
    colClass: "col-md-6",
    validate: (value) => {
      if (!/^\d{9,10}$/.test(value)) {
        return "El teléfono debe tener 9 o 10 dígitos";
      }
      return null;
    },
  },
  {
    name: "alergias",
    label: "Alergias o Condiciones Médicas",
    type: "textarea",
    placeholder:
      "Describa alergias alimentarias o condiciones médicas relevantes",
    rows: 3,
    maxLength: 500,
    colClass: "col-md-12",
    helpText:
      "Información importante para el manejo nutricional",
  },
  {
    name: "activo",
    label: "Estado",
    type: "checkbox",
    checkboxLabel: "Estudiante activo",
    defaultValue: true,
    colClass: "col-md-12",
  },
]);

// Filtros disponibles
const availableFilters = ref([
  {
    field: "grado",
    label: "Grado",
    type: "select",
    placeholder: "Todos los grados",
    options: [
      { value: "", label: "Todos" },
      { value: "1ro", label: "1ro" },
      { value: "2do", label: "2do" },
      { value: "3ro", label: "3ro" },
      { value: "4to", label: "4to" },
      { value: "5to", label: "5to" },
      { value: "6to", label: "6to" },
      { value: "7mo", label: "7mo" },
      { value: "8vo", label: "8vo" },
      { value: "9no", label: "9no" },
      { value: "10mo", label: "10mo" },
    ],
  },
  {
    field: "paralelo",
    label: "Paralelo",
    type: "select",
    placeholder: "Todos los paralelos",
    options: [
      { value: "", label: "Todos" },
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" },
      { value: "D", label: "D" },
    ],
  },
  {
    field: "activo",
    label: "Estado",
    type: "select",
    placeholder: "Todos",
    options: [
      { value: "", label: "Todos" },
      { value: "true", label: "Activos" },
      { value: "false", label: "Inactivos" },
    ],
  },
]);

// Estado
const students = ref([]);
const selectedStudent = ref({});
const searchQuery = ref("");
const currentFilters = ref({});
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Computed
const filteredStudents = computed(() => {
  let result = students.value;

  // Aplicar búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (student) =>
        student.nombres
          .toLowerCase()
          .includes(query) ||
        student.apellidos
          .toLowerCase()
          .includes(query) ||
        student.cedula.includes(query) ||
        student.grado
          .toLowerCase()
          .includes(query) ||
        student.representante
          .toLowerCase()
          .includes(query)
    );
  }

  // Aplicar filtros
  if (currentFilters.value.grado) {
    result = result.filter(
      (s) =>
        s.grado === currentFilters.value.grado
    );
  }
  if (currentFilters.value.paralelo) {
    result = result.filter(
      (s) =>
        s.paralelo ===
        currentFilters.value.paralelo
    );
  }
  if (currentFilters.value.activo !== "") {
    result = result.filter(
      (s) =>
        s.activo ===
        (currentFilters.value.activo === "true")
    );
  }

  return result;
});

const totalPages = computed(() =>
  Math.ceil(
    filteredStudents.value.length /
      itemsPerPage.value
  )
);

const startIndex = computed(
  () =>
    (currentPage.value - 1) * itemsPerPage.value
);
const endIndex = computed(() =>
  Math.min(
    startIndex.value + itemsPerPage.value,
    filteredStudents.value.length
  )
);

const paginatedStudents = computed(() =>
  filteredStudents.value.slice(
    startIndex.value,
    endIndex.value
  )
);

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(
    1,
    currentPage.value - Math.floor(maxVisible / 2)
  );
  const end = Math.min(
    totalPages.value,
    start + maxVisible - 1
  );

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Métodos
async function handleSave(data, isUpdate) {
  usabilityStore.startTask("save_student");

  try {
    // Simular guardado en API
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    if (isUpdate) {
      const index = students.value.findIndex(
        (s) => s.id === data.id
      );
      if (index !== -1) {
        students.value[index] = { ...data };
      }
    } else {
      const newStudent = {
        ...data,
        id: Date.now(),
        createdAt: new Date(),
      };
      students.value.unshift(newStudent);
    }

    selectedStudent.value = {};
    usabilityStore.completeTask(
      "save_student",
      true
    );
  } catch (error) {
    notificationStore.error(
      "Error al guardar estudiante"
    );
    usabilityStore.logError(
      "save_student_error",
      error.message
    );
    usabilityStore.completeTask(
      "save_student",
      false
    );
  }
}

function handleCancel() {
  selectedStudent.value = {};
  notificationStore.info("Operación cancelada");
}

function handleFilter(filters) {
  currentFilters.value = filters;
  currentPage.value = 1;
}

function handleSearch() {
  currentPage.value = 1;
  usabilityStore.trackClick("search_students");
}

function editStudent(student) {
  selectedStudent.value = { ...student };
  usabilityStore.trackClick("edit_student");
  // Scroll al formulario
  globalThis.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function viewStudent(student) {
  notificationStore.info(
    `Ver detalles de ${student.nombres} ${student.apellidos}`
  );
  usabilityStore.trackClick("view_student");
  // Aquí se podría abrir un modal con detalles completos
}

function deleteStudent(student) {
  if (
    confirm(
      `¿Está seguro de eliminar a ${student.nombres} ${student.apellidos}?`
    )
  ) {
    students.value = students.value.filter(
      (s) => s.id !== student.id
    );
    notificationStore.success(
      "Estudiante eliminado correctamente"
    );
    usabilityStore.trackClick("delete_student");
  }
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    usabilityStore.trackClick("change_page");
  }
}

function exportData() {
  // Exportar datos a CSV
  const csv = [
    [
      "Cédula",
      "Nombres",
      "Apellidos",
      "Grado",
      "Paralelo",
      "Representante",
      "Estado",
    ],
    ...filteredStudents.value.map((s) => [
      s.cedula,
      s.nombres,
      s.apellidos,
      s.grado,
      s.paralelo,
      s.representante,
      s.activo ? "Activo" : "Inactivo",
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `estudiantes_${
    new Date().toISOString().split("T")[0]
  }.csv`;
  a.click();
  URL.revokeObjectURL(url);

  notificationStore.success(
    "Datos exportados correctamente"
  );
  usabilityStore.trackClick("export_students");
}

function refreshData() {
  loadStudents();
  notificationStore.info("Datos actualizados");
  usabilityStore.trackClick("refresh_students");
}

function loadStudents() {
  // Datos de ejemplo
  students.value = [
    {
      id: 1,
      cedula: "1234567890",
      nombres: "Juan Carlos",
      apellidos: "García López",
      email: "juan.garcia@ejemplo.com",
      telefono: "0999999999",
      fechaNacimiento: "2010-05-15",
      genero: "M",
      tipoSangre: "O+",
      grado: "5to",
      paralelo: "A",
      jornada: "matutina",
      direccion: "Av. Principal 123",
      representante: "María López",
      telefonoRepresentante: "0988888888",
      alergias: "Alergia a los mariscos",
      activo: true,
    },
    {
      id: 2,
      cedula: "0987654321",
      nombres: "Ana María",
      apellidos: "Rodríguez Silva",
      email: "ana.rodriguez@ejemplo.com",
      telefono: "0988888888",
      fechaNacimiento: "2011-08-20",
      genero: "F",
      tipoSangre: "A+",
      grado: "4to",
      paralelo: "B",
      jornada: "matutina",
      direccion: "Calle Secundaria 456",
      representante: "Pedro Rodríguez",
      telefonoRepresentante: "0977777777",
      alergias: "",
      activo: true,
    },
  ];
}

// Lifecycle
onMounted(() => {
  loadStudents();
  usabilityStore.startTask("manage_students");
});
</script>

<style scoped>
.page-header {
  background: linear-gradient(
    135deg,
    #2f3460 0%,
    #24193a 100%
  );
  color: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.page-header h2 {
  margin-bottom: 0.5rem;
}

.table {
  font-size: 0.9rem;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}
</style>
