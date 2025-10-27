// === Función para calcular edad ===
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
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

// === Función para obtener nombre de curso ===
function obtenerNombreCurso(curso) {
  const cursos = {
    1: "Primer grado",
    2: "Segundo grado",
    3: "Tercer grado",
    4: "Cuarto grado",
    5: "Quinto grado",
    6: "Sexto grado",
    7: "Séptimo grado",
  };
  return cursos[curso] || "No especificado";
}
document.addEventListener(
  "DOMContentLoaded",
  function () {
    // Obtener usuario activo
    const usuarioActivo = JSON.parse(
      localStorage.getItem("usuarioActivo") ||
        "{}"
    );
    let estudianteVinculado = null;

    // Si es representante, buscar estudiante vinculado
    if (
      usuarioActivo.usuario ??
      usuarioActivo.usuario.includes("_rep")
    ) {
      const representantes = JSON.parse(
        localStorage.getItem("representantes") ||
          "[]"
      );
      const rep = representantes.find(
        (r) => r.usuario === usuarioActivo.usuario
      );
      if (rep) {
        const estudiantes = JSON.parse(
          localStorage.getItem("estudiantes") ||
            "[]"
        );
        estudianteVinculado = estudiantes.find(
          (e) =>
            e.usuario === rep.estudianteUsuario
        );
      }
    }

    const infoMostrar =
      estudianteVinculado || usuarioActivo;

    if (!usuarioActivo.usuario) {
      globalThis.location.href =
        "src/app/pages/usuario/login/login.html";
      return;
    }

    const btnCerrarSesion =
      document.querySelector(
        "[aria-label='Cerrar sesión']"
      );
    const nombreUsuarioElement =
      document.getElementById("nombreUsuario");
    if (nombreUsuarioElement) {
      nombreUsuarioElement.textContent = `${usuarioActivo.nombres} ${usuarioActivo.apellidos}`;
    }

    // === Mostrar información del estudiante ===
    function mostrarInformacionNutricional() {
      const infoContainer =
        document.getElementById(
          "infoNutricional"
        );
      if (!infoContainer) return;
      const edad = calcularEdad(
        infoMostrar.fecha_nacimiento
      );
      const curso = infoMostrar.curso;

      const informacion = `
      <div class="card mb-4">
        <div class="card-header"><h5 class="card-title">Información Nutricional</h5></div>
        <div class="card-body">
          <p><strong>Nombre:</strong> ${
            infoMostrar.nombres
          } ${infoMostrar.apellidos}</p>
          <p><strong>Edad:</strong> ${edad} años</p>
          <p><strong>Curso:</strong> ${obtenerNombreCurso(
            curso
          )}</p>
          <p><strong>Representante:</strong> ${
            infoMostrar.representante ||
            "No asignado"
          }</p>
        </div>
      </div>
    `;
      infoContainer.innerHTML = informacion;
    }

    // === Mostrar menú semanal según nutricionista ===
    function mostrarMenuNutricionista(
      estudianteUsuario
    ) {
      const contenedorMenu =
        document.getElementById("menuSemanal");
      const dietas = JSON.parse(
        localStorage.getItem("dietas") || "{}"
      );
      const infoNutricional =
        dietas[estudianteUsuario];

      if (!infoNutricional) {
        contenedorMenu.innerHTML =
          "<p>No hay dieta registrada aún por el nutricionista.</p>";
        return;
      }

      let html = `<div class="card">
      <div class="card-header"><h5 class="card-title">Menú Semanal Nutricionista</h5></div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Día</th>
                <th>Desayuno</th>
                <th>Almuerzo</th>
                <th>Merienda</th>
              </tr>
            </thead>
            <tbody>`;
      for (const dia in infoNutricional.menuSemanal) {
        html += `<tr>
                 <td>${dia}</td>
                 <td>${infoNutricional.menuSemanal[dia].desayuno}</td>
                 <td>${infoNutricional.menuSemanal[dia].almuerzo}</td>
                 <td>${infoNutricional.menuSemanal[dia].merienda}</td>
               </tr>`;
      }
      html += `</tbody></table  >
           </div>
         </div>
       </div>`;

      contenedorMenu.innerHTML = html;
    }

    // === Cerrar sesión ===
    btnCerrarSesion?.addEventListener(
      "click",
      () => {
        localStorage.removeItem("usuarioActivo");
        location.href =
          "../../auth/login/login.html";
      }
    );

    // Inicializar página
    mostrarInformacionNutricional();
    mostrarMenuNutricionista(infoMostrar.usuario);
  }
);
