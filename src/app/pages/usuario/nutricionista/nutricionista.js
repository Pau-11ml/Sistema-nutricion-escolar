function capitalizar(texto) {
  return texto
    .toLowerCase()
    .replaceAll(/\b\w/g, (l) => l.toUpperCase());
}

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
    const estudiantes = JSON.parse(
      localStorage.getItem("estudiantes") || "[]"
    );
    const listaEstudiantes =
      document.getElementById("listaEstudiantes");
    const detalleEstudiante =
      document.getElementById(
        "detalleEstudiante"
      );
    const menuSemanalDiv =
      document.getElementById("menuSemanal");
    const btnCerrarSesion =
      document.querySelector(
        "[aria-label='Cerrar sesión']"
      );

    function mostrarLista() {
      listaEstudiantes.innerHTML = "";
      for (const est of estudiantes) {
        const li = document.createElement("li");
        li.className =
          "list-group-item list-group-item-action";
        li.textContent = `${capitalizar(
          est.nombres
        )} ${capitalizar(est.apellidos)}`;
        li.style.cursor = "pointer";
        li.addEventListener("click", () =>
          seleccionarEstudiante(est)
        );
        listaEstudiantes.appendChild(li);
      }
    }

    function seleccionarEstudiante(est) {
      mostrarDetalle(est);
      mostrarMenuSemanal(est);
    }

    function mostrarDetalle(est) {
      const edad = calcularEdad(
        est.fecha_nacimiento
      );
      detalleEstudiante.innerHTML = `
      <div class="card mb-3">
        <div class="card-header"><strong>Información Estudiante</strong></div>
        <div class="card-body">
          <p><strong>Nombres:</strong> ${capitalizar(
            est.nombres
          )}</p>
          <p><strong>Apellidos:</strong> ${capitalizar(
            est.apellidos
          )}</p>
          <p><strong>Curso:</strong> ${
            est.curso
          }</p>
          <p><strong>Edad:</strong> ${edad} años</p>
        </div>
      </div>
    `;
    }

    function mostrarMenuSemanal(est) {
      const observaciones = JSON.parse(
        localStorage.getItem("observaciones") ||
          "{}"
      );
      const menu = observaciones[est.usuario] || {
        lunes: {
          desayuno: "",
          almuerzo: "",
          merienda: "",
          cena: "",
        },
        martes: {
          desayuno: "",
          almuerzo: "",
          merienda: "",
          cena: "",
        },
        miercoles: {
          desayuno: "",
          almuerzo: "",
          merienda: "",
          cena: "",
        },
        jueves: {
          desayuno: "",
          almuerzo: "",
          merienda: "",
          cena: "",
        },
        viernes: {
          desayuno: "",
          almuerzo: "",
          merienda: "",
          cena: "",
        },
      };

      menuSemanalDiv.innerHTML = `
      <h2>Menú Semanal Editable</h2>
      <form id="formMenuSemanal">
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>Día</th>
              <th>Desayuno</th>
              <th>Almuerzo</th>
              <th>Merienda</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            ${Object.keys(menu)
              .map(
                (dia) => `
                  <tr>
                    <td>${capitalizar(dia)}</td>
                    <td><input type="text" name="${dia}_desayuno" class="form-control" value="${
                  menu[dia].desayuno
                }" /></td>
                    <td><input type="text" name="${dia}_almuerzo" class="form-control" value="${
                  menu[dia].almuerzo
                }" /></td>
                    <td><input type="text" name="${dia}_merienda" class="form-control" value="${
                  menu[dia].merienda
                }" /></td>
                    <td><input type="text" name="${dia}_cena" class="form-control" value="${
                  menu[dia].cena
                }" /></td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
        <button type="submit" class="btn btn-primary">Guardar Menú</button>
      </form>
    `;

      const form = document.getElementById(
        "formMenuSemanal"
      );
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const nuevoMenu = {};
        for (const dia of Object.keys(menu)) {
          nuevoMenu[dia] = {
            desayuno: formData.get(
              `${dia}_desayuno`
            ),
            almuerzo: formData.get(
              `${dia}_almuerzo`
            ),
            merienda: formData.get(
              `${dia}_merienda`
            ),
            cena: formData.get(`${dia}_cena`),
          };
        }
        alert("✅ Menú guardado correctamente.");
      });
    }

    btnCerrarSesion?.addEventListener(
      "click",
      () => {
        localStorage.removeItem("usuarioActivo");
        location.href =
          "../../auth/login/login.html";
      }
    );

    mostrarLista();
  }
);
