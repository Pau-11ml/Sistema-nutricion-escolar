<template>
  <Teleport to="body">
    <Transition name="panel">
      <div
        v-if="isOpen"
        class="accessibility-panel"
        role="dialog"
        aria-labelledby="accessibility-title"
        aria-modal="true"
      >
        <div class="panel-header">
          <h5
            id="accessibility-title"
            class="mb-0"
          >
            <i
              class="bi bi-universal-access me-2"
            ></i>
            {{ $t("accessibility.title") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            :aria-label="$t('common.close')"
            @click="closePanel"
          ></button>
        </div>

        <div class="panel-body">
          <!-- Alto contraste -->
          <div class="accessibility-option">
            <div
              class="d-flex justify-content-between align-items-center mb-2"
            >
              <label
                for="high-contrast"
                class="form-label mb-0"
              >
                <i
                  class="bi bi-circle-half me-2"
                ></i>
                {{
                  $t("accessibility.highContrast")
                }}
              </label>
              <div class="form-check form-switch">
                <input
                  id="high-contrast"
                  type="checkbox"
                  class="form-check-input"
                  role="switch"
                  v-model="highContrast"
                  @change="toggleHighContrast"
                />
              </div>
            </div>
          </div>

          <hr />

          <!-- Tamaño de texto -->
          <fieldset class="accessibility-option">
            <legend class="form-label">
              <i class="bi bi-fonts me-2"></i>
              {{ $t("accessibility.textSize") }}
            </legend>
            <div
              class="btn-group w-100"
              role="group"
              aria-label="Tamaño de texto"
            >
              <input
                type="radio"
                class="btn-check"
                name="textSize"
                id="text-normal"
                value="normal"
                v-model="textSize"
                @change="changeTextSize"
              />
              <label
                class="btn btn-outline-primary"
                for="text-normal"
              >
                {{ $t("accessibility.normal") }}
              </label>

              <input
                type="radio"
                class="btn-check"
                name="textSize"
                id="text-large"
                value="large"
                v-model="textSize"
                @change="changeTextSize"
              />
              <label
                class="btn btn-outline-primary"
                for="text-large"
              >
                {{ $t("accessibility.large") }}
              </label>

              <input
                type="radio"
                class="btn-check"
                name="textSize"
                id="text-xlarge"
                value="extra-large"
                v-model="textSize"
                @change="changeTextSize"
              />
              <label
                class="btn btn-outline-primary"
                for="text-xlarge"
              >
                {{
                  $t("accessibility.extraLarge")
                }}
              </label>
            </div>
          </fieldset>

          <hr />

          <!-- Lectura por voz -->
          <div class="accessibility-option">
            <div
              class="d-flex justify-content-between align-items-center mb-2"
            >
              <label
                for="read-aloud"
                class="form-label mb-0"
              >
                <i
                  class="bi bi-volume-up me-2"
                ></i>
                {{
                  $t("accessibility.readAloud")
                }}
              </label>
              <div class="form-check form-switch">
                <input
                  id="read-aloud"
                  type="checkbox"
                  class="form-check-input"
                  role="switch"
                  v-model="speechEnabled"
                  @change="toggleSpeech"
                />
              </div>
            </div>
            <small
              class="text-muted d-block"
              v-if="speechEnabled"
            >
              <i
                class="bi bi-info-circle me-1"
              ></i>
              Pase el cursor sobre los elementos
              para escuchar su descripción
            </small>
          </div>

          <hr />

          <!-- Alertas visuales -->
          <div class="accessibility-option">
            <div
              class="d-flex justify-content-between align-items-center mb-2"
            >
              <label
                for="visual-alerts"
                class="form-label mb-0"
              >
                <i class="bi bi-bell me-2"></i>
                {{
                  $t("accessibility.visualAlerts")
                }}
              </label>
              <div class="form-check form-switch">
                <input
                  id="visual-alerts"
                  type="checkbox"
                  class="form-check-input"
                  role="switch"
                  v-model="visualAlerts"
                  @change="toggleVisualAlerts"
                />
              </div>
            </div>
            <small class="text-muted d-block">
              <i
                class="bi bi-info-circle me-1"
              ></i>
              Las notificaciones incluirán
              indicadores visuales adicionales
            </small>
          </div>

          <hr />

          <!-- Atajos de teclado -->
          <div class="accessibility-option">
            <button
              class="btn btn-outline-secondary w-100"
              @click="showKeyboardShortcuts"
            >
              <i class="bi bi-keyboard me-2"></i>
              {{
                $t(
                  "accessibility.keyboardShortcuts"
                )
              }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Overlay -->
    <Transition name="overlay">
      <div
        v-if="isOpen"
        class="accessibility-overlay"
        @click="closePanel"
      ></div>
    </Transition>

    <!-- Modal de atajos de teclado -->
    <div
      v-if="showShortcutsModal"
      class="modal show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div
        class="modal-dialog modal-dialog-centered"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Atajos de teclado
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="showShortcutsModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Acción</th>
                  <th>Atajo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ir a inicio</td>
                  <td>
                    <kbd>Alt</kbd> + <kbd>H</kbd>
                  </td>
                </tr>
                <tr>
                  <td>Buscar</td>
                  <td>
                    <kbd>Alt</kbd> + <kbd>F</kbd>
                  </td>
                </tr>
                <tr>
                  <td>Abrir accesibilidad</td>
                  <td>
                    <kbd>Alt</kbd> + <kbd>A</kbd>
                  </td>
                </tr>
                <tr>
                  <td>Ayuda</td>
                  <td><kbd>F1</kbd></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from "vue";
import { useI18n } from "vue-i18n";
import { useAccessibilityStore } from "@/stores/accessibility";

const { t } = useI18n();
const accessibilityStore =
  useAccessibilityStore();

const isOpen = computed(
  () => accessibilityStore.panelOpen
);
const highContrast = ref(
  accessibilityStore.highContrast
);

function getInitialTextSize() {
  if (accessibilityStore.extraLargeText)
    return "extra-large";
  if (accessibilityStore.largeText)
    return "large";
  return "normal";
}

const textSize = ref(getInitialTextSize());
const speechEnabled = ref(
  accessibilityStore.speechEnabled
);
const visualAlerts = ref(
  accessibilityStore.visualAlerts
);
const showShortcutsModal = ref(false);

function closePanel() {
  accessibilityStore.togglePanel();
}

function toggleHighContrast() {
  accessibilityStore.toggleHighContrast();
}

function changeTextSize() {
  accessibilityStore.setTextSize(textSize.value);
}

function toggleSpeech() {
  accessibilityStore.toggleSpeech();
  if (speechEnabled.value) {
    accessibilityStore.speak(
      "Lectura por voz activada"
    );
  }
}

function toggleVisualAlerts() {
  accessibilityStore.toggleVisualAlerts();
}

function showKeyboardShortcuts() {
  showShortcutsModal.value = true;
}

// Registrar atajo de teclado para abrir el panel
function handleKeyPress(e) {
  if (e.altKey && e.key === "a") {
    e.preventDefault();
    accessibilityStore.togglePanel();
  } else if (e.key === "F1") {
    e.preventDefault();
    showKeyboardShortcuts();
  } else if (e.key === "Escape" && isOpen.value) {
    closePanel();
  }
}

onMounted(() => {
  globalThis.addEventListener(
    "keydown",
    handleKeyPress
  );
});

onUnmounted(() => {
  globalThis.removeEventListener(
    "keydown",
    handleKeyPress
  );
});
</script>

<style scoped>
.accessibility-panel {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 350px;
  background: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color) !important;
  background: var(--primary) !important;
  color: #ffffff !important;
}

.panel-header h5 {
  color: #ffffff !important;
}

.panel-header .btn-close {
  filter: invert(1) brightness(2);
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: var(--bg-primary) !important;
}

.accessibility-option {
  margin-bottom: 1rem;
}

.accessibility-option label,
.accessibility-option .form-label {
  color: var(--text-primary) !important;
}

.accessibility-option small {
  color: var(--text-secondary) !important;
}

.accessibility-option .form-check-input {
  background-color: var(
    --bg-secondary
  ) !important;
  border-color: var(--border-color) !important;
}

.accessibility-option .form-check-input:checked {
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
}

.accessibility-option .btn-outline-primary {
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
  background-color: var(
    --bg-secondary
  ) !important;
}

.accessibility-option .btn-outline-primary:hover,
.accessibility-option
  .btn-outline-primary.active {
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
  color: #ffffff !important;
}

.accessibility-option
  .btn-check:checked
  + .btn-outline-primary {
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
  color: #ffffff !important;
}

.accessibility-option .btn-outline-secondary {
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
  background-color: var(
    --bg-secondary
  ) !important;
}

.accessibility-option
  .btn-outline-secondary:hover {
  background-color: var(
    --nav-hover-bg
  ) !important;
  border-color: var(--border-color) !important;
}

.accessibility-option hr {
  border-color: var(--border-color) !important;
  opacity: 0.3;
}

.accessibility-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* Animaciones */
.panel-enter-active,
.panel-leave-active {
  transition: transform 0.3s ease;
}

.panel-enter-from,
.panel-leave-to {
  transform: translateX(100%);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 576px) {
  .accessibility-panel {
    width: 100%;
  }
}

kbd {
  padding: 0.2rem 0.4rem;
  font-size: 0.875rem;
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-radius: 3px;
  border: 1px solid var(--border-color) !important;
}

/* Modal de atajos */
.modal-content {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color) !important;
}

.modal-header {
  border-bottom: 1px solid var(--border-color) !important;
}

.modal-title {
  color: var(--text-primary) !important;
}

.modal-body {
  background-color: var(--bg-primary) !important;
}

.table {
  color: var(--text-primary) !important;
  background-color: var(--bg-primary) !important;
}

.table thead {
  border-bottom: 2px solid var(--border-color) !important;
}

.table th,
.table td {
  border-color: var(--border-color) !important;
  color: var(--text-primary) !important;
}

.modal-backdrop {
  opacity: 0.5;
}
</style>
