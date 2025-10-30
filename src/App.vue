<template>
  <div id="app" :class="appClasses">
    <RouterView />

    <!-- Sistema de notificaciones -->
    <NotificationContainer />

    <!-- Panel de accesibilidad flotante -->
    <AccessibilityPanel
      v-if="showAccessibilityPanel"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { RouterView } from "vue-router";
import { useAccessibilityStore } from "@/stores/accessibility";
import { useThemeStore } from "@/stores/theme";
import NotificationContainer from "@/components/common/NotificationContainer.vue";
import AccessibilityPanel from "@/components/common/AccessibilityPanel.vue";

const accessibilityStore =
  useAccessibilityStore();
const themeStore = useThemeStore();

const appClasses = computed(() => {
  const classes = [
    `theme-${themeStore.currentTheme}`,
  ];

  if (accessibilityStore.highContrast) {
    classes.push("high-contrast");
  }
  if (accessibilityStore.largeText) {
    classes.push("large-text");
  }
  if (accessibilityStore.extraLargeText) {
    classes.push("extra-large-text");
  }

  return classes;
});

const showAccessibilityPanel = computed(
  () => accessibilityStore.panelOpen
);
</script>

<style>
/* Clases de accesibilidad globales */
.high-contrast {
  filter: contrast(1.5);
}

.large-text {
  font-size: 1.15rem !important;
}

.large-text * {
  font-size: inherit;
}

.extra-large-text {
  font-size: 1.3rem !important;
}

.extra-large-text * {
  font-size: inherit;
}

/* Animaciones reducidas para usuarios con preferencias de movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
