import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMenusStore = defineStore('menus', () => {
  // Estado
  const menusSemanales = ref([]) // Menú semanal predeterminado
  const menusPersonalizados = ref([]) // Menús personalizados por estudiante
  const comidas = ref([]) // Catálogo de comidas disponibles
  
  // Getters
  const allMenusSemanales = computed(() => menusSemanales.value)
  const allMenusPersonalizados = computed(() => menusPersonalizados.value)
  const allComidas = computed(() => comidas.value)
  
  const getMenuPorEstudiante = computed(() => (estudianteId) => {
    return menusPersonalizados.value.filter(m => m.estudianteId === estudianteId)
  })
  
  const getMenuActivo = (estudianteId) => {
    const hoy = new Date()
    return menusPersonalizados.value.find(m => 
      m.estudianteId === estudianteId && 
      new Date(m.fechaInicio) <= hoy && 
      new Date(m.fechaFin) >= hoy &&
      m.activo
    )
  }
  
  // Actions
  function loadData() {
    try {
      const storedMenusSemanales = localStorage.getItem('menus_semanales')
      const storedMenusPersonalizados = localStorage.getItem('menus_personalizados')
      const storedComidas = localStorage.getItem('comidas_catalogo')
      
      if (storedMenusSemanales) {
        menusSemanales.value = JSON.parse(storedMenusSemanales)
      }
      
      if (storedMenusPersonalizados) {
        menusPersonalizados.value = JSON.parse(storedMenusPersonalizados)
      }
      
      if (storedComidas) {
        comidas.value = JSON.parse(storedComidas)
      }
    } catch (error) {
      console.error('Error al cargar datos de menús:', error)
    }
  }
  
  function saveMenusSemanales() {
    localStorage.setItem('menus_semanales', JSON.stringify(menusSemanales.value))
  }
  
  function saveMenusPersonalizados() {
    localStorage.setItem('menus_personalizados', JSON.stringify(menusPersonalizados.value))
  }
  
  function saveComidas() {
    localStorage.setItem('comidas_catalogo', JSON.stringify(comidas.value))
  }
  
  // CRUD Comidas
  function addComida(comidaData) {
    const newComida = {
      id: Date.now(),
      ...comidaData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    comidas.value.push(newComida)
    saveComidas()
    
    return newComida
  }
  
  function updateComida(id, updates) {
    const index = comidas.value.findIndex(c => c.id === id)
    if (index !== -1) {
      comidas.value[index] = {
        ...comidas.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveComidas()
      return comidas.value[index]
    }
    return null
  }
  
  function deleteComida(id) {
    const index = comidas.value.findIndex(c => c.id === id)
    if (index !== -1) {
      comidas.value.splice(index, 1)
      saveComidas()
      return true
    }
    return false
  }
  
  function getComidaById(id) {
    return comidas.value.find(c => c.id === id)
  }
  
  // CRUD Menús Personalizados
  function addMenuPersonalizado(menuData) {
    const newMenu = {
      id: Date.now(),
      ...menuData,
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    menusPersonalizados.value.push(newMenu)
    saveMenusPersonalizados()
    
    return newMenu
  }
  
  function updateMenuPersonalizado(id, updates) {
    const index = menusPersonalizados.value.findIndex(m => m.id === id)
    if (index !== -1) {
      menusPersonalizados.value[index] = {
        ...menusPersonalizados.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveMenusPersonalizados()
      return menusPersonalizados.value[index]
    }
    return null
  }
  
  function deleteMenuPersonalizado(id) {
    const index = menusPersonalizados.value.findIndex(m => m.id === id)
    if (index !== -1) {
      menusPersonalizados.value.splice(index, 1)
      saveMenusPersonalizados()
      return true
    }
    return false
  }
  
  function toggleMenuActivo(id, activo) {
    const index = menusPersonalizados.value.findIndex(m => m.id === id)
    if (index !== -1) {
      menusPersonalizados.value[index].activo = activo
      menusPersonalizados.value[index].updatedAt = new Date().toISOString()
      saveMenusPersonalizados()
      return menusPersonalizados.value[index]
    }
    return null
  }
  
  // CRUD Menú Semanal Predeterminado
  function updateMenuSemanal(dia, tipoComida, comidaId) {
    const menuIndex = menusSemanales.value.findIndex(m => m.dia === dia)
    
    if (menuIndex === -1) {
      // Crear nuevo día
      const nuevoMenu = {
        id: Date.now(),
        dia,
        desayuno: null,
        almuerzo: null,
        merienda: null,
        updatedAt: new Date().toISOString()
      }
      nuevoMenu[tipoComida] = comidaId
      menusSemanales.value.push(nuevoMenu)
    } else {
      menusSemanales.value[menuIndex][tipoComida] = comidaId
      menusSemanales.value[menuIndex].updatedAt = new Date().toISOString()
    }
    
    saveMenusSemanales()
  }
  
  function getMenuSemanalPorDia(dia) {
    return menusSemanales.value.find(m => m.dia === dia)
  }
  
  return {
    menusSemanales,
    menusPersonalizados,
    comidas,
    allMenusSemanales,
    allMenusPersonalizados,
    allComidas,
    getMenuPorEstudiante,
    getMenuActivo,
    loadData,
    addComida,
    updateComida,
    deleteComida,
    getComidaById,
    addMenuPersonalizado,
    updateMenuPersonalizado,
    deleteMenuPersonalizado,
    toggleMenuActivo,
    updateMenuSemanal,
    getMenuSemanalPorDia
  }
})
