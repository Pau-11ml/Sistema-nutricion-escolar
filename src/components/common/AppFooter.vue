<template>
  <footer class="app-footer" role="contentinfo">
    <div class="container-fluid">
      <div class="row">
        <!-- Información institucional -->
        <div class="col-md-4 mb-3 mb-md-0">
          <h6 class="footer-title">{{ $t('footer.institutionalInfo') }}</h6>
          <p class="footer-text">
            {{ $t('common.appName') }}
          </p>
          <p class="footer-text small">
            Sistema integral para la gestión nutricional en instituciones educativas.
          </p>
        </div>

        <!-- Soporte y contacto -->
        <div class="col-md-4 mb-3 mb-md-0">
          <h6 class="footer-title">{{ $t('footer.support') }}</h6>
          <ul class="footer-links">
            <li>
              <a href="mailto:soporte@nutricionescolar.edu" class="footer-link">
                <i class="bi bi-envelope me-2"></i>
                soporte@nutricionescolar.edu
              </a>
            </li>
            <li>
              <a href="tel:+593999999999" class="footer-link">
                <i class="bi bi-telephone me-2"></i>
                +593 99 999 9999
              </a>
            </li>
            <li>
              <button class="footer-link btn-link" @click="openHelpCenter">
                <i class="bi bi-question-circle me-2"></i>
                Centro de ayuda
              </button>
            </li>
          </ul>
        </div>

        <!-- Política y términos -->
        <div class="col-md-4">
          <h6 class="footer-title">Legal</h6>
          <ul class="footer-links">
            <li>
              <router-link to="/terminos" class="footer-link">
                <i class="bi bi-file-text me-2"></i>
                {{ $t('footer.terms') }}
              </router-link>
            </li>
            <li>
              <router-link to="/politica-privacidad" class="footer-link">
                <i class="bi bi-shield-check me-2"></i>
                {{ $t('footer.privacy') }}
              </router-link>
            </li>
            <li>
              <button class="footer-link btn-link" @click="showAccessibilityInfo">
                <i class="bi bi-universal-access me-2"></i>
                Declaración de accesibilidad
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="row mt-4 pt-3 border-top">
        <div class="col text-center">
          <p class="mb-0 small text-muted">
            {{ $t('footer.copyright') }}
          </p>
          <p class="mb-0 small text-muted mt-1">
            Desarrollado con 
            <i class="bi bi-heart-fill text-danger"></i>
            para la comunidad educativa
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notification'

const { t } = useI18n()
const notificationStore = useNotificationStore()

function openHelpCenter() {
  // Abrir centro de ayuda
  window.open('/ayuda', '_blank')
}

function showAccessibilityInfo() {
  notificationStore.info(
    'Este sistema cumple con las pautas WCAG 2.1 nivel AA para garantizar la accesibilidad a todos los usuarios.',
    'Accesibilidad'
  )
}
</script>

<style scoped>
.app-footer {
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  padding: 2rem 0 1rem;
  margin-top: auto;
}

.footer-title {
  font-weight: 600;
  color: #212529;
  margin-bottom: 1rem;
}

.footer-text {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-link {
  color: #6c757d;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.footer-link:hover {
  color: #0d6efd;
}

.btn-link {
  text-align: left;
}
</style>
