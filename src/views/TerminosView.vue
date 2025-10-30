<template>
  <div class="terms-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="card shadow">
            <div class="card-header">
              <h1 class="h3 mb-0">
                <i class="bi bi-file-text me-2"></i>
                Términos de Uso
              </h1>
            </div>
            <div class="card-body p-4">
              <div class="content">
                <p class="text-muted"><em>Última actualización: 29 de octubre de 2025</em></p>

                <h2 class="h5 mt-4 mb-3">1. Aceptación de los Términos</h2>
                <p>
                  Al acceder y utilizar el Sistema de Nutrición Escolar ("el Sistema"), usted acepta 
                  estar sujeto a estos Términos de Uso. Si no está de acuerdo con estos términos, 
                  no debe utilizar el Sistema.
                </p>

                <h2 class="h5 mt-4 mb-3">2. Uso del Sistema</h2>
                <p>
                  El Sistema está diseñado para facilitar la gestión nutricional en instituciones 
                  educativas. Los usuarios se comprometen a:
                </p>
                <ul>
                  <li>Proporcionar información precisa y actualizada</li>
                  <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                  <li>No compartir su cuenta con terceros</li>
                  <li>Utilizar el Sistema únicamente para los fines autorizados</li>
                  <li>No intentar acceder a áreas no autorizadas del Sistema</li>
                </ul>

                <h2 class="h5 mt-4 mb-3">3. Roles y Responsabilidades</h2>
                
                <h3 class="h6 mt-3 mb-2">3.1 Administradores</h3>
                <p>
                  Los administradores tienen acceso completo al Sistema y son responsables de:
                </p>
                <ul>
                  <li>Gestionar usuarios y permisos</li>
                  <li>Configurar parámetros del sistema</li>
                  <li>Supervisar el uso apropiado del Sistema</li>
                  <li>Mantener la seguridad e integridad de los datos</li>
                </ul>

                <h3 class="h6 mt-3 mb-2">3.2 Nutricionistas</h3>
                <p>
                  Los nutricionistas son responsables de:
                </p>
                <ul>
                  <li>Crear y actualizar menús semanales</li>
                  <li>Proporcionar recomendaciones nutricionales</li>
                  <li>Mantener registros precisos de la información nutricional</li>
                </ul>

                <h3 class="h6 mt-3 mb-2">3.3 Representantes</h3>
                <p>
                  Los representantes (padres/tutores) pueden:
                </p>
                <ul>
                  <li>Consultar información del estudiante</li>
                  <li>Ver menús semanales</li>
                  <li>Actualizar datos de contacto</li>
                  <li>Recibir notificaciones sobre el programa nutricional</li>
                </ul>

                <h2 class="h5 mt-4 mb-3">4. Privacidad y Protección de Datos</h2>
                <p>
                  La recopilación y uso de datos personales se rige por nuestra 
                  <router-link to="/politica-privacidad" class="link-primary">
                    Política de Privacidad
                  </router-link>.
                  Nos comprometemos a proteger la información personal de conformidad con 
                  las leyes aplicables de protección de datos.
                </p>

                <h2 class="h5 mt-4 mb-3">5. Seguridad</h2>
                <p>
                  El Sistema implementa medidas de seguridad para proteger la información, incluyendo:
                </p>
                <ul>
                  <li>Encriptación de datos sensibles</li>
                  <li>Autenticación segura</li>
                  <li>Bloqueo temporal después de intentos fallidos de inicio de sesión</li>
                  <li>Auditoría de accesos</li>
                </ul>

                <h2 class="h5 mt-4 mb-3">6. Propiedad Intelectual</h2>
                <p>
                  Todo el contenido, diseño, código y materiales del Sistema son propiedad de la 
                  institución educativa y están protegidos por leyes de propiedad intelectual.
                </p>

                <h2 class="h5 mt-4 mb-3">7. Limitación de Responsabilidad</h2>
                <p>
                  El Sistema se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos 
                  responsables de:
                </p>
                <ul>
                  <li>Interrupciones o errores en el servicio</li>
                  <li>Pérdida de datos debido a fallos técnicos</li>
                  <li>Uso inapropiado por parte de los usuarios</li>
                  <li>Decisiones tomadas basadas en la información del Sistema</li>
                </ul>

                <h2 class="h5 mt-4 mb-3">8. Modificaciones</h2>
                <p>
                  Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. 
                  Los cambios entrarán en vigor inmediatamente después de su publicación en el Sistema.
                </p>

                <h2 class="h5 mt-4 mb-3">9. Terminación</h2>
                <p>
                  Podemos suspender o terminar su acceso al Sistema en cualquier momento por:
                </p>
                <ul>
                  <li>Violación de estos Términos de Uso</li>
                  <li>Uso fraudulento o abusivo del Sistema</li>
                  <li>Solicitud del usuario</li>
                  <li>Requisitos legales o regulatorios</li>
                </ul>

                <h2 class="h5 mt-4 mb-3">10. Contacto</h2>
                <p>
                  Para preguntas sobre estos Términos de Uso, contacte:
                </p>
                <ul>
                  <li><strong>Email:</strong> soporte@nutricionescolar.edu</li>
                  <li><strong>Teléfono:</strong> +593 99 999 9999</li>
                </ul>

                <div class="alert alert-info mt-4">
                  <i class="bi bi-info-circle me-2"></i>
                  <strong>Nota:</strong> Al continuar utilizando el Sistema, usted acepta estos 
                  Términos de Uso y cualquier modificación futura.
                </div>
              </div>

              <div class="mt-4 d-flex gap-2">
                <button class="btn btn-primary" @click="$router.go(-1)">
                  <i class="bi bi-arrow-left me-2"></i>
                  Volver
                </button>
                <router-link to="/politica-privacidad" class="btn btn-outline-secondary">
                  <i class="bi bi-shield-check me-2"></i>
                  Ver Política de Privacidad
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No se requiere lógica adicional
</script>

<style scoped>
.terms-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.content {
  line-height: 1.8;
}

.content h2 {
  color: #0d6efd;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #e9ecef;
}

.content h2:first-of-type {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.content h3 {
  color: #495057;
}

.content ul {
  margin-left: 1.5rem;
}

.content li {
  margin-bottom: 0.5rem;
}
</style>
