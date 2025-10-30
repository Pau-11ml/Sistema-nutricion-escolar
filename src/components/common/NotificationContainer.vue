<template>
  <Teleport to="body">
    <div class="notification-container" role="region" aria-label="Notificaciones" aria-live="polite">
      <TransitionGroup name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="`alert alert-${notification.type}`"
          role="alert"
        >
          <div class="d-flex align-items-start">
            <i 
              class="bi notification-icon me-2" 
              :class="getIcon(notification.type)"
            ></i>
            <div class="flex-grow-1">
              <strong class="notification-title">{{ notification.title }}</strong>
              <p class="notification-message mb-0">{{ notification.message }}</p>
            </div>
            <button
              type="button"
              class="btn-close ms-2"
              :aria-label="$t('common.close')"
              @click="removeNotification(notification.id)"
            ></button>
          </div>
          
          <!-- Visual alert for accessibility -->
          <div 
            v-if="visualAlerts" 
            class="visual-alert-bar"
            :class="`bg-${notification.type}`"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { useAccessibilityStore } from '@/stores/accessibility'

const notificationStore = useNotificationStore()
const accessibilityStore = useAccessibilityStore()

const notifications = computed(() => notificationStore.notifications)
const visualAlerts = computed(() => accessibilityStore.visualAlerts)

function getIcon(type) {
  const icons = {
    success: 'bi-check-circle-fill',
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill'
  }
  return icons[type] || icons.info
}

function removeNotification(id) {
  notificationStore.removeNotification(id)
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  width: 100%;
}

.notification-item {
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  border-left: 4px solid currentColor;
  position: relative;
  overflow: hidden;
}

.notification-icon {
  font-size: 1.25rem;
  margin-top: 0.125rem;
}

.notification-title {
  display: block;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.9rem;
}

.visual-alert-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  animation: pulse 1s ease-in-out infinite;
}

/* Animaciones */
.notification-enter-active {
  animation: slideInRight 0.4s ease-out;
}

.notification-leave-active {
  animation: slideOutRight 0.4s ease-in;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive */
@media (max-width: 576px) {
  .notification-container {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
