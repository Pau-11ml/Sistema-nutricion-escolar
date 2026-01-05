<template>
  <div>
    <!-- Botón flotante de ayuda -->
    <button
      class="help-button"
      @click="showModal = true"
      aria-label="Ayuda"
      type="button"
    >
      <i class="bi bi-question-circle"></i>
    </button>

    <!-- Modal de ayuda -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      @click.self="showModal = false"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-info-circle me-2"></i>
              {{ helpContent.title }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="showModal = false"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
            <div class="help-content">
              <!-- Sección de bienvenida -->
              <div class="help-section mb-4">
                <h6 class="help-section-title">
                  <i class="bi bi-hand-thumbs-up me-2"></i>
                  {{ helpContent.welcome.title }}
                </h6>
                <p>{{ helpContent.welcome.description }}</p>
              </div>

              <!-- Características principales -->
              <div class="help-section mb-4">
                <h6 class="help-section-title">
                  <i class="bi bi-star me-2"></i>
                  {{ helpContent.features.title }}
                </h6>
                <ul class="list-unstyled">
                  <li
                    v-for="(feature, index) in helpContent.features.items"
                    :key="index"
                    class="mb-2"
                  >
                    <i :class="`bi ${feature.icon} me-2 text-primary`"></i>
                    <strong>{{ feature.title }}:</strong> {{ feature.description }}
                  </li>
                </ul>
              </div>

              <!-- Cómo usar -->
              <div class="help-section mb-4">
                <h6 class="help-section-title">
                  <i class="bi bi-book me-2"></i>
                  {{ helpContent.howTo.title }}
                </h6>
                <ol class="help-steps">
                  <li
                    v-for="(step, index) in helpContent.howTo.steps"
                    :key="index"
                    class="mb-2"
                  >
                    {{ step }}
                  </li>
                </ol>
              </div>

              <!-- Consejos -->
              <div class="help-section">
                <h6 class="help-section-title">
                  <i class="bi bi-lightbulb me-2"></i>
                  {{ helpContent.tips.title }}
                </h6>
                <div class="alert alert-info">
                  <ul class="mb-0">
                    <li
                      v-for="(tip, index) in helpContent.tips.items"
                      :key="index"
                      class="mb-1"
                    >
                      {{ tip }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="showModal = false"
            >
              <i class="bi bi-check-lg me-2"></i>
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop del modal -->
    <div
      v-if="showModal"
      class="modal-backdrop fade show"
      @click="showModal = false"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const showModal = ref(false);

function openModal() {
  showModal.value = true;
}

function handleHelpEvent() {
  openModal();
}

onMounted(() => {
  globalThis.addEventListener('app:open-help', handleHelpEvent);
});

onUnmounted(() => {
  globalThis.removeEventListener('app:open-help', handleHelpEvent);
});

defineExpose({ openModal });

const helpContent = computed(() => {
  const role = authStore.userRole;

  if (role === "nutricionista") {
    return {
      title: "Guía para Nutricionistas",
      welcome: {
        title: "Bienvenido/a Nutricionista",
        description:
          "Este sistema te permite gestionar los menús semanales para los estudiantes de manera eficiente y profesional.",
      },
      features: {
        title: "Características Principales",
        items: [
          {
            icon: "bi-calendar-week",
            title: "Gestión de Menús",
            description:
              "Crea y edita menús semanales balanceados para los estudiantes.",
          },
          {
            icon: "bi-card-checklist",
            title: "Planificación Nutricional",
            description:
              "Asegura que cada menú cumpla con los requerimientos nutricionales.",
          },
          {
            icon: "bi-clock-history",
            title: "Historial",
            description:
              "Revisa menús anteriores y reutiliza plantillas exitosas.",
          },
          {
            icon: "bi-graph-up",
            title: "Reportes",
            description:
              "Genera informes sobre la alimentación y nutrición estudiantil.",
          },
        ],
      },
      howTo: {
        title: "¿Cómo usar el sistema?",
        steps: [
          "Accede a la sección 'Menú Semanal' desde el menú principal",
          "Selecciona el día de la semana que deseas configurar",
          "Ingresa los platos para desayuno, almuerzo y merienda",
          "Guarda los cambios para que queden registrados",
          "Los representantes podrán ver los menús en tiempo real",
        ],
      },
      tips: {
        title: "Consejos Útiles",
        items: [
          "Planifica con anticipación los menús de toda la semana",
          "Considera alergias y restricciones alimentarias comunes",
          "Varía los menús para mantener el interés de los estudiantes",
          "Revisa el historial para evitar repetir menús muy seguido",
        ],
      },
    };
  } else if (role === "representante") {
    return {
      title: "Guía para Representantes",
      welcome: {
        title: "Bienvenido/a Representante",
        description:
          "Este sistema te permite estar informado sobre la alimentación de tus representados en la institución educativa.",
      },
      features: {
        title: "Características Principales",
        items: [
          {
            icon: "bi-calendar-week",
            title: "Ver Menús",
            description:
              "Consulta los menús semanales planificados por los nutricionistas.",
          },
          {
            icon: "bi-person-badge",
            title: "Gestión de Estudiantes",
            description:
              "Administra la información de tus representados registrados.",
          },
          {
            icon: "bi-bell",
            title: "Notificaciones",
            description:
              "Recibe alertas sobre cambios en los menús o información importante.",
          },
          {
            icon: "bi-info-circle",
            title: "Información Nutricional",
            description:
              "Accede a detalles sobre los valores nutricionales de cada menú.",
          },
        ],
      },
      howTo: {
        title: "¿Cómo usar el sistema?",
        steps: [
          "Revisa el menú semanal en la página de inicio",
          "Consulta los detalles de cada comida haciendo clic en ellos",
          "Verifica que tu representado esté correctamente registrado",
          "Mantente atento a las notificaciones del sistema",
          "Contacta al personal si tienes dudas o sugerencias",
        ],
      },
      tips: {
        title: "Consejos Útiles",
        items: [
          "Revisa el menú cada semana para planificar la alimentación en casa",
          "Comunica alergias o restricciones alimentarias al personal",
          "Mantén actualizada la información de contacto",
          "Aprovecha la información nutricional para educar a tus hijos",
        ],
      },
    };
  } else if (role === "admin") {
    return {
      title: "Guía para Administradores",
      welcome: {
        title: "Bienvenido/a Administrador",
        description:
          "Tienes acceso completo al sistema para gestionar usuarios, estudiantes y configuraciones.",
      },
      features: {
        title: "Características Principales",
        items: [
          {
            icon: "bi-people",
            title: "Gestión de Usuarios",
            description:
              "Administra nutricionistas y representantes registrados.",
          },
          {
            icon: "bi-person-plus",
            title: "Registro de Estudiantes",
            description:
              "Registra y actualiza información de estudiantes.",
          },
          {
            icon: "bi-gear",
            title: "Configuración",
            description:
              "Personaliza parámetros del sistema según necesidades.",
          },
          {
            icon: "bi-graph-up",
            title: "Reportes",
            description:
              "Genera informes estadísticos del uso del sistema.",
          },
        ],
      },
      howTo: {
        title: "¿Cómo usar el sistema?",
        steps: [
          "Accede al Dashboard para ver estadísticas generales",
          "Gestiona usuarios desde las secciones correspondientes",
          "Registra estudiantes con su información completa",
          "Configura parámetros globales del sistema",
          "Genera reportes periódicos para análisis",
        ],
      },
      tips: {
        title: "Consejos Útiles",
        items: [
          "Mantén actualizada la información de todos los usuarios",
          "Revisa periódicamente los reportes del sistema",
          "Comunica cambios importantes a todos los usuarios",
          "Realiza copias de seguridad de la información regularmente",
        ],
      },
    };
  }

  // Default para usuarios sin rol o no autenticados
  return {
    title: "Ayuda del Sistema",
    welcome: {
      title: "Bienvenido",
      description:
        "Sistema de Gestión de Nutrición Escolar - Inicia sesión para acceder a todas las funcionalidades.",
    },
    features: {
      title: "Características",
      items: [
        {
          icon: "bi-shield-check",
          title: "Seguro",
          description: "Tu información está protegida y segura.",
        },
        {
          icon: "bi-speedometer2",
          title: "Rápido",
          description: "Acceso ágil a toda la información que necesitas.",
        },
      ],
    },
    howTo: {
      title: "¿Cómo empezar?",
      steps: [
        "Inicia sesión con tus credenciales",
        "Explora las funcionalidades disponibles",
        "Contacta al administrador si necesitas ayuda adicional",
      ],
    },
    tips: {
      title: "Consejos",
      items: [
        "Mantén tus credenciales seguras",
        "Actualiza tu contraseña periódicamente",
      ],
    },
  };
});
</script>

<style scoped>
.help-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  transition: all 0.3s ease;
  z-index: 1000;
}

.help-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.help-button:active {
  transform: scale(0.95);
}

.help-button i {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  border-radius: 15px;
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border-bottom: none;
}

.modal-header .btn-close {
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

.modal-header .btn-close:hover {
  opacity: 1;
}

.modal-title {
  font-weight: 600;
  font-size: 1.3rem;
}

.help-content {
  padding: 1rem 0;
}

.help-section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.help-section-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #667eea;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.help-section p {
  line-height: 1.6;
  color: #495057;
}

.help-section ul li {
  padding: 0.5rem 0;
  line-height: 1.5;
}

.help-steps {
  padding-left: 1.5rem;
}

.help-steps li {
  padding: 0.5rem 0;
  line-height: 1.6;
  color: #495057;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.modal-footer .btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.6rem 2rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.modal-footer .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .help-button {
    width: 50px;
    height: 50px;
    font-size: 24px;
    bottom: 20px;
    right: 20px;
  }

  .modal-dialog {
    margin: 0.5rem;
  }
}
</style>
