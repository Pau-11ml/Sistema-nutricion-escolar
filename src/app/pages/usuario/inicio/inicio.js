// === INICIO ESTUDIANTE/REPRESENTANTE (versión simplificada) ===

// Función para capitalizar palabras
function capitalizar(texto) {
  return texto
    ? texto
        .toLowerCase()
        .replaceAll(/\b\w/g, (l) =>
          l.toUpperCase()
        )
    : "";
}

// Calcular edad a partir de la fecha de nacimiento
function calcularEdad(fecha) {
  const hoy = new Date();
  const nacimiento = new Date(fecha);
  let edad =
    hoy.getFullYear() - nacimiento.getFullYear();
  const mes =
    hoy.getMonth() - nacimiento.getMonth();
  if (
    mes < 0 ||
    (mes === 0 &&
      hoy.getDate() < nacimiento.getDate())
  )
    edad--;
  return edad;
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    // Obtenemos el usuario activo (el estudiante)
    const usuarioActivo = JSON.parse(
      localStorage.getItem("usuarioActivo") ||
        "{}"
    );

    // Si no hay usuario activo, redirigir al login
    if (!usuarioActivo.usuario) {
      location.href =
        "../../auth/login/login.html";
      return;
    }

    // Obtenemos todos los estudiantes (si los hay)
    const estudiantes = JSON.parse(
      localStorage.getItem("estudiantes") || "[]"
    );
    const menuSemanalStore = JSON.parse(
      localStorage.getItem("menuSemanal") || "{}"
    );

    // Buscar el estudiante por su usuario
    // Si no está en "estudiantes", usamos directamente el usuarioActivo
    let estudiante =
      estudiantes.find(
        (e) => e.usuario === usuarioActivo.usuario
      ) || usuarioActivo;

    // Elementos DOM
    const nombreEstudiante =
      document.getElementById("nombreEstudiante");
    const edadEstudiante =
      document.getElementById("edadEstudiante");
    const cursoEstudiante =
      document.getElementById("cursoEstudiante");
    const institucionEstudiante =
      document.getElementById(
        "institucionEstudiante"
      );
    const menuSemanalDiv =
      document.getElementById("menuSemanal");
    const menuSemanalStoreDiv =
      document.getElementById("menuSemanalStore");
    const btnCerrarSesion =
      document.getElementById("btnCerrarSesion");

    // Mostrar información del estudiante
    nombreEstudiante.textContent = capitalizar(
      estudiante.nombres +
        " " +
        estudiante.apellidos
    );
    edadEstudiante.textContent =
      calcularEdad(estudiante.fecha_nacimiento) +
      " años";
    cursoEstudiante.textContent =
      estudiante.curso || "No especificado";
    institucionEstudiante.textContent =
      estudiante.escuela || "Unidad Educativa";

    // Mostrar menú semanal (si existe)
    const menu =
      menuSemanalStore[estudiante.usuario];
    if (!menu || Object.keys(menu).length === 0) {
      menuSemanalDiv.innerHTML = `
      <div class="alert alert-warning">
        <i class="bi bi-exclamation-circle"></i> El nutricionista aún no ha registrado una dieta.
      </div>`;
    } else {
      menuSemanalDiv.innerHTML = `<div class="row g-3"></div>`;
      const rowDiv =
        menuSemanalDiv.querySelector(".row");

      for (const dia of Object.keys(menu)) {
        const cardDiv =
          document.createElement("div");
        cardDiv.className = "col-md-6 col-lg-4";
        cardDiv.innerHTML = `
        <div class="card shadow-sm h-100">
          <div class="card-header bg-success text-white text-center">
            <strong>${capitalizar(dia)}</strong>
          </div>
          <div class="card-body">
            <p><strong>Desayuno:</strong> ${
              menu[dia].desayuno || "-"
            }</p>
            <p><strong>Almuerzo:</strong> ${
              menu[dia].almuerzo || "-"
            }</p>
            <p><strong>Merienda:</strong> ${
              menu[dia].merienda || "-"
            }</p>
            <p><strong>Cena:</strong> ${
              menu[dia].cena || "-"
            }</p>
          </div>
        </div>`;
        rowDiv.appendChild(cardDiv);
      }
    }

    // menuSemanalStore del nutricionista (si hay)
    if (
      estudiante.menuSemanalStore &&
      estudiante.menuSemanalStore.trim() !== ""
    ) {
      menuSemanalStoreDiv.innerHTML = `
      <i class="bi bi-chat-left-text text-success"></i>
      ${estudiante.menuSemanalStore}`;
    }

    // Botón de cerrar sesión
    btnCerrarSesion?.addEventListener(
      "click",
      () => {
        localStorage.removeItem("usuarioActivo");
        location.href =
          "../../auth/login/login.html";
      }
    );
  }
);
