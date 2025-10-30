<template>
  <div class="dashboard-view">
    <!-- Estadísticas -->
    <div class="row g-4 mb-4">
      <div
        class="col-md-3"
        v-for="stat in statistics"
        :key="stat.id"
      >
        <div
          class="card stat-card"
          :class="`border-start border-${stat.color} border-4`"
        >
          <div class="card-body">
            <div
              class="d-flex justify-content-between align-items-center"
            >
              <div>
                <p class="text-muted mb-1 small">
                  {{ stat.label }}
                </p>
                <h3 class="mb-0">
                  {{ stat.value }}
                </h3>
              </div>
              <div
                class="stat-icon"
                :class="`text-${stat.color}`"
              >
                <i
                  class="bi"
                  :class="stat.icon"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones rápidas -->
    <div class="card mb-4">
      <div class="card-header">
        <i
          class="bi bi-lightning-charge me-2"
        ></i>
        {{ $t("admin.quickActions") }}
      </div>
      <div class="card-body">
        <div class="d-flex flex-wrap gap-2">
          <router-link
            to="/admin/estudiantes/registro"
            class="btn btn-primary"
          >
            <i class="bi bi-person-plus me-2"></i>
            {{ $t("student.registerStudent") }}
          </router-link>
          <router-link
            to="/admin/nutricionistas/registro"
            class="btn btn-success"
          >
            <i class="bi bi-heart-pulse me-2"></i>
            {{ $t("admin.registerNutritionist") }}
          </router-link>
          <button
            class="btn btn-info"
            @click="exportData"
          >
            <i
              class="bi bi-file-earmark-text me-2"
            ></i>
            {{ $t("admin.exportData") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de usuarios -->
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <span>
          <i class="bi bi-people me-2"></i>
          {{ $t("admin.registeredUsers") }}
        </span>
        <div class="search-box">
          <div class="input-group input-group-sm">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="search"
              class="form-control"
              :placeholder="
                $t('admin.searchByName')
              "
              v-model="searchQuery"
            />
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table
            class="table table-hover align-middle"
          >
            <thead>
              <tr>
                <th>{{ $t("admin.name") }}</th>
                <th>
                  {{ $t("admin.username") }}
                </th>
                <th>{{ $t("admin.role") }}</th>
                <th>
                  {{ $t("admin.document") }}
                </th>
                <th>{{ $t("admin.status") }}</th>
                <th class="text-center">
                  {{ $t("admin.actions") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in filteredUsers"
                :key="user.id"
              >
                <td>{{ user.name }}</td>
                <td>{{ user.username }}</td>
                <td>
                  <span
                    class="badge"
                    :class="
                      getRoleBadgeClass(user.role)
                    "
                  >
                    {{ $t(`admin.${user.role}`) }}
                  </span>
                </td>
                <td>{{ user.cedula }}</td>
                <td>
                  <span
                    class="badge"
                    :class="
                      user.active
                        ? 'bg-success'
                        : 'bg-secondary'
                    "
                  >
                    {{
                      user.active
                        ? $t("admin.active")
                        : $t("admin.inactive")
                    }}
                  </span>
                </td>
                <td class="text-center">
                  <div
                    class="btn-group btn-group-sm"
                  >
                    <button
                      class="btn btn-outline-primary"
                      @click="editUser(user)"
                      :title="$t('admin.edit')"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="deleteUser(user)"
                      :title="$t('admin.delete')"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p
          v-if="filteredUsers.length === 0"
          class="text-center text-muted my-4"
        >
          {{ $t("student.noStudents") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useNotificationStore } from "@/stores/notification";

const { t } = useI18n();
const notificationStore = useNotificationStore();

const searchQuery = ref("");

const statistics = ref([
  {
    id: 1,
    label: t("admin.totalStudents"),
    value: 0,
    icon: "bi-people-fill",
    color: "primary",
  },
  {
    id: 2,
    label: t("admin.totalNutritionists"),
    value: 0,
    icon: "bi-heart-pulse-fill",
    color: "success",
  },
  {
    id: 3,
    label: t("admin.totalUsers"),
    value: 1,
    icon: "bi-person-check-fill",
    color: "info",
  },
  {
    id: 4,
    label: t("admin.activeMenus"),
    value: 0,
    icon: "bi-calendar-week-fill",
    color: "warning",
  },
]);

// Solo usuarios predeterminados del sistema
// Los nuevos usuarios se agregarán mediante registro
const users = ref([
  {
    id: 1,
    name: "Administrador del Sistema",
    username: "admin",
    role: "admin",
    cedula: "0000000000",
    active: true,
  },
]);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  const query = searchQuery.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.username
        .toLowerCase()
        .includes(query) ||
      user.role.toLowerCase().includes(query)
  );
});

function getRoleBadgeClass(role) {
  const classes = {
    admin: "bg-danger",
    nutricionista: "bg-success",
    representante: "bg-primary",
  };
  return classes[role] || "bg-secondary";
}

function editUser(user) {
  notificationStore.info(
    `${t("admin.edit")}: ${user.name}`
  );
  // Implementar navegación a formulario de edición
}

function deleteUser(user) {
  if (
    confirm(
      `${t("student.confirmDelete").replace(
        "estudiante",
        "usuario"
      )}: ${user.name}?`
    )
  ) {
    notificationStore.success(
      `${t("common.success")}: ${user.name}`
    );
    // Implementar lógica de eliminación
  }
}

function exportData() {
  try {
    // Preparar datos para exportar
    const exportDate =
      new Date().toLocaleDateString("es-EC");
    const data = {
      fecha_exportacion: exportDate,
      estadisticas: {
        total_estudiantes:
          statistics.value[0].value,
        total_nutricionistas:
          statistics.value[1].value,
        total_usuarios: statistics.value[2].value,
        menus_activos: statistics.value[3].value,
      },
      usuarios: users.value.map((user) => ({
        nombre: user.name,
        usuario: user.username,
        rol: user.role,
        cedula: user.cedula,
        estado: user.active
          ? "Activo"
          : "Inactivo",
      })),
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
    link.download = `datos_sistema_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    notificationStore.success(
      "Datos exportados correctamente"
    );
  } catch (error) {
    notificationStore.error(
      "Error al exportar datos: " + error.message
    );
  }
}
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.7;
}

.search-box {
  min-width: 250px;
}
</style>
