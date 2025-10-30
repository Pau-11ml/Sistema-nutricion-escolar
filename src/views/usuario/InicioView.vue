<template>
  <div class="inicio-view">
    <!-- Banner de Bienvenida -->
    <div
      class="welcome-banner p-4 rounded-3 mb-4"
    >
      <div class="row align-items-center">
        <div class="col-md-8">
          <h1 class="display-6 fw-bold mb-2">
            <i
              class="bi bi-house-heart-fill me-2"
            ></i>
            {{ $t("common.welcome") }},
            {{ userName }}!
          </h1>
          <p class="lead mb-0">
            {{ $t("usuario.welcomeMessage") }}
          </p>
        </div>
        <div class="col-md-4 text-center">
          <i
            class="bi bi-calendar-check display-1 text-white opacity-50"
          ></i>
        </div>
      </div>
    </div>

    <!-- Tarjetas de Información Rápida -->
    <div class="row g-4 mb-4">
      <!-- Estudiantes a cargo -->
      <div class="col-md-6 col-lg-3">
        <div class="info-card h-100 p-4">
          <div
            class="d-flex align-items-center mb-3"
          >
            <div class="icon-wrapper bg-primary">
              <i class="bi bi-people-fill"></i>
            </div>
            <div class="ms-3">
              <h6 class="mb-0 text-muted">
                {{ $t("usuario.myStudents") }}
              </h6>
              <h3 class="mb-0 fw-bold">
                {{ estudiantesCount }}
              </h3>
            </div>
          </div>
          <router-link
            to="/usuario/perfil"
            class="btn btn-sm btn-outline-primary w-100"
          >
            {{ $t("common.viewDetails") }}
          </router-link>
        </div>
      </div>

      <!-- Menú de Hoy -->
      <div class="col-md-6 col-lg-3">
        <div class="info-card h-100 p-4">
          <div
            class="d-flex align-items-center mb-3"
          >
            <div class="icon-wrapper bg-success">
              <i
                class="bi bi-calendar-check-fill"
              ></i>
            </div>
            <div class="ms-3">
              <h6 class="mb-0 text-muted">
                {{ $t("usuario.todayMenu") }}
              </h6>
              <h3 class="mb-0 fw-bold">
                {{ todayMenu }}
              </h3>
            </div>
          </div>
          <button
            class="btn btn-sm btn-outline-success w-100"
            @click="showMenuModal = true"
          >
            {{ $t("common.view") }}
          </button>
        </div>
      </div>

      <!-- Próxima Cita -->
      <div class="col-md-6 col-lg-3">
        <div class="info-card h-100 p-4">
          <div
            class="d-flex align-items-center mb-3"
          >
            <div class="icon-wrapper bg-info">
              <i
                class="bi bi-calendar2-event-fill"
              ></i>
            </div>
            <div class="ms-3">
              <h6 class="mb-0 text-muted">
                Próxima Cita
              </h6>
              <h3 class="mb-0 fw-bold">
                {{ nextAppointment }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="row g-4">
      <!-- Columna Izquierda -->
      <div class="col-lg-8">
        <!-- Menú Semanal -->
        <div class="card mb-4">
          <div
            class="card-header bg-primary text-white"
          >
            <h5 class="mb-0">
              <i
                class="bi bi-calendar-week me-2"
              ></i>
              {{ $t("usuario.weeklyMenu") }}
            </h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>
                      {{ $t("common.day") }}
                    </th>
                    <th>
                      {{
                        $t("usuario.breakfast")
                      }}
                    </th>
                    <th>
                      {{ $t("usuario.lunch") }}
                    </th>
                    <th>
                      {{ $t("usuario.snack") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="day in weeklyMenu"
                    :key="day.id"
                    :class="{
                      'table-active': day.isToday,
                    }"
                  >
                    <td>
                      <strong>{{
                        day.day
                      }}</strong>
                      <span
                        v-if="day.isToday"
                        class="badge bg-success ms-2"
                        >{{
                          $t("common.today")
                        }}</span
                      >
                    </td>
                    <td>{{ day.breakfast }}</td>
                    <td>{{ day.lunch }}</td>
                    <td>{{ day.snack }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Dieta Personalizada del Nutricionista -->
        <div
          class="card mb-4"
          v-if="dietaAsignada"
        >
          <div
            class="card-header bg-success text-white"
          >
            <h5 class="mb-0">
              <i
                class="bi bi-heart-pulse me-2"
              ></i>
              Mi Dieta Personalizada
            </h5>
          </div>
          <div class="card-body">
            <div class="alert alert-info mb-3">
              <div
                class="d-flex align-items-center"
              >
                <i
                  class="bi bi-person-badge fs-4 me-2"
                ></i>
                <div>
                  <strong
                    >Nutricionista:
                    {{
                      dietaAsignada.nutricionista
                    }}</strong
                  >
                  <br />
                  <small
                    >Vigencia:
                    {{
                      dietaAsignada.fechaInicio
                    }}
                    -
                    {{
                      dietaAsignada.fechaFin
                    }}</small
                  >
                </div>
              </div>
            </div>

            <div class="mb-3">
              <h6 class="diet-section-title">
                <i class="bi bi-bullseye me-2"></i
                >Objetivo
              </h6>
              <p class="mb-0">
                {{ dietaAsignada.objetivo }}
              </p>
            </div>

            <div class="mb-3">
              <h6 class="diet-section-title">
                <i
                  class="bi bi-calculator me-2"
                ></i
                >Calorías Diarias
              </h6>
              <div
                class="progress"
                style="height: 25px"
              >
                <div
                  class="progress-bar bg-success"
                  style="width: 100%"
                >
                  {{ dietaAsignada.calorias }}
                  kcal
                </div>
              </div>
            </div>

            <!-- Plan de Comidas -->
            <h6 class="diet-section-title mb-3">
              <i
                class="bi bi-calendar2-week me-2"
              ></i
              >Plan de Comidas
            </h6>

            <div
              class="accordion"
              id="dietaAccordion"
            >
              <div
                class="accordion-item"
                v-for="(
                  comida, key
                ) in dietaAsignada.comidas"
                :key="key"
              >
                <h2
                  class="accordion-header"
                  :id="'heading-' + key"
                >
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    :data-bs-target="
                      '#collapse-' + key
                    "
                    :aria-expanded="false"
                    :aria-controls="
                      'collapse-' + key
                    "
                  >
                    <i
                      class="bi bi-clock me-2"
                    ></i>
                    <strong
                      class="text-capitalize"
                      >{{ key }}</strong
                    >
                    <small class="ms-2 text-muted"
                      >({{ comida.hora }}) -
                      {{ comida.calorias }}
                      kcal</small
                    >
                  </button>
                </h2>
                <div
                  :id="'collapse-' + key"
                  class="accordion-collapse collapse"
                  data-bs-parent="#dietaAccordion"
                >
                  <div class="accordion-body">
                    <ul
                      class="list-unstyled mb-0"
                    >
                      <li
                        v-for="(
                          alimento, idx
                        ) in comida.alimentos"
                        :key="idx"
                        class="mb-1 diet-text"
                      >
                        <i
                          class="bi bi-check2-circle me-2"
                          style="color: #198754"
                        ></i>
                        {{ alimento }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Restricciones y Recomendaciones -->
            <div class="mt-3">
              <h6 class="diet-restriction-title">
                <i
                  class="bi bi-exclamation-triangle me-2"
                ></i
                >Restricciones
              </h6>
              <ul class="mb-0 diet-text">
                <li
                  v-for="(
                    restriccion, idx
                  ) in dietaAsignada.restricciones"
                  :key="idx"
                >
                  {{ restriccion }}
                </li>
              </ul>
            </div>

            <div class="mt-3">
              <h6
                class="diet-recommendation-title"
              >
                <i
                  class="bi bi-lightbulb me-2"
                ></i
                >Recomendaciones
              </h6>
              <p class="mb-0 diet-text">
                {{
                  dietaAsignada.recomendaciones
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Novedades y Anuncios -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-megaphone me-2"></i>
              {{
                $t("usuario.newsAndAnnouncements")
              }}
            </h5>
          </div>
          <div class="card-body">
            <div
              v-for="notice in notices"
              :key="notice.id"
              class="notice-item mb-3 p-3 rounded"
            >
              <div
                class="d-flex align-items-start"
              >
                <i
                  :class="notice.icon"
                  class="fs-3 me-3"
                  :style="{ color: notice.color }"
                ></i>
                <div class="flex-grow-1">
                  <h6 class="mb-1 notice-title">
                    {{ notice.title }}
                  </h6>
                  <p class="mb-1 notice-message">
                    {{ notice.message }}
                  </p>
                  <small class="notice-date">
                    <i
                      class="bi bi-clock me-1"
                    ></i>
                    {{ notice.date }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Derecha -->
      <div class="col-lg-4">
        <!-- Información de Estudiantes -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i
                class="bi bi-person-badge me-2"
              ></i>
              {{ $t("usuario.myChildren") }}
            </h5>
          </div>
          <div class="card-body">
            <div
              v-for="student in students"
              :key="student.id"
              class="student-item mb-3"
            >
              <div
                class="d-flex align-items-center"
              >
                <div
                  class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                >
                  {{ student.initials }}
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-0">
                    {{ student.name }}
                  </h6>
                  <small class="text-muted">{{
                    student.grade
                  }}</small>
                </div>
                <button
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="bi bi-eye"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Ayuda Rápida -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i
                class="bi bi-question-circle me-2"
              ></i>
              {{ $t("usuario.quickHelp") }}
            </h5>
          </div>
          <div class="card-body">
            <div
              class="list-group list-group-flush"
            >
              <a
                href="#"
                class="list-group-item list-group-item-action"
              >
                <i class="bi bi-book me-2"></i>
                {{ $t("usuario.userGuide") }}
              </a>
              <a
                href="#"
                class="list-group-item list-group-item-action"
              >
                <i
                  class="bi bi-telephone me-2"
                ></i>
                {{ $t("usuario.contactSupport") }}
              </a>
              <a
                href="#"
                class="list-group-item list-group-item-action"
              >
                <i
                  class="bi bi-chat-dots me-2"
                ></i>
                {{ $t("usuario.faq") }}
              </a>
              <router-link
                to="/terminos"
                class="list-group-item list-group-item-action"
              >
                <i
                  class="bi bi-file-text me-2"
                ></i>
                {{
                  $t("usuario.termsAndConditions")
                }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Menú del Día -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showMenuModal"
          class="modal show d-block"
          tabindex="-1"
        >
          <div
            class="modal-dialog modal-dialog-centered"
          >
            <div class="modal-content">
              <div
                class="modal-header bg-success text-white"
              >
                <h5 class="modal-title">
                  <i
                    class="bi bi-calendar-check me-2"
                  ></i>
                  {{ $t("usuario.todayMenu") }}
                </h5>
                <button
                  type="button"
                  class="btn-close btn-close-white"
                  @click="showMenuModal = false"
                ></button>
              </div>
              <div class="modal-body">
                <h6 class="text-muted">
                  {{ currentDay }}
                </h6>
                <div class="menu-details">
                  <div class="mb-3">
                    <strong
                      >{{
                        $t("usuario.breakfast")
                      }}:</strong
                    >
                    <p class="mb-0">
                      {{
                        todayMenuDetails.breakfast
                      }}
                    </p>
                  </div>
                  <div class="mb-3">
                    <strong
                      >{{
                        $t("usuario.lunch")
                      }}:</strong
                    >
                    <p class="mb-0">
                      {{ todayMenuDetails.lunch }}
                    </p>
                  </div>
                  <div>
                    <strong
                      >{{
                        $t("usuario.snack")
                      }}:</strong
                    >
                    <p class="mb-0">
                      {{ todayMenuDetails.snack }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="showMenuModal = false"
                >
                  {{ $t("common.close") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <div
          v-if="showMenuModal"
          class="modal-backdrop show"
          @click="showMenuModal = false"
        ></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const userName = computed(
  () =>
    authStore.user?.name ||
    authStore.user?.username ||
    "Usuario"
);

// Estado
const showMenuModal = ref(false);
const estudiantesCount = ref(2);
const nextAppointment = ref("15/Nov");

// Datos de ejemplo
const students = ref([
  {
    id: 1,
    name: "Juan García",
    initials: "JG",
    grade: '5to "A"',
  },
  {
    id: 2,
    name: "María García",
    initials: "MG",
    grade: '3ro "B"',
  },
]);

// Obtener el día actual (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
const getCurrentDayOfWeek = () => {
  const dayIndex = new Date().getDay();
  // Convertir domingo (0) a 7 para que lunes sea 1
  return dayIndex === 0 ? 7 : dayIndex;
};

const currentDayIndex = getCurrentDayOfWeek();

const weeklyMenu = ref([
  {
    id: 1,
    day: "Lunes",
    dayIndex: 1,
    breakfast: "Café con leche, pan integral",
    lunch: "Arroz, pollo, ensalada",
    snack: "Fruta fresca",
    isToday: currentDayIndex === 1,
  },
  {
    id: 2,
    day: "Martes",
    dayIndex: 2,
    breakfast: "Jugo natural, avena",
    lunch: "Sopa de verduras, pescado",
    snack: "Yogurt",
    isToday: currentDayIndex === 2,
  },
  {
    id: 3,
    day: "Miércoles",
    dayIndex: 3,
    breakfast: "Batido de frutas",
    lunch: "Pasta, carne, vegetales",
    snack: "Galletas integrales",
    isToday: currentDayIndex === 3,
  },
  {
    id: 4,
    day: "Jueves",
    dayIndex: 4,
    breakfast: "Chocolate caliente, tostadas",
    lunch: "Arroz, atún, ensalada",
    snack: "Fruta picada",
    isToday: currentDayIndex === 4,
  },
  {
    id: 5,
    day: "Viernes",
    dayIndex: 5,
    breakfast: "Jugo, empanadas",
    lunch: "Locro, pollo asado",
    snack: "Gelatina",
    isToday: currentDayIndex === 5,
  },
]);

const notices = ref([
  {
    id: 1,
    icon: "bi bi-exclamation-circle-fill",
    color: "#ffc107",
    title: "Reunión de Padres",
    message:
      "Se realizará una reunión el próximo viernes a las 18:00",
    date: "28 Oct 2025",
  },
  {
    id: 2,
    icon: "bi bi-info-circle-fill",
    color: "#0dcaf0",
    title: "Nuevo Menú",
    message:
      "Se ha actualizado el menú semanal con opciones más saludables",
    date: "27 Oct 2025",
  },
  {
    id: 3,
    icon: "bi bi-check-circle-fill",
    color: "#198754",
    title: "Pago Confirmado",
    message:
      "Se ha registrado el pago del mes de octubre",
    date: "26 Oct 2025",
  },
]);

// Dieta asignada por el nutricionista (puede ser null si no hay dieta asignada)
const dietaAsignada = ref({
  nutricionista: "Dra. Ana Martínez",
  fechaInicio: "01/11/2024",
  fechaFin: "30/11/2024",
  objetivo:
    "Mantener un peso saludable y mejorar los hábitos alimenticios",
  calorias: 1800,
  comidas: {
    desayuno: {
      hora: "7:00 AM",
      calorias: 450,
      alimentos: [
        "1 vaso de leche descremada (200ml)",
        "2 rebanadas de pan integral",
        "1 cucharada de mantequilla de maní",
        "1 plátano mediano",
        "1 vaso de jugo natural",
      ],
    },
    almuerzo: {
      hora: "12:00 PM",
      calorias: 650,
      alimentos: [
        "150g de arroz integral",
        "120g de pechuga de pollo a la plancha",
        "Ensalada mixta con aceite de oliva",
        "1 porción de vegetales al vapor",
        "1 vaso de agua",
        "1 fruta fresca de temporada",
      ],
    },
    merienda: {
      hora: "3:30 PM",
      calorias: 250,
      alimentos: [
        "1 yogurt natural bajo en grasa",
        "1 porción de frutos secos (almendras o nueces)",
        "1 manzana",
      ],
    },
    cena: {
      hora: "6:30 PM",
      calorias: 450,
      alimentos: [
        "Sopa de verduras casera",
        "100g de pescado al horno",
        "Puré de papa (1 porción pequeña)",
        "Ensalada verde",
        "1 vaso de agua",
        "1 gelatina sin azúcar",
      ],
    },
  },
  restricciones: [
    "Evitar alimentos fritos y procesados",
    "Limitar el consumo de azúcar y dulces",
    "No consumir bebidas gaseosas",
  ],
  recomendaciones:
    "Tomar al menos 8 vasos de agua al día. Realizar actividad física moderada 3 veces por semana. Comer a horarios regulares. Masticar bien los alimentos y comer despacio.",
});

const currentDay = computed(() => {
  const today = weeklyMenu.value.find(
    (d) => d.isToday
  );
  return today?.day || "Lunes";
});

const todayMenu = computed(() => {
  const today = weeklyMenu.value.find(
    (d) => d.isToday
  );
  return today ? today.day : "Sin menú";
});

const todayMenuDetails = computed(() => {
  const today = weeklyMenu.value.find(
    (d) => d.isToday
  );
  return (
    today || {
      breakfast: "N/A",
      lunch: "N/A",
      snack: "N/A",
    }
  );
});
</script>

<style scoped>
.inicio-view {
  padding-top: 2rem;
}

.welcome-banner {
  background: linear-gradient(
    135deg,
    #4c51bf 0%,
    #6b21a8 100%
  );
  color: #ffffff !important;
}

.info-card {
  background: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.notice-item {
  background: var(--bg-secondary) !important;
  border-left: 4px solid #0d6efd;
}

.notice-title {
  color: var(--text-primary) !important;
  font-weight: 600;
}

.notice-message {
  color: var(--text-primary) !important;
  opacity: 0.85;
}

.notice-date {
  color: var(--text-primary) !important;
  opacity: 0.7;
}

.avatar {
  width: 45px;
  height: 45px;
  font-size: 1rem;
  font-weight: bold;
}

.student-item {
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.student-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos para la sección de dieta */
.diet-section-title {
  color: var(--text-primary) !important;
  font-weight: 600;
  opacity: 0.9;
}

.diet-restriction-title {
  color: #dc3545;
  font-weight: 600;
}

.diet-recommendation-title {
  color: #0dcaf0;
  font-weight: 600;
}

.diet-text {
  color: var(--text-primary) !important;
}

/* Asegurar que el acordeón se adapte al tema */
.accordion-button {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
}

.accordion-button:not(.collapsed) {
  background-color: var(
    --bg-secondary
  ) !important;
  color: var(--text-primary) !important;
}

.accordion-body {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
}

.accordion-item {
  background-color: var(--bg-primary) !important;
  border-color: var(--border-color) !important;
}
</style>
