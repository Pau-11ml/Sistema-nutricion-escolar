import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import router from "./router";
import App from "./App.vue";

// Importar estilos globales
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/main.css";

// Importar Bootstrap JavaScript
import * as bootstrap from "bootstrap";

// Hacer bootstrap disponible globalmente
globalThis.bootstrap = bootstrap;

// Configuración de i18n (internacionalización)
import es from "./locales/es.json";
import en from "./locales/en.json";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("locale") || "es",
  fallbackLocale: "es",
  messages: {
    es,
    en,
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

app.mount("#app");

// Inicializar stores después del montaje
import { useAuthStore } from "./stores/auth";
import { useThemeStore } from "./stores/theme";
import { useUsabilityStore } from "./stores/usability";

// Inicializar auth
const authStore = useAuthStore();
authStore.initializeAuth();

// Inicializar tema
const themeStore = useThemeStore();
themeStore.initialize();

// Inicializar tracking de usabilidad
const usabilityStore = useUsabilityStore();
usabilityStore.logInteraction({
  type: "app_start",
  timestamp: new Date(),
});
