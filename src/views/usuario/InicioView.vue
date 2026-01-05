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
                Mis Hijos
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

        <!-- Dietas Personalizadas de los Estudiantes -->
        <div
          class="card mb-4"
          v-if="estudiantesConMenuPersonalizado.length > 0"
        >
          <div
            class="card-header bg-success text-white"
          >
            <h5 class="mb-0">
              <i
                class="bi bi-heart-pulse me-2"
              ></i>
              Menús Personalizados
            </h5>
          </div>
          <div class="card-body">
            <!-- Iterar sobre cada estudiante con menú personalizado -->
            <div
              v-for="(menuData, index) in estudiantesConMenuPersonalizado"
              :key="menuData.estudiante.id"
              :class="{ 'mb-4': index < estudiantesConMenuPersonalizado.length - 1 }"
            >
              <!-- Nombre del estudiante -->
              <div class="alert alert-info mb-3">
                <div class="d-flex align-items-center">
                  <i class="bi bi-person-circle fs-4 me-2"></i>
                  <div>
                    <strong>{{ menuData.estudiante.nombres }} {{ menuData.estudiante.apellidos }}</strong>
                    <br />
                    <small>Vigencia: {{ menuData.menu.fechaInicio }} - {{ menuData.menu.fechaFin }}</small>
                  </div>
                </div>
              </div>

              <!-- Calorías diarias -->
              <div class="mb-3">
                <h6 class="diet-section-title">
                  <i class="bi bi-calculator me-2"></i>
                  Calorías Diarias
                </h6>
                <div class="progress" style="height: 25px">
                  <div
                    class="progress-bar bg-success"
                    style="width: 100%"
                  >
                    {{ menuData.menu.calorias }} kcal
                  </div>
                </div>
              </div>

              <!-- Plan de Comidas -->
              <h6 class="diet-section-title mb-3">
                <i class="bi bi-calendar2-week me-2"></i>
                Plan de Comidas para {{ menuData.estudiante.nombres }} {{ menuData.estudiante.apellidos }}
              </h6>

              <div
                class="accordion"
                :id="`dietaAccordion${menuData.estudiante.id}`"
              >
                <!-- Desayuno -->
                <div class="accordion-item" v-if="menuData.menu.comidas.desayuno">
                  <h2
                    class="accordion-header"
                    :id="`heading-${menuData.estudiante.id}-desayuno`"
                  >
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      :data-bs-target="`#collapse-${menuData.estudiante.id}-desayuno`"
                      :aria-expanded="false"
                      :aria-controls="`collapse-${menuData.estudiante.id}-desayuno`"
                    >
                      <i class="bi bi-sunrise me-2"></i>
                      <strong>Desayuno</strong>
                      <small class="ms-2 text-muted">
                        ({{ menuData.menu.comidas.desayuno.hora }}) - {{ menuData.menu.comidas.desayuno.calorias }} kcal
                      </small>
                    </button>
                  </h2>
                  <div
                    :id="`collapse-${menuData.estudiante.id}-desayuno`"
                    class="accordion-collapse collapse"
                    :data-bs-parent="`#dietaAccordion${menuData.estudiante.id}`"
                  >
                    <div class="accordion-body">
                      <ul class="list-unstyled mb-0">
                        <li
                          v-for="(alimento, idx) in menuData.menu.comidas.desayuno.alimentos"
                          :key="idx"
                          class="mb-1 diet-text"
                        >
                          <i class="bi bi-check2-circle me-2" style="color: #198754"></i>
                          {{ alimento }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Almuerzo -->
                <div class="accordion-item" v-if="menuData.menu.comidas.almuerzo">
                  <h2
                    class="accordion-header"
                    :id="`heading-${menuData.estudiante.id}-almuerzo`"
                  >
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      :data-bs-target="`#collapse-${menuData.estudiante.id}-almuerzo`"
                      :aria-expanded="false"
                      :aria-controls="`collapse-${menuData.estudiante.id}-almuerzo`"
                    >
                      <i class="bi bi-sun me-2"></i>
                      <strong>Almuerzo</strong>
                      <small class="ms-2 text-muted">
                        ({{ menuData.menu.comidas.almuerzo.hora }}) - {{ menuData.menu.comidas.almuerzo.calorias }} kcal
                      </small>
                    </button>
                  </h2>
                  <div
                    :id="`collapse-${menuData.estudiante.id}-almuerzo`"
                    class="accordion-collapse collapse"
                    :data-bs-parent="`#dietaAccordion${menuData.estudiante.id}`"
                  >
                    <div class="accordion-body">
                      <ul class="list-unstyled mb-0">
                        <li
                          v-for="(alimento, idx) in menuData.menu.comidas.almuerzo.alimentos"
                          :key="idx"
                          class="mb-1 diet-text"
                        >
                          <i class="bi bi-check2-circle me-2" style="color: #198754"></i>
                          {{ alimento }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Merienda -->
                <div class="accordion-item" v-if="menuData.menu.comidas.merienda">
                  <h2
                    class="accordion-header"
                    :id="`heading-${menuData.estudiante.id}-merienda`"
                  >
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      :data-bs-target="`#collapse-${menuData.estudiante.id}-merienda`"
                      :aria-expanded="false"
                      :aria-controls="`collapse-${menuData.estudiante.id}-merienda`"
                    >
                      <i class="bi bi-moon-stars me-2"></i>
                      <strong>Merienda</strong>
                      <small class="ms-2 text-muted">
                        ({{ menuData.menu.comidas.merienda.hora }}) - {{ menuData.menu.comidas.merienda.calorias }} kcal
                      </small>
                    </button>
                  </h2>
                  <div
                    :id="`collapse-${menuData.estudiante.id}-merienda`"
                    class="accordion-collapse collapse"
                    :data-bs-parent="`#dietaAccordion${menuData.estudiante.id}`"
                  >
                    <div class="accordion-body">
                      <ul class="list-unstyled mb-0">
                        <li
                          v-for="(alimento, idx) in menuData.menu.comidas.merienda.alimentos"
                          :key="idx"
                          class="mb-1 diet-text"
                        >
                          <i class="bi bi-check2-circle me-2" style="color: #198754"></i>
                          {{ alimento }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Separador entre estudiantes -->
              <hr v-if="index < estudiantesConMenuPersonalizado.length - 1" class="my-4" />
            </div>
          </div>
        </div>

        <!-- Recomendaciones Nutricionales -->
        <div class="card mb-4" v-if="recomendacionesDelRepresentante.length > 0">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">
              <i class="bi bi-heart-pulse me-2"></i>
              Recomendaciones Nutricionales
            </h5>
          </div>
          <div class="card-body">
            <div v-for="(rec, index) in recomendacionesDelRepresentante" :key="rec.id" class="mb-3">
              <div class="alert" :class="getPrioridadClass(rec.prioridad)">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 class="mb-1">
                      <i class="bi bi-person-circle me-1"></i>
                      <strong>{{ rec.estudianteNombre }}</strong>
                    </h6>
                    <span class="badge" :class="getTipoBadgeClass(rec.tipo)">{{ rec.tipo }}</span>
                  </div>
                  <small class="text-muted">
                    <i class="bi bi-calendar3 me-1"></i>
                    {{ formatDate(rec.fecha) }}
                  </small>
                </div>
                <h6 class="fw-bold">{{ rec.titulo }}</h6>
                <p class="mb-2">{{ rec.descripcion }}</p>
                <div v-if="rec.fechaSeguimiento" class="mt-2">
                  <small class="text-muted">
                    <i class="bi bi-clock me-1"></i>
                    Seguimiento: {{ formatDate(rec.fechaSeguimiento) }}
                  </small>
                </div>
              </div>
              <hr v-if="index < recomendacionesDelRepresentante.length - 1" class="my-3" />
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
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i
                class="bi bi-person-badge me-2"
              ></i>
              Mis Hijos
            </h5>
            <button
              class="btn btn-sm btn-success"
              @click="openAddStudentModal"
            >
              <i class="bi bi-plus-lg me-1"></i>
              Agregar
            </button>
          </div>
          <div class="card-body">
            <div v-if="students.length === 0" class="text-center text-muted py-4">
              <i class="bi bi-people fs-1 mb-3 d-block"></i>
              <p>No tienes estudiantes registrados</p>
              <button class="btn btn-primary" @click="openAddStudentModal">
                <i class="bi bi-plus-lg me-2"></i>
                Agregar primer estudiante
              </button>
            </div>
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
                  <small class="text-muted d-block">{{ student.grade }}</small>
                  <span 
                    v-if="tieneMenuPersonalizado(student.id)" 
                    class="badge bg-success mt-1"
                  >
                    <i class="bi bi-clipboard-check me-1"></i>
                    Con menú personalizado
                  </span>
                  <span 
                    v-else 
                    class="badge bg-secondary mt-1"
                  >
                    <i class="bi bi-clipboard-x me-1"></i>
                    Sin menú personalizado
                  </span>
                </div>
                <button
                  class="btn btn-sm btn-outline-primary"
                  title="Ver detalles"
                  @click="openViewStudentModal(student)"
                >
                  <i class="bi bi-eye"></i>
                </button>
              </div>
            </div>
          </div>
        </div>        <!-- Ayuda Rápida -->
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
                @click.prevent="abrirContactoSoporte"
              >
                <i
                  class="bi bi-telephone me-2"
                ></i>
                {{ $t("usuario.contactSupport") }}
              </a>
              <a
                href="#"
                class="list-group-item list-group-item-action"
                @click.prevent="abrirPreguntasFrecuentes"
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

    <!-- Modal Agregar Estudiante -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showAddStudentModal"
          class="modal fade show d-block"
          tabindex="-1"
          role="dialog"
          @click.self="closeAddStudentModal"
        >
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header bg-success text-white">
                <h5 class="modal-title">
                  <i class="bi bi-person-plus me-2"></i>
                  Agregar Nuevo Estudiante
                </h5>
                <button
                  type="button"
                  class="btn-close btn-close-white"
                  @click="closeAddStudentModal"
                  aria-label="Cerrar"
                ></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="handleAddStudent">
                  <div class="row g-3">
                    <!-- Nombres -->
                    <div class="col-md-6">
                      <label for="nombres" class="form-label">
                        Nombres <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.nombres }"
                        id="nombres"
                        v-model="newStudent.nombres"
                        placeholder="Ej: Juan Carlos"
                      />
                      <div v-if="formErrors.nombres" class="invalid-feedback">
                        {{ formErrors.nombres }}
                      </div>
                    </div>

                    <!-- Apellidos -->
                    <div class="col-md-6">
                      <label for="apellidos" class="form-label">
                        Apellidos <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.apellidos }"
                        id="apellidos"
                        v-model="newStudent.apellidos"
                        placeholder="Ej: García Pérez"
                      />
                      <div v-if="formErrors.apellidos" class="invalid-feedback">
                        {{ formErrors.apellidos }}
                      </div>
                    </div>

                    <!-- Cédula -->
                    <div class="col-md-6">
                      <label for="cedula" class="form-label">
                        Cédula <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.cedula }"
                        id="cedula"
                        v-model="newStudent.cedula"
                        placeholder="Ej: 1234567890"
                        maxlength="10"
                      />
                      <div v-if="formErrors.cedula" class="invalid-feedback">
                        {{ formErrors.cedula }}
                      </div>
                    </div>

                    <!-- Fecha de Nacimiento -->
                    <div class="col-md-6">
                      <label for="fechaNacimiento" class="form-label">
                        Fecha de Nacimiento <span class="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.fechaNacimiento }"
                        id="fechaNacimiento"
                        v-model="newStudent.fechaNacimiento"
                      />
                      <div v-if="formErrors.fechaNacimiento" class="invalid-feedback">
                        {{ formErrors.fechaNacimiento }}
                      </div>
                    </div>

                    <!-- Grado -->
                    <div class="col-md-6">
                      <label for="grado" class="form-label">
                        Grado <span class="text-danger">*</span>
                      </label>
                      <select
                        class="form-select"
                        :class="{ 'is-invalid': formErrors.grado }"
                        id="grado"
                        v-model="newStudent.grado"
                      >
                        <option value="">Seleccione un grado</option>
                        <option value="1ro">1ro</option>
                        <option value="2do">2do</option>
                        <option value="3ro">3ro</option>
                        <option value="4to">4to</option>
                        <option value="5to">5to</option>
                        <option value="6to">6to</option>
                        <option value="7mo">7mo</option>
                        <option value="8vo">8vo</option>
                        <option value="9no">9no</option>
                        <option value="10mo">10mo</option>
                      </select>
                      <div v-if="formErrors.grado" class="invalid-feedback">
                        {{ formErrors.grado }}
                      </div>
                    </div>

                    <!-- Sección -->
                    <div class="col-md-6">
                      <label for="seccion" class="form-label">
                        Sección <span class="text-danger">*</span>
                      </label>
                      <select
                        class="form-select"
                        :class="{ 'is-invalid': formErrors.seccion }"
                        id="seccion"
                        v-model="newStudent.seccion"
                      >
                        <option value="">Seleccione una sección</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                      <div v-if="formErrors.seccion" class="invalid-feedback">
                        {{ formErrors.seccion }}
                      </div>
                    </div>

                    <!-- Email -->
                    <div class="col-md-6">
                      <label for="email" class="form-label">
                        Email <span class="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.email }"
                        id="email"
                        v-model="newStudent.email"
                        placeholder="Ej: estudiante@ejemplo.com"
                      />
                      <div v-if="formErrors.email" class="invalid-feedback">
                        {{ formErrors.email }}
                      </div>
                    </div>

                    <!-- Teléfono -->
                    <div class="col-md-6">
                      <label for="telefono" class="form-label">
                        Teléfono <span class="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.telefono }"
                        id="telefono"
                        v-model="newStudent.telefono"
                        placeholder="Ej: 0412-1234567"
                      />
                      <div v-if="formErrors.telefono" class="invalid-feedback">
                        {{ formErrors.telefono }}
                      </div>
                    </div>

                    <!-- Peso -->
                    <div class="col-md-4">
                      <label for="peso" class="form-label">
                        Peso (kg) <span class="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.peso }"
                        id="peso"
                        v-model="newStudent.peso"
                        placeholder="Ej: 35"
                        step="0.1"
                        min="0"
                      />
                      <div v-if="formErrors.peso" class="invalid-feedback">
                        {{ formErrors.peso }}
                      </div>
                    </div>

                    <!-- Altura -->
                    <div class="col-md-4">
                      <label for="altura" class="form-label">
                        Altura (cm) <span class="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.altura }"
                        id="altura"
                        v-model="newStudent.altura"
                        placeholder="Ej: 140"
                        step="0.1"
                        min="0"
                      />
                      <div v-if="formErrors.altura" class="invalid-feedback">
                        {{ formErrors.altura }}
                      </div>
                    </div>

                    <!-- Grupo Sanguíneo -->
                    <div class="col-md-4">
                      <label for="grupoSanguineo" class="form-label">
                        Grupo Sanguíneo <span class="text-danger">*</span>
                      </label>
                      <select
                        class="form-select"
                        :class="{ 'is-invalid': formErrors.grupoSanguineo }"
                        id="grupoSanguineo"
                        v-model="newStudent.grupoSanguineo"
                      >
                        <option value="">Seleccione</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                      <div v-if="formErrors.grupoSanguineo" class="invalid-feedback">
                        {{ formErrors.grupoSanguineo }}
                      </div>
                    </div>

                    <!-- Alergias -->
                    <div class="col-12">
                      <label for="alergias" class="form-label">
                        Alergias
                      </label>
                      <textarea
                        class="form-control"
                        id="alergias"
                        v-model="newStudent.alergias"
                        rows="2"
                        placeholder="Ej: Alergia al maní, lactosa, etc."
                      ></textarea>
                    </div>

                    <!-- Condiciones Médicas -->
                    <div class="col-12">
                      <label for="condicionesMedicas" class="form-label">
                        Condiciones Médicas
                      </label>
                      <textarea
                        class="form-control"
                        id="condicionesMedicas"
                        v-model="newStudent.condicionesMedicas"
                        rows="2"
                        placeholder="Ej: Diabetes, asma, etc."
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeAddStudentModal"
                >
                  <i class="bi bi-x-lg me-1"></i>
                  Cancelar
                </button>
                <button
                  type="button"
                  class="btn btn-success"
                  @click="handleAddStudent"
                >
                  <i class="bi bi-check-lg me-1"></i>
                  Agregar Estudiante
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="backdrop-fade">
        <div
          v-if="showAddStudentModal"
          class="modal-backdrop show"
          @click="closeAddStudentModal"
        ></div>
      </Transition>
    </Teleport>

    <!-- Modal Ver/Editar Estudiante -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showViewStudentModal"
          class="modal fade show d-block"
          tabindex="-1"
          role="dialog"
          @click.self="closeViewStudentModal"
        >
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header" :class="editMode ? 'bg-warning' : 'bg-info text-white'">
                <h5 class="modal-title">
                  <i :class="editMode ? 'bi bi-pencil-square me-2' : 'bi bi-person-circle me-2'"></i>
                  {{ editMode ? 'Editar Estudiante' : 'Información del Estudiante' }}
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  :class="{ 'btn-close-white': !editMode }"
                  @click="closeViewStudentModal"
                  aria-label="Cerrar"
                ></button>
              </div>
              <div class="modal-body" v-if="selectedStudent">
                <form @submit.prevent="handleUpdateStudent">
                  <div class="row g-3">
                    <!-- Nombres -->
                    <div class="col-md-6">
                      <label for="viewNombres" class="form-label">
                        Nombres <span v-if="editMode" class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.nombres }"
                        id="viewNombres"
                        v-model="selectedStudent.nombres"
                        :readonly="!editMode"
                        placeholder="Ej: Juan Carlos"
                      />
                      <div v-if="formErrors.nombres" class="invalid-feedback">
                        {{ formErrors.nombres }}
                      </div>
                    </div>

                    <!-- Apellidos -->
                    <div class="col-md-6">
                      <label for="viewApellidos" class="form-label">
                        Apellidos <span v-if="editMode" class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.apellidos }"
                        id="viewApellidos"
                        v-model="selectedStudent.apellidos"
                        :readonly="!editMode"
                        placeholder="Ej: García Pérez"
                      />
                      <div v-if="formErrors.apellidos" class="invalid-feedback">
                        {{ formErrors.apellidos }}
                      </div>
                    </div>

                    <!-- Cédula -->
                    <div class="col-md-6">
                      <label for="viewCedula" class="form-label">
                        Cédula <span v-if="editMode" class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.cedula }"
                        id="viewCedula"
                        v-model="selectedStudent.cedula"
                        :readonly="!editMode"
                        placeholder="Ej: 1234567890"
                        maxlength="10"
                      />
                      <div v-if="formErrors.cedula" class="invalid-feedback">
                        {{ formErrors.cedula }}
                      </div>
                    </div>

                    <!-- Fecha de Nacimiento -->
                    <div class="col-md-6">
                      <label for="viewFechaNacimiento" class="form-label">
                        Fecha de Nacimiento <span v-if="editMode" class="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.fechaNacimiento }"
                        id="viewFechaNacimiento"
                        v-model="selectedStudent.fechaNacimiento"
                        :readonly="!editMode"
                      />
                      <div v-if="formErrors.fechaNacimiento" class="invalid-feedback">
                        {{ formErrors.fechaNacimiento }}
                      </div>
                    </div>

                    <!-- Grado -->
                    <div class="col-md-6">
                      <label for="viewGrado" class="form-label">
                        Grado <span v-if="editMode" class="text-danger">*</span>
                      </label>
                      <select
                        class="form-select"
                        :class="{ 'is-invalid': formErrors.grado }"
                        id="viewGrado"
                        v-model="selectedStudent.grado"
                        :disabled="!editMode"
                      >
                        <option value="">Seleccione un grado</option>
                        <option value="1ro">1ro</option>
                        <option value="2do">2do</option>
                        <option value="3ro">3ro</option>
                        <option value="4to">4to</option>
                        <option value="5to">5to</option>
                        <option value="6to">6to</option>
                        <option value="7mo">7mo</option>
                        <option value="8vo">8vo</option>
                        <option value="9no">9no</option>
                        <option value="10mo">10mo</option>
                      </select>
                      <div v-if="formErrors.grado" class="invalid-feedback">
                        {{ formErrors.grado }}
                      </div>
                    </div>

                    <!-- Sección -->
                    <div class="col-md-6">
                      <label for="viewSeccion" class="form-label">
                        Sección <span v-if="editMode" class="text-danger">*</span>
                      </label>
                      <select
                        class="form-select"
                        :class="{ 'is-invalid': formErrors.seccion }"
                        id="viewSeccion"
                        v-model="selectedStudent.seccion"
                        :disabled="!editMode"
                      >
                        <option value="">Seleccione una sección</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                      <div v-if="formErrors.seccion" class="invalid-feedback">
                        {{ formErrors.seccion }}
                      </div>
                    </div>

                    <!-- Email -->
                    <div class="col-md-6">
                      <label for="viewEmail" class="form-label">
                        Email <span v-if="editMode" class="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.email }"
                        id="viewEmail"
                        v-model="selectedStudent.email"
                        :readonly="!editMode"
                        placeholder="Ej: estudiante@ejemplo.com"
                      />
                      <div v-if="formErrors.email" class="invalid-feedback">
                        {{ formErrors.email }}
                      </div>
                    </div>

                    <!-- Teléfono -->
                    <div class="col-md-6">
                      <label for="viewTelefono" class="form-label">
                        Teléfono <span v-if="editMode" class="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.telefono }"
                        id="viewTelefono"
                        v-model="selectedStudent.telefono"
                        :readonly="!editMode"
                        placeholder="Ej: 0412-1234567"
                      />
                      <div v-if="formErrors.telefono" class="invalid-feedback">
                        {{ formErrors.telefono }}
                      </div>
                    </div>

                    <!-- Peso -->
                    <div class="col-md-4">
                      <label for="viewPeso" class="form-label">
                        Peso (kg) <span v-if="editMode" class="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.peso }"
                        id="viewPeso"
                        v-model="selectedStudent.peso"
                        :readonly="!editMode"
                        placeholder="Ej: 35"
                        step="0.1"
                        min="0"
                      />
                      <div v-if="formErrors.peso" class="invalid-feedback">
                        {{ formErrors.peso }}
                      </div>
                    </div>

                    <!-- Altura -->
                    <div class="col-md-4">
                      <label for="viewAltura" class="form-label">
                        Altura (cm) <span v-if="editMode" class="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.altura }"
                        id="viewAltura"
                        v-model="selectedStudent.altura"
                        :readonly="!editMode"
                        placeholder="Ej: 140"
                        step="0.1"
                        min="0"
                      />
                      <div v-if="formErrors.altura" class="invalid-feedback">
                        {{ formErrors.altura }}
                      </div>
                    </div>

                    <!-- Grupo Sanguíneo -->
                    <div class="col-md-4">
                      <label for="viewGrupoSanguineo" class="form-label">
                        Grupo Sanguíneo <span v-if="editMode" class="text-danger">*</span>
                      </label>
                      <select
                        class="form-select"
                        :class="{ 'is-invalid': formErrors.grupoSanguineo }"
                        id="viewGrupoSanguineo"
                        v-model="selectedStudent.grupoSanguineo"
                        :disabled="!editMode"
                      >
                        <option value="">Seleccione</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                      <div v-if="formErrors.grupoSanguineo" class="invalid-feedback">
                        {{ formErrors.grupoSanguineo }}
                      </div>
                    </div>

                    <!-- Alergias -->
                    <div class="col-12">
                      <label for="viewAlergias" class="form-label">
                        Alergias
                      </label>
                      <textarea
                        class="form-control"
                        id="viewAlergias"
                        v-model="selectedStudent.alergias"
                        :readonly="!editMode"
                        rows="2"
                        placeholder="Ej: Alergia al maní, lactosa, etc."
                      ></textarea>
                    </div>

                    <!-- Condiciones Médicas -->
                    <div class="col-12">
                      <label for="viewCondicionesMedicas" class="form-label">
                        Condiciones Médicas
                      </label>
                      <textarea
                        class="form-control"
                        id="viewCondicionesMedicas"
                        v-model="selectedStudent.condicionesMedicas"
                        :readonly="!editMode"
                        rows="2"
                        placeholder="Ej: Diabetes, asma, etc."
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button
                  v-if="!editMode"
                  type="button"
                  class="btn btn-warning"
                  @click="toggleEditMode"
                >
                  <i class="bi bi-pencil-square me-1"></i>
                  Editar
                </button>
                <button
                  v-if="editMode"
                  type="button"
                  class="btn btn-secondary"
                  @click="cancelEdit"
                >
                  <i class="bi bi-x-lg me-1"></i>
                  Cancelar
                </button>
                <button
                  v-if="editMode"
                  type="button"
                  class="btn btn-success"
                  @click="handleUpdateStudent"
                >
                  <i class="bi bi-check-lg me-1"></i>
                  Guardar Cambios
                </button>
                <button
                  v-if="!editMode"
                  type="button"
                  class="btn btn-secondary"
                  @click="closeViewStudentModal"
                >
                  <i class="bi bi-x-lg me-1"></i>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="backdrop-fade">
        <div
          v-if="showViewStudentModal"
          class="modal-backdrop show"
          @click="closeViewStudentModal"
        ></div>
      </Transition>
    </Teleport>

    <!-- Modal: Ver Menú Completo -->
    <div
      class="modal fade"
      id="menuCompletoModal"
      tabindex="-1"
      aria-hidden="true"
      ref="menuCompletoModalRef"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-calendar-week me-2"></i>
              Menú Personalizado - {{ currentStudentMenu?.nombres }} {{ currentStudentMenu?.apellidos }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="menuCompletoData">
            <!-- Información del menú -->
            <div class="alert alert-info mb-4">
              <div class="row">
                <div class="col-md-4">
                  <strong><i class="bi bi-calendar-range me-1"></i>Período:</strong>
                  {{ formatDateShort(menuCompletoData.fechaInicio) }} - {{ formatDateShort(menuCompletoData.fechaFin) }}
                </div>
                <div class="col-md-4">
                  <strong><i class="bi bi-check-circle me-1"></i>Estado:</strong>
                  <span class="badge bg-success ms-1">Activo</span>
                </div>
                <div class="col-md-4" v-if="currentStudentMenu?.alergias">
                  <strong><i class="bi bi-exclamation-triangle me-1"></i>Alergias:</strong>
                  {{ currentStudentMenu.alergias }}
                </div>
              </div>
              <div class="row mt-2" v-if="menuCompletoData.observaciones">
                <div class="col-12">
                  <strong><i class="bi bi-chat-square-text me-1"></i>Observaciones:</strong>
                  <p class="mb-0 mt-1">{{ menuCompletoData.observaciones }}</p>
                </div>
              </div>
            </div>

            <!-- Menú semanal -->
            <h6 class="mb-3">
              <i class="bi bi-calendar-week me-2"></i>Menú Semanal
            </h6>
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead class="table-light">
                  <tr>
                    <th style="width: 15%">Día</th>
                    <th style="width: 28%">
                      <i class="bi bi-sunrise me-1"></i>Desayuno
                    </th>
                    <th style="width: 28%">
                      <i class="bi bi-sun me-1"></i>Almuerzo
                    </th>
                    <th style="width: 28%">
                      <i class="bi bi-moon-stars me-1"></i>Merienda
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(dia, key) in menuCompletoData.menu" :key="key">
                    <td class="fw-bold">{{ getDiaNombre(key) }}</td>
                    <td>
                      <div v-if="dia.desayuno">
                        <div class="fw-bold">{{ getComidaById(dia.desayuno)?.nombre }}</div>
                        <small class="text-muted d-block">
                          {{ getComidaById(dia.desayuno)?.descripcion }}
                        </small>
                        <div class="mt-2">
                          <span class="badge bg-warning text-dark me-1">
                            <i class="bi bi-lightning-charge-fill"></i>
                            {{ getComidaById(dia.desayuno)?.valores.calorias }} kcal
                          </span>
                          <span class="badge bg-primary me-1">
                            <i class="bi bi-egg-fill"></i>
                            {{ getComidaById(dia.desayuno)?.valores.proteinas }}g
                          </span>
                        </div>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <div v-if="dia.almuerzo">
                        <div class="fw-bold">{{ getComidaById(dia.almuerzo)?.nombre }}</div>
                        <small class="text-muted d-block">
                          {{ getComidaById(dia.almuerzo)?.descripcion }}
                        </small>
                        <div class="mt-2">
                          <span class="badge bg-warning text-dark me-1">
                            <i class="bi bi-lightning-charge-fill"></i>
                            {{ getComidaById(dia.almuerzo)?.valores.calorias }} kcal
                          </span>
                          <span class="badge bg-primary me-1">
                            <i class="bi bi-egg-fill"></i>
                            {{ getComidaById(dia.almuerzo)?.valores.proteinas }}g
                          </span>
                        </div>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <div v-if="dia.merienda">
                        <div class="fw-bold">{{ getComidaById(dia.merienda)?.nombre }}</div>
                        <small class="text-muted d-block">
                          {{ getComidaById(dia.merienda)?.descripcion }}
                        </small>
                        <div class="mt-2">
                          <span class="badge bg-warning text-dark me-1">
                            <i class="bi bi-lightning-charge-fill"></i>
                            {{ getComidaById(dia.merienda)?.valores.calorias }} kcal
                          </span>
                          <span class="badge bg-primary me-1">
                            <i class="bi bi-egg-fill"></i>
                            {{ getComidaById(dia.merienda)?.valores.proteinas }}g
                          </span>
                        </div>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Contacto Soporte -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showContactoSoporteModal"
          class="modal fade show d-block"
          tabindex="-1"
          role="dialog"
          @click.self="cerrarContactoSoporte"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header bg-primary text-white">
                <h5 class="modal-title">
                  <i class="bi bi-telephone me-2"></i>
                  Contactar Soporte
                </h5>
                <button
                  type="button"
                  class="btn-close btn-close-white"
                  @click="cerrarContactoSoporte"
                  aria-label="Cerrar"
                ></button>
              </div>
              <div class="modal-body">
                <div class="text-center mb-4">
                  <i class="bi bi-headset display-1 text-primary"></i>
                </div>
                <h6 class="mb-3">Estamos aquí para ayudarte</h6>
                <div class="list-group">
                  <div class="list-group-item">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-telephone-fill text-primary me-3 fs-4"></i>
                      <div>
                        <strong>Teléfono</strong>
                        <p class="mb-0 text-muted">+58 424-1234567</p>
                      </div>
                    </div>
                  </div>
                  <div class="list-group-item">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-envelope-fill text-primary me-3 fs-4"></i>
                      <div>
                        <strong>Email</strong>
                        <p class="mb-0 text-muted">soporte@nutricionescolar.com</p>
                      </div>
                    </div>
                  </div>
                  <div class="list-group-item">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-whatsapp text-success me-3 fs-4"></i>
                      <div>
                        <strong>WhatsApp</strong>
                        <p class="mb-0 text-muted">+58 412-7654321</p>
                      </div>
                    </div>
                  </div>
                  <div class="list-group-item">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-clock-fill text-info me-3 fs-4"></i>
                      <div>
                        <strong>Horario de atención</strong>
                        <p class="mb-0 text-muted">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="cerrarContactoSoporte"
                >
                  <i class="bi bi-x-lg me-1"></i>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="backdrop-fade">
        <div
          v-if="showContactoSoporteModal"
          class="modal-backdrop show"
          @click="cerrarContactoSoporte"
        ></div>
      </Transition>
    </Teleport>

    <!-- Modal Preguntas Frecuentes -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showPreguntasFrecuentesModal"
          class="modal fade show d-block"
          tabindex="-1"
          role="dialog"
          @click.self="cerrarPreguntasFrecuentes"
        >
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header bg-info text-white">
                <h5 class="modal-title">
                  <i class="bi bi-chat-dots me-2"></i>
                  Preguntas Frecuentes
                </h5>
                <button
                  type="button"
                  class="btn-close btn-close-white"
                  @click="cerrarPreguntasFrecuentes"
                  aria-label="Cerrar"
                ></button>
              </div>
              <div class="modal-body">
                <div class="accordion" id="faqAccordion">
                  <!-- FAQ 1 -->
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="faq1">
                      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true">
                        <i class="bi bi-question-circle me-2 text-primary"></i>
                        ¿Cómo puedo ver el menú de mis hijos?
                      </button>
                    </h2>
                    <div id="collapse1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                      <div class="accordion-body">
                        En la página de inicio, encontrarás una sección llamada "Menú Semanal" donde podrás ver el menú general de la semana. Si tu hijo tiene un menú personalizado asignado por el nutricionista, aparecerá con una insignia verde "Con menú personalizado" y podrás hacer clic en el botón de ojo para ver los detalles.
                      </div>
                    </div>
                  </div>

                  <!-- FAQ 2 -->
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="faq2">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                        <i class="bi bi-question-circle me-2 text-primary"></i>
                        ¿Cómo agrego un nuevo hijo al sistema?
                      </button>
                    </h2>
                    <div id="collapse2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div class="accordion-body">
                        En la sección "Mis Hijos" de la página de inicio, haz clic en el botón "Agregar" o "Agregar primer estudiante". Completa el formulario con todos los datos requeridos: nombres, apellidos, cédula, fecha de nacimiento (entre 4 y 15 años), grado, sección, email, teléfono, peso, altura, grupo sanguíneo, alergias y condiciones médicas.
                      </div>
                    </div>
                  </div>

                  <!-- FAQ 3 -->
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="faq3">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
                        <i class="bi bi-question-circle me-2 text-primary"></i>
                        ¿Cómo edito la información de mi hijo?
                      </button>
                    </h2>
                    <div id="collapse3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div class="accordion-body">
                        En la lista de "Mis Hijos", haz clic en el ícono de ojo (👁️) junto al nombre de tu hijo. Se abrirá un modal con toda su información. Luego haz clic en el botón "Editar", modifica los campos necesarios y guarda los cambios.
                      </div>
                    </div>
                  </div>

                  <!-- FAQ 4 -->
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="faq4">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4">
                        <i class="bi bi-question-circle me-2 text-primary"></i>
                        ¿Qué son las recomendaciones nutricionales?
                      </button>
                    </h2>
                    <div id="collapse4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div class="accordion-body">
                        Las recomendaciones nutricionales son sugerencias personalizadas que el nutricionista asigna a tu hijo. Pueden incluir recomendaciones sobre alergias, peso, actividad física, hidratación, suplementos, etc. Las encontrarás en la página de inicio con el nombre del estudiante al que fueron asignadas.
                      </div>
                    </div>
                  </div>

                  <!-- FAQ 5 -->
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="faq5">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5">
                        <i class="bi bi-question-circle me-2 text-primary"></i>
                        ¿Qué horarios tienen las comidas?
                      </button>
                    </h2>
                    <div id="collapse5" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div class="accordion-body">
                        El sistema maneja tres comidas diarias:
                        <ul class="mt-2 mb-0">
                          <li><strong>Desayuno:</strong> 7:00 AM</li>
                          <li><strong>Almuerzo:</strong> 12:00 PM</li>
                          <li><strong>Merienda:</strong> 6:00 PM (18:00)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- FAQ 6 -->
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="faq6">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6">
                        <i class="bi bi-question-circle me-2 text-primary"></i>
                        ¿El sistema funciona los fines de semana?
                      </button>
                    </h2>
                    <div id="collapse6" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div class="accordion-body">
                        No, el menú escolar solo está disponible de lunes a viernes. Los sábados y domingos no hay servicio de comedor escolar.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="cerrarPreguntasFrecuentes"
                >
                  <i class="bi bi-x-lg me-1"></i>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="backdrop-fade">
        <div
          v-if="showPreguntasFrecuentesModal"
          class="modal-backdrop show"
          @click="cerrarPreguntasFrecuentes"
        ></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { useStudentsStore } from "@/stores/students";
import { useMenusStore } from "@/stores/menus";
import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";
import HelpButton from "@/components/common/HelpButton.vue";

const { t } = useI18n();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const studentsStore = useStudentsStore();
const menusStore = useMenusStore();

const userName = computed(
  () =>
    authStore.user?.name ||
    authStore.user?.username ||
    "Usuario"
);

// Estado
const showMenuModal = ref(false);
const showAddStudentModal = ref(false);
const showViewStudentModal = ref(false);
const selectedStudent = ref(null);
const editMode = ref(false);
const showContactoSoporteModal = ref(false);
const showPreguntasFrecuentesModal = ref(false);
const nextAppointment = ref("15/Nov");

// Datos de estudiantes desde el store
const students = computed(() => {
  return studentsStore.studentsByRepresentante.map(s => ({
    ...s,
    initials: studentsStore.initials(s.nombres + ' ' + s.apellidos),
    name: `${s.nombres} ${s.apellidos}`,
    grade: s.grado || 'Sin grado'
  }));
});

const estudiantesCount = computed(() => studentsStore.studentCount);

// Estudiantes con sus menús personalizados
const studentsWithMenus = computed(() => {
  return students.value.map(student => ({
    ...student,
    menu: menusStore.getMenuActivo(student.id)
  }));
});

// Modal para ver menú completo
const menuCompletoModalRef = ref(null);
let menuCompletoModalInstance = null;
const menuCompletoData = ref(null);
const currentStudentMenu = ref(null);

// Formulario para agregar estudiante
const newStudent = ref({
  nombres: '',
  apellidos: '',
  cedula: '',
  fechaNacimiento: '',
  grado: '',
  seccion: '',
  email: '',
  telefono: '',
  peso: '',
  altura: '',
  grupoSanguineo: '',
  alergias: '',
  condicionesMedicas: ''
});

const formErrors = ref({});

// Obtener el día actual (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
const getCurrentDayOfWeek = () => {
  const dayIndex = new Date().getDay();
  // Convertir domingo (0) a 7 para que lunes sea 1
  return dayIndex === 0 ? 7 : dayIndex;
};

const currentDayIndex = getCurrentDayOfWeek();

// Funciones para manejar estudiantes
function openAddStudentModal() {
  showAddStudentModal.value = true;
  resetForm();
}

function closeAddStudentModal() {
  showAddStudentModal.value = false;
  resetForm();
}

function resetForm() {
  newStudent.value = {
    nombres: '',
    apellidos: '',
    cedula: '',
    fechaNacimiento: '',
    grado: '',
    seccion: '',
    email: '',
    telefono: '',
    peso: '',
    altura: '',
    grupoSanguineo: '',
    alergias: '',
    condicionesMedicas: ''
  };
  formErrors.value = {};
}

function validateForm() {
  formErrors.value = {};
  
  if (!newStudent.value.nombres.trim()) {
    formErrors.value.nombres = 'Los nombres son obligatorios';
  }
  
  if (!newStudent.value.apellidos.trim()) {
    formErrors.value.apellidos = 'Los apellidos son obligatorios';
  }
  
  if (!newStudent.value.cedula.trim()) {
    formErrors.value.cedula = 'La cédula es obligatoria';
  } else if (!/^\d{10}$/.test(newStudent.value.cedula)) {
    formErrors.value.cedula = 'La cédula debe tener 10 dígitos';
  }
  
  if (!newStudent.value.fechaNacimiento) {
    formErrors.value.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
  } else {
    // Validar edad entre 4 y 15 años
    const fechaNac = new Date(newStudent.value.fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    if (edad < 4 || edad > 15) {
      formErrors.value.fechaNacimiento = 'La fecha de nacimiento no está en el rango de edad establecido de 4 a 15 años';
    }
  }
  
  if (!newStudent.value.grado.trim()) {
    formErrors.value.grado = 'El grado es obligatorio';
  }
  
  if (!newStudent.value.seccion.trim()) {
    formErrors.value.seccion = 'La sección es obligatoria';
  }
  
  if (!newStudent.value.email.trim()) {
    formErrors.value.email = 'El email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.value.email)) {
    formErrors.value.email = 'El email no es válido';
  }
  
  if (!newStudent.value.telefono.trim()) {
    formErrors.value.telefono = 'El teléfono es obligatorio';
  }
  
  if (!newStudent.value.peso || newStudent.value.peso <= 0) {
    formErrors.value.peso = 'El peso es obligatorio y debe ser mayor a 0';
  }
  
  if (!newStudent.value.altura || newStudent.value.altura <= 0) {
    formErrors.value.altura = 'La altura es obligatoria y debe ser mayor a 0';
  }
  
  if (!newStudent.value.grupoSanguineo.trim()) {
    formErrors.value.grupoSanguineo = 'El grupo sanguíneo es obligatorio';
  }
  
  return Object.keys(formErrors.value).length === 0;
}

function handleAddStudent() {
  if (!validateForm()) {
    notificationStore.error('Por favor completa todos los campos obligatorios');
    return;
  }
  
  try {
    studentsStore.addStudent(newStudent.value);
    notificationStore.success('Estudiante agregado exitosamente');
    closeAddStudentModal();
  } catch (error) {
    notificationStore.error('Error al agregar estudiante: ' + error.message);
  }
}

// Funciones para ver/editar estudiante
function openViewStudentModal(student) {
  // Buscar el estudiante completo del store
  const fullStudent = studentsStore.allStudents.find(s => s.id === student.id);
  selectedStudent.value = { ...fullStudent };
  editMode.value = false;
  formErrors.value = {};
  showViewStudentModal.value = true;
}

function closeViewStudentModal() {
  showViewStudentModal.value = false;
  selectedStudent.value = null;
  editMode.value = false;
  formErrors.value = {};
}

function toggleEditMode() {
  editMode.value = true;
}

function cancelEdit() {
  // Recargar los datos originales del estudiante
  const fullStudent = studentsStore.allStudents.find(s => s.id === selectedStudent.value.id);
  selectedStudent.value = { ...fullStudent };
  editMode.value = false;
  formErrors.value = {};
}

function validateStudentForm(student) {
  formErrors.value = {};
  
  if (!student.nombres.trim()) {
    formErrors.value.nombres = 'Los nombres son obligatorios';
  }
  
  if (!student.apellidos.trim()) {
    formErrors.value.apellidos = 'Los apellidos son obligatorios';
  }
  
  if (!student.cedula.trim()) {
    formErrors.value.cedula = 'La cédula es obligatoria';
  } else if (!/^\d{10}$/.test(student.cedula)) {
    formErrors.value.cedula = 'La cédula debe tener 10 dígitos';
  }
  
  if (!student.fechaNacimiento) {
    formErrors.value.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
  } else {
    // Validar edad entre 4 y 15 años
    const fechaNac = new Date(student.fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    if (edad < 4 || edad > 15) {
      formErrors.value.fechaNacimiento = 'La fecha de nacimiento no está en el rango de edad establecido de 4 a 15 años';
    }
  }
  
  if (!student.grado.trim()) {
    formErrors.value.grado = 'El grado es obligatorio';
  }
  
  if (!student.seccion.trim()) {
    formErrors.value.seccion = 'La sección es obligatoria';
  }
  
  if (!student.email.trim()) {
    formErrors.value.email = 'El email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
    formErrors.value.email = 'El email no es válido';
  }
  
  if (!student.telefono.trim()) {
    formErrors.value.telefono = 'El teléfono es obligatorio';
  }
  
  if (!student.peso || student.peso <= 0) {
    formErrors.value.peso = 'El peso es obligatorio y debe ser mayor a 0';
  }
  
  if (!student.altura || student.altura <= 0) {
    formErrors.value.altura = 'La altura es obligatoria y debe ser mayor a 0';
  }
  
  if (!student.grupoSanguineo.trim()) {
    formErrors.value.grupoSanguineo = 'El grupo sanguíneo es obligatorio';
  }
  
  return Object.keys(formErrors.value).length === 0;
}

function handleUpdateStudent() {
  if (!validateStudentForm(selectedStudent.value)) {
    notificationStore.error('Por favor completa todos los campos obligatorios correctamente');
    return;
  }
  
  try {
    studentsStore.updateStudent(selectedStudent.value.id, selectedStudent.value);
    notificationStore.success('Estudiante actualizado exitosamente');
    closeViewStudentModal();
  } catch (error) {
    notificationStore.error('Error al actualizar estudiante: ' + error.message);
  }
}

// Funciones para menús
function getInitials(student) {
  const firstInitial = student.nombres.charAt(0).toUpperCase();
  const lastInitial = student.apellidos.charAt(0).toUpperCase();
  return firstInitial + lastInitial;
}

function getAvatarColor(id) {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#FFD93D",
  ];
  const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

function formatDateShort(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-VE", { day: "2-digit", month: "short" });
}

function verMenuCompleto(student) {
  currentStudentMenu.value = student;
  menuCompletoData.value = student.menu;
  menuCompletoModalInstance?.show();
}

function verMenuPredeterminado() {
  notificationStore.info(
    "El menú predeterminado se muestra en la sección inferior de esta página"
  );
}

function getComidaById(id) {
  return menusStore.comidas.find((c) => c.id === id);
}

function getDiaNombre(key) {
  const dias = {
    lunes: "Lunes",
    martes: "Martes",
    miercoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes",
  };
  return dias[key] || key;
}

// Funciones para ayuda rápida
function abrirContactoSoporte() {
  showContactoSoporteModal.value = true;
}

function cerrarContactoSoporte() {
  showContactoSoporteModal.value = false;
}

function abrirPreguntasFrecuentes() {
  showPreguntasFrecuentesModal.value = true;
}

function cerrarPreguntasFrecuentes() {
  showPreguntasFrecuentesModal.value = false;
}

onMounted(async () => {
  studentsStore.loadStudents();
  menusStore.loadData();
  cargarAlertasNutricionista(); // Cargar alertas del nutricionista
  await nextTick();
  if (menuCompletoModalRef.value) {
    menuCompletoModalInstance = new Modal(menuCompletoModalRef.value);
  }
});

// Función para obtener el nombre de la comida por ID
function getComidaNombre(comidaId) {
  if (!comidaId) return 'Sin asignar';
  const comida = menusStore.comidas.find(c => c.id === comidaId);
  return comida ? comida.nombre : 'Sin asignar';
}

// Menú semanal dinámico desde localStorage
const weeklyMenu = computed(() => {
  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  const diasNombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  
  try {
    // Cargar menú semanal actual desde localStorage
    const menuActualStr = localStorage.getItem('menu_semanal_actual');
    
    if (!menuActualStr) {
      return diasSemana.map((dia, index) => ({
        id: index + 1,
        day: diasNombres[index],
        dayIndex: index + 1,
        breakfast: 'Sin asignar',
        lunch: 'Sin asignar',
        snack: 'Sin asignar',
        isToday: false
      }));
    }
    
    const menuActual = JSON.parse(menuActualStr);
    const menuSemanal = menuActual.menu;
    
    // Determinar qué día mostrar (si es sábado/domingo, mostrar lunes de la próxima semana)
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
    
    // Si es sábado (6) o domingo (0), mostrar como si fuera lunes (día 1)
    const diaActual = (diaSemana === 0 || diaSemana === 6) ? 1 : diaSemana;
    
    return diasSemana.map((dia, index) => {
      const menuDia = menuSemanal[dia];
      const diaIndex = index + 1; // 1=Lunes, 2=Martes, etc.
      
      return {
        id: diaIndex,
        day: diasNombres[index],
        dayIndex: diaIndex,
        breakfast: menuDia?.desayuno?.descripcion || 'Sin asignar',
        lunch: menuDia?.almuerzo?.descripcion || 'Sin asignar',
        snack: menuDia?.merienda?.descripcion || 'Sin asignar',
        calories: {
          breakfast: menuDia?.desayuno?.calorias || 0,
          lunch: menuDia?.almuerzo?.calorias || 0,
          snack: menuDia?.merienda?.calorias || 0
        },
        isToday: diaActual === diaIndex
      };
    });
  } catch (error) {
    console.error('Error al cargar menú semanal:', error);
    return diasSemana.map((dia, index) => ({
      id: index + 1,
      day: diasNombres[index],
      dayIndex: index + 1,
      breakfast: 'Error al cargar',
      lunch: 'Error al cargar',
      snack: 'Error al cargar',
      isToday: false
    }));
  }
});

const notices = ref([]);

// Función para cargar alertas del nutricionista desde localStorage
function cargarAlertasNutricionista() {
  try {
    const alertasGuardadas = localStorage.getItem('alertas_notificaciones');
    if (alertasGuardadas) {
      const alertas = JSON.parse(alertasGuardadas);
      
      // Filtrar alertas enviadas (no programadas) y mapear al formato de notices
      notices.value = alertas
        .filter(alerta => alerta.estado === 'enviada')
        .map(alerta => {
          // Determinar icono y color según el tipo
          let icon, color;
          switch (alerta.tipo) {
            case 'cambio-menu':
              icon = 'bi bi-calendar-week';
              color = '#0d6efd';
              break;
            case 'alergia':
              icon = 'bi bi-exclamation-triangle-fill';
              color = '#dc3545';
              break;
            case 'recordatorio':
              icon = 'bi bi-clock-history';
              color = '#ffc107';
              break;
            case 'general':
            default:
              icon = 'bi bi-info-circle-fill';
              color = '#0dcaf0';
              break;
          }
          
          // Formatear fecha
          const fecha = new Date(alerta.fechaHora);
          const fechaFormateada = fecha.toLocaleDateString('es-VE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
          
          return {
            id: alerta.id,
            icon: icon,
            color: color,
            title: alerta.titulo,
            message: alerta.mensaje,
            date: fechaFormateada,
            tipo: alerta.tipo,
            prioridad: alerta.prioridad
          };
        })
        .sort((a, b) => {
          // Ordenar por fecha, más recientes primero
          return new Date(b.date) - new Date(a.date);
        })
        .slice(0, 5); // Mostrar solo las 5 más recientes
      
      console.log('✅ Alertas cargadas para representante:', notices.value.length);
    }
  } catch (error) {
    console.error('❌ Error al cargar alertas:', error);
    notices.value = [
      {
        id: 1,
        icon: "bi bi-info-circle-fill",
        color: "#0dcaf0",
        title: "Bienvenido",
        message: "Mantente al tanto de las notificaciones del nutricionista",
        date: new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' }),
      }
    ];
  }
}

// Computed para cargar menús personalizados de estudiantes desde localStorage
const estudiantesConMenuPersonalizado = computed(() => {
  try {
    // Obtener lista de menús personalizados desde localStorage
    const menusPersonalizados = JSON.parse(localStorage.getItem('menus_personalizados') || '[]');
    
    // Si no hay menús personalizados, retornar array vacío
    if (!menusPersonalizados || menusPersonalizados.length === 0) {
      return [];
    }
    
    // Filtrar solo los estudiantes del representante actual que tengan menú asignado
    const estudiantesDelRepresentante = students.value || [];
    const resultado = [];
    
    estudiantesDelRepresentante.forEach(estudiante => {
      // Buscar si este estudiante tiene un menú personalizado
      const menuDelEstudiante = menusPersonalizados.find(m => m.estudianteId === estudiante.id);
      
      if (menuDelEstudiante) {
        resultado.push({
          estudiante: {
            id: estudiante.id,
            nombres: estudiante.nombres,
            apellidos: estudiante.apellidos
          },
          menu: {
            fechaInicio: menuDelEstudiante.fechaInicio,
            fechaFin: menuDelEstudiante.fechaFin,
            calorias: menuDelEstudiante.calorias,
            comidas: menuDelEstudiante.comidas
          }
        });
      }
    });
    
    return resultado;
  } catch (error) {
    console.error('Error al cargar menús personalizados:', error);
    return [];
  }
});

// Función para verificar si un estudiante tiene menú personalizado
const tieneMenuPersonalizado = (estudianteId) => {
  try {
    const menusPersonalizados = JSON.parse(localStorage.getItem('menus_personalizados') || '[]');
    return menusPersonalizados.some(m => m.estudianteId === estudianteId);
  } catch (error) {
    return false;
  }
};

// Computed para cargar recomendaciones nutricionales de los estudiantes
const recomendacionesDelRepresentante = computed(() => {
  try {
    const recomendaciones = JSON.parse(localStorage.getItem('recomendaciones_nutricionales') || '[]');
    const estudiantesDelRepresentante = students.value || [];
    
    // Filtrar solo las recomendaciones de los estudiantes del representante actual
    return recomendaciones
      .filter(rec => estudiantesDelRepresentante.some(est => est.id === rec.estudianteId))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Más recientes primero
  } catch (error) {
    console.error('Error al cargar recomendaciones:', error);
    return [];
  }
});

// Funciones helper para las recomendaciones
const getPrioridadClass = (prioridad) => {
  const classes = {
    'baja': 'alert-info',
    'media': 'alert-warning',
    'alta': 'alert-danger'
  };
  return classes[prioridad] || 'alert-info';
};

const getTipoBadgeClass = (tipo) => {
  const classes = {
    'general': 'bg-primary',
    'alergias': 'bg-warning text-dark',
    'peso': 'bg-info',
    'actividad': 'bg-success',
    'hidratacion': 'bg-cyan',
    'suplementos': 'bg-purple'
  };
  return classes[tipo] || 'bg-secondary';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
};

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

.student-menu-card {
  padding: 1.5rem;
  border: 1px solid #dee2e6;
  border-radius: 0.75rem;
  background: white;
  transition: all 0.3s ease;
}

.student-menu-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.menu-content {
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
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

<HelpButton role="usuario" />

<HelpButton role="usuario" />
