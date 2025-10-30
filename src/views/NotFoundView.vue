<template>
  <div
    class="not-found-view min-vh-100 d-flex align-items-center justify-content-center"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div
          class="col-md-8 col-lg-6 text-center"
        >
          <div class="error-content">
            <!-- Número 404 animado -->
            <h1
              class="error-code display-1 fw-bold mb-4"
            >
              <span class="text-primary">4</span>
              <span class="text-danger">0</span>
              <span class="text-warning">4</span>
            </h1>

            <!-- Icono -->
            <div class="mb-4">
              <i
                class="bi bi-compass display-1 text-muted"
              ></i>
            </div>

            <!-- Mensaje -->
            <h2 class="mb-3">
              {{ $t("errors.pageNotFound") }}
            </h2>
            <p class="lead text-muted mb-4">
              {{
                $t("errors.pageNotFoundMessage")
              }}
            </p>

            <!-- Sugerencias -->
            <div class="suggestions mb-4">
              <p class="text-muted mb-3">
                {{ $t("errors.suggestions") }}
              </p>
              <div class="list-group">
                <router-link
                  to="/"
                  class="list-group-item list-group-item-action"
                >
                  <i
                    class="bi bi-house-fill me-2"
                  ></i>
                  {{ $t("nav.home") }}
                </router-link>
                <router-link
                  to="/login"
                  class="list-group-item list-group-item-action"
                >
                  <i
                    class="bi bi-box-arrow-in-right me-2"
                  ></i>
                  {{ $t("auth.login") }}
                </router-link>
                <button
                  class="list-group-item list-group-item-action"
                  @click="goBack"
                >
                  <i
                    class="bi bi-arrow-left me-2"
                  ></i>
                  {{ $t("common.goBack") }}
                </button>
              </div>
            </div>

            <!-- Búsqueda -->
            <div class="search-box">
              <div class="input-group">
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  :placeholder="
                    $t('common.searchPlaceholder')
                  "
                  @keyup.enter="handleSearch"
                />
                <button
                  class="btn btn-primary"
                  @click="handleSearch"
                >
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();

const searchQuery = ref("");

function goBack() {
  router.go(-1);
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    // Implementar búsqueda
    console.log("Buscando:", searchQuery.value);
  }
}
</script>

<style scoped>
.not-found-view {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
}

.error-content {
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 8rem;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.suggestions {
  max-width: 400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }

  .error-content {
    padding: 2rem;
  }
}
</style>
