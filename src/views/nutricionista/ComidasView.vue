<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="h3 mb-3">
          <i class="bi bi-egg-fried me-2"></i>Gestión de Comidas
        </h1>
        <p class="text-muted">
          Administra el catálogo de comidas disponibles para los menús semanales
        </p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-primary">
                <i class="bi bi-collection"></i>
              </div>
              <div class="ms-3">
                <h6 class="mb-0 text-muted">Total Comidas</h6>
                <h3 class="mb-0">{{ comidas.length }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-success">
                <i class="bi bi-check-circle"></i>
              </div>
              <div class="ms-3">
                <h6 class="mb-0 text-muted">Activas</h6>
                <h3 class="mb-0">{{ comidasActivas }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-warning text-dark">
                <i class="bi bi-egg"></i>
              </div>
              <div class="ms-3">
                <h6 class="mb-0 text-muted">Desayunos</h6>
                <h3 class="mb-0">{{ comidaPorTipo.desayuno }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-info">
                <i class="bi bi-cup-straw"></i>
              </div>
              <div class="ms-3">
                <h6 class="mb-0 text-muted">Almuerzos</h6>
                <h3 class="mb-0">{{ comidaPorTipo.almuerzo }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Actions -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="Buscar comida..."
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filterTipo">
              <option value="">Todos los tipos</option>
              <option value="desayuno">Desayuno</option>
              <option value="almuerzo">Almuerzo</option>
              <option value="refrigerio">Refrigerio</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filterEstado">
              <option value="">Todos los estados</option>
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-primary w-100" @click="abrirFormularioNueva">
              <i class="bi bi-plus-circle me-2"></i>Nueva Comida
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Comidas -->
    <div class="row">
      <div
        v-for="comida in comidasFiltradas"
        :key="comida.id"
        class="col-md-6 col-lg-4 mb-4"
      >
        <div class="card comida-card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h5 class="card-title mb-0">{{ comida.nombre }}</h5>
              <span :class="['badge', comida.estado === 'activa' ? 'bg-success' : 'bg-secondary']">
                {{ comida.estado }}
              </span>
            </div>

            <div class="mb-3">
              <span :class="['badge', getTipoBadgeClass(comida.tipo)]">
                <i :class="getTipoIcon(comida.tipo)"></i>
                {{ comida.tipo }}
              </span>
            </div>

            <p class="text-muted mb-3">{{ comida.descripcion }}</p>

            <!-- Información Nutricional -->
            <div class="info-nutricional mb-3">
              <h6 class="text-muted mb-2"><i class="bi bi-bar-chart me-1"></i>Información Nutricional</h6>
              <div class="row g-2">
                <div class="col-6">
                  <small class="text-muted">Calorías:</small>
                  <strong class="d-block">{{ comida.calorias }} kcal</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted">Proteínas:</small>
                  <strong class="d-block">{{ comida.proteinas }}g</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted">Carbohidratos:</small>
                  <strong class="d-block">{{ comida.carbohidratos }}g</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted">Grasas:</small>
                  <strong class="d-block">{{ comida.grasas }}g</strong>
                </div>
              </div>
            </div>

            <!-- Ingredientes -->
            <div class="mb-3" v-if="comida.ingredientes && comida.ingredientes.length > 0">
              <small class="text-muted d-block mb-1">
                <i class="bi bi-list-check me-1"></i>Ingredientes:
              </small>
              <div class="d-flex flex-wrap gap-1">
                <span
                  v-for="ingrediente in comida.ingredientes"
                  :key="ingrediente"
                  class="badge bg-light text-dark"
                >
                  {{ ingrediente }}
                </span>
              </div>
            </div>

            <!-- Acciones -->
            <div class="d-grid gap-2">
              <button class="btn btn-outline-primary btn-sm" @click="editarComida(comida)">
                <i class="bi bi-pencil me-2"></i>Editar
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="eliminarComida(comida)"
              >
                <i class="bi bi-trash me-2"></i>Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="comidasFiltradas.length === 0" class="col-12">
        <div class="alert alert-info text-center">
          <i class="bi bi-info-circle me-2"></i>
          No se encontraron comidas con los filtros seleccionados
        </div>
      </div>
    </div>

    <!-- Modal Formulario -->
    <div
      class="modal fade"
      :class="{ show: mostrarModal }"
      :style="{ display: mostrarModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-egg-fried me-2"></i>
              {{ comidaEditando ? 'Editar Comida' : 'Nueva Comida' }}
            </h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarComida">
              <div class="row g-3">
                <div class="col-md-8">
                  <label class="form-label required">Nombre</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formulario.nombre"
                    required
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label required">Tipo</label>
                  <select class="form-select" v-model="formulario.tipo" required>
                    <option value="">Seleccione...</option>
                    <option value="desayuno">Desayuno</option>
                    <option value="almuerzo">Almuerzo</option>
                    <option value="refrigerio">Refrigerio</option>
                  </select>
                </div>

                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    v-model="formulario.descripcion"
                  ></textarea>
                </div>

                <div class="col-12">
                  <h6 class="border-bottom pb-2">Información Nutricional</h6>
                </div>

                <div class="col-md-3">
                  <label class="form-label required">Calorías (kcal)</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="formulario.calorias"
                    min="0"
                    required
                  />
                </div>
                <div class="col-md-3">
                  <label class="form-label required">Proteínas (g)</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="formulario.proteinas"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
                <div class="col-md-3">
                  <label class="form-label required">Carbohidratos (g)</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="formulario.carbohidratos"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
                <div class="col-md-3">
                  <label class="form-label required">Grasas (g)</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="formulario.grasas"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div class="col-12">
                  <label class="form-label">Ingredientes (separados por coma)</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="ingredientesTexto"
                    placeholder="Ej: Arroz, Pollo, Ensalada"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label required">Estado</label>
                  <select class="form-select" v-model="formulario.estado" required>
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModal">
              Cancelar
            </button>
            <button type="button" class="btn btn-primary" @click="guardarComida">
              <i class="bi bi-save me-2"></i>Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="mostrarModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

// Estado
const searchQuery = ref('')
const filterTipo = ref('')
const filterEstado = ref('')
const mostrarModal = ref(false)
const comidaEditando = ref(null)
const ingredientesTexto = ref('')

// Datos de ejemplo
const comidas = ref([
  {
    id: 1,
    nombre: 'Desayuno Continental',
    tipo: 'desayuno',
    descripcion: 'Pan integral con huevo revuelto y jugo natural',
    calorias: 350,
    proteinas: 15,
    carbohidratos: 45,
    grasas: 12,
    ingredientes: ['Pan integral', 'Huevo', 'Naranja', 'Leche'],
    estado: 'activa'
  },
  {
    id: 2,
    nombre: 'Almuerzo Balanceado',
    tipo: 'almuerzo',
    descripcion: 'Arroz, pollo a la plancha con ensalada mixta',
    calorias: 550,
    proteinas: 35,
    carbohidratos: 65,
    grasas: 18,
    ingredientes: ['Arroz', 'Pollo', 'Lechuga', 'Tomate', 'Zanahoria'],
    estado: 'activa'
  },
  {
    id: 3,
    nombre: 'Refrigerio Saludable',
    tipo: 'refrigerio',
    descripcion: 'Fruta picada con yogurt natural',
    calorias: 180,
    proteinas: 8,
    carbohidratos: 28,
    grasas: 5,
    ingredientes: ['Manzana', 'Plátano', 'Yogurt', 'Granola'],
    estado: 'activa'
  }
])

// Formulario
const formulario = ref({
  nombre: '',
  tipo: '',
  descripcion: '',
  calorias: 0,
  proteinas: 0,
  carbohidratos: 0,
  grasas: 0,
  ingredientes: [],
  estado: 'activa'
})

// Computadas
const comidasActivas = computed(() => 
  comidas.value.filter(c => c.estado === 'activa').length
)

const comidaPorTipo = computed(() => ({
  desayuno: comidas.value.filter(c => c.tipo === 'desayuno').length,
  almuerzo: comidas.value.filter(c => c.tipo === 'almuerzo').length,
  refrigerio: comidas.value.filter(c => c.tipo === 'refrigerio').length
}))

const comidasFiltradas = computed(() => {
  return comidas.value.filter(comida => {
    const matchSearch = comida.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchTipo = !filterTipo.value || comida.tipo === filterTipo.value
    const matchEstado = !filterEstado.value || comida.estado === filterEstado.value
    return matchSearch && matchTipo && matchEstado
  })
})

// Funciones
function getTipoBadgeClass(tipo) {
  const classes = {
    desayuno: 'bg-warning text-dark',
    almuerzo: 'bg-primary',
    refrigerio: 'bg-info'
  }
  return classes[tipo] || 'bg-secondary'
}

function getTipoIcon(tipo) {
  const icons = {
    desayuno: 'bi bi-egg',
    almuerzo: 'bi bi-cup-straw',
    refrigerio: 'bi bi-basket'
  }
  return icons[tipo] || 'bi bi-circle'
}

function abrirFormularioNueva() {
  comidaEditando.value = null
  formulario.value = {
    nombre: '',
    tipo: '',
    descripcion: '',
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
    ingredientes: [],
    estado: 'activa'
  }
  ingredientesTexto.value = ''
  mostrarModal.value = true
}

function editarComida(comida) {
  comidaEditando.value = comida
  formulario.value = { ...comida }
  ingredientesTexto.value = comida.ingredientes?.join(', ') || ''
  mostrarModal.value = true
}

function guardarComida() {
  // Procesar ingredientes
  if (ingredientesTexto.value) {
    formulario.value.ingredientes = ingredientesTexto.value
      .split(',')
      .map(i => i.trim())
      .filter(i => i)
  }

  if (comidaEditando.value) {
    // Actualizar
    const index = comidas.value.findIndex(c => c.id === comidaEditando.value.id)
    if (index !== -1) {
      comidas.value[index] = { ...formulario.value, id: comidaEditando.value.id }
      notificationStore.addNotification({
        type: 'success',
        message: 'Comida actualizada correctamente'
      })
    }
  } else {
    // Crear nueva
    const nuevaComida = {
      ...formulario.value,
      id: Date.now()
    }
    comidas.value.push(nuevaComida)
    notificationStore.addNotification({
      type: 'success',
      message: 'Comida creada correctamente'
    })
  }

  cerrarModal()
}

function eliminarComida(comida) {
  if (confirm(`¿Está seguro de eliminar la comida "${comida.nombre}"?`)) {
    const index = comidas.value.findIndex(c => c.id === comida.id)
    if (index !== -1) {
      comidas.value.splice(index, 1)
      notificationStore.addNotification({
        type: 'success',
        message: 'Comida eliminada correctamente'
      })
    }
  }
}

function cerrarModal() {
  mostrarModal.value = false
  comidaEditando.value = null
}
</script>

<style scoped>
.stat-card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.comida-card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.comida-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.info-nutricional {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.required::after {
  content: ' *';
  color: #dc3545;
}

.modal.show {
  background: rgba(0, 0, 0, 0.5);
}
</style>
