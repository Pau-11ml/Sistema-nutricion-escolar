<template>
  <!-- Componente invisible que maneja la lectura de texto seleccionado -->
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useAccessibilityStore } from '@/stores/accessibility';

const accessibilityStore = useAccessibilityStore();

let selectionTimeout = null;

function handleTextSelection() {
  // Limpiar timeout anterior
  if (selectionTimeout) {
    clearTimeout(selectionTimeout);
  }

  // Esperar un momento para asegurar que la selección esté completa
  selectionTimeout = setTimeout(() => {
    const selectedText = window.getSelection().toString().trim();
    
    // Solo leer si hay texto seleccionado y la síntesis de voz está habilitada
    if (selectedText && accessibilityStore.speechEnabled) {
      // Si es más de una palabra o más de 10 caracteres, leerlo
      if (selectedText.length > 10 || selectedText.split(' ').length > 1) {
        accessibilityStore.speak(selectedText);
      }
    }
  }, 500); // Esperar 500ms después de que termine la selección
}

function handleMouseUp(e) {
  // Solo si no es un clic en un botón o input
  if (!['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
    handleTextSelection();
  }
}

function handleKeyUp(e) {
  // Solo si es Shift (usado para seleccionar con teclado)
  if (e.key === 'Shift') {
    handleTextSelection();
  }
}

// Atajo de teclado Ctrl+Shift+S para leer selección
function handleKeyDown(e) {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
    e.preventDefault();
    accessibilityStore.speakSelection();
  }
}

onMounted(() => {
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  if (selectionTimeout) {
    clearTimeout(selectionTimeout);
  }
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('keyup', handleKeyUp);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>
