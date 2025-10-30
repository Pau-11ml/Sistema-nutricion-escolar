<template>
  <header class="app-header" role="banner">
    <nav
      class="navbar navbar-expand-lg navbar-light bg-white shadow-sm"
    >
      <div class="container-fluid">
        <!-- Logo y nombre del sistema -->
        <router-link
          :to="homeRoute"
          class="navbar-brand d-flex align-items-center"
        >
          <img
            src="@/assets/images/logo.png"
            alt="Logo"
            width="40"
            height="40"
            class="d-inline-block align-text-top me-2"
          />
          <span class="fw-bold">{{
            $t("common.appName")
          }}</span>
        </router-link>

        <!-- Botón toggle para móviles -->
        <button
          class="navbar-toggler"
          type="button"
          @click="toggleMobileMenu"
          :aria-expanded="showMobileMenu"
          aria-controls="navbarContent"
          aria-label="Toggle navigation"
        >
          <span
            class="navbar-toggler-icon"
          ></span>
        </button>

        <!-- Contenido del navbar -->
        <div
          class="collapse navbar-collapse"
          :class="{ show: showMobileMenu }"
          id="navbarContent"
        >
          <!-- Barra de búsqueda (centro) -->
          <div
            class="mx-auto search-container"
            v-if="showSearch"
          >
            <div class="input-group">
              <span
                class="input-group-text bg-white border-end-0"
              >
                <i class="bi bi-search"></i>
              </span>
              <input
                type="search"
                class="form-control border-start-0"
                :placeholder="$t('common.search')"
                v-model="searchQuery"
                @input="handleSearch"
                aria-label="Búsqueda global"
              />
            </div>
          </div>

          <!-- Acciones de la derecha -->
          <ul
            class="navbar-nav ms-auto align-items-center gap-2"
          >
            <!-- Selector de tema -->
            <li class="nav-item dropdown">
              <button
                class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
                type="button"
                id="themeDropdown"
                @click="
                  showThemeMenu = !showThemeMenu
                "
                aria-expanded="false"
                aria-label="Cambiar tema"
              >
                <i :class="themeIcon"></i>
                <span
                  class="d-none d-lg-inline"
                  >{{ themeName }}</span
                >
              </button>
              <ul
                v-if="showThemeMenu"
                class="dropdown-menu dropdown-menu-end show"
                aria-labelledby="themeDropdown"
                @click="showThemeMenu = false"
              >
                <li>
                  <button
                    class="dropdown-item d-flex align-items-center gap-2"
                    :class="{
                      active:
                        themeStore.currentTheme ===
                        'light',
                    }"
                    @click="
                      themeStore.setTheme('light')
                    "
                  >
                    <i
                      class="bi bi-sun-fill text-warning"
                    ></i>
                    <span class="flex-grow-1"
                      >Claro</span
                    >
                    <i
                      class="bi bi-check"
                      v-if="
                        themeStore.currentTheme ===
                        'light'
                      "
                    ></i>
                  </button>
                </li>
                <li>
                  <button
                    class="dropdown-item d-flex align-items-center gap-2"
                    :class="{
                      active:
                        themeStore.currentTheme ===
                        'dark',
                    }"
                    @click="
                      themeStore.setTheme('dark')
                    "
                  >
                    <i
                      class="bi bi-moon-fill text-primary"
                    ></i>
                    <span class="flex-grow-1"
                      >Oscuro</span
                    >
                    <i
                      class="bi bi-check"
                      v-if="
                        themeStore.currentTheme ===
                        'dark'
                      "
                    ></i>
                  </button>
                </li>
                <li>
                  <button
                    class="dropdown-item d-flex align-items-center gap-2"
                    :class="{
                      active:
                        themeStore.currentTheme ===
                        'highContrast',
                    }"
                    @click="
                      themeStore.setTheme(
                        'highContrast'
                      )
                    "
                  >
                    <i
                      class="bi bi-circle-half text-dark"
                    ></i>
                    <span class="flex-grow-1"
                      >Alto Contraste</span
                    >
                    <i
                      class="bi bi-check"
                      v-if="
                        themeStore.currentTheme ===
                        'highContrast'
                      "
                    ></i>
                  </button>
                </li>
                <li>
                  <button
                    class="dropdown-item d-flex align-items-center gap-2"
                    :class="{
                      active:
                        themeStore.currentTheme ===
                        'sepia',
                    }"
                    @click="
                      themeStore.setTheme('sepia')
                    "
                  >
                    <i
                      class="bi bi-book text-brown"
                    ></i>
                    <span class="flex-grow-1"
                      >Sepia</span
                    >
                    <i
                      class="bi bi-check"
                      v-if="
                        themeStore.currentTheme ===
                        'sepia'
                      "
                    ></i>
                  </button>
                </li>
              </ul>
            </li>

            <!-- Selector de idioma -->
            <li class="nav-item dropdown">
              <button
                class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
                type="button"
                id="languageDropdown"
                @click="
                  showLanguageMenu =
                    !showLanguageMenu
                "
                aria-expanded="false"
                :aria-label="
                  $t('common.changeLanguage')
                "
              >
                <i class="bi bi-translate"></i>
                <span
                  class="d-none d-md-inline"
                  >{{
                    currentLanguage.toUpperCase()
                  }}</span
                >
              </button>
              <ul
                v-if="showLanguageMenu"
                class="dropdown-menu dropdown-menu-end show"
                aria-labelledby="languageDropdown"
                @click="showLanguageMenu = false"
              >
                <li>
                  <button
                    class="dropdown-item"
                    :class="{
                      active:
                        currentLanguage === 'es',
                    }"
                    @click="changeLanguage('es')"
                  >
                    <i
                      class="bi bi-check me-2"
                      v-if="
                        currentLanguage === 'es'
                      "
                    ></i>
                    Español
                  </button>
                </li>
                <li>
                  <button
                    class="dropdown-item"
                    :class="{
                      active:
                        currentLanguage === 'en',
                    }"
                    @click="changeLanguage('en')"
                  >
                    <i
                      class="bi bi-check me-2"
                      v-if="
                        currentLanguage === 'en'
                      "
                    ></i>
                    English
                  </button>
                </li>
              </ul>
            </li>

            <!-- Notificaciones -->
            <li
              class="nav-item"
              v-if="isAuthenticated"
            >
              <button
                class="btn btn-sm btn-outline-secondary position-relative"
                @click="toggleNotifications"
                aria-label="Notificaciones"
              >
                <i class="bi bi-bell"></i>
                <span
                  v-if="unreadCount > 0"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {{ unreadCount }}
                  <span class="visually-hidden"
                    >notificaciones no
                    leídas</span
                  >
                </span>
              </button>
            </li>

            <!-- Accesibilidad -->
            <li class="nav-item">
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="toggleAccessibility"
                :aria-label="
                  $t('accessibility.title')
                "
                title="Opciones de accesibilidad"
              >
                <i
                  class="bi bi-universal-access"
                ></i>
              </button>
            </li>

            <!-- Usuario y logout -->
            <li
              class="nav-item"
              v-if="isAuthenticated"
            >
              <div class="dropdown">
                <button
                  class="btn btn-sm btn-primary dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  @click="
                    showUserMenu = !showUserMenu
                  "
                  aria-expanded="false"
                >
                  <i
                    class="bi bi-person-circle me-1"
                  ></i>
                  <span
                    class="d-none d-md-inline"
                    >{{ userName }}</span
                  >
                </button>
                <ul
                  v-if="showUserMenu"
                  class="dropdown-menu dropdown-menu-end show"
                  aria-labelledby="userDropdown"
                  @click="showUserMenu = false"
                >
                  <li v-if="!isAdmin">
                    <router-link
                      :to="profileRoute"
                      class="dropdown-item"
                    >
                      <i
                        class="bi bi-person me-2"
                      ></i>
                      {{ $t("nav.profile") }}
                    </router-link>
                  </li>
                  <li v-if="!isAdmin">
                    <hr
                      class="dropdown-divider"
                    />
                  </li>
                  <li>
                    <button
                      class="dropdown-item text-danger"
                      @click="handleLogout"
                    >
                      <i
                        class="bi bi-box-arrow-right me-2"
                      ></i>
                      {{ $t("common.logout") }}
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Indicador de en qué formulario estoy -->
    <output
      v-if="currentFormName"
      class="form-indicator bg-light border-bottom py-2 d-block"
      aria-live="polite"
    >
      <div class="container-fluid">
        <small class="text-muted">
          <i class="bi bi-file-text me-1"></i>
          {{ currentFormName }}
        </small>
      </div>
    </output>

    <!-- Modal de Resultados de Búsqueda -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showSearchModal"
          class="search-modal-overlay"
          @click="closeSearchModal"
        >
          <div class="search-modal" @click.stop>
            <div class="search-modal-header">
              <h5>
                <i class="bi bi-search me-2"></i>
                Resultados de búsqueda
              </h5>
              <button
                class="btn-close"
                @click="closeSearchModal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div class="search-modal-body">
              <!-- Indicador de carga -->
              <div
                v-if="isSearching"
                class="text-center py-4"
              >
                <div
                  class="spinner-border text-primary"
                  aria-hidden="true"
                ></div>
                <output
                  aria-live="polite"
                  class="visually-hidden"
                  >Buscando...</output
                >
              </div>

              <!-- Sin resultados -->
              <div
                v-else-if="
                  searchResults.length === 0
                "
                class="text-center py-4 text-muted"
              >
                <i
                  class="bi bi-search display-4"
                ></i>
                <p class="mt-3">
                  No se encontraron resultados
                  para "{{ searchQuery }}"
                </p>
              </div>

              <!-- Resultados -->
              <div v-else class="search-results">
                <div
                  v-for="(
                    result, index
                  ) in searchResults"
                  :key="index"
                  class="search-result-item"
                  @click="
                    navigateToResult(result.path)
                  "
                >
                  <div class="result-icon">
                    <i
                      class="bi"
                      :class="result.icon"
                    ></i>
                  </div>
                  <div class="result-content">
                    <h6 class="mb-1">
                      {{ result.title }}
                    </h6>
                    <small class="text-muted">{{
                      result.description
                    }}</small>
                  </div>
                  <i
                    class="bi bi-chevron-right text-muted"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useAccessibilityStore } from "@/stores/accessibility";
import { useThemeStore } from "@/stores/theme";

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true,
  },
  currentFormName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["search"]);

const { locale, t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const accessibilityStore =
  useAccessibilityStore();
const themeStore = useThemeStore();

const searchQuery = ref("");
const showMobileMenu = ref(false);
const showThemeMenu = ref(false);
const showLanguageMenu = ref(false);
const showUserMenu = ref(false);
const showSearchModal = ref(false);
const searchResults = ref([]);
const isSearching = ref(false);
const unreadCount = ref(3); // Simulado

const currentLanguage = computed(
  () => locale.value
);
const isAuthenticated = computed(
  () => authStore.isAuthenticated
);
const userName = computed(
  () =>
    authStore.user?.name ||
    authStore.user?.username ||
    ""
);

// Computed para verificar si es admin
const isAdmin = computed(
  () => authStore.user?.role === "admin"
);

// Computed para ruta de perfil según rol
const profileRoute = computed(() => {
  const role = authStore.user?.role;
  if (role === "nutricionista")
    return "/nutricionista/perfil";
  return "/usuario/perfil";
});

// Computed para tema
const themeIcon = computed(() => {
  const icons = {
    light: "bi bi-sun-fill",
    dark: "bi bi-moon-fill",
    highContrast: "bi bi-circle-half",
    sepia: "bi bi-book",
  };
  return (
    icons[themeStore.currentTheme] ||
    "bi bi-palette"
  );
});

const themeName = computed(() => {
  const names = {
    light: "Claro",
    dark: "Oscuro",
    highContrast: "Alto Contraste",
    sepia: "Sepia",
  };
  return names[themeStore.currentTheme] || "Tema";
});

const homeRoute = computed(() => {
  if (!isAuthenticated.value) return "/login";
  const role = authStore.user?.role;

  if (role === "admin") return "/admin";
  if (role === "nutricionista")
    return "/nutricionista";
  return "/usuario";
});

function changeLanguage(lang) {
  locale.value = lang;
  localStorage.setItem("locale", lang);
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value;
}

function handleSearch() {
  if (searchQuery.value.trim().length >= 2) {
    isSearching.value = true;
    showSearchModal.value = true;

    // Simular búsqueda con debounce
    setTimeout(() => {
      const query =
        searchQuery.value.toLowerCase();
      const role = authStore.user?.role;

      // Definir páginas según el rol
      let allPages = [];

      if (role === "admin") {
        allPages = [
          {
            title: "Panel de Administración",
            path: "/admin",
            description:
              "Estadísticas y gestión general",
            icon: "bi-speedometer2",
          },
          {
            title: "Estudiantes",
            path: "/admin/estudiantes",
            description:
              "Lista de estudiantes registrados",
            icon: "bi-people",
          },
          {
            title: "Registrar Estudiante",
            path: "/admin/estudiantes/registro",
            description:
              "Agregar nuevo estudiante",
            icon: "bi-person-plus",
          },
          {
            title: "Nutricionistas",
            path: "/admin/nutricionistas",
            description:
              "Lista de nutricionistas",
            icon: "bi-heart-pulse",
          },
          {
            title: "Registrar Nutricionista",
            path: "/admin/nutricionistas/registro",
            description:
              "Agregar nuevo nutricionista",
            icon: "bi-person-plus",
          },
          {
            title: "Reportes",
            path: "/admin/reportes",
            description: "Generar y ver reportes",
            icon: "bi-file-earmark-bar-graph",
          },
          {
            title: "Configuración",
            path: "/admin/configuracion",
            description: "Ajustes del sistema",
            icon: "bi-gear",
          },
        ];
      } else if (role === "nutricionista") {
        allPages = [
          {
            title: "Dashboard",
            path: "/nutricionista",
            description:
              "Panel del nutricionista",
            icon: "bi-speedometer2",
          },
          {
            title: "Menú Semanal",
            path: "/nutricionista/menu-semanal",
            description: "Gestionar menús",
            icon: "bi-calendar-week",
          },
          {
            title: "Perfil",
            path: "/nutricionista/perfil",
            description: "Mi perfil",
            icon: "bi-person",
          },
        ];
      } else {
        allPages = [
          {
            title: "Inicio",
            path: "/usuario",
            description: "Página principal",
            icon: "bi-house",
          },
          {
            title: "Perfil",
            path: "/usuario/perfil",
            description:
              "Mi perfil y estudiantes",
            icon: "bi-person",
          },
        ];
      }

      // Filtrar resultados
      searchResults.value = allPages.filter(
        (page) =>
          page.title
            .toLowerCase()
            .includes(query) ||
          page.description
            .toLowerCase()
            .includes(query)
      );

      isSearching.value = false;
      emit("search", searchQuery.value);
    }, 300);
  } else {
    showSearchModal.value = false;
    searchResults.value = [];
  }
}

function navigateToResult(path) {
  router.push(path);
  showSearchModal.value = false;
  searchQuery.value = "";
  searchResults.value = [];
}

function closeSearchModal() {
  showSearchModal.value = false;
  searchResults.value = [];
}

function toggleNotifications() {
  // Mostrar notificaciones simuladas
  const notifications = [
    "Nuevo estudiante registrado: Juan Pérez",
    "Menú semanal actualizado",
    "Recordatorio: Revisar reportes mensuales",
  ];

  const message = notifications.join("\n• ");
  alert(
    `Notificaciones (${unreadCount.value})\n\n• ${message}`
  );

  // Marcar como leídas
  unreadCount.value = 0;
}

function toggleAccessibility() {
  accessibilityStore.togglePanel();
}

async function handleLogout() {
  await authStore.logout();
  router.push("/login");
}

function handleImageError(e) {
  e.target.src =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Crect fill="%230d6efd" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" fill="white" text-anchor="middle" dy=".3em" font-size="20" font-weight="bold"%3ESNE%3C/text%3E%3C/svg%3E';
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1020;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar {
  background-color: var(--nav-bg) !important;
  color: var(--nav-text) !important;
  border-bottom: 1px solid var(--border-color);
}

.navbar-brand {
  color: var(--nav-text) !important;
}

.navbar-brand:hover {
  color: var(--primary) !important;
}

.search-container {
  max-width: 400px;
  width: 100%;
}

.form-indicator {
  font-weight: 500;
  color: var(--text-primary) !important;
  background-color: var(
    --bg-secondary
  ) !important;
}

.btn {
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.btn-primary {
  background-color: #0d6efd !important;
  color: #ffffff !important;
  border-color: #0d6efd !important;
}

.btn-outline-secondary {
  color: var(--text-secondary) !important;
  background-color: transparent !important;
  border-color: var(--border-color) !important;
}

.btn-outline-secondary:hover {
  background-color: var(
    --nav-hover-bg
  ) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.dropdown-menu {
  background-color: var(--dropdown-bg) !important;
  border: 1px solid var(--border-color);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  color: var(--dropdown-text) !important;
}

.dropdown-item:hover {
  background-color: var(
    --nav-hover-bg
  ) !important;
  color: var(--text-primary) !important;
}

.dropdown-item.active {
  background-color: #0d6efd !important;
  color: #ffffff !important;
}

.dropdown-item.text-danger {
  color: #dc3545 !important;
}

.dropdown-item.text-danger:hover {
  background-color: #dc3545 !important;
  color: #ffffff !important;
}

.input-group-text {
  color: var(--input-text) !important;
  background-color: var(--input-bg) !important;
  border-color: var(--border-color) !important;
}

.form-control {
  color: var(--input-text) !important;
  background-color: var(--input-bg) !important;
  border-color: var(--border-color) !important;
}

.form-control:focus {
  background-color: var(--input-bg) !important;
  color: var(--input-text) !important;
}

.badge {
  background-color: #dc3545 !important;
  color: #ffffff !important;
}

/* Modal de Búsqueda */
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1050;
  padding-top: 80px;
}

.search-modal {
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.search-modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-modal-header h5 {
  margin: 0;
  color: var(--text-primary);
}

.search-modal-body {
  padding: 1rem;
  overflow-y: auto;
  max-height: 60vh;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 6px;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
}

.search-result-item:hover {
  background: var(--nav-hover-bg);
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
}

.result-content h6 {
  margin: 0;
  color: var(--text-primary);
}

.result-content small {
  color: var(--text-secondary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .search-container {
    margin: 1rem 0;
    max-width: 100%;
  }

  .search-modal {
    width: 95%;
    margin: 0 auto;
  }

  .search-modal-overlay {
    padding-top: 60px;
  }
}
</style>
