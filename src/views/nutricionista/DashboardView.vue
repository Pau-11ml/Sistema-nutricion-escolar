<template>
  <div class="dashboard-nutricionista">
    <!-- Encabezado de Bienvenida -->
    <div class="welcome-banner mb-4">
      <div class="row align-items-center">
        <div class="col-md-8">
          <h1 class="h3 mb-2">
            <i class="bi bi-clipboard2-pulse-fill me-2"></i>
            ¡Bienvenido/a, {{ nombreNutricionista }}!
          </h1>
          <p class="mb-0 text-white-50">
            Panel de control del nutricionista - {{ fechaActual }}
          </p>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-light" @click="goToMenuSemanal">
            <i class="bi bi-calendar-week me-2"></i>
            Gestionar Menú Semanal
          </button>
        </div>
      </div>
    </div>

  <!-- Tarjetas de Estadísticas -->
      <div class="row g-3 mb-4">
        <div class="col-xl-6 col-md-6">
          <div class="stat-card">
            <div class="stat-icon bg-primary">
              <i class="bi bi-people-fill"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ estadisticas.estudiantesAsignados }}</div>
              <div class="stat-label">Estudiantes Asignados</div>
            </div>
          </div>
        </div>
        <div class="col-xl-6 col-md-6">
          <div class="stat-card">
            <div class="stat-icon bg-warning text-dark">
              <i class="bi bi-exclamation-triangle-fill"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ estadisticas.estudiantesAlergias }}</div>
              <div class="stat-label">Con Alergias</div>
            </div>
          </div>
        </div>
      </div>

    <div class="row g-4">
      <!-- Columna Principal -->
      <div class="col-lg-8">
        <!-- Menú Semanal -->
        <div class="card mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-calendar-week me-2"></i>
              Menú Semanal
            </h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Desayuno</th>
                    <th>Almuerzo</th>
                    <th>Merienda</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="day in menuSemanalCompleto"
                    :key="day.id"
                    :class="{ 'table-active': day.isToday }"
                  >
                    <td>
                      <strong>{{ day.day }}</strong>
                      <span
                        v-if="day.isToday"
                        class="badge bg-success ms-2"
                      >
                        Hoy
                      </span>
                    </td>
                    <td>
                      {{ day.breakfast }}
                      <small v-if="day.calories.breakfast > 0" class="text-muted d-block">
                        {{ day.calories.breakfast }} kcal
                      </small>
                    </td>
                    <td>
                      {{ day.lunch }}
                      <small v-if="day.calories.lunch > 0" class="text-muted d-block">
                        {{ day.calories.lunch }} kcal
                      </small>
                    </td>
                    <td>
                      {{ day.snack }}
                      <small v-if="day.calories.snack > 0" class="text-muted d-block">
                        {{ day.calories.snack }} kcal
                      </small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="!menuSemanalCompleto || menuSemanalCompleto.length === 0" class="text-center text-muted py-4">
              <i class="bi bi-calendar-x display-4 mb-3"></i>
              <p>No hay menú semanal configurado</p>
              <button class="btn btn-primary" @click="goToMenuSemanal">
                <i class="bi bi-plus-circle me-2"></i>
                Crear Menú Semanal
              </button>
            </div>
          </div>
        </div>

        <!-- Lista Completa de Estudiantes -->
        <div class="card mb-4" id="seccion-estudiantes">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bi bi-people-fill me-2"></i>
                Todos los Estudiantes
              </h5>
              <span class="badge bg-primary">{{ estadisticas.estudiantesAsignados }}</span>
            </div>
          </div>
          <div class="card-body">
            <div v-if="estadisticas.estudiantesAsignados > 0" class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Grado</th>
                    <th>Sección</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="estudiante in cargarEstudiantes()" :key="estudiante.id">
                    <td>
                      <strong>{{
                        estudiante.name || `${estudiante.nombres || ''} ${estudiante.apellidos || ''}`
                      }}</strong>
                    </td>
                    <td>{{ estudiante.email }}</td>
                    <td>{{ estudiante.grado || 'No especificado' }}</td>
                    <td>{{ estudiante.seccion || 'No especificado' }}</td>
                    <td>
                      <span v-if="estudiante.alergias && estudiante.alergias.length > 0" class="badge bg-warning text-dark">
                        <i class="bi bi-exclamation-triangle me-1"></i>
                        Con restricciones
                      </span>
                      <span v-else class="badge bg-success">
                        <i class="bi bi-check-circle me-1"></i>
                        Normal
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="verDetalleEstudiante({
                          id: estudiante.id,
                          nombres: estudiante.nombres || estudiante.name?.split(' ')[0] || 'Sin nombre',
                          apellidos: estudiante.apellidos || estudiante.name?.split(' ').slice(1).join(' ') || 'Sin apellido',
                          grado: estudiante.grado || 'No especificado',
                          paralelo: estudiante.seccion || 'No especificado',
                        })"
                      >
                        <i class="bi bi-eye"></i> Ver
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center text-muted py-4">
              <i class="bi bi-people display-4 mb-3"></i>
              <p>No hay estudiantes registrados aún</p>
              <small>Los estudiantes aparecerán aquí cuando se registren desde administración o cuando creen cuenta</small>
            </div>
          </div>
        </div>

        <!-- Estudiantes con Restricciones -->
        <div class="card mb-4">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bi bi-exclamation-triangle me-2 text-warning"></i>
                Estudiantes con Restricciones Alimentarias
              </h5>
              <span class="badge bg-warning text-dark">{{ estudiantesConAlergias.length }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Grado</th>
                    <th>Alergias/Restricciones</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="estudiante in estudiantesConAlergias" :key="estudiante.id">
                    <td>
                      <strong>{{ estudiante.nombres }} {{ estudiante.apellidos }}</strong>
                    </td>
                    <td>{{ estudiante.grado }} {{ estudiante.paralelo }}</td>
                    <td>
                      <span
                        v-for="(alergia, index) in estudiante.alergias"
                        :key="index"
                        class="badge bg-warning text-dark me-1"
                      >
                        {{ alergia }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" @click="verDetalleEstudiante(estudiante)">
                        <i class="bi bi-eye"></i> Ver
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Asignar Menú Personalizado -->
        <div class="card mb-4">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">
              <i class="bi bi-person-plus-fill me-2"></i>
              Asignar Menú Personalizado
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="asignarMenuPersonalizado">
              <!-- Seleccionar Estudiante -->
              <div class="mb-3">
                <label class="form-label">
                  <i class="bi bi-person me-1"></i>
                  Estudiante
                </label>
                <select v-model="nuevoMenuPersonalizado.estudianteId" class="form-select" required>
                  <option value="">Seleccionar estudiante...</option>
                  <option 
                    v-for="estudiante in todosEstudiantes" 
                    :key="estudiante.id" 
                    :value="estudiante.id"
                  >
                    {{ estudiante.nombres }} {{ estudiante.apellidos }} - {{ estudiante.grado }} {{ estudiante.paralelo }}
                  </option>
                </select>
              </div>

              <!-- Fechas -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Fecha Inicio</label>
                  <input 
                    type="date" 
                    v-model="nuevoMenuPersonalizado.fechaInicio" 
                    class="form-control" 
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Fecha Fin</label>
                  <input 
                    type="date" 
                    v-model="nuevoMenuPersonalizado.fechaFin" 
                    class="form-control" 
                    required
                  />
                </div>
              </div>

              <!-- Calorías -->
              <div class="mb-3">
                <label class="form-label">
                  <i class="bi bi-fire me-1"></i>
                  Calorías Diarias
                </label>
                <input 
                  type="number" 
                  v-model.number="nuevoMenuPersonalizado.calorias" 
                  class="form-control" 
                  min="1000" 
                  max="3000" 
                  required
                />
              </div>

              <!-- Comidas del Día -->
              <div class="mb-3">
                <label class="form-label fw-bold">Plan de Comidas</label>
                
                <!-- Desayuno -->
                <div class="card mb-2">
                  <div class="card-header py-2">
                    <strong>🌅 Desayuno</strong>
                  </div>
                  <div class="card-body">
                    <div class="mb-2">
                      <label class="form-label small">Hora</label>
                      <input 
                        type="time" 
                        v-model="nuevoMenuPersonalizado.comidas.desayuno.hora" 
                        class="form-control form-control-sm"
                        required
                      />
                    </div>
                    <div class="mb-2">
                      <label class="form-label small">Calorías</label>
                      <input 
                        type="number" 
                        v-model.number="nuevoMenuPersonalizado.comidas.desayuno.calorias" 
                        class="form-control form-control-sm"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label class="form-label small">Alimentos (separados por coma)</label>
                      <textarea 
                        v-model="nuevoMenuPersonalizado.comidas.desayuno.alimentosTexto" 
                        class="form-control form-control-sm"
                        rows="2"
                        placeholder="Ej: 1 vaso de leche, 2 rebanadas de pan integral, 1 plátano"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- Almuerzo -->
                <div class="card mb-2">
                  <div class="card-header py-2">
                    <strong>🍽️ Almuerzo</strong>
                  </div>
                  <div class="card-body">
                    <div class="mb-2">
                      <label class="form-label small">Hora</label>
                      <input 
                        type="time" 
                        v-model="nuevoMenuPersonalizado.comidas.almuerzo.hora" 
                        class="form-control form-control-sm"
                        required
                      />
                    </div>
                    <div class="mb-2">
                      <label class="form-label small">Calorías</label>
                      <input 
                        type="number" 
                        v-model.number="nuevoMenuPersonalizado.comidas.almuerzo.calorias" 
                        class="form-control form-control-sm"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label class="form-label small">Alimentos (separados por coma)</label>
                      <textarea 
                        v-model="nuevoMenuPersonalizado.comidas.almuerzo.alimentosTexto" 
                        class="form-control form-control-sm"
                        rows="2"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- Merienda -->
                <div class="card mb-2">
                  <div class="card-header py-2">
                    <strong>🍎 Merienda</strong>
                  </div>
                  <div class="card-body">
                    <div class="mb-2">
                      <label class="form-label small">Hora</label>
                      <input 
                        type="time" 
                        v-model="nuevoMenuPersonalizado.comidas.merienda.hora" 
                        class="form-control form-control-sm"
                        required
                      />
                    </div>
                    <div class="mb-2">
                      <label class="form-label small">Calorías</label>
                      <input 
                        type="number" 
                        v-model.number="nuevoMenuPersonalizado.comidas.merienda.calorias" 
                        class="form-control form-control-sm"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label class="form-label small">Alimentos (separados por coma)</label>
                      <textarea 
                        v-model="nuevoMenuPersonalizado.comidas.merienda.alimentosTexto" 
                        class="form-control form-control-sm"
                        rows="2"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-success w-100">
                <i class="bi bi-check-circle me-2"></i>
                Asignar Menú Personalizado
              </button>
            </form>
          </div>
        </div>

        <!-- Lista de Menús Personalizados Activos -->
        <div class="card mb-4" v-if="menusPersonalizadosActivos.length > 0">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-list-check me-2"></i>
              Menús Personalizados Activos
            </h5>
          </div>
          <div class="card-body">
            <div class="list-group">
              <div 
                v-for="menu in menusPersonalizadosActivos" 
                :key="menu.estudianteId"
                class="list-group-item"
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="mb-1">{{ menu.estudianteNombre }}</h6>
                    <small class="text-muted">
                      <i class="bi bi-calendar me-1"></i>
                      {{ menu.fechaInicio }} - {{ menu.fechaFin }}
                    </small>
                    <br>
                    <small class="text-muted">
                      <i class="bi bi-fire me-1"></i>
                      {{ menu.calorias }} kcal/día
                    </small>
                  </div>
                  <button 
                    class="btn btn-sm btn-outline-danger"
                    @click="eliminarMenuPersonalizado(menu.estudianteId)"
                    title="Eliminar menú"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- Actividades Recientes -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-clock-history me-2"></i>
              Actividad Reciente
            </h5>
          </div>
          <div class="card-body">
            <div class="timeline">
              <div v-for="(actividad, index) in actividadesRecientes" :key="index" class="timeline-item">
                <div class="timeline-icon" :class="actividad.iconClass">
                  <i :class="actividad.icon"></i>
                </div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <strong>{{ actividad.titulo }}</strong>
                    <span class="text-muted ms-2">{{ actividad.fecha }}</span>
                  </div>
                  <p class="mb-0">{{ actividad.descripcion }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Lateral -->
      <div class="col-lg-4">
        <!-- Calendario Rápido -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-calendar3 me-2"></i>
              Calendario
            </h5>
          </div>
          <div class="card-body">
            <div class="calendar-quick">
              <div class="month-year text-center mb-3">
                <h6 class="mb-0">{{ mesAnio }}</h6>
              </div>
              <div class="info-text text-center text-muted">
                <small>Vista completa disponible en Menú Semanal</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Recordatorios -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-bell me-2"></i>
              Recordatorios
            </h5>
          </div>
          <div class="card-body">
            <div v-for="(recordatorio, index) in recordatorios" :key="index" class="recordatorio-item" :class="recordatorio.prioridad">
              <div class="d-flex">
                <div class="flex-grow-1">
                  <strong>{{ recordatorio.titulo }}</strong>
                  <p class="mb-1 small">{{ recordatorio.descripcion }}</p>
                  <small class="text-muted">
                    <i class="bi bi-calendar3 me-1"></i>
                    {{ recordatorio.fecha }}
                  </small>
                </div>
                <div>
                  <button class="btn btn-sm btn-link text-muted" @click="marcarCompletado(index)">
                    <i class="bi bi-check-circle"></i>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="recordatorios.length === 0" class="text-center text-muted py-3">
              <i class="bi bi-check-circle display-6"></i>
              <p class="mb-0">No hay recordatorios pendientes</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalle del Estudiante -->
    <Teleport to="body">
      <div
        v-if="estudianteSeleccionado"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0, 0, 0, 0.5)"
        @click.self="cerrarModal"
      >
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="bi bi-person-circle me-2"></i>
                Detalle del Estudiante
              </h5>
              <button type="button" class="btn-close btn-close-white" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="fw-bold mb-1">Nombre Completo:</div>
                  <p>{{ estudianteSeleccionado.name || `${estudianteSeleccionado.nombres || ''} ${estudianteSeleccionado.apellidos || ''}` }}</p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">Email:</div>
                  <p>{{ estudianteSeleccionado.email }}</p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">Grado:</div>
                  <p>{{ estudianteSeleccionado.grado || 'No especificado' }}</p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">Sección:</div>
                  <p>{{ estudianteSeleccionado.seccion || 'No especificado' }}</p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">Peso:</div>
                  <p>{{ estudianteSeleccionado.peso ? `${estudianteSeleccionado.peso} kg` : 'No registrado' }}</p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">Altura:</div>
                  <p>{{ estudianteSeleccionado.altura ? `${estudianteSeleccionado.altura} cm` : 'No registrado' }}</p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">Grupo Sanguíneo:</div>
                  <p>{{ estudianteSeleccionado.grupoSanguineo || 'No registrado' }}</p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">Teléfono:</div>
                  <p>{{ estudianteSeleccionado.telefono || 'No registrado' }}</p>
                </div>
                <div class="col-12">
                  <div class="fw-bold mb-1">Alergias/Restricciones Alimentarias:</div>
                  <div v-if="estudianteSeleccionado.alergias && estudianteSeleccionado.alergias.length > 0">
                    <span
                      v-for="(alergia, index) in estudianteSeleccionado.alergias"
                      :key="index"
                      class="badge bg-warning text-dark me-2 mb-2"
                    >
                      <i class="bi bi-exclamation-triangle me-1"></i>
                      {{ alergia }}
                    </span>
                  </div>
                  <p v-else class="text-muted">Sin restricciones registradas</p>
                </div>
                <div v-if="estudianteSeleccionado.condicionesMedicas" class="col-12">
                  <div class="fw-bold mb-1">Condiciones Médicas:</div>
                  <p>{{ estudianteSeleccionado.condicionesMedicas }}</p>
                </div>
                <div v-if="estudianteSeleccionado.medicamentos" class="col-12">
                  <div class="fw-bold mb-1">Medicamentos:</div>
                  <p>{{ estudianteSeleccionado.medicamentos }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de Agregar Recordatorio -->
    <Teleport to="body">
      <div
        v-if="mostrarModalRecordatorio"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0, 0, 0, 0.5)"
        @click.self="cerrarModalRecordatorio"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="bi bi-bell-fill me-2"></i>
                Nuevo Recordatorio
              </h5>
              <button type="button" class="btn-close btn-close-white" @click="cerrarModalRecordatorio"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarRecordatorio">
                <div class="mb-3">
                  <label for="titulo-recordatorio" class="form-label">Título</label>
                  <input
                    type="text"
                    class="form-control"
                    id="titulo-recordatorio"
                    v-model="nuevoRecordatorio.titulo"
                    required
                    placeholder="Ej: Revisar menú de la próxima semana"
                  />
                </div>
                <div class="mb-3">
                  <label for="descripcion-recordatorio" class="form-label">Descripción</label>
                  <textarea
                    class="form-control"
                    id="descripcion-recordatorio"
                    v-model="nuevoRecordatorio.descripcion"
                    rows="3"
                    required
                    placeholder="Describe el recordatorio..."
                  ></textarea>
                </div>
                <div class="mb-3">
                  <label for="fecha-recordatorio" class="form-label">Fecha</label>
                  <input
                    type="date"
                    class="form-control"
                    id="fecha-recordatorio"
                    v-model="nuevoRecordatorio.fecha"
                    required
                  />
                </div>
                <div class="mb-3">
                  <div class="fw-bold mb-2">Prioridad</div>
                  <div class="btn-group w-100">
                    <input
                      type="radio"
                      class="btn-check"
                      name="prioridad"
                      id="prioridad-baja"
                      value="baja"
                      v-model="nuevoRecordatorio.prioridad"
                    />
                    <label class="btn btn-outline-success" for="prioridad-baja">Baja</label>

                    <input
                      type="radio"
                      class="btn-check"
                      name="prioridad"
                      id="prioridad-media"
                      value="media"
                      v-model="nuevoRecordatorio.prioridad"
                    />
                    <label class="btn btn-outline-warning" for="prioridad-media">Media</label>

                    <input
                      type="radio"
                      class="btn-check"
                      name="prioridad"
                      id="prioridad-alta"
                      value="alta"
                      v-model="nuevoRecordatorio.prioridad"
                    />
                    <label class="btn btn-outline-danger" for="prioridad-alta">Alta</label>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModalRecordatorio">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="guardarRecordatorio">
                <i class="bi bi-save me-2"></i>
                Guardar Recordatorio
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { useStudentsStore } from "@/stores/students";
import { useMenusStore } from "@/stores/menus";
import HelpButton from "@/components/common/HelpButton.vue";

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const studentsStore = useStudentsStore();
const menusStore = useMenusStore();

// Escuchar eventos globales
const handleAbrirRecordatorioEvent = () => {
  abrirModalRecordatorio();
};

const handleVerEstadisticasEvent = () => {
  verEstadisticas();
};

const handleGenerarReportesEvent = () => {
  verReportes();
};

onMounted(() => {
  // Cargar estudiantes y menús al montar el componente
  studentsStore.loadStudents();
  menusStore.loadData();
  
  globalThis.addEventListener(
    "app:abrir-recordatorio",
    handleAbrirRecordatorioEvent
  );
  globalThis.addEventListener(
    "app:ver-estadisticas",
    handleVerEstadisticasEvent
  );
  globalThis.addEventListener(
    "app:generar-reportes",
    handleGenerarReportesEvent
  );
});

onUnmounted(() => {
  globalThis.removeEventListener(
    "app:abrir-recordatorio",
    handleAbrirRecordatorioEvent
  );
  globalThis.removeEventListener(
    "app:ver-estadisticas",
    handleVerEstadisticasEvent
  );
  globalThis.removeEventListener(
    "app:generar-reportes",
    handleGenerarReportesEvent
  );
});

const nombreNutricionista = computed(
  () => authStore.user?.name || "Nutricionista"
);

const fechaActual = computed(() => {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const diaActual = computed(() => {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
});

const mesAnio = computed(() => {
  return new Date().toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
});

// Estadísticas básicas
const estadisticas = computed(() => {
  const estudiantes = studentsStore.allStudents || [];
  const menusPersonalizados = JSON.parse(localStorage.getItem('menus_personalizados') || '[]');
  const recomendaciones = JSON.parse(localStorage.getItem('recomendaciones_nutricionales') || '[]');
  const alertas = JSON.parse(localStorage.getItem('alertas_notificaciones') || '[]');
  
  return {
    estudiantesAsignados: estudiantes.length,
    menusActivos: menusPersonalizados.length,
    recomendacionesActivas: recomendaciones.length,
    alertasPendientes: alertas.filter(a => !a.leida).length
  };
});

// Cargar estudiantes desde el store
const cargarEstudiantes = () => {
  return studentsStore.allStudents;
};


// Función para obtener el ID de la semana actual
function obtenerIdSemanaActual() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  // Obtener el lunes de la semana actual
  const diaSemana = hoy.getDay();
  const diasHastaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  const lunesActual = new Date(hoy);
  lunesActual.setDate(hoy.getDate() + diasHastaLunes);
  
  // Generar ID único basado en la fecha (formato: YYYYMMDD)
  const idSemana = `${lunesActual.getFullYear()}${String(lunesActual.getMonth() + 1).padStart(2, '0')}${String(lunesActual.getDate()).padStart(2, '0')}`;
  
  console.log('📅 ID Semana calculado:', idSemana, 'para el lunes:', lunesActual.toLocaleDateString());
  
  return idSemana;
}

// Menú de hoy (desde localStorage del MenuSemanal)
const menuHoy = computed(() => {
  const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  const diaActualIndex = new Date().getDay();
  
  console.log('🔍 Dashboard - Índice del día actual:', diaActualIndex);
  
  // Si es sábado (6) o domingo (0), no hay menú escolar
  if (diaActualIndex === 0 || diaActualIndex === 6) {
    return {
      desayuno: "No hay menú los fines de semana",
      caloriaDesayuno: 0,
      almuerzo: "No hay menú los fines de semana",
      caloriaAlmuerzo: 0,
      merienda: "No hay menú los fines de semana",
      caloriaMerienda: 0,
      caloriasTotales: 0,
    };
  }
  
  const diaActualKey = diasSemana[diaActualIndex];
  const idSemanaActual = obtenerIdSemanaActual();
  
  console.log('📅 Dashboard - Día actual:', diaActualKey);
  console.log('📅 Dashboard - ID Semana actual:', idSemanaActual);
  console.log('🔑 Dashboard - Buscando en localStorage con key:', `menu_semanal_${idSemanaActual}`);
  
  // Cargar el menú semanal desde localStorage
  const menuGuardado = localStorage.getItem(`menu_semanal_${idSemanaActual}`);
  
  console.log('💾 Dashboard - Menú guardado raw:', menuGuardado);
  
  if (menuGuardado) {
    try {
      const menuSemanal = JSON.parse(menuGuardado);
      console.log('📋 Dashboard - Menú semanal parseado:', menuSemanal);
      console.log('📋 Dashboard - Keys disponibles:', Object.keys(menuSemanal));
      
      const menuDia = menuSemanal[diaActualKey];
      console.log('🍽️ Dashboard - Menú del día [' + diaActualKey + ']:', menuDia);
      
      if (menuDia) {
        const tieneAlgunaComida = 
          (menuDia.desayuno && menuDia.desayuno.descripcion) ||
          (menuDia.almuerzo && menuDia.almuerzo.descripcion) ||
          (menuDia.merienda && menuDia.merienda.descripcion);
        
        console.log('✅ Dashboard - Tiene alguna comida:', tieneAlgunaComida);
        
        if (tieneAlgunaComida) {
          const resultado = {
            desayuno: menuDia.desayuno?.descripcion || "No definido",
            caloriaDesayuno: menuDia.desayuno?.calorias || 0,
            almuerzo: menuDia.almuerzo?.descripcion || "No definido",
            caloriaAlmuerzo: menuDia.almuerzo?.calorias || 0,
            merienda: menuDia.merienda?.descripcion || "No definido",
            caloriaMerienda: menuDia.merienda?.calorias || 0,
            caloriasTotales: 
              (menuDia.desayuno?.calorias || 0) + 
              (menuDia.almuerzo?.calorias || 0) + 
              (menuDia.merienda?.calorias || 0),
          };
          console.log('🎉 Dashboard - Retornando menú:', resultado);
          return resultado;
        }
      }
    } catch (error) {
      console.error('❌ Dashboard - Error al cargar el menú del día:', error);
    }
  } else {
    console.log('⚠️ Dashboard - No hay menú guardado en localStorage');
  }

  console.log('❌ Dashboard - Retornando menú vacío');
  return {
    desayuno: "No hay menú definido para hoy",
    caloriaDesayuno: 0,
    almuerzo: "No hay menú definido para hoy",
    caloriaAlmuerzo: 0,
    merienda: "No hay menú definido para hoy",
    caloriaMerienda: 0,
    caloriasTotales: 0,
  };
});

// Menú semanal completo para mostrar en tabla
const menuSemanalCompleto = computed(() => {
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
        calories: { breakfast: 0, lunch: 0, snack: 0 },
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
      calories: { breakfast: 0, lunch: 0, snack: 0 },
      isToday: false
    }));
  }
});

// Estudiantes con alergias (desde localStorage)
const estudiantesConAlergias = computed(() => {
  const estudiantes = cargarEstudiantes();
  return estudiantes
    .filter(
      (est) =>
        est.alergias && est.alergias.length > 0
    )
    .map((est) => ({
      id: est.id,
      nombres:
        est.nombres ||
        est.name?.split(" ")[0] ||
        "Sin nombre",
      apellidos:
        est.apellidos ||
        est.name?.split(" ").slice(1).join(" ") ||
        "Sin apellido",
      grado: est.grado || "No especificado",
      paralelo: est.seccion || "No especificado",
      alergias: Array.isArray(est.alergias)
        ? est.alergias
        : [est.alergias],
    }));
});

// Cargar actividades desde localStorage
const cargarActividades = () => {
  const actividadesGuardadas =
    localStorage.getItem(
      "actividades_nutricionista"
    );
  return actividadesGuardadas
    ? JSON.parse(actividadesGuardadas)
    : [];
};

// Guardar actividades en localStorage
const guardarActividad = (actividad) => {
  const actividades = cargarActividades();
  actividades.unshift(actividad); // Agregar al inicio
  // Mantener solo las últimas 10 actividades
  if (actividades.length > 10) {
    actividades.pop();
  }
  localStorage.setItem(
    "actividades_nutricionista",
    JSON.stringify(actividades)
  );
};

// Actividades recientes (desde localStorage)
const actividadesRecientes = ref(
  cargarActividades()
);

// Cargar recordatorios desde localStorage
const cargarRecordatorios = () => {
  const recordatoriosGuardados =
    localStorage.getItem(
      "recordatorios_nutricionista"
    );
  return recordatoriosGuardados
    ? JSON.parse(recordatoriosGuardados)
    : [];
};

// Guardar recordatorios en localStorage
const guardarRecordatoriosEnStorage = (
  recordatoriosArray
) => {
  localStorage.setItem(
    "recordatorios_nutricionista",
    JSON.stringify(recordatoriosArray)
  );
};

// Recordatorios (desde localStorage)
const recordatorios = ref(cargarRecordatorios());

// ========== MENÚS PERSONALIZADOS ==========

// Estructura para nuevo menú personalizado
const nuevoMenuPersonalizado = ref({
  estudianteId: '',
  fechaInicio: '',
  fechaFin: '',
  calorias: 1800,
  comidas: {
    desayuno: {
      hora: '07:00',
      calorias: 450,
      alimentosTexto: ''
    },
    almuerzo: {
      hora: '12:00',
      calorias: 650,
      alimentosTexto: ''
    },
    merienda: {
      hora: '18:00',
      calorias: 700,
      alimentosTexto: ''
    }
  }
});

// Computed para obtener todos los estudiantes
const todosEstudiantes = computed(() => {
  const estudiantes = cargarEstudiantes();
  return estudiantes.map(est => ({
    id: est.id,
    nombres: est.nombres || est.name?.split(' ')[0] || 'Sin nombre',
    apellidos: est.apellidos || est.name?.split(' ').slice(1).join(' ') || 'Sin apellido',
    grado: est.grado || 'No especificado',
    paralelo: est.seccion || 'No especificado'
  }));
});

// Computed para obtener menús personalizados activos
const menusPersonalizadosActivos = computed(() => {
  try {
    const menusGuardados = JSON.parse(localStorage.getItem('menus_personalizados') || '[]');
    
    return menusGuardados.map(menu => {
      const estudiante = todosEstudiantes.value.find(e => e.id === menu.estudianteId);
      return {
        estudianteId: menu.estudianteId,
        estudianteNombre: estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'Desconocido',
        fechaInicio: menu.fechaInicio,
        fechaFin: menu.fechaFin,
        calorias: menu.calorias
      };
    });
  } catch (error) {
    console.error('Error al cargar menús personalizados:', error);
    return [];
  }
});

// Función para asignar menú personalizado
function asignarMenuPersonalizado() {
  const formulario = nuevoMenuPersonalizado.value;
  
  // Validar que se haya seleccionado un estudiante
  if (!formulario.estudianteId) {
    notificationStore.error('Debes seleccionar un estudiante');
    return;
  }
  
  // Validar fechas
  if (!formulario.fechaInicio || !formulario.fechaFin) {
    notificationStore.error('Debes seleccionar las fechas de inicio y fin');
    return;
  }
  
  // Validar que la fecha de fin sea mayor que la de inicio
  if (new Date(formulario.fechaFin) < new Date(formulario.fechaInicio)) {
    notificationStore.error('La fecha de fin debe ser mayor que la de inicio');
    return;
  }
  
  // Convertir los textos de alimentos en arrays
  const menuConAlimentos = {
    estudianteId: formulario.estudianteId,
    fechaInicio: formulario.fechaInicio,
    fechaFin: formulario.fechaFin,
    calorias: formulario.calorias,
    comidas: {
      desayuno: {
        hora: formulario.comidas.desayuno.hora,
        calorias: formulario.comidas.desayuno.calorias,
        alimentos: formulario.comidas.desayuno.alimentosTexto
          .split(',')
          .map(a => a.trim())
          .filter(a => a)
      },
      almuerzo: {
        hora: formulario.comidas.almuerzo.hora,
        calorias: formulario.comidas.almuerzo.calorias,
        alimentos: formulario.comidas.almuerzo.alimentosTexto
          .split(',')
          .map(a => a.trim())
          .filter(a => a)
      },
      merienda: {
        hora: formulario.comidas.merienda.hora,
        calorias: formulario.comidas.merienda.calorias,
        alimentos: formulario.comidas.merienda.alimentosTexto
          .split(',')
          .map(a => a.trim())
          .filter(a => a)
      }
    }
  };
  
  // Obtener menús guardados
  const menusGuardados = JSON.parse(localStorage.getItem('menus_personalizados') || '[]');
  
  // Verificar si ya existe un menú para este estudiante
  const indiceExistente = menusGuardados.findIndex(m => m.estudianteId === formulario.estudianteId);
  
  if (indiceExistente !== -1) {
    // Actualizar menú existente
    menusGuardados[indiceExistente] = menuConAlimentos;
    notificationStore.success('Menú personalizado actualizado correctamente');
  } else {
    // Agregar nuevo menú
    menusGuardados.push(menuConAlimentos);
    notificationStore.success('Menú personalizado asignado correctamente');
  }
  
  // Guardar en localStorage
  localStorage.setItem('menus_personalizados', JSON.stringify(menusGuardados));
  
  // Registrar actividad
  const estudiante = todosEstudiantes.value.find(e => e.id === formulario.estudianteId);
  const nombreCompleto = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'Desconocido';
  
  guardarActividad({
    titulo: 'Menú personalizado asignado',
    descripcion: `Se asignó menú personalizado a ${nombreCompleto}`,
    fecha: 'Ahora mismo',
    icon: 'bi bi-person-check',
    iconClass: 'bg-success'
  });
  actividadesRecientes.value = cargarActividades();
  
  // Limpiar formulario
  nuevoMenuPersonalizado.value = {
    estudianteId: '',
    fechaInicio: '',
    fechaFin: '',
    calorias: 1800,
    comidas: {
      desayuno: {
        hora: '07:00',
        calorias: 450,
        alimentosTexto: ''
      },
      almuerzo: {
        hora: '12:00',
        calorias: 650,
        alimentosTexto: ''
      },
      merienda: {
        hora: '18:00',
        calorias: 700,
        alimentosTexto: ''
      }
    }
  };
}

// Función para eliminar menú personalizado
function eliminarMenuPersonalizado(estudianteId) {
  if (!confirm('¿Estás seguro de que deseas eliminar este menú personalizado?')) {
    return;
  }
  
  const menusGuardados = JSON.parse(localStorage.getItem('menus_personalizados') || '[]');
  const menusFiltrados = menusGuardados.filter(m => m.estudianteId !== estudianteId);
  
  localStorage.setItem('menus_personalizados', JSON.stringify(menusFiltrados));
  
  const estudiante = todosEstudiantes.value.find(e => e.id === estudianteId);
  const nombreCompleto = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'Desconocido';
  
  notificationStore.success('Menú personalizado eliminado correctamente');
  
  // Registrar actividad
  guardarActividad({
    titulo: 'Menú personalizado eliminado',
    descripcion: `Se eliminó el menú personalizado de ${nombreCompleto}`,
    fecha: 'Ahora mismo',
    icon: 'bi bi-trash',
    iconClass: 'bg-danger'
  });
  actividadesRecientes.value = cargarActividades();
}

// ========== FIN MENÚS PERSONALIZADOS ==========

// Variable para el modal del estudiante
const estudianteSeleccionado = ref(null);

// Variables para el modal de recordatorios
const mostrarModalRecordatorio = ref(false);
const nuevoRecordatorio = ref({
  titulo: "",
  descripcion: "",
  fecha: "",
  prioridad: "media",
});

// Funciones
function goToMenuSemanal() {
  router.push({ name: "nutricionista-menu" });
}

function verEstadisticas() {
  const estudiantes = cargarEstudiantes();

  // Calcular estadísticas detalladas
  const totalEstudiantes = estudiantes.length;
  const conAlergias = estudiantes.filter(
    (est) =>
      est.alergias && est.alergias.length > 0
  ).length;
  const sinAlergias =
    totalEstudiantes - conAlergias;

  // Agrupar por grado
  const porGrado = estudiantes.reduce(
    (acc, est) => {
      const grado =
        est.grado || "Sin especificar";
      acc[grado] = (acc[grado] || 0) + 1;
      return acc;
    },
    {}
  );

  // Alergias más comunes
  const todasAlergias = estudiantes
    .filter(
      (est) =>
        est.alergias && est.alergias.length > 0
    )
    .flatMap((est) => est.alergias);

  const alergiasCount = todasAlergias.reduce(
    (acc, alergia) => {
      acc[alergia] = (acc[alergia] || 0) + 1;
      return acc;
    },
    {}
  );

  const estadisticasDetalladas = {
    fecha: new Date().toLocaleDateString("es-ES"),
    totalEstudiantes,
    conAlergias,
    sinAlergias,
    porcentajeConAlergias:
      totalEstudiantes > 0
        ? (
            (conAlergias / totalEstudiantes) *
            100
          ).toFixed(1)
        : 0,
    distribucionPorGrado: porGrado,
    alergiasComunes: alergiasCount,
  };

  // Mostrar estadísticas en consola (para desarrollo)
  console.log(
    "📊 ESTADÍSTICAS DEL SISTEMA:",
    estadisticasDetalladas
  );

  notificationStore.addNotification({
    type: "success",
    message: `Estadísticas: ${totalEstudiantes} estudiantes, ${conAlergias} con alergias (${estadisticasDetalladas.porcentajeConAlergias}%)`,
  });

  // Registrar actividad
  guardarActividad({
    titulo: "Estadísticas consultadas",
    descripcion: `Se consultaron las estadísticas del sistema`,
    fecha: "Ahora mismo",
    icon: "bi bi-graph-up",
    iconClass: "bg-info",
  });
  actividadesRecientes.value =
    cargarActividades();
}

function verReportes() {
  const estudiantes = cargarEstudiantes();
  const fecha = new Date().toLocaleDateString(
    "es-ES"
  );

  const reporte = {
    titulo: "Reporte de Nutrición Escolar",
    fecha,
    generadoPor: nombreNutricionista.value,
    resumen: {
      totalEstudiantes: estudiantes.length,
      estudiantesConAlergias: estudiantes.filter(
        (est) =>
          est.alergias && est.alergias.length > 0
      ).length,
    },
    estudiantes: estudiantes.map((est) => ({
      nombre:
        est.name ||
        `${est.nombres} ${est.apellidos}`,
      email: est.email,
      grado: est.grado || "No especificado",
      seccion: est.seccion || "No especificado",
      alergias: est.alergias || [],
      peso: est.peso || "No registrado",
      altura: est.altura || "No registrado",
      grupoSanguineo:
        est.grupoSanguineo || "No registrado",
    })),
  };

  // Generar archivo JSON
  const dataStr = JSON.stringify(
    reporte,
    null,
    2
  );
  const dataBlob = new Blob([dataStr], {
    type: "application/json",
  });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reporte_nutricion_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);

  notificationStore.addNotification({
    type: "success",
    message:
      "Reporte generado y descargado exitosamente",
  });

  // Registrar actividad
  guardarActividad({
    titulo: "Reporte generado",
    descripcion: `Se generó el reporte de nutrición con ${estudiantes.length} estudiantes`,
    fecha: "Ahora mismo",
    icon: "bi bi-file-earmark-text",
    iconClass: "bg-success",
  });
  actividadesRecientes.value =
    cargarActividades();
}

function verDetalleEstudiante(estudiante) {
  const estudianteCompleto =
    cargarEstudiantes().find(
      (est) => est.id === estudiante.id
    );

  if (estudianteCompleto) {
    estudianteSeleccionado.value =
      estudianteCompleto;
    console.log(
      "👤 DETALLE DEL ESTUDIANTE:",
      estudianteCompleto
    );
  }
}

function cerrarModal() {
  estudianteSeleccionado.value = null;
}

function irAsignarMenuPersonalizado() {
  if (!estudianteSeleccionado.value) return;

  notificationStore.addNotification({
    type: "info",
    message: `Redirigiendo para asignar menú personalizado a ${
      estudianteSeleccionado.value.name ||
      estudianteSeleccionado.value.nombres
    }`,
  });

  // Guardar el estudiante en localStorage para usarlo en MenuSemanalView
  localStorage.setItem(
    "estudiante_menu_asignacion",
    JSON.stringify(estudianteSeleccionado.value)
  );

  cerrarModal();
  router.push({
    name: "nutricionista-menu",
    query: {
      estudianteId:
        estudianteSeleccionado.value.id,
      personalizar: "true",
    },
  });
}

function marcarCompletado(index) {
  const recordatorio = recordatorios.value[index];
  recordatorios.value.splice(index, 1);
  guardarRecordatoriosEnStorage(
    recordatorios.value
  );
  notificationStore.addNotification({
    type: "success",
    message:
      "Recordatorio marcado como completado",
  });

  // Registrar actividad
  guardarActividad({
    titulo: "Recordatorio completado",
    descripcion: `Se completó: ${recordatorio.titulo}`,
    fecha: "Ahora mismo",
    icon: "bi bi-check-circle",
    iconClass: "bg-success",
  });
  actividadesRecientes.value =
    cargarActividades();
}

function abrirModalRecordatorio() {
  mostrarModalRecordatorio.value = true;
  // Limpiar el formulario
  nuevoRecordatorio.value = {
    titulo: "",
    descripcion: "",
    fecha: "",
    prioridad: "media",
  };
}

function cerrarModalRecordatorio() {
  mostrarModalRecordatorio.value = false;
  nuevoRecordatorio.value = {
    titulo: "",
    descripcion: "",
    fecha: "",
    prioridad: "media",
  };
}

function guardarRecordatorio() {
  // Validar campos
  if (
    !nuevoRecordatorio.value.titulo ||
    !nuevoRecordatorio.value.descripcion ||
    !nuevoRecordatorio.value.fecha
  ) {
    notificationStore.addNotification({
      type: "error",
      message:
        "Por favor completa todos los campos",
    });
    return;
  }

  // Formatear fecha para mostrar
  const fechaFormateada = new Date(
    nuevoRecordatorio.value.fecha
  ).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Agregar nuevo recordatorio
  recordatorios.value.unshift({
    titulo: nuevoRecordatorio.value.titulo,
    descripcion:
      nuevoRecordatorio.value.descripcion,
    fecha: fechaFormateada,
    prioridad: nuevoRecordatorio.value.prioridad,
  });

  // Guardar en localStorage
  guardarRecordatoriosEnStorage(
    recordatorios.value
  );

  notificationStore.addNotification({
    type: "success",
    message: "Recordatorio agregado exitosamente",
  });

  cerrarModalRecordatorio();

  // Registrar actividad
  guardarActividad({
    titulo: "Recordatorio creado",
    descripcion: `Se creó el recordatorio: ${nuevoRecordatorio.value.titulo}`,
    fecha: "Ahora mismo",
    icon: "bi bi-bell-fill",
    iconClass: "bg-success",
  });

  // Actualizar la vista de actividades
  actividadesRecientes.value =
    cargarActividades();
}
</script>

<style scoped>
.dashboard-nutricionista {
  padding: 0;
}

.welcome-banner {
  background: linear-gradient(
    135deg,
    #3a4ab3 0%,
    #442660 100%
  );
  padding: 2rem;
  border-radius: 12px;
  color: #f8f9fa;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.stat-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-primary);
  opacity: 0.8;
  font-weight: 500;
}

.menu-hoy {
  padding: 0;
}

.menu-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  align-items: flex-start;
}

.menu-item-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  color: white;
}

.menu-item-content {
  flex: 1;
}

.menu-item-content h6 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
}

.menu-item-content p {
  color: var(--text-primary) !important;
  font-size: 0.9rem;
}

.menu-item-content small {
  color: var(--text-primary) !important;
  opacity: 0.7;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-item::before {
  content: "";
  position: absolute;
  left: -1.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.timeline-icon {
  position: absolute;
  left: -2rem;
  top: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #212529;
  font-size: 0.875rem;
  text-shadow: none;
}

.timeline-content {
  background: var(--bg-secondary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.timeline-content strong,
.timeline-content p {
  color: var(--text-primary) !important;
}

.timeline-content .text-muted {
  color: var(--text-primary) !important;
  opacity: 0.7;
}

.timeline-header {
  margin-bottom: 0.25rem;
}

.recordatorio-item {
  padding: 0.75rem;
  border-left: 3px solid #dee2e6;
  background: var(--bg-secondary);
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.recordatorio-item strong,
.recordatorio-item p,
.recordatorio-item small {
  color: var(--text-primary) !important;
}

.recordatorio-item .text-muted {
  opacity: 0.7;
}

.recordatorio-item.alta {
  border-left-color: #dc3545;
}

.recordatorio-item.media {
  border-left-color: #ffc107;
}

.recordatorio-item.baja {
  border-left-color: #17a2b8;
}

.calendar-quick {
  text-align: center;
}

.month-year {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.info-text {
  color: var(--text-primary) !important;
  opacity: 0.7;
}
</style>

<HelpButton role="nutricionista" />
