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
                ref="searchInputRef"
                type="search"
                class="form-control border-start-0"
                :placeholder="searchPlaceholder"
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

    <!-- Panel de Notificaciones -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showNotificationsPanel"
          class="notifications-overlay"
          @click="closeNotificationsPanel"
        >
          <div class="notifications-panel" @click.stop>
            <div class="notifications-header">
              <div>
                <h5 class="mb-0">
                  <i class="bi bi-bell me-2"></i>
                  Notificaciones
                </h5>
                <small class="text-muted">
                  {{ unreadCount }} sin leer
                </small>
              </div>
              <div class="d-flex gap-2">
                <button
                  v-if="notificationsList.length > 0"
                  class="btn btn-sm btn-outline-primary"
                  @click="marcarTodasComoLeidas"
                  title="Marcar todas como leídas"
                >
                  <i class="bi bi-check-all"></i>
                </button>
                <button
                  class="btn btn-sm btn-close"
                  @click="closeNotificationsPanel"
                  aria-label="Cerrar"
                ></button>
              </div>
            </div>
            
            <div class="notifications-body">
              <!-- Sin notificaciones -->
              <div
                v-if="notificationsList.length === 0"
                class="text-center py-5 text-muted"
              >
                <i class="bi bi-inbox display-1"></i>
                <p class="mt-3 mb-0">No hay notificaciones</p>
                <small>Aquí aparecerán las alertas del nutricionista</small>
              </div>

              <!-- Lista de notificaciones -->
              <div v-else class="notifications-list">
                <div
                  v-for="notification in notificationsList"
                  :key="notification.id"
                  class="notification-item"
                  :class="{
                    'notification-unread': !notification.leida,
                    [`notification-${getNotificationColor(notification.tipo)}`]: true
                  }"
                >
                  <div class="notification-icon">
                    <i 
                      class="bi"
                      :class="getNotificationIcon(notification.tipo)"
                    ></i>
                  </div>
                  
                  <div class="notification-content">
                    <div class="notification-header-item">
                      <h6 class="mb-1">
                        {{ notification.titulo }}
                        <span
                          v-if="!notification.leida"
                          class="badge bg-primary ms-2"
                          style="font-size: 0.65rem;"
                        >
                          Nueva
                        </span>
                      </h6>
                      <small class="text-muted">
                        {{ formatearFecha(notification.fechaHora) }}
                      </small>
                    </div>
                    
                    <p class="notification-message mb-2">
                      {{ notification.mensaje }}
                    </p>
                    
                    <div class="notification-footer">
                      <span 
                        class="badge"
                        :class="`bg-${getNotificationColor(notification.tipo)}`"
                      >
                        {{ notification.tipo.replace('-', ' ') }}
                      </span>
                      
                      <div class="notification-actions">
                        <button
                          v-if="!notification.leida"
                          class="btn btn-sm btn-link text-primary"
                          @click="marcarComoLeida(notification.id)"
                          title="Marcar como leída"
                        >
                          <i class="bi bi-check"></i> Marcar leída
                        </button>
                        <button
                          v-if="notification.esRetroalimentacion && authStore.user?.role === 'nutricionista'"
                          class="btn btn-sm btn-link text-success"
                          @click="responderRetroalimentacion(notification)"
                          title="Responder retroalimentación"
                        >
                          <i class="bi bi-reply-fill"></i> Responder
                        </button>
                        <button
                          class="btn btn-sm btn-link text-danger"
                          @click="eliminarNotificacion(notification.id)"
                          title="Eliminar notificación"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal para Responder Retroalimentación -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showRespuestaModal"
          class="modal-overlay"
          @click="cerrarModalRespuesta"
        >
          <div class="modal-respuesta" @click.stop>
            <div class="modal-header-respuesta">
              <div>
                <h5 class="mb-1">
                  <i class="bi bi-reply-fill me-2"></i>
                  Responder Retroalimentación
                </h5>
                <small class="text-muted">{{ respuestaData.titulo }}</small>
              </div>
              <button
                class="btn btn-sm btn-close"
                @click="cerrarModalRespuesta"
                aria-label="Cerrar"
              ></button>
            </div>

            <div class="modal-body-respuesta">
              <!-- Información de la retroalimentación original -->
              <div class="alert alert-info mb-3">
                <div class="d-flex align-items-start gap-2">
                  <i class="bi bi-info-circle-fill"></i>
                  <div class="flex-grow-1">
                    <strong>Mensaje original:</strong>
                    <p class="mb-0 mt-1 small">{{ respuestaData.mensajeOriginal }}</p>
                  </div>
                </div>
              </div>

              <!-- Textarea para la respuesta -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  Tu respuesta <span class="text-danger">*</span>
                </label>
                <textarea
                  ref="respuestaTextarea"
                  v-model="respuestaTexto"
                  class="form-control"
                  rows="5"
                  placeholder="Escribe tu respuesta al representante..."
                  :maxlength="500"
                ></textarea>
                <small class="text-muted">
                  {{ respuestaTexto.length }}/500 caracteres
                </small>
              </div>

              <!-- Botones de acción -->
              <div class="d-flex gap-2 justify-content-end">
                <button
                  class="btn btn-secondary"
                  @click="cerrarModalRespuesta"
                >
                  <i class="bi bi-x-circle me-1"></i>
                  Cancelar
                </button>
                <button
                  class="btn btn-success"
                  @click="enviarRespuesta"
                  :disabled="!respuestaTexto.trim()"
                >
                  <i class="bi bi-send-fill me-1"></i>
                  Enviar Respuesta
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
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
const searchInputRef = ref(null);
const showMobileMenu = ref(false);
const showThemeMenu = ref(false);
const showLanguageMenu = ref(false);
const showUserMenu = ref(false);
const showSearchModal = ref(false);
const searchResults = ref([]);
const isSearching = ref(false);
const showNotificationsPanel = ref(false);
const notificationsList = ref([]);
const showRespuestaModal = ref(false);
const respuestaTexto = ref('');
const respuestaData = ref({
  notificationId: null,
  titulo: '',
  mensajeOriginal: '',
  representanteId: null,
  tipo: ''
});
const respuestaTextarea = ref(null);

// Computed para contar notificaciones no leídas
const unreadCount = computed(() => {
  try {
    const userRole = authStore.user?.role;
    
    if (userRole === 'representante') {
      // Representantes: contar alertas no leídas
      const alertasGuardadas = localStorage.getItem('alertas_notificaciones');
      if (alertasGuardadas) {
        const alertas = JSON.parse(alertasGuardadas);
        return alertas.filter(alerta => (alerta.estado === 'enviada' || alerta.esRespuesta === true) && !alerta.leida).length;
      }
    } else if (userRole === 'nutricionista') {
      // Nutricionistas: contar retroalimentaciones no vistas
      const retroalimentacionesGuardadas = localStorage.getItem('retroalimentaciones_comidas');
      if (retroalimentacionesGuardadas) {
        const retroalimentaciones = JSON.parse(retroalimentacionesGuardadas);
        return retroalimentaciones.filter(retro => !retro.vistaPorNutricionista).length;
      }
    }
  } catch (error) {
    console.error('Error al contar notificaciones:', error);
  }
  return 0;
});

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

const searchPlaceholder = computed(() => {
  const role = authStore.user?.role;
  if (role === "admin") return "Buscar estudiantes, nutricionistas, reportes...";
  if (role === "nutricionista") return "Buscar menús, estudiantes, perfil...";
  return "Buscar en mi perfil, estudiantes...";
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
            title: "Panel Nutricionista",
            path: "/nutricionista",
            description:
              "Dashboard con estadísticas y menús personalizados",
            icon: "bi-speedometer2",
          },
          {
            title: "Gestión Menú Semanal",
            path: "/nutricionista/menu-semanal",
            description: "Gestionar y actualizar menús semanales",
            icon: "bi-calendar-week",
          },
          {
            title: "Recomendaciones",
            path: "/nutricionista/recomendaciones",
            description: "Crear recomendaciones nutricionales para estudiantes",
            icon: "bi-heart-pulse",
          },
          {
            title: "Alertas y Notificaciones",
            path: "/nutricionista/alertas",
            description: "Gestionar alertas y comunicación con representantes",
            icon: "bi-bell",
          },
          {
            title: "Estudiantes",
            path: "/nutricionista",
            description: "Ver lista de estudiantes asignados",
            icon: "bi-people-fill",
          },
          {
            title: "Estadísticas",
            path: "/nutricionista",
            description: "Ver estadísticas del sistema",
            icon: "bi-graph-up",
          },
          {
            title: "Reportes",
            path: "/nutricionista",
            description: "Generar reportes nutricionales",
            icon: "bi-file-earmark-text",
          },
          {
            title: "Menú Personalizado",
            path: "/nutricionista",
            description: "Asignar menús personalizados a estudiantes",
            icon: "bi-person-badge",
          },
        ];
      } else {
        allPages = [
          {
            title: "Inicio",
            path: "/usuario",
            description: "Página principal con menús y recomendaciones",
            icon: "bi-house",
          },
          {
            title: "Perfil",
            path: "/usuario/perfil",
            description:
              "Mi perfil y estudiantes a cargo",
            icon: "bi-person",
          },
          {
            title: "Mis Hijos",
            path: "/usuario",
            description: "Ver información de mis hijos",
            icon: "bi-people-fill",
          },
          {
            title: "Menú del Día",
            path: "/usuario",
            description: "Ver menú de hoy",
            icon: "bi-calendar-check",
          },
          {
            title: "Menú Semanal",
            path: "/usuario",
            description: "Ver menú de la semana",
            icon: "bi-calendar-week",
          },
          {
            title: "Agregar Estudiante",
            path: "/usuario",
            description: "Registrar nuevo hijo",
            icon: "bi-person-plus",
          },
          {
            title: "Recomendaciones Nutricionales",
            path: "/usuario",
            description: "Ver recomendaciones del nutricionista",
            icon: "bi-heart-pulse",
          },
          {
            title: "Menú Personalizado",
            path: "/usuario",
            description: "Ver menús personalizados de mis hijos",
            icon: "bi-clipboard-check",
          },
          {
            title: "Términos y Condiciones",
            path: "/terminos",
            description: "Leer términos y condiciones",
            icon: "bi-file-text",
          },
          {
            title: "Política de Privacidad",
            path: "/politica-privacidad",
            description: "Leer política de privacidad",
            icon: "bi-shield-check",
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
  showNotificationsPanel.value = !showNotificationsPanel.value;
  if (showNotificationsPanel.value) {
    cargarNotificaciones();
  }
}

function cargarNotificaciones() {
  try {
    const userRole = authStore.user?.role;
    
    if (userRole === 'representante') {
      // Para representantes: cargar alertas del nutricionista y respuestas
      const alertasGuardadas = localStorage.getItem('alertas_notificaciones');
      
      if (alertasGuardadas) {
        const alertas = JSON.parse(alertasGuardadas);
        
        // Filtrar alertas enviadas (incluye todas las alertas con estado enviada o respuestas)
        const alertasFiltradas = alertas.filter(alerta => {
          return alerta.estado === 'enviada' || alerta.esRespuesta === true;
        });
        
        notificationsList.value = alertasFiltradas
          .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))
          .map((alerta, index) => ({
            ...alerta,
            id: alerta.id || index,
            leida: alerta.leida || false,
            tipo: alerta.tipo || 'general'
          }));
      } else {
        notificationsList.value = [];
      }
    } else if (userRole === 'nutricionista') {
      // Para nutricionistas: cargar retroalimentaciones de usuarios
      const retroalimentacionesGuardadas = localStorage.getItem('retroalimentaciones_comidas');
      
      if (retroalimentacionesGuardadas) {
        const retroalimentaciones = JSON.parse(retroalimentacionesGuardadas);
        
        // Convertir retroalimentaciones a formato de notificación (mostrar todas, no solo las no vistas)
        notificationsList.value = retroalimentaciones
          .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
          .map(retro => ({
            id: retro.id,
            tipo: retro.tipo, // 'evaluacion', 'reporte', 'sugerencia'
            titulo: obtenerTituloRetroalimentacion(retro),
            mensaje: obtenerMensajeRetroalimentacion(retro),
            fechaHora: retro.fechaRegistro,
            leida: retro.vistaPorNutricionista || false,
            esRetroalimentacion: true,
            datosOriginales: retro
          }));
      } else {
        notificationsList.value = [];
      }
    } else {
      notificationsList.value = [];
    }
  } catch (error) {
    console.error('Error al cargar notificaciones:', error);
    notificationsList.value = [];
  }
}

function obtenerTituloRetroalimentacion(retro) {
  const titulos = {
    'evaluacion': `Evaluación de comida - ${retro.estudianteNombre}`,
    'reporte': `Reporte de problema - ${retro.estudianteNombre}`,
    'sugerencia': retro.titulo || 'Nueva sugerencia'
  };
  return titulos[retro.tipo] || 'Nueva retroalimentación';
}

function obtenerMensajeRetroalimentacion(retro) {
  if (retro.tipo === 'evaluacion') {
    return `Calificación: ${retro.calificacion}/5 - ${retro.tipoComida} del ${new Date(retro.fecha).toLocaleDateString('es-VE')}`;
  } else if (retro.tipo === 'reporte') {
    return `${retro.tipoProblema} (${retro.urgencia}) - ${retro.descripcion.substring(0, 50)}...`;
  } else if (retro.tipo === 'sugerencia') {
    return retro.descripcion.substring(0, 80) + '...';
  }
  return '';
}

function marcarComoLeida(notificationId) {
  try {
    const userRole = authStore.user?.role;
    
    if (userRole === 'representante') {
      // Marcar alerta como leída
      const alertasGuardadas = localStorage.getItem('alertas_notificaciones');
      if (alertasGuardadas) {
        const alertas = JSON.parse(alertasGuardadas);
        const alertaIndex = alertas.findIndex((a, idx) => (a.id || idx) === notificationId);
        
        if (alertaIndex !== -1) {
          alertas[alertaIndex].leida = true;
          localStorage.setItem('alertas_notificaciones', JSON.stringify(alertas));
          cargarNotificaciones();
        }
      }
    } else if (userRole === 'nutricionista') {
      // Marcar retroalimentación como vista
      const retroalimentacionesGuardadas = localStorage.getItem('retroalimentaciones_comidas');
      if (retroalimentacionesGuardadas) {
        const retroalimentaciones = JSON.parse(retroalimentacionesGuardadas);
        const retroIndex = retroalimentaciones.findIndex(r => r.id === notificationId);
        
        if (retroIndex !== -1) {
          retroalimentaciones[retroIndex].vistaPorNutricionista = true;
          localStorage.setItem('retroalimentaciones_comidas', JSON.stringify(retroalimentaciones));
          cargarNotificaciones();
        }
      }
    }
  } catch (error) {
    console.error('Error al marcar como leída:', error);
  }
}

function marcarTodasComoLeidas() {
  try {
    const userRole = authStore.user?.role;
    
    if (userRole === 'representante') {
      const alertasGuardadas = localStorage.getItem('alertas_notificaciones');
      if (alertasGuardadas) {
        const alertas = JSON.parse(alertasGuardadas);
        alertas.forEach(alerta => {
          if (alerta.estado === 'enviada' || alerta.esRespuesta === true) {
            alerta.leida = true;
          }
        });
        localStorage.setItem('alertas_notificaciones', JSON.stringify(alertas));
        cargarNotificaciones();
      }
    } else if (userRole === 'nutricionista') {
      const retroalimentacionesGuardadas = localStorage.getItem('retroalimentaciones_comidas');
      if (retroalimentacionesGuardadas) {
        const retroalimentaciones = JSON.parse(retroalimentacionesGuardadas);
        retroalimentaciones.forEach(retro => {
          retro.vistaPorNutricionista = true;
        });
        localStorage.setItem('retroalimentaciones_comidas', JSON.stringify(retroalimentaciones));
        cargarNotificaciones();
      }
    }
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
  }
}

function eliminarNotificacion(notificationId) {
  try {
    const userRole = authStore.user?.role;
    
    if (userRole === 'representante') {
      const alertasGuardadas = localStorage.getItem('alertas_notificaciones');
      if (alertasGuardadas) {
        let alertas = JSON.parse(alertasGuardadas);
        alertas = alertas.filter((a, idx) => (a.id || idx) !== notificationId);
        localStorage.setItem('alertas_notificaciones', JSON.stringify(alertas));
        cargarNotificaciones();
      }
    } else if (userRole === 'nutricionista') {
      const retroalimentacionesGuardadas = localStorage.getItem('retroalimentaciones_comidas');
      if (retroalimentacionesGuardadas) {
        let retroalimentaciones = JSON.parse(retroalimentacionesGuardadas);
        retroalimentaciones = retroalimentaciones.filter(r => r.id !== notificationId);
        localStorage.setItem('retroalimentaciones_comidas', JSON.stringify(retroalimentaciones));
        cargarNotificaciones();
      }
    }
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
  }
}

function getNotificationIcon(tipo) {
  const icons = {
    'cambio-menu': 'bi-calendar-event',
    'alergia': 'bi-exclamation-triangle',
    'recordatorio': 'bi-bell',
    'general': 'bi-info-circle',
    'evaluacion': 'bi-star-fill',
    'reporte': 'bi-exclamation-circle-fill',
    'sugerencia': 'bi-lightbulb-fill'
  };
  return icons[tipo] || 'bi-bell';
}

function getNotificationColor(tipo) {
  const colors = {
    'cambio-menu': 'primary',
    'alergia': 'warning',
    'recordatorio': 'info',
    'general': 'secondary',
    'evaluacion': 'success',
    'reporte': 'danger',
    'sugerencia': 'warning'
  };
  return colors[tipo] || 'secondary';
}

function formatearFecha(fechaHora) {
  const fecha = new Date(fechaHora);
  const ahora = new Date();
  const diffMs = ahora - fecha;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHoras = Math.floor(diffMs / 3600000);
  const diffDias = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHoras < 24) return `Hace ${diffHoras}h`;
  if (diffDias < 7) return `Hace ${diffDias}d`;
  
  return fecha.toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'short',
    year: fecha.getFullYear() !== ahora.getFullYear() ? 'numeric' : undefined
  });
}

function closeNotificationsPanel() {
  showNotificationsPanel.value = false;
}

async function responderRetroalimentacion(notification) {
  // Preparar datos para el modal
  respuestaData.value = {
    notificationId: notification.id,
    titulo: notification.titulo,
    mensajeOriginal: notification.mensaje,
    representanteId: notification.datosOriginales.representanteId,
    tipo: notification.tipo
  };
  respuestaTexto.value = '';
  
  // Mostrar modal
  showRespuestaModal.value = true;
  
  // Enfocar textarea después de que el modal se renderice
  await nextTick();
  if (respuestaTextarea.value) {
    respuestaTextarea.value.focus();
  }
}

function cerrarModalRespuesta() {
  showRespuestaModal.value = false;
  respuestaTexto.value = '';
  respuestaData.value = {
    notificationId: null,
    titulo: '',
    mensajeOriginal: '',
    representanteId: null,
    tipo: ''
  };
}

async function enviarRespuesta() {
  if (!respuestaTexto.value.trim()) return;
  
  try {
    // Marcar la retroalimentación como leída
    marcarComoLeida(respuestaData.value.notificationId);
    
    // Crear una nueva alerta para el representante
    const alertasGuardadas = localStorage.getItem('alertas_notificaciones') || '[]';
    const alertas = JSON.parse(alertasGuardadas);
    
    const nuevaAlerta = {
      id: `RESP-${Date.now()}`,
      tipo: 'general',
      prioridad: 'media',
      titulo: `Respuesta del nutricionista`,
      mensaje: respuestaTexto.value.trim(),
      estado: 'enviada',
      fechaHora: new Date().toISOString(),
      leida: false,
      esRespuesta: true,
      retroalimentacionOriginalId: respuestaData.value.notificationId,
      tipoOriginal: respuestaData.value.tipo,
      representanteId: respuestaData.value.representanteId
    };
    
    alertas.push(nuevaAlerta);
    localStorage.setItem('alertas_notificaciones', JSON.stringify(alertas));
    
    // Importar notification store
    const { useNotificationStore } = await import('@/stores/notification');
    const notificationStore = useNotificationStore();
    notificationStore.success('✅ Respuesta enviada al representante');
    
    // Cerrar modales
    cerrarModalRespuesta();
    closeNotificationsPanel();
    
  } catch (error) {
    console.error('Error al enviar respuesta:', error);
    const { useNotificationStore } = await import('@/stores/notification');
    const notificationStore = useNotificationStore();
    notificationStore.error('Error al enviar la respuesta');
  }
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

function focusSearchInput() {
  if (searchInputRef.value && props.showSearch) {
    searchInputRef.value.focus();
    searchInputRef.value.select();
  }
}

function handleKeyboardShortcut(e) {
  // Alt+F para enfocar búsqueda
  if (e.altKey && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    focusSearchInput();
  }
}

// Lifecycle hooks
onMounted(() => {
  // Listener para Alt+F
  globalThis.addEventListener('keydown', handleKeyboardShortcut);
  
  // Listener para el evento personalizado app:focus-search
  globalThis.addEventListener('app:focus-search', focusSearchInput);
});

onUnmounted(() => {
  globalThis.removeEventListener('keydown', handleKeyboardShortcut);
  globalThis.removeEventListener('app:focus-search', focusSearchInput);
});
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

/* Estilos del Panel de Notificaciones */
.notifications-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
  z-index: 9999;
}

.notifications-panel {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideDown 0.3s ease;
}

.notifications-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 2px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, var(--primary) 0%, #0056b3 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.notifications-header h5 {
  margin: 0;
  font-weight: 600;
}

.notifications-header small {
  color: rgba(255, 255, 255, 0.85);
}

.notifications-body {
  overflow-y: auto;
  max-height: calc(80vh - 80px);
  padding: 0.5rem;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: var(--bg-secondary);
  border-left: 4px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
}

.notification-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.notification-item.notification-unread {
  background: rgba(13, 110, 253, 0.05);
  border-left-color: var(--primary);
}

.notification-item.notification-primary {
  border-left-color: #0d6efd;
}

.notification-item.notification-warning {
  border-left-color: #ffc107;
}

.notification-item.notification-info {
  border-left-color: #0dcaf0;
}

.notification-item.notification-secondary {
  border-left-color: #6c757d;
}

.notification-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.2) 0%, rgba(13, 110, 253, 0.05) 100%);
  color: var(--primary);
}

.notification-primary .notification-icon {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.2) 0%, rgba(13, 110, 253, 0.05) 100%);
  color: #0d6efd;
}

.notification-warning .notification-icon {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 193, 7, 0.05) 100%);
  color: #ffc107;
}

.notification-info .notification-icon {
  background: linear-gradient(135deg, rgba(13, 202, 240, 0.2) 0%, rgba(13, 202, 240, 0.05) 100%);
  color: #0dcaf0;
}

.notification-secondary .notification-icon {
  background: linear-gradient(135deg, rgba(108, 117, 125, 0.2) 0%, rgba(108, 117, 125, 0.05) 100%);
  color: #6c757d;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.notification-header-item h6 {
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.95rem;
  flex: 1;
}

.notification-header-item small {
  color: var(--text-secondary);
  white-space: nowrap;
  font-size: 0.75rem;
}

.notification-message {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.notification-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  gap: 0.5rem;
}

.notification-footer .badge {
  text-transform: capitalize;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
}

.notification-actions {
  display: flex;
  gap: 0.25rem;
}

.notification-actions .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  text-decoration: none;
}

.notification-actions .btn:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .notifications-overlay {
    padding-top: 60px;
  }

  .notifications-panel {
    width: 95%;
    max-height: 85vh;
  }

  .notification-item {
    padding: 0.875rem;
  }

  .notification-icon {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
}

/* Estilos del Modal de Respuesta */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 10000;
}

.modal-respuesta {
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header-respuesta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 2px solid var(--border-color);
  background: linear-gradient(135deg, var(--primary) 0%, #0056b3 100%);
  border-radius: 16px 16px 0 0;
  color: white;
}

.modal-header-respuesta h5 {
  margin: 0;
  font-weight: 700;
  font-size: 1.25rem;
}

.modal-header-respuesta small {
  opacity: 0.9;
  display: block;
  margin-top: 0.25rem;
}

.modal-header-respuesta .btn-close {
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.modal-header-respuesta .btn-close:hover {
  opacity: 1;
}

.modal-body-respuesta {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-body-respuesta .alert {
  border-radius: 8px;
  border: none;
}

.modal-body-respuesta .form-control {
  border-radius: 8px;
  border: 2px solid var(--border-color);
  padding: 0.75rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  resize: vertical;
}

.modal-body-respuesta .form-control:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

.modal-body-respuesta .btn {
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.modal-body-respuesta .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-body-respuesta .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .modal-respuesta {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header-respuesta,
  .modal-body-respuesta {
    padding: 1rem;
  }
}
</style>
