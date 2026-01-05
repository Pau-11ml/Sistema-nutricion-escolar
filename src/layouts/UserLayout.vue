<template>
  <div class="user-layout">
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
        :menu-items="userMenuItems"
        :default-expanded="false"
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
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStudentsStore } from "@/stores/students";
import { useMenusStore } from "@/stores/menus";
import AppHeader from "@/components/common/AppHeader.vue";
import AppSidebar from "@/components/common/AppSidebar.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import HelpButton from "@/components/common/HelpButton.vue";
import TextSelectionReader from "@/components/common/TextSelectionReader.vue";

const route = useRoute();
const isSidebarExpanded = ref(false);
const studentsStore = useStudentsStore();
const menusStore = useMenusStore();

const handleSidebarState = (expanded) => {
  isSidebarExpanded.value = expanded;
};

onMounted(() => {
  studentsStore.loadStudents();
});

const userMenuItems = [
  {
    path: "/usuario",
    label: "nav.home",
    icon: "bi-house-door",
    key: "home",
  },
  {
    path: "/usuario/retroalimentacion",
    label: "Retroalimentación",
    icon: "bi-chat-square-text",
    key: "retroalimentacion",
  },
  {
    path: "/usuario/perfil",
    label: "nav.profile",
    icon: "bi-person-circle",
    key: "profile",
  },
];

const currentPageTitle = computed(() => {
  const titles = {
    "/usuario": "Inicio",
    "/usuario/retroalimentacion": "Retroalimentación de Comidas",
    "/usuario/perfil": "Mi Perfil",
  };
  return titles[route.path] || "";
});
</script>

<style scoped>
.user-layout {
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
