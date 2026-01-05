import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAccessibilityStore = defineStore('accessibility', () => {
  // Estado
  const panelOpen = ref(false)
  const highContrast = ref(localStorage.getItem('highContrast') === 'true')
  const largeText = ref(localStorage.getItem('largeText') === 'true')
  const extraLargeText = ref(localStorage.getItem('extraLargeText') === 'true')
  const speechEnabled = ref(false)
  const visualAlerts = ref(localStorage.getItem('visualAlerts') === 'true')

  // Actions
  function togglePanel() {
    panelOpen.value = !panelOpen.value
  }

  function toggleHighContrast() {
    highContrast.value = !highContrast.value
    localStorage.setItem('highContrast', highContrast.value)
  }

  function setTextSize(size) {
    largeText.value = size === 'large'
    extraLargeText.value = size === 'extra-large'
    
    localStorage.setItem('largeText', largeText.value)
    localStorage.setItem('extraLargeText', extraLargeText.value)
  }

  function toggleSpeech() {
    speechEnabled.value = !speechEnabled.value
    
    if (speechEnabled.value) {
      // Inicializar síntesis de voz
      if ('speechSynthesis' in window) {
        console.log('Síntesis de voz habilitada')
      }
    }
  }

  function speak(text) {
    if (speechEnabled.value && 'speechSynthesis' in window) {
      // Cancelar cualquier lectura en curso
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      speechSynthesis.speak(utterance)
    }
  }
  
  function speakSelection() {
    if (speechEnabled.value && 'speechSynthesis' in window) {
      const selectedText = window.getSelection().toString().trim()
      if (selectedText) {
        speak(selectedText)
        return true
      }
    }
    return false
  }

  function toggleVisualAlerts() {
    visualAlerts.value = !visualAlerts.value
    localStorage.setItem('visualAlerts', visualAlerts.value)
  }

  return {
    panelOpen,
    highContrast,
    largeText,
    extraLargeText,
    speechEnabled,
    visualAlerts,
    togglePanel,
    toggleHighContrast,
    setTextSize,
    toggleSpeech,
    speak,
    speakSelection,
    toggleVisualAlerts
  }
})
