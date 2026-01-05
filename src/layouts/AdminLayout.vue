<template>
  <div class="admin-layout">
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
        :menu-items="adminMenuItems"
        @sidebar-state="handleSidebarState"
      />

      <main class="main-content" role="main">
        <div class="container-fluid py-4">
          <RouterView v-slot="{ Component, route }">
            <Transition name="page" mode="out-in">
              <component :is="Component" :key="route.path" />
            </Transition>
          </RouterView>
        </div>
      </main>
    </div>

    <AppFooter />
    <HelpButton />
    <TextSelectionReader />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "@/components/common/AppHeader.vue";
import AppSidebar from "@/components/common/AppSidebar.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import HelpButton from "@/components/common/HelpButton.vue";
import TextSelectionReader from "@/components/common/TextSelectionReader.vue";

const route = useRoute();
const isSidebarExpanded = ref(true);

const handleSidebarState = (expanded) => {
  isSidebarExpanded.value = expanded;
};

const adminMenuItems = [
  {
    path: "/admin",
    label: "nav.home",
    icon: "bi-speedometer2",
    key: "dashboard",
  },
  {
    path: "/admin/estudiantes",
    label: "nav.students",
    icon: "bi-people",
    key: "students",
    children: [
      {
        path: "/admin/estudiantes",
        label: "student.studentList",
        icon: "bi-list-ul",
      },
      {
        path: "/admin/estudiantes/registro",
        label: "student.registerStudent",
        icon: "bi-person-plus",
      },
    ],
  },
  {
    path: "/admin/nutricionistas",
    label: "nav.nutritionists",
    icon: "bi-heart-pulse",
    key: "nutritionists",
    children: [
      {
        path: "/admin/nutricionistas",
        label: "admin.nutritionistList",
        icon: "bi-list-ul",
      },
      {
        path: "/admin/nutricionistas/registro",
        label: "admin.registerNutritionist",
        icon: "bi-person-plus",
      },
    ],
  },
  {
    path: "/admin/representantes",
    label: "Representantes",
    icon: "bi-person-badge",
    key: "representatives",
    children: [
      {
        path: "/admin/representantes",
        label: "Lista de Representantes",
        icon: "bi-list-ul",
      },
      {
        path: "/admin/representantes/registro",
        label: "Registrar Representante",
        icon: "bi-person-plus",
      },
    ],
  },
  {
    path: "/admin/reportes",
    label: "nav.reports",
    icon: "bi-file-earmark-bar-graph",
    key: "reports",
  },
  {
    path: "/admin/configuracion",
    label: "nav.settings",
    icon: "bi-gear",
    key: "settings",
  },
];

const currentPageTitle = computed(() => {
  const titles = {
    "/admin": "Panel de Administración",
    "/admin/estudiantes":
      "Gestión de Estudiantes",
    "/admin/estudiantes/registro":
      "Registro de Estudiante",
    "/admin/nutricionistas":
      "Gestión de Nutricionistas",
    "/admin/nutricionistas/registro":
      "Registro de Nutricionista",
    "/admin/representantes":
      "Gestión de Representantes",
    "/admin/representantes/registro":
      "Registro de Representante",
  };
  return titles[route.path] || "";
});
</script>

<style scoped>
.admin-layout {
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
