import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  let notificationId = 0

  function addNotification({ type = 'info', title, message, duration = 5000 }) {
    const id = ++notificationId
    const notification = {
      id,
      type,
      title,
      message,
      timestamp: Date.now()
    }
    
    notifications.value.push(notification)
    
    // Auto-remover después de la duración especificada
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function success(message, title = 'Éxito') {
    return addNotification({ type: 'success', title, message })
  }

  function error(message, title = 'Error') {
    return addNotification({ type: 'danger', title, message, duration: 7000 })
  }

  function warning(message, title = 'Advertencia') {
    return addNotification({ type: 'warning', title, message })
  }

  function info(message, title = 'Información') {
    return addNotification({ type: 'info', title, message })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }
})
