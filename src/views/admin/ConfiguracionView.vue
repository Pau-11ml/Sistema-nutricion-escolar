<template>
  <div class="configuracion-view">
    <!-- Header -->
    <div class="page-header mb-4">
      <h2>
        <i class="bi bi-gear me-2"></i>
        {{ $t("nav.settings") }}
      </h2>
      <p class="text-muted">
        Configura los parámetros del sistema
      </p>
    </div>

    <div class="row g-4">
      <!-- Configuración General -->
      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-sliders me-2"></i>
              Configuración General
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveSettings">
              <!-- Nombre del Sistema -->
              <div class="mb-3">
                <label
                  for="systemName"
                  class="form-label"
                  >Nombre del Sistema</label
                >
                <input
                  id="systemName"
                  v-model="settings.systemName"
                  type="text"
                  class="form-control"
                />
              </div>

              <!-- Email de Contacto -->
              <div class="mb-3">
                <label
                  for="contactEmail"
                  class="form-label"
                  >Email de Contacto</label
                >
                <input
                  id="contactEmail"
                  v-model="settings.contactEmail"
                  type="email"
                  class="form-control"
                />
              </div>

              <!-- Idioma Predeterminado -->
              <div class="mb-3">
                <label
                  for="defaultLanguage"
                  class="form-label"
                  >Idioma Predeterminado</label
                >
                <select
                  id="defaultLanguage"
                  v-model="
                    settings.defaultLanguage
                  "
                  class="form-select"
                >
                  <option value="es">
                    Español
                  </option>
                  <option value="en">
                    English
                  </option>
                </select>
              </div>

              <!-- Zona Horaria -->
              <div class="mb-3">
                <label
                  for="timezone"
                  class="form-label"
                  >Zona Horaria</label
                >
                <select
                  id="timezone"
                  v-model="settings.timezone"
                  class="form-select"
                >
                  <option
                    value="America/Guayaquil"
                  >
                    Ecuador (GMT-5)
                  </option>
                  <option value="America/Bogota">
                    Colombia (GMT-5)
                  </option>
                  <option value="America/Lima">
                    Perú (GMT-5)
                  </option>
                </select>
              </div>

              <!-- Notificaciones -->
              <div class="mb-4">
                <h6
                  class="border-bottom pb-2 mb-3"
                >
                  Notificaciones
                </h6>
                <div
                  class="form-check form-switch mb-2"
                >
                  <input
                    id="emailNotifications"
                    v-model="
                      settings.emailNotifications
                    "
                    class="form-check-input"
                    type="checkbox"
                  />
                  <label
                    class="form-check-label"
                    for="emailNotifications"
                  >
                    Enviar notificaciones por
                    correo
                  </label>
                </div>
                <div
                  class="form-check form-switch"
                >
                  <input
                    id="pushNotifications"
                    v-model="
                      settings.pushNotifications
                    "
                    class="form-check-input"
                    type="checkbox"
                  />
                  <label
                    class="form-check-label"
                    for="pushNotifications"
                  >
                    Notificaciones push en el
                    navegador
                  </label>
                </div>
              </div>

              <!-- Botones -->
              <div
                class="d-flex gap-2 justify-content-end"
              >
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="resetSettings"
                >
                  <i
                    class="bi bi-arrow-counterclockwise me-2"
                  ></i>
                  Restablecer
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

        <!-- Mantenimiento -->
        <div class="card">
          <div class="card-header bg-warning">
            <h5 class="mb-0">
              <i class="bi bi-tools me-2"></i>
              Mantenimiento del Sistema
            </h5>
          </div>
          <div class="card-body">
            <p class="text-muted">
              Realiza tareas de mantenimiento para
              optimizar el rendimiento del
              sistema.
            </p>
            <div class="d-grid gap-2">
              <button
                class="btn btn-outline-warning"
                @click="clearCache"
              >
                <i class="bi bi-trash me-2"></i>
                Limpiar Caché
              </button>
              <button
                class="btn btn-outline-info"
                @click="optimizeDatabase"
              >
                <i
                  class="bi bi-database me-2"
                ></i>
                Optimizar Base de Datos
              </button>
              <button
                class="btn btn-outline-secondary"
                @click="exportData"
              >
                <i
                  class="bi bi-download me-2"
                ></i>
                Exportar Datos del Sistema
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Lateral - Información -->
      <div class="col-lg-4">
        <!-- Información del Sistema -->
        <div class="card mb-4">
          <div class="card-header">
            <h6 class="mb-0">
              <i
                class="bi bi-info-circle me-2"
              ></i>
              Información del Sistema
            </h6>
          </div>
          <div class="card-body">
            <div class="info-item mb-3">
              <small class="text-muted d-block"
                >Versión</small
              >
              <strong>1.0.0</strong>
            </div>
            <div class="info-item mb-3">
              <small class="text-muted d-block"
                >Última Actualización</small
              >
              <strong>29 Oct 2025</strong>
            </div>
            <div class="info-item mb-3">
              <small class="text-muted d-block"
                >Estado del Sistema</small
              >
              <span class="badge bg-success"
                >Operativo</span
              >
            </div>
            <div class="info-item">
              <small class="text-muted d-block"
                >Espacio Usado</small
              >
              <div class="mt-2">
                <progress
                  class="w-100"
                  value="35"
                  max="100"
                  style="height: 20px"
                >
                  35%
                </progress>
                <small class="text-muted"
                  >35% utilizado</small
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Ayuda Rápida -->
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">
              <i
                class="bi bi-question-circle me-2"
              ></i>
              Ayuda Rápida
            </h6>
          </div>
          <div class="card-body">
            <p class="small text-muted">
              ¿Necesitas ayuda con la
              configuración?
            </p>
            <a
              href="#"
              class="btn btn-sm btn-outline-primary w-100 mb-2"
            >
              <i class="bi bi-book me-2"></i>
              Ver Documentación
            </a>
            <a
              href="#"
              class="btn btn-sm btn-outline-secondary w-100"
            >
              <i class="bi bi-envelope me-2"></i>
              Contactar Soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useNotificationStore } from "@/stores/notification";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const notificationStore = useNotificationStore();

const settings = reactive({
  systemName: "Sistema de Nutrición Escolar",
  contactEmail: "admin@nutricionescolar.com",
  defaultLanguage: "es",
  timezone: "America/Guayaquil",
  emailNotifications: true,
  pushNotifications: false,
});

const originalSettings = { ...settings };

function saveSettings() {
  notificationStore.success(
    t("common.success") +
      ": Configuración guardada correctamente"
  );
}

function resetSettings() {
  Object.assign(settings, originalSettings);
  notificationStore.info(
    "Configuración restablecida"
  );
}

function clearCache() {
  notificationStore.info(
    "Limpiando caché del sistema..."
  );
  setTimeout(() => {
    notificationStore.success(
      "Caché limpiado exitosamente"
    );
  }, 1000);
}

function optimizeDatabase() {
  notificationStore.info(
    "Optimizando base de datos..."
  );
  setTimeout(() => {
    notificationStore.success(
      "Base de datos optimizada"
    );
  }, 2000);
}

function exportData() {
  try {
    // Preparar configuración del sistema para exportar
    const exportDate =
      new Date().toLocaleDateString("es-EC");
    const data = {
      fecha_exportacion: exportDate,
      version: "1.0.0",
      configuracion: {
        nombre_sistema: settings.systemName,
        email_contacto: settings.contactEmail,
        idioma_predeterminado:
          settings.defaultLanguage,
        zona_horaria: settings.timezone,
        notificaciones: {
          email: settings.emailNotifications,
          push: settings.pushNotifications,
        },
      },
      informacion_sistema: {
        estado: "Operativo",
        ultima_actualizacion: "29 Oct 2025",
        espacio_usado: "35%",
      },
    };

    // Convertir a JSON con formato legible
    const jsonString = JSON.stringify(
      data,
      null,
      2
    );

    // Crear blob y descargar
    const blob = new Blob([jsonString], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `configuracion_sistema_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    notificationStore.success(
      "Configuración exportada correctamente"
    );
  } catch (error) {
    notificationStore.error(
      "Error al exportar: " + error.message
    );
  }
}
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 1rem;
}

.info-item {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
</style>
