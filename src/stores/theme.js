import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

/**
 * Store para tema dinámico (modo claro/oscuro)
 * Diseño centrado en el usuario - ISO 9241-210
 */
export const useThemeStore = defineStore(
  "theme",
  () => {
    // Temas disponibles
    const themes = {
      light: {
        name: "Claro",
        primary: "#0d6efd",
        secondary: "#6c757d",
        success: "#198754",
        danger: "#dc3545",
        warning: "#ffc107",
        info: "#0dcaf0",
        light: "#f8f9fa",
        dark: "#212529",
        background: "#ffffff",
        surface: "#f8f9fa",
        text: "#212529",
        textSecondary: "#6c757d",
        border: "#dee2e6",
      },
      dark: {
        name: "Oscuro",
        primary: "#0d6efd",
        secondary: "#adb5bd",
        success: "#198754",
        danger: "#dc3545",
        warning: "#ffc107",
        info: "#0dcaf0",
        light: "#343a40",
        dark: "#f8f9fa",
        background: "#212529",
        surface: "#343a40",
        text: "#f8f9fa",
        textSecondary: "#adb5bd",
        border: "#495057",
      },
      highContrast: {
        name: "Alto Contraste",
        primary: "#0066cc",
        secondary: "#6c757d",
        success: "#00aa00",
        danger: "#cc0000",
        warning: "#ff9900",
        info: "#0099cc",
        light: "#ffffff",
        dark: "#000000",
        background: "#ffffff",
        surface: "#ffffff",
        text: "#000000",
        textSecondary: "#333333",
        border: "#000000",
      },
      sepia: {
        name: "Sepia",
        primary: "#8b4513",
        secondary: "#a0826d",
        success: "#6b8e23",
        danger: "#b22222",
        warning: "#daa520",
        info: "#5f9ea0",
        light: "#f4ecd8",
        dark: "#3e2723",
        background: "#f4ecd8",
        surface: "#e8dcc4",
        text: "#3e2723",
        textSecondary: "#6d4c41",
        border: "#c7b299",
      },
    };

    // Estado
    const currentTheme = ref(
      localStorage.getItem("theme") || "light"
    );
    const customColors = ref(
      JSON.parse(
        localStorage.getItem("customColors") ||
          "{}"
      )
    );
    const autoTheme = ref(
      localStorage.getItem("autoTheme") === "true"
    );

    // Computed
    const themeConfig = computed(() => ({
      ...themes[currentTheme.value],
      ...customColors.value,
    }));

    const isDark = computed(
      () => currentTheme.value === "dark"
    );
    const isHighContrast = computed(
      () => currentTheme.value === "highContrast"
    );

    const availableThemes = computed(() =>
      Object.entries(themes).map(
        ([key, value]) => ({
          key,
          name: value.name,
        })
      )
    );

    // Actions
    function setTheme(themeName) {
      if (themes[themeName]) {
        currentTheme.value = themeName;
        localStorage.setItem("theme", themeName);
        applyTheme();
      }
    }

    function toggleTheme() {
      const newTheme =
        currentTheme.value === "light"
          ? "dark"
          : "light";
      setTheme(newTheme);
    }

    function setCustomColor(
      colorKey,
      colorValue
    ) {
      customColors.value[colorKey] = colorValue;
      localStorage.setItem(
        "customColors",
        JSON.stringify(customColors.value)
      );
      applyTheme();
    }

    function resetCustomColors() {
      customColors.value = {};
      localStorage.removeItem("customColors");
      applyTheme();
    }

    function setAutoTheme(enabled) {
      autoTheme.value = enabled;
      localStorage.setItem(
        "autoTheme",
        enabled.toString()
      );

      if (enabled) {
        detectSystemTheme();
      }
    }

    function detectSystemTheme() {
      if (
        globalThis.matchMedia?.(
          "(prefers-color-scheme: dark)"
        )?.matches
      ) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    }

    function applyTheme() {
      const root = document.documentElement;
      const config = themeConfig.value;

      // Aplicar variables CSS
      for (const [key, value] of Object.entries(
        config
      )) {
        if (key !== "name") {
          root.style.setProperty(
            `--theme-${key}`,
            value
          );
        }
      }

      // Limpiar todas las clases de tema anteriores
      document.body.classList.remove(
        "theme-light",
        "theme-dark",
        "theme-highContrast",
        "theme-sepia"
      );

      // Aplicar clase al body
      document.body.classList.add(
        `theme-${currentTheme.value}`
      );

      // Actualizar meta theme-color para móviles
      const metaThemeColor =
        document.querySelector(
          'meta[name="theme-color"]'
        );
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          "content",
          config.primary
        );
      }

      console.log(
        "Tema aplicado:",
        currentTheme.value
      );
    }

    function getThemePreview(themeName) {
      return themes[themeName] || themes.light;
    }

    // Inicialización
    function initialize() {
      // Detectar preferencia del sistema si autoTheme está habilitado
      if (autoTheme.value) {
        detectSystemTheme();

        // Escuchar cambios en la preferencia del sistema
        if (globalThis.matchMedia) {
          globalThis
            .matchMedia(
              "(prefers-color-scheme: dark)"
            )
            .addEventListener("change", (e) => {
              if (autoTheme.value) {
                setTheme(
                  e.matches ? "dark" : "light"
                );
              }
            });
        }
      } else {
        applyTheme();
      }
    }

    // Watch para aplicar tema cuando cambia
    watch(currentTheme, () => {
      applyTheme();
    });

    return {
      // State
      currentTheme,
      customColors,
      autoTheme,

      // Computed
      themeConfig,
      isDark,
      isHighContrast,
      availableThemes,

      // Actions
      setTheme,
      toggleTheme,
      setCustomColor,
      resetCustomColors,
      setAutoTheme,
      detectSystemTheme,
      applyTheme,
      getThemePreview,
      initialize,
    };
  }
);
