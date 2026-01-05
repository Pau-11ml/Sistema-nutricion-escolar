<template>
  <div class="menu-semanal-view">
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1">
          <i class="bi bi-calendar-week me-2"></i>
          Gestión de Menú Semanal
        </h1>
        <p class="text-muted mb-0">
          Planificación nutricional para la semana escolar
        </p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="exportarPDF">
          <i class="bi bi-file-pdf me-2"></i>
          Exportar PDF
        </button>
        <button class="btn btn-primary" @click="guardarMenu">
          <i class="bi bi-save me-2"></i>
          Guardar Cambios
        </button>
      </div>
    </div>

    <!-- Selector de Semana -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-md-4">
            <label for="semanaSelect" class="form-label">
              <i class="bi bi-calendar3 me-1"></i>
              Seleccionar Semana
            </label>
            <select id="semanaSelect" v-model="semanaSeleccionada" class="form-select">
              <option v-for="semana in semanas" :key="semana.id" :value="semana.id">
                {{ semana.nombre }} ({{ semana.fechas }})
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <div>
              <span class="form-label d-block">Estado del Menú</span>
              <span class="badge fs-6" :class="estadoMenuClass">
                {{ estadoMenu }}
              </span>
            </div>
          </div>
          <div class="col-md-4">
            <div>
              <span class="form-label d-block">Calorías Promedio Diarias</span>
              <strong class="fs-5 text-primary">{{ caloriasTotales }} kcal</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs de Días -->
    <div class="card mb-4">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li v-for="dia in diasSemana" :key="dia.id" class="nav-item">
            <button
              class="nav-link"
              :class="{ active: diaActivo === dia.id }"
              type="button"
              @click="cambiarDia(dia.id)"
            >
              <i :class="dia.icon"></i>
              {{ dia.nombre }}
            </button>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <!-- Contenido del día activo -->
        <div
          v-for="dia in diasSemana"
          :key="dia.id"
          v-show="diaActivo === dia.id"
          class="tab-pane"
        >
          <h5 class="mb-4">Menú para {{ dia.nombre }} - {{ dia.fecha }}</h5>

          <!-- Desayuno -->
          <div class="comida-section mb-4">
            <div class="comida-header">
              <div class="comida-icon bg-warning">
                <i class="bi bi-sunrise-fill"></i>
              </div>
              <div>
                <h6 class="mb-0">Desayuno</h6>
                <small class="text-muted">07:00 - 08:00</small>
              </div>
            </div>
            <div class="comida-content">
              <div class="row g-3">
                <div class="col-md-8">
                  <label :for="`desayuno-${dia.id}`" class="form-label">
                    Descripción del Menú
                  </label>
                  <textarea
                    :id="`desayuno-${dia.id}`"
                    v-model="menuSemanal[dia.id].desayuno.descripcion"
                    class="form-control"
                    rows="3"
                    placeholder="Ejemplo: Avena con frutas, yogurt natural y pan integral"
                  ></textarea>
                  <div class="row g-2 mt-2">
                    <div class="col-md-3">
                      <label :for="`desayuno-proteina-${dia.id}`" class="form-label">
                        Proteína (g)
                      </label>
                      <input
                        :id="`desayuno-proteina-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].desayuno.proteina"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="15"
                      />
                    </div>
                    <div class="col-md-3">
                      <label :for="`desayuno-carbohidratos-${dia.id}`" class="form-label">
                        Carbohidratos (g)
                      </label>
                      <input
                        :id="`desayuno-carbohidratos-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].desayuno.carbohidratos"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="30"
                      />
                    </div>
                    <div class="col-md-3">
                      <label :for="`desayuno-grasas-${dia.id}`" class="form-label">
                        Grasas (g)
                      </label>
                      <input
                        :id="`desayuno-grasas-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].desayuno.grasas"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="10"
                      />
                    </div>
                    <div class="col-md-3">
                      <label :for="`desayuno-fibra-${dia.id}`" class="form-label">
                        Fibra (g)
                      </label>
                      <input
                        :id="`desayuno-fibra-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].desayuno.fibra"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <label :for="`desayuno-calorias-${dia.id}`" class="form-label">
                    Calorías (kcal)
                  </label>
                  <input
                    :id="`desayuno-calorias-${dia.id}`"
                    v-model.number="menuSemanal[dia.id].desayuno.calorias"
                    type="number"
                    class="form-control"
                    placeholder="300"
                  />
                  <label :for="`desayuno-alergenos-${dia.id}`" class="form-label mt-2">
                    Alérgenos
                  </label>
                  <select
                    :id="`desayuno-alergenos-${dia.id}`"
                    v-model="menuSemanal[dia.id].desayuno.alergenos"
                    class="form-select"
                    multiple
                  >
                    <option value="gluten">Gluten</option>
                    <option value="lactosa">Lactosa</option>
                    <option value="frutos-secos">Frutos secos</option>
                    <option value="huevo">Huevo</option>
                    <option value="soja">Soja</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Almuerzo -->
          <div class="comida-section mb-4">
            <div class="comida-header">
              <div class="comida-icon bg-danger">
                <i class="bi bi-sun-fill"></i>
              </div>
              <div>
                <h6 class="mb-0">Almuerzo</h6>
                <small class="text-muted">12:00 - 13:00</small>
              </div>
            </div>
            <div class="comida-content">
              <div class="row g-3">
                <div class="col-md-8">
                  <label :for="`almuerzo-${dia.id}`" class="form-label">
                    Descripción del Menú
                  </label>
                  <textarea
                    :id="`almuerzo-${dia.id}`"
                    v-model="menuSemanal[dia.id].almuerzo.descripcion"
                    class="form-control"
                    rows="3"
                    placeholder="Ejemplo: Pollo al horno, arroz integral, ensalada mixta y jugo natural"
                  ></textarea>
                  <div class="row g-2 mt-2">
                    <div class="col-md-3">
                      <label :for="`almuerzo-proteina-${dia.id}`" class="form-label">
                        Proteína (g)
                      </label>
                      <input
                        :id="`almuerzo-proteina-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].almuerzo.proteina"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="25"
                      />
                    </div>
                    <div class="col-md-3">
                      <label :for="`almuerzo-carbohidratos-${dia.id}`" class="form-label">
                        Carbohidratos (g)
                      </label>
                      <input
                        :id="`almuerzo-carbohidratos-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].almuerzo.carbohidratos"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="45"
                      />
                    </div>
                    <div class="col-md-3">
                      <label :for="`almuerzo-grasas-${dia.id}`" class="form-label">
                        Grasas (g)
                      </label>
                      <input
                        :id="`almuerzo-grasas-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].almuerzo.grasas"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="15"
                      />
                    </div>
                    <div class="col-md-3">
                      <label :for="`almuerzo-fibra-${dia.id}`" class="form-label">
                        Fibra (g)
                      </label>
                      <input
                        :id="`almuerzo-fibra-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].almuerzo.fibra"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="8"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <label :for="`almuerzo-calorias-${dia.id}`" class="form-label">
                    Calorías (kcal)
                  </label>
                  <input
                    :id="`almuerzo-calorias-${dia.id}`"
                    v-model.number="menuSemanal[dia.id].almuerzo.calorias"
                    type="number"
                    class="form-control"
                    placeholder="500"
                  />
                  <label :for="`almuerzo-alergenos-${dia.id}`" class="form-label mt-2">
                    Alérgenos
                  </label>
                  <select
                    :id="`almuerzo-alergenos-${dia.id}`"
                    v-model="menuSemanal[dia.id].almuerzo.alergenos"
                    class="form-select"
                    multiple
                  >
                    <option value="gluten">Gluten</option>
                    <option value="lactosa">Lactosa</option>
                    <option value="frutos-secos">Frutos secos</option>
                    <option value="huevo">Huevo</option>
                    <option value="soja">Soja</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Merienda -->
          <div class="comida-section mb-4">
            <div class="comida-header">
              <div class="comida-icon bg-success">
                <i class="bi bi-moon-stars-fill"></i>
              </div>
              <div>
                <h6 class="mb-0">Merienda</h6>
                <small class="text-muted">18:00 - 19:00</small>
              </div>
            </div>
            <div class="comida-content">
              <div class="row g-3">
                <div class="col-md-8">
                  <label :for="`merienda-${dia.id}`" class="form-label">
                    Descripción del Menú
                  </label>
                  <textarea
                    :id="`merienda-${dia.id}`"
                    v-model="menuSemanal[dia.id].merienda.descripcion"
                    class="form-control"
                    rows="3"
                    placeholder="Ejemplo: Sándwich integral, jugo natural y fruta"
                  ></textarea>
                  <div class="row g-2 mt-2">
                    <div class="col-md-3">
                      <label :for="`merienda-proteina-${dia.id}`" class="form-label">
                        Proteína (g)
                      </label>
                      <input
                        :id="`merienda-proteina-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].merienda.proteina"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="10"
                      />
                    </div>
                    <div class="col-md-3">
                      <label :for="`merienda-carbohidratos-${dia.id}`" class="form-label">
                        Carbohidratos (g)
                      </label>
                      <input
                        :id="`merienda-carbohidratos-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].merienda.carbohidratos"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="20"
                      />
                    </div>
                    <div class="col-md-3">
                      <label :for="`merienda-grasas-${dia.id}`" class="form-label">
                        Grasas (g)
                      </label>
                      <input
                        :id="`merienda-grasas-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].merienda.grasas"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="5"
                      />
                    </div>
                    <div class="col-md-3">
                      <label :for="`merienda-fibra-${dia.id}`" class="form-label">
                        Fibra (g)
                      </label>
                      <input
                        :id="`merienda-fibra-${dia.id}`"
                        v-model.number="menuSemanal[dia.id].merienda.fibra"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="3"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <label :for="`merienda-calorias-${dia.id}`" class="form-label">
                    Calorías (kcal)
                  </label>
                  <input
                    :id="`merienda-calorias-${dia.id}`"
                    v-model.number="menuSemanal[dia.id].merienda.calorias"
                    type="number"
                    class="form-control"
                    placeholder="200"
                  />
                  <label :for="`merienda-alergenos-${dia.id}`" class="form-label mt-2">
                    Alérgenos
                  </label>
                  <select
                    :id="`merienda-alergenos-${dia.id}`"
                    v-model="menuSemanal[dia.id].merienda.alergenos"
                    class="form-select"
                    multiple
                  >
                    <option value="gluten">Gluten</option>
                    <option value="lactosa">Lactosa</option>
                    <option value="frutos-secos">Frutos secos</option>
                    <option value="huevo">Huevo</option>
                    <option value="soja">Soja</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen del día -->
          <div class="alert alert-info">
            <div class="row">
              <div class="col-md-2">
                <strong>Total Calorías:</strong>
                <div class="fs-4 text-primary">{{ calcularCaloriasDia(dia.id) }} kcal</div>
              </div>
              <div class="col-md-2">
                <strong>Proteínas:</strong>
                <div class="fs-4 text-success">{{ calcularTotalMacro(dia.id, 'proteina') }}g</div>
              </div>
              <div class="col-md-2">
                <strong>Carbohidratos:</strong>
                <div class="fs-4 text-warning">{{ calcularTotalMacro(dia.id, 'carbohidratos') }}g</div>
              </div>
              <div class="col-md-2">
                <strong>Grasas:</strong>
                <div class="fs-4 text-danger">{{ calcularTotalMacro(dia.id, 'grasas') }}g</div>
              </div>
              <div class="col-md-2">
                <strong>Fibra:</strong>
                <div class="fs-4 text-info">{{ calcularTotalMacro(dia.id, 'fibra') }}g</div>
              </div>
            </div>
          </div>

          <!-- Botones de acción del día -->
          <div class="d-flex justify-content-between">
            <button class="btn btn-outline-secondary" @click="copiarDiaAnterior(dia.id)">
              <i class="bi bi-clipboard me-2"></i>
              Copiar del día anterior
            </button>
            <button class="btn btn-outline-danger" @click="limpiarDia(dia.id)">
              <i class="bi bi-x-circle me-2"></i>
              Limpiar día
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Accesos Rápidos -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-lightning me-2"></i>
          Accesos Rápidos
        </h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <button class="btn btn-outline-success btn-lg w-100" @click="abrirModalRecordatorio">
              <i class="bi bi-bell-fill me-2"></i>
              Crear Recordatorio
            </button>
          </div>
          <div class="col-md-4">
            <button class="btn btn-outline-info btn-lg w-100" @click="verEstudiantes">
              <i class="bi bi-people-fill me-2"></i>
              Ver Estudiantes
            </button>
          </div>
          <div class="col-md-4">
            <button class="btn btn-outline-primary btn-lg w-100" @click="verDashboard">
              <i class="bi bi-speedometer2 me-2"></i>
              Ir al Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista Resumen Semanal -->
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">
          <i class="bi bi-table me-2"></i>
          Resumen Semanal
        </h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Día</th>
                <th>Desayuno</th>
                <th>Almuerzo</th>
                <th>Merienda</th>
                <th>Total Calorías</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dia in diasSemana" :key="dia.id">
                <td><strong>{{ dia.nombre }}</strong></td>
                <td>
                  <small>{{ menuSemanal[dia.id].desayuno.descripcion || "Sin definir" }}</small>
                  <div class="text-muted">{{ menuSemanal[dia.id].desayuno.calorias || 0 }} kcal</div>
                </td>
                <td>
                  <small>{{ menuSemanal[dia.id].almuerzo.descripcion || "Sin definir" }}</small>
                  <div class="text-muted">{{ menuSemanal[dia.id].almuerzo.calorias || 0 }} kcal</div>
                </td>
                <td>
                  <small>{{ menuSemanal[dia.id].merienda.descripcion || "Sin definir" }}</small>
                  <div class="text-muted">{{ menuSemanal[dia.id].merienda.calorias || 0 }} kcal</div>
                </td>
                <td>
                  <strong class="text-primary">{{ calcularCaloriasDia(dia.id) }} kcal</strong>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="table-active">
                <td colspan="4"><strong>Promedio Diario</strong></td>
                <td><strong class="text-primary">{{ caloriasTotales }} kcal</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

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
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="cerrarModalRecordatorio"
              ></button>
            </div>
            <div class="modal-body">
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
                    name="prioridad-menu"
                    id="prioridad-baja-menu"
                    value="baja"
                    v-model="nuevoRecordatorio.prioridad"
                  />
                  <label class="btn btn-outline-success" for="prioridad-baja-menu">Baja</label>

                  <input
                    type="radio"
                    class="btn-check"
                    name="prioridad-menu"
                    id="prioridad-media-menu"
                    value="media"
                    v-model="nuevoRecordatorio.prioridad"
                  />
                  <label class="btn btn-outline-warning" for="prioridad-media-menu">Media</label>

                  <input
                    type="radio"
                    class="btn-check"
                    name="prioridad-menu"
                    id="prioridad-alta-menu"
                    value="alta"
                    v-model="nuevoRecordatorio.prioridad"
                  />
                  <label class="btn btn-outline-danger" for="prioridad-alta-menu">Alta</label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModalRecordatorio">
                Cancelar
              </button>
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
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/stores/notification";
import { useMenusStore } from "@/stores/menus";

const router = useRouter();
const notificationStore = useNotificationStore();
const menusStore = useMenusStore();

// Función para generar semanas dinámicamente (solo futuras y actual)
function generarSemanas() {
  const semanasArray = [];
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Resetear horas para comparación exacta
  
  // Obtener el lunes de la semana actual
  const diaSemana = hoy.getDay();
  const diasHastaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  const lunesActual = new Date(hoy);
  lunesActual.setDate(hoy.getDate() + diasHastaLunes);
  
  // Generar 4 semanas desde la actual
  for (let i = 0; i < 4; i++) {
    const inicioSemana = new Date(lunesActual);
    inicioSemana.setDate(lunesActual.getDate() + (i * 7));
    
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 4);
    
    const formatoFecha = (fecha) => {
      const dia = fecha.getDate();
      const mes = fecha.toLocaleDateString('es-ES', { month: 'short' });
      return `${dia} ${mes}`;
    };
    
    // Generar ID único basado en la fecha (formato: YYYYMMDD)
    const idSemana = `${inicioSemana.getFullYear()}${String(inicioSemana.getMonth() + 1).padStart(2, '0')}${String(inicioSemana.getDate()).padStart(2, '0')}`;
    
    semanasArray.push({
      id: idSemana,
      nombre: i === 0 ? 'Semana Actual' : `Semana ${i + 1}`,
      fechas: `${formatoFecha(inicioSemana)} - ${formatoFecha(finSemana)} ${inicioSemana.getFullYear()}`,
      inicio: inicioSemana,
    });
  }
  
  return semanasArray;
}

const semanas = ref(generarSemanas());
const semanaSeleccionada = ref(semanas.value[0]?.id || null);
const diaActivo = ref("lunes");

// Función para generar los días de la semana con fechas dinámicas (SOLO LUNES A VIERNES)
function generarDiasSemana() {
  const hoy = new Date();
  const diaSemana = hoy.getDay();
  
  // Si es domingo (0), usar el lunes siguiente
  // Si es sábado (6), usar el lunes siguiente
  let diasHastaLunes;
  if (diaSemana === 0) {
    // Domingo - ir al lunes siguiente
    diasHastaLunes = 1;
  } else if (diaSemana === 6) {
    // Sábado - ir al lunes siguiente
    diasHastaLunes = 2;
  } else {
    // Lunes a viernes - ir al lunes de esta semana
    diasHastaLunes = 1 - diaSemana;
  }
  
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diasHastaLunes);
  
  const dias = [
    { id: "lunes", nombre: "Lunes", icon: "bi bi-calendar-day" },
    { id: "martes", nombre: "Martes", icon: "bi bi-calendar-day" },
    { id: "miercoles", nombre: "Miércoles", icon: "bi bi-calendar-day" },
    { id: "jueves", nombre: "Jueves", icon: "bi bi-calendar-day" },
    { id: "viernes", nombre: "Viernes", icon: "bi bi-calendar-day" },
  ];
  
  return dias.map((dia, index) => {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + index);
    const formatoFecha = `${fecha.getDate()} ${fecha.toLocaleDateString('es-ES', { month: 'short' })}`;
    return { ...dia, fecha: formatoFecha };
  });
}

const diasSemana = ref(generarDiasSemana());

// Función para cargar el menú desde localStorage
function cargarMenuDesdeStorage() {
  const menuGuardado = localStorage.getItem(`menu_semanal_${semanaSeleccionada.value}`);
  if (menuGuardado) {
    try {
      const menuParseado = JSON.parse(menuGuardado);
      // Fusionar con la estructura por defecto para asegurar que todos los campos existen
      Object.keys(menuSemanal.value).forEach(dia => {
        if (menuParseado[dia]) {
          menuSemanal.value[dia] = {
            ...menuSemanal.value[dia],
            ...menuParseado[dia],
            desayuno: { ...menuSemanal.value[dia].desayuno, ...menuParseado[dia].desayuno },
            almuerzo: { ...menuSemanal.value[dia].almuerzo, ...menuParseado[dia].almuerzo },
            merienda: { ...menuSemanal.value[dia].merienda, ...menuParseado[dia].merienda },
          };
        }
      });
    } catch (error) {
      console.error('Error al cargar el menú:', error);
    }
  }
}

// Función para resetear el menú a valores vacíos
function resetearMenu() {
  menuSemanal.value = {
    lunes: {
      desayuno: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
      almuerzo: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
      merienda: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    },
    martes: {
      desayuno: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
      almuerzo: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
      merienda: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    },
    miercoles: {
      desayuno: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
      almuerzo: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
      merienda: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    },
    jueves: {
      desayuno: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
      almuerzo: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
      merienda: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    },
    viernes: {
      desayuno: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
      almuerzo: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
      merienda: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    },
  };
}

const menuSemanal = ref({
  lunes: {
    desayuno: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    almuerzo: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    merienda: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
  },
  martes: {
    desayuno: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    almuerzo: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    merienda: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
  },
  miercoles: {
    desayuno: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    almuerzo: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    merienda: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
  },
  jueves: {
    desayuno: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    almuerzo: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    merienda: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
  },
  viernes: {
    desayuno: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    almuerzo: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
    merienda: { descripcion: "", calorias: 0, alergenos: [], proteina: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
  },
});

const estadoMenu = computed(() => {
  const diasCompletos = diasSemana.value.filter((dia) => {
    const menu = menuSemanal.value[dia.id];
    return (
      menu.desayuno.descripcion &&
      menu.almuerzo.descripcion &&
      menu.merienda.descripcion
    );
  }).length;

  if (diasCompletos === 5) return "Completo";
  if (diasCompletos > 0) return "En Progreso";
  return "Pendiente";
});

const estadoMenuClass = computed(() => {
  const estado = estadoMenu.value;
  if (estado === "Completo") return "bg-success";
  if (estado === "En Progreso") return "bg-warning text-dark";
  return "bg-secondary";
});

const caloriasTotales = computed(() => {
  let total = 0;
  let dias = 0;

  for (const dia of diasSemana.value) {
    const calorias = calcularCaloriasDia(dia.id);
    if (calorias > 0) {
      total += calorias;
      dias++;
    }
  }

  return dias > 0 ? Math.round(total / dias) : 0;
});

function cambiarDia(diaId) {
  diaActivo.value = diaId;
}

function calcularCaloriasDia(diaId) {
  const menu = menuSemanal.value[diaId];
  return (
    (menu.desayuno.calorias || 0) +
    (menu.almuerzo.calorias || 0) +
    (menu.merienda.calorias || 0)
  );
}

function calcularTotalMacro(diaId, macro) {
  const menu = menuSemanal.value[diaId];
  return (
    (menu.desayuno[macro] || 0) +
    (menu.almuerzo[macro] || 0) +
    (menu.merienda[macro] || 0)
  );
}

function copiarDiaAnterior(diaId) {
  const indiceActual = diasSemana.value.findIndex((d) => d.id === diaId);
  if (indiceActual > 0) {
    const diaAnterior = diasSemana.value[indiceActual - 1];
    menuSemanal.value[diaId] = structuredClone(menuSemanal.value[diaAnterior.id]);
    notificationStore.addNotification({
      type: "success",
      message: `Menú copiado desde ${diaAnterior.nombre}`,
    });
  } else {
    notificationStore.addNotification({
      type: "warning",
      message: "No hay día anterior para copiar",
    });
  }
}

function limpiarDia(diaId) {
  menuSemanal.value[diaId] = {
    desayuno: {
      descripcion: "",
      calorias: 0,
      alergenos: [],
      proteina: 0,
      carbohidratos: 0,
      grasas: 0,
      fibra: 0,
    },
    almuerzo: {
      descripcion: "",
      calorias: 0,
      alergenos: [],
      proteina: 0,
      carbohidratos: 0,
      grasas: 0,
      fibra: 0,
    },
    merienda: {
      descripcion: "",
      calorias: 0,
      alergenos: [],
      proteina: 0,
      carbohidratos: 0,
      grasas: 0,
      fibra: 0,
    },
  };
  notificationStore.addNotification({
    type: "info",
    message: "Día limpiado correctamente",
  });
}

function guardarMenu() {
  try {
    // Guardar el menú en localStorage con un ID único por semana
    const menuKey = `menu_semanal_${semanaSeleccionada.value}`;
    localStorage.setItem(menuKey, JSON.stringify(menuSemanal.value));
    
    // También guardar como "menu_semanal_actual" para acceso rápido
    localStorage.setItem('menu_semanal_actual', JSON.stringify({
      semanaId: semanaSeleccionada.value,
      menu: menuSemanal.value,
      fechaActualizacion: new Date().toISOString()
    }));

    console.log('Menú guardado exitosamente:', menuKey, menuSemanal.value);

    // Registrar actividad
    const actividades = JSON.parse(
      localStorage.getItem("actividades_nutricionista") || "[]"
    );
    const semanaActual = semanas.value.find((s) => s.id === semanaSeleccionada.value);
    actividades.unshift({
      titulo: "Menú semanal actualizado",
      descripcion: `Se actualizó el menú: ${semanaActual?.fechas || 'semana'}`,
      fecha: "Ahora mismo",
      icon: "bi bi-calendar-week",
      iconClass: "bg-success",
    });
    if (actividades.length > 10) actividades.pop();
    localStorage.setItem("actividades_nutricionista", JSON.stringify(actividades));

    notificationStore.success("Los cambios han sido guardados correctamente");
  } catch (error) {
    console.error("Error al guardar el menú:", error);
    notificationStore.error("Error al guardar los cambios. Por favor intenta nuevamente.");
  }
}

function exportarPDF() {
  notificationStore.addNotification({
    type: "info",
    message: "Exportando menú a PDF...",
  });
}

// Modal de recordatorios
const mostrarModalRecordatorio = ref(false);
const nuevoRecordatorio = ref({
  titulo: "",
  descripcion: "",
  fecha: "",
  prioridad: "media",
});

function abrirModalRecordatorio() {
  mostrarModalRecordatorio.value = true;
  nuevoRecordatorio.value = {
    titulo: "",
    descripcion: "",
    fecha: "",
    prioridad: "media",
  };
}

function cerrarModalRecordatorio() {
  mostrarModalRecordatorio.value = false;
}

function guardarRecordatorio() {
  if (
    !nuevoRecordatorio.value.titulo ||
    !nuevoRecordatorio.value.descripcion ||
    !nuevoRecordatorio.value.fecha
  ) {
    notificationStore.addNotification({
      type: "error",
      message: "Por favor completa todos los campos",
    });
    return;
  }

  // Obtener recordatorios existentes
  const recordatorios = JSON.parse(
    localStorage.getItem("recordatorios_nutricionista") || "[]"
  );

  // Formatear fecha
  const fechaFormateada = new Date(nuevoRecordatorio.value.fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Agregar nuevo recordatorio
  recordatorios.unshift({
    titulo: nuevoRecordatorio.value.titulo,
    descripcion: nuevoRecordatorio.value.descripcion,
    fecha: fechaFormateada,
    prioridad: nuevoRecordatorio.value.prioridad,
  });

  // Guardar en localStorage
  localStorage.setItem("recordatorios_nutricionista", JSON.stringify(recordatorios));

  // Registrar actividad
  const actividades = JSON.parse(
    localStorage.getItem("actividades_nutricionista") || "[]"
  );
  actividades.unshift({
    titulo: "Recordatorio creado desde Menú",
    descripcion: `Se creó el recordatorio: ${nuevoRecordatorio.value.titulo}`,
    fecha: "Ahora mismo",
    icon: "bi bi-bell-fill",
    iconClass: "bg-success",
  });
  if (actividades.length > 10) actividades.pop();
  localStorage.setItem("actividades_nutricionista", JSON.stringify(actividades));

  notificationStore.addNotification({
    type: "success",
    message: "Recordatorio agregado exitosamente",
  });

  cerrarModalRecordatorio();
}

function verEstudiantes() {
  router.push({
    name: "nutricionista-dashboard",
  });
  // Después del push, hacer scroll (esto se ejecutará cuando se cargue el dashboard)
  setTimeout(() => {
    const elemento = document.getElementById("seccion-estudiantes");
    if (elemento) {
      elemento.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, 300);
}

function verDashboard() {
  router.push({
    name: "nutricionista-dashboard",
  });
}

// Cargar datos al montar
onMounted(() => {
  menusStore.loadData();
  cargarMenuDesdeStorage();
});

// Watch para cambiar de semana
watch(semanaSeleccionada, () => {
  resetearMenu();
  cargarMenuDesdeStorage();
});
</script>

<style scoped>
.menu-semanal-view {
  padding: 0;
}

.nav-tabs .nav-link {
  color: #6c757d;
  border: none;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.nav-tabs .nav-link:hover {
  border-bottom-color: #dee2e6;
}

.nav-tabs .nav-link.active {
  color: #0d6efd;
  background: transparent;
  border-bottom-color: #0d6efd;
  font-weight: 600;
}

.comida-section {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.comida-header {
  background: #f8f9fa;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.comida-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.comida-content {
  padding: 1.5rem;
}

.table-bordered td,
.table-bordered th {
  vertical-align: middle;
}

.table-bordered small {
  display: block;
  line-height: 1.4;
}
</style>