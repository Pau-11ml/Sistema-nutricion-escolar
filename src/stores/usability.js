import { defineStore } from "pinia";
import { ref, computed } from "vue";

/**
 * Store para métricas de usabilidad según ISO 9241-11
 * - Eficacia: Grado en que los usuarios logran sus objetivos
 * - Eficiencia: Recursos empleados en relación con los resultados
 * - Satisfacción: Respuestas del usuario al usar el producto
 */
export const useUsabilityStore = defineStore(
  "usability",
  () => {
    // Métricas de Eficacia
    const tasksCompleted = ref(0);
    const tasksAttempted = ref(0);
    const errors = ref([]);

    // Métricas de Eficiencia
    const taskStartTime = ref(null);
    const taskTimes = ref([]);
    const clickCount = ref(0);
    const keyPressCount = ref(0);

    // Métricas de Satisfacción
    const satisfactionRatings = ref([]);
    const feedbackComments = ref([]);

    // Historial de interacciones
    const interactionHistory = ref([]);

    // Computed: Tasa de éxito (Eficacia)
    const successRate = computed(() => {
      if (tasksAttempted.value === 0) return "0";
      return (
        (tasksCompleted.value /
          tasksAttempted.value) *
        100
      ).toFixed(2);
    });

    // Computed: Tiempo promedio por tarea (Eficiencia)
    const averageTaskTime = computed(() => {
      if (taskTimes.value.length === 0)
        return "0";
      const sum = taskTimes.value.reduce(
        (a, b) => a + b,
        0
      );
      return (
        sum /
        taskTimes.value.length /
        1000
      ).toFixed(2); // en segundos
    });

    // Computed: Satisfacción promedio
    const averageSatisfaction = computed(() => {
      if (satisfactionRatings.value.length === 0)
        return "0";
      const sum =
        satisfactionRatings.value.reduce(
          (a, b) => a + b,
          0
        );
      return (
        sum / satisfactionRatings.value.length
      ).toFixed(2);
    });

    // Computed: Tasa de error
    const errorRate = computed(() => {
      if (tasksAttempted.value === 0) return "0";
      return (
        (errors.value.length /
          tasksAttempted.value) *
        100
      ).toFixed(2);
    });

    // Actions
    function startTask(taskName) {
      taskStartTime.value = Date.now();
      tasksAttempted.value++;

      logInteraction({
        type: "task_start",
        task: taskName,
        timestamp: new Date().toISOString(),
      });
    }

    function completeTask(
      taskName,
      success = true
    ) {
      if (taskStartTime.value) {
        const duration =
          Date.now() - taskStartTime.value;
        taskTimes.value.push(duration);

        if (success) {
          tasksCompleted.value++;
        }

        logInteraction({
          type: "task_complete",
          task: taskName,
          success,
          duration,
          timestamp: new Date().toISOString(),
        });

        taskStartTime.value = null;
      }
    }

    function logError(
      errorType,
      errorMessage,
      context = {}
    ) {
      errors.value.push({
        type: errorType,
        message: errorMessage,
        context,
        timestamp: new Date().toISOString(),
      });

      logInteraction({
        type: "error",
        errorType,
        errorMessage,
        context,
      });
    }

    function trackClick(element, context = {}) {
      clickCount.value++;

      logInteraction({
        type: "click",
        element,
        context,
        timestamp: new Date().toISOString(),
      });
    }

    function trackKeyPress(key, context = {}) {
      keyPressCount.value++;

      logInteraction({
        type: "keypress",
        key,
        context,
        timestamp: new Date().toISOString(),
      });
    }

    function rateSatisfaction(
      rating,
      comment = ""
    ) {
      satisfactionRatings.value.push(rating);

      if (comment) {
        feedbackComments.value.push({
          rating,
          comment,
          timestamp: new Date().toISOString(),
        });
      }

      logInteraction({
        type: "satisfaction_rating",
        rating,
        comment,
      });
    }

    function logInteraction(interaction) {
      interactionHistory.value.push({
        ...interaction,
        timestamp:
          interaction.timestamp ||
          new Date().toISOString(),
      });

      // Limitar historial a últimas 1000 interacciones
      if (
        interactionHistory.value.length > 1000
      ) {
        interactionHistory.value.shift();
      }
    }

    function getMetricsReport() {
      return {
        efficacy: {
          successRate: successRate.value,
          tasksCompleted: tasksCompleted.value,
          tasksAttempted: tasksAttempted.value,
          errorRate: errorRate.value,
          totalErrors: errors.value.length,
        },
        efficiency: {
          averageTaskTime: averageTaskTime.value,
          totalClicks: clickCount.value,
          totalKeyPresses: keyPressCount.value,
          clicksPerTask:
            tasksCompleted.value > 0
              ? (
                  clickCount.value /
                  tasksCompleted.value
                ).toFixed(2)
              : 0,
        },
        satisfaction: {
          averageRating:
            averageSatisfaction.value,
          totalRatings:
            satisfactionRatings.value.length,
          feedbackCount:
            feedbackComments.value.length,
        },
        interactions: {
          total: interactionHistory.value.length,
          recent:
            interactionHistory.value.slice(-10),
        },
      };
    }

    function resetMetrics() {
      tasksCompleted.value = 0;
      tasksAttempted.value = 0;
      errors.value = [];
      taskStartTime.value = null;
      taskTimes.value = [];
      clickCount.value = 0;
      keyPressCount.value = 0;
      satisfactionRatings.value = [];
      feedbackComments.value = [];
      interactionHistory.value = [];
    }

    function exportMetrics() {
      const report = getMetricsReport();
      const blob = new Blob(
        [JSON.stringify(report, null, 2)],
        { type: "application/json" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `usability-metrics-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    return {
      // State
      tasksCompleted,
      tasksAttempted,
      errors,
      clickCount,
      keyPressCount,
      satisfactionRatings,
      feedbackComments,
      interactionHistory,

      // Computed
      successRate,
      averageTaskTime,
      averageSatisfaction,
      errorRate,

      // Actions
      startTask,
      completeTask,
      logError,
      trackClick,
      trackKeyPress,
      rateSatisfaction,
      logInteraction,
      getMetricsReport,
      resetMetrics,
      exportMetrics,
    };
  }
);
