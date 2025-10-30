<template>
  <div class="perfil-view">
    <!-- Header -->
    <div class="page-header mb-4">
      <h2>
        <i class="bi bi-person-circle me-2"></i>
        {{ $t("nav.profile") }}
      </h2>
      <p class="text-muted">
        {{ $t("usuario.manageProfile") }}
      </p>
    </div>

    <div class="row g-4">
      <!-- Columna Izquierda - Información de Usuario -->
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body text-center">
            <!-- Avatar -->
            <div class="avatar-wrapper mb-3">
              <div
                v-if="!profileData.fotoUrl"
                class="avatar-large bg-primary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center"
              >
                {{ userInitials }}
              </div>
              <img
                v-else
                :src="profileData.fotoUrl"
                alt="Foto de perfil"
                class="avatar-large rounded-circle mx-auto d-block"
              />
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                class="d-none"
                @change="handlePhotoUpload"
              />
              <button
                class="btn btn-sm btn-light rounded-circle change-photo-btn"
                title="Cambiar foto"
                @click="triggerPhotoUpload"
                :disabled="!editMode"
              >
                <i class="bi bi-camera-fill"></i>
              </button>
            </div>

            <!-- Nombre -->
            <h4 class="mb-1">{{ fullName }}</h4>
            <p class="text-muted mb-3">
              <span class="badge bg-info">{{
                userRole
              }}</span>
            </p>

            <!-- Estadísticas -->
            <div class="row text-center mb-3">
              <div class="col-6">
                <div class="stat-box p-2">
                  <h5 class="mb-0">
                    {{ studentCount }}
                  </h5>
                  <small class="text-muted">{{
                    $t("usuario.students")
                  }}</small>
                </div>
              </div>
              <div class="col-6">
                <div class="stat-box p-2">
                  <h5 class="mb-0">
                    {{ accountAge }}
                  </h5>
                  <small class="text-muted">{{
                    $t("usuario.memberSince")
                  }}</small>
                </div>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="d-grid gap-2">
              <button
                class="btn btn-primary"
                @click="toggleEditMode"
              >
                <i
                  :class="
                    editMode
                      ? 'bi bi-x-circle'
                      : 'bi bi-pencil-square'
                  "
                  class="me-2"
                ></i>
                {{
                  editMode
                    ? $t("common.cancel")
                    : $t("common.edit")
                }}
              </button>
              <button
                class="btn btn-outline-danger"
                @click="handleLogout"
              >
                <i
                  class="bi bi-box-arrow-right me-2"
                ></i>
                {{ $t("common.logout") }}
              </button>
            </div>
          </div>
        </div>

        <!-- Seguridad -->
        <div class="card mt-4">
          <div class="card-header">
            <h6 class="mb-0">
              <i
                class="bi bi-shield-check me-2"
              ></i>
              {{ $t("usuario.security") }}
            </h6>
          </div>
          <div class="card-body">
            <button
              class="btn btn-outline-primary w-100 mb-2"
              @click="
                showChangePasswordModal = true
              "
            >
              <i class="bi bi-key me-2"></i>
              {{ $t("usuario.changePassword") }}
            </button>
            <button
              class="btn btn-outline-secondary w-100"
            >
              <i
                class="bi bi-clock-history me-2"
              ></i>
              {{ $t("usuario.loginHistory") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Columna Derecha - Formulario de Perfil -->
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i
                class="bi bi-info-circle me-2"
              ></i>
              {{ $t("usuario.personalInfo") }}
            </h5>
          </div>
          <div class="card-body">
            <form
              @submit.prevent="handleSaveProfile"
            >
              <!-- Información Personal -->
              <h6 class="border-bottom pb-2 mb-3">
                {{ $t("usuario.basicInfo") }}
              </h6>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label
                    for="nombres"
                    class="form-label"
                    >{{
                      $t("auth.firstName")
                    }}</label
                  >
                  <input
                    id="nombres"
                    v-model="profileData.nombres"
                    type="text"
                    class="form-control"
                    :disabled="!editMode"
                  />
                </div>
                <div class="col-md-6">
                  <label
                    for="apellidos"
                    class="form-label"
                    >{{
                      $t("auth.lastName")
                    }}</label
                  >
                  <input
                    id="apellidos"
                    v-model="
                      profileData.apellidos
                    "
                    type="text"
                    class="form-control"
                    :disabled="!editMode"
                  />
                </div>
                <div class="col-md-6">
                  <label
                    for="cedula"
                    class="form-label"
                    >{{
                      $t("auth.idNumber")
                    }}</label
                  >
                  <input
                    id="cedula"
                    v-model="profileData.cedula"
                    type="text"
                    class="form-control"
                    disabled
                  />
                  <small
                    class="form-text text-muted"
                    >{{
                      $t("usuario.cannotChange")
                    }}</small
                  >
                </div>
                <div class="col-md-6">
                  <label
                    for="fechaNacimiento"
                    class="form-label"
                    >{{
                      $t("usuario.birthDate")
                    }}</label
                  >
                  <input
                    id="fechaNacimiento"
                    v-model="
                      profileData.fechaNacimiento
                    "
                    type="date"
                    class="form-control"
                    :disabled="!editMode"
                  />
                </div>
              </div>

              <!-- Información de Contacto -->
              <h6 class="border-bottom pb-2 mb-3">
                {{ $t("usuario.contactInfo") }}
              </h6>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label
                    for="email"
                    class="form-label"
                    >{{ $t("auth.email") }}</label
                  >
                  <input
                    id="email"
                    v-model="profileData.email"
                    type="email"
                    class="form-control"
                    :disabled="!editMode"
                  />
                </div>
                <div class="col-md-6">
                  <label
                    for="telefono"
                    class="form-label"
                    >{{ $t("auth.phone") }}</label
                  >
                  <input
                    id="telefono"
                    v-model="profileData.telefono"
                    type="tel"
                    class="form-control"
                    :disabled="!editMode"
                  />
                </div>
                <div class="col-12">
                  <label
                    for="direccion"
                    class="form-label"
                    >{{
                      $t("usuario.address")
                    }}</label
                  >
                  <textarea
                    id="direccion"
                    v-model="
                      profileData.direccion
                    "
                    class="form-control"
                    rows="2"
                    :disabled="!editMode"
                  ></textarea>
                </div>
              </div>

              <!-- Preferencias -->
              <h6 class="border-bottom pb-2 mb-3">
                {{ $t("usuario.preferences") }}
              </h6>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label
                    for="idioma"
                    class="form-label"
                    >{{
                      $t("usuario.language")
                    }}</label
                  >
                  <select
                    id="idioma"
                    v-model="profileData.idioma"
                    class="form-select"
                    :disabled="!editMode"
                  >
                    <option value="es">
                      Español
                    </option>
                    <option value="en">
                      English
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label
                    for="tema"
                    class="form-label"
                    >{{
                      $t("usuario.theme")
                    }}</label
                  >
                  <select
                    id="tema"
                    v-model="profileData.tema"
                    class="form-select"
                    :disabled="!editMode"
                  >
                    <option value="light">
                      {{
                        $t("usuario.lightTheme")
                      }}
                    </option>
                    <option value="dark">
                      {{
                        $t("usuario.darkTheme")
                      }}
                    </option>
                    <option value="auto">
                      {{
                        $t("usuario.autoTheme")
                      }}
                    </option>
                  </select>
                </div>
                <div class="col-12">
                  <div
                    class="form-check form-switch"
                  >
                    <input
                      id="notifications"
                      v-model="
                        profileData.notificaciones
                      "
                      class="form-check-input"
                      type="checkbox"
                      :disabled="!editMode"
                    />
                    <label
                      class="form-check-label"
                      for="notifications"
                    >
                      {{
                        $t(
                          "usuario.emailNotifications"
                        )
                      }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- Botones -->
              <div
                v-if="editMode"
                class="d-flex gap-2 justify-content-end"
              >
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="toggleEditMode"
                >
                  <i
                    class="bi bi-x-circle me-2"
                  ></i>
                  {{ $t("common.cancel") }}
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading">
                    <span
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    {{ $t("common.saving") }}
                  </span>
                  <span v-else>
                    <i
                      class="bi bi-check-circle me-2"
                    ></i>
                    {{ $t("common.save") }}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Mis Estudiantes -->
        <div class="card mt-4">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">
              <i class="bi bi-people me-2"></i>
              {{ $t("usuario.myStudents") }}
            </h5>
            <button
              class="btn btn-sm btn-primary"
            >
              <i
                class="bi bi-plus-circle me-1"
              ></i>
              {{ $t("usuario.addStudent") }}
            </button>
          </div>
          <div class="card-body">
            <div
              v-if="students.length === 0"
              class="text-center text-muted py-4"
            >
              <i
                class="bi bi-person-x display-4 mb-3 d-block"
              ></i>
              <p>
                No tienes estudiantes registrados
              </p>
              <small>
                Usa el botón de arriba para
                agregar un estudiante
              </small>
            </div>
            <div
              v-for="student in students"
              :key="student.id"
              class="student-card mb-3 p-3"
            >
              <div
                class="d-flex align-items-center"
              >
                <div
                  class="avatar bg-primary text-white rounded-circle me-3"
                >
                  {{ student.initials }}
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-1">
                    {{ student.name }}
                  </h6>
                  <p
                    class="mb-0 small text-muted"
                  >
                    <i
                      class="bi bi-book me-1"
                    ></i>
                    {{ student.grade }} |
                    <i
                      class="bi bi-calendar me-1 ms-2"
                    ></i>
                    {{ student.age }} años
                  </p>
                </div>
                <div
                  class="btn-group btn-group-sm"
                >
                  <button
                    class="btn btn-outline-primary"
                    title="Ver perfil"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    class="btn btn-outline-secondary"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Cambiar Contraseña -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showChangePasswordModal"
          class="modal show d-block"
          tabindex="-1"
        >
          <div
            class="modal-dialog modal-dialog-centered"
          >
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <i class="bi bi-key me-2"></i>
                  {{
                    $t("usuario.changePassword")
                  }}
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  @click="
                    showChangePasswordModal = false
                  "
                ></button>
              </div>
              <form
                @submit.prevent="
                  handleChangePassword
                "
              >
                <div class="modal-body">
                  <div class="mb-3">
                    <label
                      for="currentPassword"
                      class="form-label"
                      >{{
                        $t(
                          "usuario.currentPassword"
                        )
                      }}</label
                    >
                    <input
                      id="currentPassword"
                      v-model="
                        passwordData.current
                      "
                      type="password"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label
                      for="newPassword"
                      class="form-label"
                      >{{
                        $t("usuario.newPassword")
                      }}</label
                    >
                    <input
                      id="newPassword"
                      v-model="passwordData.new"
                      type="password"
                      class="form-control"
                      required
                    />
                    <small
                      class="form-text text-muted"
                      >{{
                        $t(
                          "auth.passwordRequirements"
                        )
                      }}</small
                    >
                  </div>
                  <div class="mb-3">
                    <label
                      for="confirmNewPassword"
                      class="form-label"
                      >{{
                        $t(
                          "usuario.confirmNewPassword"
                        )
                      }}</label
                    >
                    <input
                      id="confirmNewPassword"
                      v-model="
                        passwordData.confirm
                      "
                      type="password"
                      class="form-control"
                      required
                    />
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="
                      showChangePasswordModal = false
                    "
                  >
                    {{ $t("common.cancel") }}
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                  >
                    <i
                      class="bi bi-check-circle me-2"
                    ></i>
                    {{ $t("common.save") }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <div
          v-if="showChangePasswordModal"
          class="modal-backdrop show"
          @click="showChangePasswordModal = false"
        ></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// Estado
const editMode = ref(false);
const isLoading = ref(false);
const showChangePasswordModal = ref(false);

// Datos del perfil del estudiante vinculado
// El representante gestiona el perfil de su estudiante
const profileData = reactive({
  // Datos personales
  nombres: "",
  apellidos: "",
  cedula: "",
  fechaNacimiento: "",
  genero: "",
  grupoSanguineo: "",
  foto: null,
  fotoUrl: "",

  // Datos de contacto
  email: "",
  telefono: "",
  direccion: "",

  // Información educativa
  grado: "",
  seccion: "",
  institucion: "",

  // Información médica
  alergias: "",
  condicionesMedicas: "",
  medicamentos: "",
  contactoEmergencia: "",

  // Información nutricional
  peso: "",
  altura: "",
  imc: "",

  // Preferencias del sistema
  idioma: "es",
  tema: "light",
  notificaciones: true,
});

// Datos de contraseña
const passwordData = reactive({
  current: "",
  new: "",
  confirm: "",
});

// Estudiantes vinculados al representante
// El representante puede tener múltiples estudiantes
const students = ref([]);

// Computed
const fullName = computed(
  () =>
    `${profileData.nombres} ${profileData.apellidos}`
);
const userInitials = computed(() => {
  const first = profileData.nombres.charAt(0);
  const last = profileData.apellidos.charAt(0);
  return `${first}${last}`.toUpperCase();
});
const userRole = computed(() =>
  t("auth.roleStudent")
);
const studentCount = computed(
  () => students.value.length
);
const accountAge = computed(() => {
  const edad = calcularEdad(
    profileData.fechaNacimiento
  );
  return `${edad} años`;
});

// Calcular IMC automáticamente
const imcCalculado = computed(() => {
  const peso = Number.parseFloat(
    profileData.peso
  );
  const alturaM =
    Number.parseFloat(profileData.altura) / 100;
  if (peso > 0 && alturaM > 0) {
    return (peso / (alturaM * alturaM)).toFixed(
      2
    );
  }
  return "0.00";
});

const imcCategoria = computed(() => {
  const imc = Number.parseFloat(
    imcCalculado.value
  );
  if (imc < 18.5)
    return {
      texto: "Bajo peso",
      clase: "text-warning",
    };
  if (imc < 25)
    return {
      texto: "Peso normal",
      clase: "text-success",
    };
  if (imc < 30)
    return {
      texto: "Sobrepeso",
      clase: "text-warning",
    };
  return {
    texto: "Obesidad",
    clase: "text-danger",
  };
});

// Métodos
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad =
    hoy.getFullYear() - nacimiento.getFullYear();
  const mes =
    hoy.getMonth() - nacimiento.getMonth();
  if (
    mes < 0 ||
    (mes === 0 &&
      hoy.getDate() < nacimiento.getDate())
  ) {
    edad--;
  }
  return edad;
}

function toggleEditMode() {
  editMode.value = !editMode.value;
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tipo de archivo
  if (!file.type.startsWith("image/")) {
    notificationStore.error(
      "Por favor selecciona una imagen válida"
    );
    return;
  }

  // Validar tamaño (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    notificationStore.error(
      "La imagen no debe superar 5MB"
    );
    return;
  }

  // Leer y mostrar preview
  const reader = new FileReader();
  reader.onload = (e) => {
    profileData.fotoUrl = e.target.result;
    profileData.foto = file;
    notificationStore.success(
      "Foto cargada. Guarda el perfil para aplicar los cambios."
    );
  };
  reader.readAsDataURL(file);
}

function triggerPhotoUpload() {
  document.getElementById("photoInput").click();
}

async function handleSaveProfile() {
  isLoading.value = true;

  try {
    // Simular guardado
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    notificationStore.success(
      t("usuario.profileUpdated")
    );
    editMode.value = false;
  } catch (error) {
    // Log the error for diagnostics and notify the user
    console.error("Error saving profile:", error);
    notificationStore.error(
      t("usuario.profileUpdateError")
    );
  } finally {
    isLoading.value = false;
  }
}

async function handleChangePassword() {
  if (passwordData.new !== passwordData.confirm) {
    notificationStore.error(
      t("validation.passwordMismatch")
    );
    return;
  }

  if (passwordData.new.length < 8) {
    notificationStore.error(
      t("validation.passwordMin")
    );
    return;
  }

  try {
    // Simular cambio de contraseña
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    notificationStore.success(
      t("usuario.passwordChanged")
    );
    showChangePasswordModal.value = false;

    // Limpiar campos
    passwordData.current = "";
    passwordData.new = "";
    passwordData.confirm = "";
  } catch (error) {
    // Handle the error instead of swallowing it: log for diagnostics and notify the user
    console.error(
      "Error changing password:",
      error
    );
    notificationStore.error(
      t("usuario.passwordChangeError")
    );
  }
}

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 1rem;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-large {
  width: 120px;
  height: 120px;
  font-size: 3rem;
  font-weight: bold;
}

.change-photo-btn {
  position: absolute;
  bottom: 0;
  right: -10px;
  width: 35px;
  height: 35px;
  padding: 0;
  border: 2px solid white;
}

.stat-box {
  border-radius: 0.5rem;
  background: #f8f9fa;
}

.student-card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  background: #f8f9fa;
}

.avatar {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
