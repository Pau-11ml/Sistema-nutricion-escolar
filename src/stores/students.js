import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useStudentsStore = defineStore('students', () => {
  const authStore = useAuthStore()
  
  // Estado
  const students = ref([])
  
  // Getters
  const allStudents = computed(() => students.value)
  
  const studentsByRepresentante = computed(() => {
    if (!authStore.user) return []
    const userId = authStore.user.id || authStore.user.username
    return students.value.filter(s => s.representanteId === userId)
  })
  
  const studentCount = computed(() => studentsByRepresentante.value.length)
  
  // Actions
  function loadStudents() {
    try {
      const stored = localStorage.getItem('students')
      if (stored) {
        students.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error al cargar estudiantes:', error)
      students.value = []
    }
  }
  
  function saveStudents() {
    try {
      localStorage.setItem('students', JSON.stringify(students.value))
    } catch (error) {
      console.error('Error al guardar estudiantes:', error)
    }
  }
  
  function addStudent(studentData, representanteId = null, representanteNombre = null) {
    // Si se proporciona un representanteId (admin agrega estudiante), usarlo
    // Si no, usar el usuario actual (representante agrega su propio hijo)
    const repId = representanteId || authStore.user?.id || authStore.user?.username
    const repNombre = representanteNombre || authStore.user?.name || authStore.user?.username
    
    const newStudent = {
      id: `EST-${Date.now()}`,
      ...studentData,
      representanteId: repId,
      representanteNombre: repNombre,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    students.value.push(newStudent)
    saveStudents()
    
    return newStudent
  }
  
  function updateStudent(id, updates) {
    const index = students.value.findIndex(s => s.id === id)
    if (index !== -1) {
      students.value[index] = {
        ...students.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveStudents()
      return students.value[index]
    }
    return null
  }
  
  function deleteStudent(id) {
    const index = students.value.findIndex(s => s.id === id)
    if (index !== -1) {
      students.value.splice(index, 1)
      saveStudents()
      return true
    }
    return false
  }
  
  function getStudentById(id) {
    return students.value.find(s => s.id === id)
  }
  
  function initials(name) {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }
  
  // Cargar estudiantes al inicializar el store
  loadStudents()
  
  return {
    students,
    allStudents,
    studentsByRepresentante,
    studentCount,
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    initials
  }
})
