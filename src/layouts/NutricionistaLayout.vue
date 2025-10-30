<template>
  <div class="nutricionista-layout">
    <AppHeader
      :show-search="true"
      :current-form-name="currentPageTitle"
    />

    <div
      class="layout-container"
      :class="{
        'sidebar-expanded': isSidebarExpanded,
      }"
    >
      <AppSidebar
        :menu-items="nutricionistaMenuItems"
        @sidebar-state="handleSidebarState"
      />

      <main class="main-content" role="main">
        <div class="container-fluid py-4">
          <RouterView v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "@/components/common/AppHeader.vue";
import AppSidebar from "@/components/common/AppSidebar.vue";
import AppFooter from "@/components/common/AppFooter.vue";

const route = useRoute();
const isSidebarExpanded = ref(true);

const handleSidebarState = (expanded) => {
  isSidebarExpanded.value = expanded;
};

const nutricionistaMenuItems = [
  {
    path: "/nutricionista",
    label: "nav.home",
    icon: "bi-speedometer2",
    key: "dashboard",
  },
  {
    path: "/nutricionista/menu-semanal",
    label: "nav.weeklyMenu",
    icon: "bi-calendar-week",
    key: "menu",
  },
  {
    path: "#",
    label: "Crear Recordatorio",
    icon: "bi-bell-fill",
    key: "recordatorio",
    action: "crear-recordatorio",
  },
  {
    path: "#",
    label: "Ver Estudiantes",
    icon: "bi-people-fill",
    key: "estudiantes",
    action: "ver-estudiantes",
  },
  {
    path: "#",
    label: "Ver Estadísticas",
    icon: "bi-graph-up",
    key: "estadisticas",
    action: "ver-estadisticas",
  },
  {
    path: "#",
    label: "Generar Reportes",
    icon: "bi-file-earmark-text",
    key: "reportes",
    action: "generar-reportes",
  },
];

const currentPageTitle = computed(() => {
  const titles = {
    "/nutricionista": "Panel Nutricionista",
    "/nutricionista/menu-semanal":
      "Gestión Menú Semanal",
  };
  return titles[route.path] || "";
});
</script>

<style scoped>
.nutricionista-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.layout-container {
  display: flex;
  flex: 1;
  padding-top: var(--header-height, 60px);
}

.main-content {
  flex: 1;
  margin-left: 60px;
  transition: margin-left 0.3s ease,
    width 0.3s ease;
  background: var(--bg-secondary);
  min-height: calc(
    100vh - var(--header-height, 60px)
  );
  color: var(--text-primary);
  overflow-x: hidden;
  position: relative;
  z-index: 1;
}

/* Cuando el sidebar está expandido, ajustar el margen */
.sidebar-expanded .main-content {
  margin-left: 250px;
}

/* Asegurar que ningún contenido de página cubra el sidebar */
.main-content > * {
  position: relative;
  z-index: auto;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .sidebar-expanded .main-content {
    margin-left: 0;
  }
}
</style>
