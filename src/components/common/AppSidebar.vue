<template>
  <nav
    class="app-sidebar"
    :class="{
      collapsed: isCollapsed,
      expanded: isExpanded,
    }"
    aria-label="Navegación principal"
  >
    <!-- Toggle button -->
    <button
      class="sidebar-toggle"
      @click="toggleSidebar"
      :aria-label="
        isExpanded
          ? 'Contraer menú'
          : 'Expandir menú'
      "
      :aria-expanded="isExpanded"
      :title="
        isExpanded
          ? 'Ocultar menú'
          : 'Mostrar menú'
      "
    >
      <i
        class="bi"
        :class="
          isExpanded
            ? 'bi-chevron-left'
            : 'bi-chevron-right'
        "
      ></i>
    </button>

    <!-- Menu items -->
    <div class="sidebar-nav">
      <ul class="nav flex-column">
        <li
          class="nav-item"
          v-for="item in menuItems"
          :key="item.path"
        >
          <!-- Item sin hijos -->
          <router-link
            v-if="!item.children"
            :to="item.path"
            class="nav-link"
            :class="{
              active: isActive(item.path),
            }"
            @click="handleNavClick(item)"
          >
            <i class="bi" :class="item.icon"></i>
            <span
              class="nav-text"
              v-show="isExpanded"
              >{{ $t(item.label) }}</span
            >
          </router-link>

          <!-- Item con submenú -->
          <div v-else>
            <button
              class="nav-link submenu-toggle"
              :class="{
                active: isActiveParent(item),
              }"
              @click="toggleSubmenu(item.key)"
              :aria-expanded="
                isSubmenuOpen(item.key)
              "
            >
              <i
                class="bi"
                :class="item.icon"
              ></i>
              <span
                class="nav-text"
                v-show="isExpanded"
                >{{ $t(item.label) }}</span
              >
              <i
                v-show="isExpanded"
                class="bi bi-chevron-down submenu-icon ms-auto"
                :class="{
                  rotated: isSubmenuOpen(
                    item.key
                  ),
                }"
              ></i>
            </button>

            <!-- Submenú -->
            <transition name="submenu">
              <ul
                v-show="
                  isExpanded &&
                  isSubmenuOpen(item.key)
                "
                class="submenu nav flex-column"
              >
                <li
                  class="nav-item"
                  v-for="child in item.children"
                  :key="child.path"
                >
                  <router-link
                    :to="child.path"
                    class="nav-link"
                    :class="{
                      active: isActive(
                        child.path
                      ),
                    }"
                    @click="handleNavClick(child)"
                  >
                    <i
                      class="bi"
                      :class="child.icon"
                    ></i>
                    <span class="nav-text">{{
                      $t(child.label)
                    }}</span>
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>
        </li>
      </ul>

      <!-- Shortcuts section -->
      <div
        class="sidebar-section"
        v-if="isExpanded && shortcuts.length > 0"
      >
        <div class="section-title">
          <small class="text-muted"
            >Atajos rápidos</small
          >
        </div>
        <ul class="nav flex-column">
          <li
            class="nav-item"
            v-for="shortcut in shortcuts"
            :key="shortcut.id"
          >
            <button
              class="nav-link shortcut"
              @click="handleShortcut(shortcut)"
            >
              <i
                class="bi"
                :class="shortcut.icon"
              ></i>
              <span class="nav-text">{{
                shortcut.label
              }}</span>
              <kbd class="ms-auto">{{
                shortcut.key
              }}</kbd>
            </button>
          </li>
        </ul>
      </div>

      <!-- Contextual submenu (tema del proyecto) -->
      <div
        class="sidebar-section mt-auto"
        v-if="isExpanded"
      >
        <div class="section-title">
          <small class="text-muted">{{
            $t("nav.help")
          }}</small>
        </div>
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link
              to="/terminos"
              class="nav-link"
            >
              <i class="bi bi-file-text"></i>
              <span class="nav-text">{{
                $t("nav.terms")
              }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/politica-privacidad"
              class="nav-link"
            >
              <i class="bi bi-shield-check"></i>
              <span class="nav-text">{{
                $t("nav.privacy")
              }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <button
              class="nav-link"
              @click="openContextualHelp"
            >
              <i
                class="bi bi-question-circle"
              ></i>
              <span class="nav-text"
                >Ayuda contextual</span
              >
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Overlay para cerrar menú en móvil -->
    <Teleport to="body">
      <Transition name="overlay-fade">
        <div
          v-if="isExpanded && isMobile"
          class="sidebar-mobile-overlay"
          @click="closeSidebar"
        ></div>
      </Transition>
    </Teleport>
  </nav>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAccessibilityStore } from "@/stores/accessibility";

const props = defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
  defaultExpanded: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["sidebar-state"]);

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const accessibilityStore =
  useAccessibilityStore();

const isExpanded = ref(props.defaultExpanded);
const isCollapsed = computed(
  () => !isExpanded.value
);
const openSubmenus = ref(new Set());
const isMobile = ref(
  globalThis.innerWidth <= 768
);

// Shortcuts de teclado
const shortcuts = ref([
  {
    id: 1,
    label: "Inicio",
    icon: "bi-house",
    key: "Alt+H",
    action: "goHome",
  },
  {
    id: 2,
    label: "Buscar",
    icon: "bi-search",
    key: "Alt+F",
    action: "search",
  },
]);

function toggleSidebar() {
  isExpanded.value = !isExpanded.value;
  localStorage.setItem(
    "sidebarExpanded",
    isExpanded.value
  );
  emit("sidebar-state", isExpanded.value);
}

function closeSidebar() {
  if (isMobile.value) {
    isExpanded.value = false;
    localStorage.setItem(
      "sidebarExpanded",
      false
    );
    emit("sidebar-state", false);
  }
}

function handleResize() {
  isMobile.value = globalThis.innerWidth <= 768;
}

function isActive(path) {
  return route.path === path;
}

function isActiveParent(item) {
  if (!item.children) return false;
  return item.children.some((child) =>
    route.path.startsWith(child.path)
  );
}

function toggleSubmenu(key) {
  if (openSubmenus.value.has(key)) {
    openSubmenus.value.delete(key);
  } else {
    openSubmenus.value.add(key);
  }
}

function isSubmenuOpen(key) {
  return openSubmenus.value.has(key);
}

function handleNavClick(item) {
  // Manejar acciones especiales
  if (item.action === "crear-recordatorio") {
    // Emitir evento global para abrir el modal de recordatorios
    globalThis.dispatchEvent(
      new CustomEvent("app:abrir-recordatorio")
    );
    closeSidebar();
    return;
  }

  if (item.action === "ver-estudiantes") {
    // Redirigir al dashboard y hacer scroll a estudiantes
    router.push("/nutricionista");
    setTimeout(() => {
      const elemento = document.getElementById(
        "seccion-estudiantes"
      );
      if (elemento) {
        elemento.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);
    closeSidebar();
    return;
  }

  if (item.action === "ver-estadisticas") {
    // Emitir evento global para ver estadísticas
    globalThis.dispatchEvent(
      new CustomEvent("app:ver-estadisticas")
    );
    closeSidebar();
    return;
  }

  if (item.action === "generar-reportes") {
    // Emitir evento global para generar reportes
    globalThis.dispatchEvent(
      new CustomEvent("app:generar-reportes")
    );
    closeSidebar();
    return;
  }

  // Anunciar navegación con síntesis de voz si está habilitada
  if (accessibilityStore.speechEnabled) {
    accessibilityStore.speak(
      `Navegando a ${t(item.label)}`
    );
  }
  // Cerrar menú en móvil después de navegar
  closeSidebar();
}

function handleShortcut(shortcut) {
  if (shortcut.action === "goHome") {
    router.push("/");
  } else if (shortcut.action === "search") {
    // Emitir evento para enfocar el buscador
    globalThis.dispatchEvent(
      new CustomEvent("app:focus-search")
    );
  }
}

function openContextualHelp() {
  // Mostrar ayuda según la ruta actual
  const helpMessages = {
    "/admin":
      "Panel principal donde puedes ver estadísticas y gestionar usuarios del sistema.",
    "/admin/estudiantes":
      "Gestiona los estudiantes registrados en el sistema.",
    "/admin/nutricionistas":
      "Gestiona los nutricionistas del sistema.",
    "/admin/reportes":
      "Consulta y genera reportes del sistema.",
    "/admin/configuracion":
      "Configura los parámetros del sistema.",
  };

  const message =
    helpMessages[route.path] ||
    "Ayuda no disponible para esta sección.";
  alert(`Ayuda Contextual\n\n${message}`);
}

// Inicializar estado del sidebar desde localStorage
onMounted(() => {
  const saved = localStorage.getItem(
    "sidebarExpanded"
  );
  if (saved !== null) {
    isExpanded.value = saved === "true";
  }

  // Emitir estado inicial
  emit("sidebar-state", isExpanded.value);

  // Auto-abrir submenú si la ruta activa está dentro
  for (const item of props.menuItems) {
    if (item.children && isActiveParent(item)) {
      openSubmenus.value.add(item.key);
    }
  }
});

// Registrar shortcuts de teclado y resize listener
onMounted(() => {
  globalThis.addEventListener(
    "keydown",
    handleKeyboardShortcut
  );
  globalThis.addEventListener(
    "resize",
    handleResize
  );
});

onUnmounted(() => {
  globalThis.removeEventListener(
    "resize",
    handleResize
  );
});

function handleKeyboardShortcut(e) {
  if (!e.altKey) {
    return;
  }

  const key = e.key?.toLowerCase();

  if (key === "h") {
    e.preventDefault();
    router.push("/");
  } else if (key === "f") {
    e.preventDefault();
    globalThis.dispatchEvent(
      new CustomEvent("app:focus-search")
    );
  }
}
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  left: 0;
  top: calc(var(--header-height, 60px) + 1rem);
  height: calc(
    100vh - var(--header-height, 60px) - 1rem
  );
  background: var(--nav-bg);
  border-right: 1px solid var(--border-color);
  transition: width 0.3s ease, transform 0.3s ease;
  width: var(--sidebar-width, 250px);
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1010;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding-top: 0.5rem;
  border-radius: 0 8px 0 0;
}

.app-sidebar.collapsed {
  width: 60px;
}

.app-sidebar.expanded {
  z-index: 1015;
}

.sidebar-toggle {
  position: absolute;
  right: -18px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #0d6efd;
  color: white;
  border: 3px solid #ffffff;
  display: flex !important;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1050;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.5);
  transition: all 0.3s ease;
  font-size: 1.1rem;
  opacity: 1 !important;
  visibility: visible !important;
}

.sidebar-toggle:hover {
  background: #0056b3;
  transform: translateY(-50%) scale(1.2);
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.7);
}

.sidebar-toggle:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.sidebar-nav {
  padding: 1rem 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--nav-text);
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  white-space: nowrap;
}

.nav-link:hover {
  background: var(--nav-hover-bg);
  color: var(--primary);
}

.nav-link.active {
  background: var(--nav-hover-bg);
  color: var(--primary);
  border-left: 3px solid var(--primary);
  font-weight: 600;
}

.nav-link i {
  font-size: 1.2rem;
  min-width: 28px;
  flex-shrink: 0;
}

.nav-text {
  margin-left: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.submenu {
  padding-left: 1rem;
  background: var(--bg-secondary);
  border-left: 2px solid var(--border-color);
}

.submenu .nav-link {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.submenu-toggle {
  cursor: pointer;
}

.submenu-icon {
  transition: transform 0.3s ease;
  font-size: 0.8rem;
  margin-left: auto;
  flex-shrink: 0;
}

.submenu-icon.rotated {
  transform: rotate(180deg);
}

.sidebar-section {
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
  margin-top: 1rem;
}

.section-title {
  padding: 0 1rem;
  margin-bottom: 0.5rem;
}

.section-title small {
  color: var(--text-secondary);
}

.shortcut kbd {
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 3px;
}

/* Transiciones */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  max-height: 0;
  opacity: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  max-height: 500px;
  opacity: 1;
}

/* Overlay móvil */
.sidebar-mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1005;
  cursor: pointer;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
    z-index: 1015;
  }

  .app-sidebar.expanded {
    transform: translateX(0);
  }

  .sidebar-toggle {
    right: -40px;
    background: var(--primary);
  }
}

/* Scrollbar personalizado */
.app-sidebar::-webkit-scrollbar {
  width: 6px;
}

.app-sidebar::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.app-sidebar::-webkit-scrollbar-thumb {
  background: var(--text-secondary);
  border-radius: 3px;
}

.app-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--text-primary);
}
</style>
