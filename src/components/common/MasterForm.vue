<template>
  <div class="master-form">
    <!-- Barra de herramientas -->
    <div class="form-toolbar mb-3">
      <div
        class="d-flex justify-content-between align-items-center flex-wrap gap-2"
      >
        <div class="toolbar-actions d-flex gap-2">
          <button
            type="button"
            class="btn btn-success"
            @click="handleNuevo"
            :disabled="isLoading"
            title="Nuevo registro (Ctrl+N)"
          >
            <i class="bi bi-plus-circle me-1"></i>
            Nuevo
          </button>

          <button
            type="button"
            class="btn btn-primary"
            @click="handleActualizar"
            :disabled="!canUpdate || isLoading"
            title="Actualizar registro (Ctrl+S)"
          >
            <i class="bi bi-save me-1"></i>
            Actualizar
          </button>

          <button
            type="button"
            class="btn btn-info"
            @click="toggleFiltros"
            title="Filtros inteligentes (Ctrl+F)"
          >
            <i class="bi bi-funnel me-1"></i>
            Filtrar
            <span
              v-if="activeFiltersCount > 0"
              class="badge bg-danger ms-1"
            >
              {{ activeFiltersCount }}
            </span>
          </button>

          <button
            type="button"
            class="btn btn-warning"
            @click="handleLimpiar"
            :disabled="isLoading"
            title="Limpiar formulario (Ctrl+L)"
          >
            <i class="bi bi-eraser me-1"></i>
            Limpiar
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            @click="toggleHistorial"
            title="Ver historial de cambios (Ctrl+H)"
          >
            <i
              class="bi bi-clock-history me-1"
            ></i>
            Historial
            <span
              v-if="changeHistory.length > 0"
              class="badge bg-primary ms-1"
            >
              {{ changeHistory.length }}
            </span>
          </button>
        </div>

        <div
          class="toolbar-info text-muted small"
        >
          <span v-if="currentRecord">
            <i class="bi bi-info-circle me-1"></i>
            Registro: {{ currentRecord.id }}
          </span>
          <span v-if="lastSaved" class="ms-3">
            <i
              class="bi bi-check-circle me-1"
            ></i>
            Guardado:
            {{ formatDateTime(lastSaved) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Panel de filtros (colapsable) -->
    <Transition name="slide-down">
      <div
        v-if="showFiltros"
        class="filters-panel card mb-3"
      >
        <div class="card-body">
          <h6 class="card-title">
            <i class="bi bi-funnel-fill me-2"></i>
            Filtros Inteligentes
          </h6>
          <div class="row g-3">
            <div
              class="col-md-4"
              v-for="filter in availableFilters"
              :key="filter.field"
            >
              <label
                :for="`filter-${filter.field}`"
                class="form-label"
              >
                {{ filter.label }}
              </label>
              <component
                :is="
                  getFilterComponent(filter.type)
                "
                :id="`filter-${filter.field}`"
                v-model="filters[filter.field]"
                :options="filter.options"
                :placeholder="filter.placeholder"
                @change="applyFilters"
              />
            </div>
          </div>
          <div class="mt-3 d-flex gap-2">
            <button
              class="btn btn-sm btn-primary"
              @click="applyFilters"
            >
              <i class="bi bi-check me-1"></i>
              Aplicar
            </button>
            <button
              class="btn btn-sm btn-outline-secondary"
              @click="clearFilters"
            >
              <i class="bi bi-x me-1"></i>
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Formulario principal -->
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i :class="formIcon" class="me-2"></i>
          {{ formTitle }}
        </h5>
      </div>
      <div class="card-body">
        <form
          @submit.prevent="handleSubmit"
          novalidate
          ref="formElement"
        >
          <div class="row g-3">
            <!-- Campos dinámicos del formulario -->
            <div
              v-for="field in fields"
              :key="field.name"
              :class="
                field.colClass || 'col-md-6'
              "
            >
              <label
                :for="field.name"
                class="form-label"
              >
                {{ field.label }}
                <span
                  v-if="field.required"
                  class="text-danger"
                  >*</span
                >
                <i
                  v-if="field.helpText"
                  class="bi bi-question-circle ms-1"
                  :title="field.helpText"
                  style="cursor: help"
                ></i>
              </label>

              <!-- Input de texto -->
              <input
                v-if="
                  field.type === 'text' ||
                  field.type === 'email' ||
                  field.type === 'number'
                "
                :id="field.name"
                v-model="formData[field.name]"
                :type="field.type"
                class="form-control"
                :class="{
                  'is-invalid':
                    errors[field.name],
                }"
                :placeholder="field.placeholder"
                :required="field.required"
                :disabled="
                  field.disabled || isLoading
                "
                :maxlength="field.maxLength"
                :min="field.min"
                :max="field.max"
                @input="handleInput(field)"
                @blur="validateField(field)"
                @keydown="trackKeyboardNavigation"
                :list="
                  field.autocomplete
                    ? `datalist-${field.name}`
                    : null
                "
              />

              <!-- Datalist para autocompletado -->
              <datalist
                v-if="field.autocomplete"
                :id="`datalist-${field.name}`"
              >
                <option
                  v-for="option in getAutocompleteOptions(
                    field.name
                  )"
                  :key="option"
                  :value="option"
                />
              </datalist>

              <!-- Select/Combobox -->
              <select
                v-if="field.type === 'select'"
                :id="field.name"
                v-model="formData[field.name]"
                class="form-select"
                :class="{
                  'is-invalid':
                    errors[field.name],
                }"
                :required="field.required"
                :disabled="
                  field.disabled || isLoading
                "
                @change="handleSelect(field)"
                @keydown="trackKeyboardNavigation"
              >
                <option value="">
                  {{
                    field.placeholder ||
                    "Seleccione..."
                  }}
                </option>
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>

              <!-- Textarea -->
              <textarea
                v-if="field.type === 'textarea'"
                :id="field.name"
                v-model="formData[field.name]"
                class="form-control"
                :class="{
                  'is-invalid':
                    errors[field.name],
                }"
                :placeholder="field.placeholder"
                :required="field.required"
                :disabled="
                  field.disabled || isLoading
                "
                :rows="field.rows || 3"
                :maxlength="field.maxLength"
                @input="handleInput(field)"
                @blur="validateField(field)"
                @keydown="trackKeyboardNavigation"
              ></textarea>

              <!-- Date -->
              <input
                v-if="field.type === 'date'"
                :id="field.name"
                v-model="formData[field.name]"
                type="date"
                class="form-control"
                :class="{
                  'is-invalid':
                    errors[field.name],
                }"
                :required="field.required"
                :disabled="
                  field.disabled || isLoading
                "
                :min="field.min"
                :max="field.max"
                @change="handleInput(field)"
                @blur="validateField(field)"
                @keydown="trackKeyboardNavigation"
              />

              <!-- Checkbox -->
              <div
                v-if="field.type === 'checkbox'"
                class="form-check"
              >
                <input
                  :id="field.name"
                  v-model="formData[field.name]"
                  type="checkbox"
                  class="form-check-input"
                  :class="{
                    'is-invalid':
                      errors[field.name],
                  }"
                  :disabled="
                    field.disabled || isLoading
                  "
                  @change="handleInput(field)"
                  @keydown="
                    trackKeyboardNavigation
                  "
                />
                <label
                  class="form-check-label"
                  :for="field.name"
                >
                  {{
                    field.checkboxLabel ||
                    field.label
                  }}
                </label>
              </div>

              <!-- Lista múltiple -->
              <select
                v-if="
                  field.type === 'multiselect'
                "
                :id="field.name"
                v-model="formData[field.name]"
                class="form-select"
                :class="{
                  'is-invalid':
                    errors[field.name],
                }"
                :required="field.required"
                :disabled="
                  field.disabled || isLoading
                "
                multiple
                :size="field.size || 5"
                @change="handleInput(field)"
                @keydown="trackKeyboardNavigation"
              >
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>

              <!-- Mensaje de error -->
              <div
                v-if="errors[field.name]"
                class="invalid-feedback d-block"
              >
                <i
                  class="bi bi-exclamation-circle me-1"
                ></i>
                {{ errors[field.name] }}
              </div>

              <!-- Contador de caracteres -->
              <small
                v-if="
                  field.maxLength &&
                  (field.type === 'text' ||
                    field.type === 'textarea')
                "
                class="form-text"
                :class="{
                  'text-danger':
                    (formData[field.name]
                      ?.length || 0) >
                    field.maxLength * 0.9,
                }"
              >
                {{
                  formData[field.name]?.length ||
                  0
                }}
                / {{ field.maxLength }}
              </small>
            </div>
          </div>

          <!-- Botones de acción del formulario -->
          <div
            class="mt-4 d-flex justify-content-end gap-2"
          >
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="handleCancel"
              :disabled="isLoading"
            >
              <i class="bi bi-x-circle me-1"></i>
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="
                isLoading || !isFormValid
              "
            >
              <span v-if="isLoading">
                <span
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                Guardando...
              </span>
              <span v-else>
                <i
                  class="bi bi-check-circle me-1"
                ></i>
                {{
                  currentRecord
                    ? "Actualizar"
                    : "Guardar"
                }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Panel de historial (modal) -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showHistorial"
          class="modal show d-block"
          tabindex="-1"
        >
          <div
            class="modal-dialog modal-lg modal-dialog-scrollable"
          >
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <i
                    class="bi bi-clock-history me-2"
                  ></i>
                  Historial de Cambios
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  @click="showHistorial = false"
                ></button>
              </div>
              <div class="modal-body">
                <div
                  v-if="
                    changeHistory.length === 0
                  "
                  class="text-center text-muted py-5"
                >
                  <i
                    class="bi bi-inbox display-1"
                  ></i>
                  <p class="mt-3">
                    No hay cambios registrados
                  </p>
                </div>
                <div v-else class="timeline">
                  <div
                    v-for="(
                      change, index
                    ) in changeHistory"
                    :key="index"
                    class="timeline-item"
                  >
                    <div
                      class="timeline-marker"
                      :class="`bg-${getChangeTypeColor(
                        change.type
                      )}`"
                    >
                      <i
                        :class="
                          getChangeTypeIcon(
                            change.type
                          )
                        "
                      ></i>
                    </div>
                    <div class="timeline-content">
                      <div
                        class="d-flex justify-content-between align-items-start"
                      >
                        <div>
                          <strong>{{
                            getChangeTypeLabel(
                              change.type
                            )
                          }}</strong>
                          <p
                            class="mb-1 small text-muted"
                          >
                            {{
                              formatDateTime(
                                change.timestamp
                              )
                            }}
                          </p>
                        </div>
                        <span
                          :class="`badge bg-${getChangeTypeColor(
                            change.type
                          )}`"
                        >
                          {{ change.type }}
                        </span>
                      </div>
                      <div class="mt-2">
                        <div
                          v-for="(
                            value, field
                          ) in change.changes"
                          :key="field"
                          class="small"
                        >
                          <strong
                            >{{
                              getFieldLabel(
                                field
                              )
                            }}:</strong
                          >
                          <span
                            class="text-muted"
                          >
                            {{ value.old }}
                          </span>
                          <i
                            class="bi bi-arrow-right mx-1"
                          ></i>
                          <span
                            class="text-success"
                          >
                            {{ value.new }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="clearHistory"
                >
                  <i class="bi bi-trash me-1"></i>
                  Limpiar historial
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="showHistorial = false"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <div
          v-if="showHistorial"
          class="modal-backdrop show"
          @click="showHistorial = false"
        ></div>
      </Transition>
    </Teleport>

    <!-- Notificación de cambios -->
    <Transition name="slide-up">
      <div
        v-if="showChangeNotification"
        class="change-notification"
        role="alert"
      >
        <i class="bi bi-info-circle me-2"></i>
        {{ changeNotificationMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
} from "vue";
import { useNotificationStore } from "@/stores/notification";
import { useUsabilityStore } from "@/stores/usability";

const props = defineProps({
  formTitle: {
    type: String,
    default: "Formulario Maestro",
  },
  formIcon: {
    type: String,
    default: "bi bi-file-earmark-text",
  },
  fields: {
    type: Array,
    required: true,
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
  availableFilters: {
    type: Array,
    default: () => [],
  },
  onSave: {
    type: Function,
    required: true,
  },
  onCancel: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits([
  "save",
  "cancel",
  "change",
  "filter",
]);

const notificationStore = useNotificationStore();
const usabilityStore = useUsabilityStore();

// Estado del formulario
const formData = ref({ ...props.initialData });
const errors = ref({});
const isLoading = ref(false);
const currentRecord = ref(null);
const lastSaved = ref(null);

// Filtros
const showFiltros = ref(false);
const filters = ref({});

// Historial
const showHistorial = ref(false);
const changeHistory = ref([]);
const previousFormData = ref({
  ...props.initialData,
});

// Notificaciones de cambios
const showChangeNotification = ref(false);
const changeNotificationMessage = ref("");

// Autocompletado
const autocompleteData = ref({});

// Navegación por teclado
const formElement = ref(null);

// Computed
const canUpdate = computed(
  () => currentRecord.value !== null
);

const isFormValid = computed(() => {
  return (
    Object.keys(errors.value).length === 0 &&
    props.fields
      .filter((f) => f.required)
      .every((f) => formData.value[f.name])
  );
});

const activeFiltersCount = computed(() => {
  return Object.values(filters.value).filter(
    (v) =>
      v !== "" && v !== null && v !== undefined
  ).length;
});

// Métodos de validación
function validateField(field) {
  errors.value[field.name] = "";

  const value = formData.value[field.name];

  // Requerido
  if (field.required && !value) {
    errors.value[
      field.name
    ] = `${field.label} es obligatorio`;
    return false;
  }

  // Email
  if (field.type === "email" && value) {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.value[field.name] = "Email inválido";
      return false;
    }
  }

  // Longitud mínima
  if (
    field.minLength &&
    value &&
    value.length < field.minLength
  ) {
    errors.value[
      field.name
    ] = `Mínimo ${field.minLength} caracteres`;
    return false;
  }

  // Longitud máxima
  if (
    field.maxLength &&
    value &&
    value.length > field.maxLength
  ) {
    errors.value[
      field.name
    ] = `Máximo ${field.maxLength} caracteres`;
    return false;
  }

  // Validación personalizada
  if (field.validate && value) {
    const customError = field.validate(
      value,
      formData.value
    );
    if (customError) {
      errors.value[field.name] = customError;
      return false;
    }
  }

  return true;
}

function validateForm() {
  errors.value = {};
  let isValid = true;

  for (const field of props.fields) {
    if (!validateField(field)) {
      isValid = false;
    }
  }

  return isValid;
}

// Handlers
function handleInput(field) {
  // Actualizar autocompletado
  if (field.autocomplete) {
    updateAutocomplete(
      field.name,
      formData.value[field.name]
    );
  }

  // Limpiar error al escribir
  if (errors.value[field.name]) {
    errors.value[field.name] = "";
  }

  emit("change", {
    field: field.name,
    value: formData.value[field.name],
  });
}

function handleSelect(field) {
  // Lógica especial para selects (ej: cargar datos dependientes)
  if (field.onChange) {
    field.onChange(
      formData.value[field.name],
      formData.value
    );
  }

  emit("change", {
    field: field.name,
    value: formData.value[field.name],
  });
}

async function handleSubmit() {
  usabilityStore.startTask("submit_form");

  if (!validateForm()) {
    notificationStore.error(
      "Por favor corrige los errores en el formulario"
    );
    usabilityStore.logError(
      "validation_error",
      "Form validation failed"
    );
    usabilityStore.completeTask(
      "submit_form",
      false
    );
    return;
  }

  isLoading.value = true;

  try {
    // Guardar cambios en historial
    recordChange(
      currentRecord.value ? "update" : "create"
    );

    await props.onSave(
      formData.value,
      currentRecord.value
    );

    lastSaved.value = new Date();
    notificationStore.success(
      currentRecord.value
        ? "Registro actualizado correctamente"
        : "Registro creado correctamente"
    );

    // Mostrar notificación de cambio
    showChangeNotif(
      currentRecord.value
        ? "Registro actualizado"
        : "Registro creado"
    );

    usabilityStore.completeTask(
      "submit_form",
      true
    );
    emit("save", formData.value);
  } catch (error) {
    notificationStore.error(
      error.message || "Error al guardar"
    );
    usabilityStore.logError(
      "save_error",
      error.message
    );
    usabilityStore.completeTask(
      "submit_form",
      false
    );
  } finally {
    isLoading.value = false;
  }
}

function handleNuevo() {
  usabilityStore.trackClick("nuevo_button");

  currentRecord.value = null;
  formData.value = props.fields.reduce(
    (acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    },
    {}
  );
  errors.value = {};
  previousFormData.value = { ...formData.value };

  notificationStore.info(
    "Formulario listo para nuevo registro"
  );

  // Enfocar primer campo
  nextTick(() => {
    const firstInput =
      formElement.value?.querySelector(
        "input, select, textarea"
      );
    firstInput?.focus();
  });
}

function handleActualizar() {
  usabilityStore.trackClick("actualizar_button");
  handleSubmit();
}

function handleLimpiar() {
  usabilityStore.trackClick("limpiar_button");

  if (
    confirm(
      "¿Estás seguro de limpiar el formulario?"
    )
  ) {
    formData.value = props.fields.reduce(
      (acc, field) => {
        acc[field.name] =
          field.defaultValue || "";
        return acc;
      },
      {}
    );
    errors.value = {};
    currentRecord.value = null;
    previousFormData.value = {
      ...formData.value,
    };

    notificationStore.info("Formulario limpiado");
  }
}

function handleCancel() {
  emit("cancel");
  props.onCancel();
}

// Filtros
function toggleFiltros() {
  showFiltros.value = !showFiltros.value;
  usabilityStore.trackClick("toggle_filters");
}

function applyFilters() {
  emit("filter", filters.value);
  notificationStore.info(
    `Filtros aplicados: ${activeFiltersCount.value}`
  );
  usabilityStore.trackClick("apply_filters");
}

function clearFilters() {
  filters.value = {};
  emit("filter", {});
  notificationStore.info("Filtros limpiados");
  usabilityStore.trackClick("clear_filters");
}

function getFilterComponent(type) {
  // Retorna el componente apropiado según el tipo de filtro
  return type === "select" ? "select" : "input";
}

// Historial
function toggleHistorial() {
  showHistorial.value = !showHistorial.value;
  usabilityStore.trackClick("toggle_history");
}

function recordChange(type) {
  const changes = {};

  for (const key of Object.keys(formData.value)) {
    if (
      formData.value[key] !==
      previousFormData.value[key]
    ) {
      changes[key] = {
        old: previousFormData.value[key],
        new: formData.value[key],
      };
    }
  }

  if (Object.keys(changes).length > 0) {
    changeHistory.value.unshift({
      type,
      timestamp: new Date(),
      changes,
    });

    // Limitar historial a 50 cambios
    if (changeHistory.value.length > 50) {
      changeHistory.value =
        changeHistory.value.slice(0, 50);
    }

    previousFormData.value = {
      ...formData.value,
    };
  }
}

function clearHistory() {
  if (
    confirm(
      "¿Estás seguro de limpiar el historial?"
    )
  ) {
    changeHistory.value = [];
    notificationStore.info("Historial limpiado");
  }
}

function getChangeTypeLabel(type) {
  const labels = {
    create: "Creación",
    update: "Actualización",
    delete: "Eliminación",
  };
  return labels[type] || type;
}

function getChangeTypeColor(type) {
  const colors = {
    create: "success",
    update: "info",
    delete: "danger",
  };
  return colors[type] || "secondary";
}

function getChangeTypeIcon(type) {
  const icons = {
    create: "bi bi-plus-circle",
    update: "bi bi-pencil-square",
    delete: "bi bi-trash",
  };
  return icons[type] || "bi bi-circle";
}

function getFieldLabel(fieldName) {
  const field = props.fields.find(
    (f) => f.name === fieldName
  );
  return field?.label || fieldName;
}

// Autocompletado
function updateAutocomplete(fieldName, value) {
  if (!autocompleteData.value[fieldName]) {
    autocompleteData.value[fieldName] = [];
  }

  if (
    value &&
    !autocompleteData.value[fieldName].includes(
      value
    )
  ) {
    autocompleteData.value[fieldName].push(value);

    // Limitar a 20 sugerencias
    if (
      autocompleteData.value[fieldName].length >
      20
    ) {
      autocompleteData.value[fieldName].shift();
    }

    // Guardar en localStorage
    localStorage.setItem(
      `autocomplete_${fieldName}`,
      JSON.stringify(
        autocompleteData.value[fieldName]
      )
    );
  }
}

function getAutocompleteOptions(fieldName) {
  return autocompleteData.value[fieldName] || [];
}

function loadAutocompleteData() {
  for (const field of props.fields) {
    if (field.autocomplete) {
      const saved = localStorage.getItem(
        `autocomplete_${field.name}`
      );
      if (saved) {
        try {
          autocompleteData.value[field.name] =
            JSON.parse(saved);
        } catch (e) {
          console.error(
            "Error loading autocomplete data:",
            e
          );
        }
      }
    }
  }
}

// Notificaciones de cambios
function showChangeNotif(message) {
  changeNotificationMessage.value = message;
  showChangeNotification.value = true;

  setTimeout(() => {
    showChangeNotification.value = false;
  }, 3000);
}

// Navegación por teclado
function trackKeyboardNavigation(e) {
  usabilityStore.trackKeyPress(e.key, {
    element: e.target.id || e.target.name,
  });

  // Implementar navegación con Tab, Enter, etc.
  if (
    e.key === "Enter" &&
    e.target.tagName !== "TEXTAREA"
  ) {
    e.preventDefault();
    focusNextField(e.target);
  }
}

function focusNextField(currentField) {
  const fields = Array.from(
    formElement.value.querySelectorAll(
      "input, select, textarea, button"
    )
  );
  const currentIndex =
    fields.indexOf(currentField);
  const nextField = fields[currentIndex + 1];

  if (nextField) {
    nextField.focus();
  }
}

// Atajos de teclado
function handleKeyboardShortcuts(e) {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case "n":
        e.preventDefault();
        handleNuevo();
        break;
      case "s":
        e.preventDefault();
        handleActualizar();
        break;
      case "l":
        e.preventDefault();
        handleLimpiar();
        break;
      case "f":
        e.preventDefault();
        toggleFiltros();
        break;
      case "h":
        e.preventDefault();
        toggleHistorial();
        break;
    }
  }
}

// Utilidades
function formatDateTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Lifecycle
onMounted(() => {
  globalThis.addEventListener(
    "keydown",
    handleKeyboardShortcuts
  );
  loadAutocompleteData();
  previousFormData.value = { ...formData.value };

  // Iniciar tracking de usabilidad
  usabilityStore.startTask("fill_form");
});

onUnmounted(() => {
  globalThis.removeEventListener(
    "keydown",
    handleKeyboardShortcuts
  );
  usabilityStore.completeTask("fill_form", true);
});

// Watch para detectar cambios externos
watch(
  () => props.initialData,
  (newData) => {
    formData.value = { ...newData };
    previousFormData.value = { ...newData };
    currentRecord.value = newData.id || null;
  },
  { deep: true }
);
</script>

<style scoped>
.master-form {
  margin-bottom: 2rem;
}

.form-toolbar {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.filters-panel {
  border-left: 4px solid #0d6efd;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
  border-left: 2px solid #dee2e6;
  padding-left: 2rem;
  margin-left: 1rem;
}

.timeline-item:last-child {
  border-left: none;
}

.timeline-marker {
  position: absolute;
  left: -1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.timeline-content {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
}

.change-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #0d6efd;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1050;
}

/* Animaciones */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 500px;
  opacity: 1;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .toolbar-actions {
    width: 100%;
  }

  .toolbar-actions .btn {
    flex: 1;
    font-size: 0.875rem;
  }

  .toolbar-actions .btn span:not(.badge) {
    display: none;
  }
}
</style>
