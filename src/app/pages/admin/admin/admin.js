// === Filtrar usuarios ===
function filtrarUsuarios(usuarios, termino) {
  termino = termino.toLowerCase().trim();
  return usuarios.filter(
    (u) =>
      u.nombres.toLowerCase().includes(termino) ||
      u.apellidos
        .toLowerCase()
        .includes(termino) ||
      u.usuario.toLowerCase().includes(termino)
  );
}

// === Guardar usuarios en localStorage ===
function guardarUsuarios(usuarios) {
  localStorage.setItem(
    "estudiantes",
    JSON.stringify(usuarios)
  );
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    // Verificar sesión y rol de administrador
    const usuarioActivo = JSON.parse(
      localStorage.getItem("usuarioActivo")
    );
    if (
      !usuarioActivo ||
      usuarioActivo.rol !== "admin"
    ) {
      location.href = "../auth/login/login.html";
      return;
    }

    // Elementos
    const filtroInput =
      document.getElementById("filtro");
    const tablaUsuarios = document.getElementById(
      "usuariosBody"
    );
    const btnCerrarSesion =
      document.querySelector(
        "[aria-label='Cerrar sesión']"
      );
    const statsRow =
      document.getElementById("statsRow");
    const btnExportarDatos =
      document.getElementById("btnExportarDatos");
    const sinUsuarios = document.getElementById(
      "sinUsuarios"
    );

    // Cargar usuarios
    function cargarUsuarios() {
      const datos = localStorage.getItem(
        "estudiantes"
      );
      return datos ? JSON.parse(datos) : [];
    }

    // Renderizar tabla
    function renderizarTabla(usuarios) {
      if (!tablaUsuarios) return;
      tablaUsuarios.innerHTML = "";

      if (usuarios.length === 0) {
        sinUsuarios.style.display = "block";
      } else {
        sinUsuarios.style.display = "none";
      }

      for (const u of usuarios) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${u.nombres} ${u.apellidos}</td>
        <td>${u.usuario}</td>
        <td>${u.cedula || "-"}</td>
        <td>${u.curso || "-"}</td>
        <td class="text-center">
          ${
            u.pendiente
              ? `<button class="btn btn-success btn-sm" data-autorizar="${u.usuario}">Autorizar</button>`
              : ""
          }
          <button class="btn btn-danger btn-sm" data-usuario="${
            u.usuario
          }">Eliminar</button>
        </td>
      `;
        tablaUsuarios.appendChild(fila);
      }
    }

    // Renderizar estadísticas
    function renderizarEstadisticas(usuarios) {
      if (!statsRow) return;
      statsRow.innerHTML = "";
      if (usuarios.length === 0) return;

      const total = usuarios.length;
      const activos = usuarios.filter(
        (u) => u.activo
      ).length;
      const pendientes = usuarios.filter(
        (u) => u.pendiente
      ).length;

      statsRow.innerHTML = `
      <div class="col-md-3">
        <div class="stats-card bg-primary text-white">
          <div class="stats-icon"><i class="bi bi-people-fill"></i></div>
          <div class="stats-info">
            <h3 class="h2 mb-2">${total}</h3>
            <p class="mb-0">Estudiantes Totales</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stats-card bg-success text-white">
          <div class="stats-icon"><i class="bi bi-check-circle-fill"></i></div>
          <div class="stats-info">
            <h3 class="h2 mb-2">${activos}</h3>
            <p class="mb-0">Registros Activos</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stats-card bg-warning text-dark">
          <div class="stats-icon"><i class="bi bi-clock-fill"></i></div>
          <div class="stats-info">
            <h3 class="h2 mb-2">${pendientes}</h3>
            <p class="mb-0">Pendientes</p>
          </div>
        </div>
      </div>
    `;
    }

    // Manejo de clics: Autorizar o Eliminar
    tablaUsuarios?.addEventListener(
      "click",
      function (e) {
        const autorizar =
          e.target.dataset.autorizar;
        let usuarios = cargarUsuarios();

        if (autorizar) {
          // Autorizar usuario
          usuarios = usuarios.map((u) => {
            if (u.usuario === autorizar) {
              u.pendiente = false;
              u.activo = true;
            }
            return u;
          });
          guardarUsuarios(usuarios);
          renderizarTabla(usuarios);
          renderizarEstadisticas(usuarios);
        }

        if (e.target.dataset.usuario) {
          const usuario =
            e.target.dataset.usuario;
          if (
            confirm(
              `¿Estás seguro de eliminar al usuario "${usuario}"?`
            )
          ) {
            usuarios = usuarios.filter(
              (u) => u.usuario !== usuario
            );
            guardarUsuarios(usuarios);
            renderizarTabla(usuarios);
            renderizarEstadisticas(usuarios);
          }
        }
      }
    );

    // Cerrar sesión
    btnCerrarSesion?.addEventListener(
      "click",
      function () {
        localStorage.removeItem("usuarioActivo");
        location.href =
          "../../auth/login/login.html";
      }
    );

    // Exportar datos
    btnExportarDatos?.addEventListener(
      "click",
      function () {
        const usuarios = cargarUsuarios();
        if (usuarios.length === 0) {
          alert("No hay datos para exportar.");
          return;
        }
        let csv =
          "Nombres,Apellidos,Usuario,Cédula,Curso\n";
        for (const u of usuarios) {
          csv += `${u.nombres || ""},${
            u.apellidos || ""
          },${u.usuario || ""},${
            u.cedula || ""
          },${u.curso || ""}\n`;
        }
        const blob = new Blob([csv], {
          type: "text/csv",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "estudiantes.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    );

    // Inicializar
    const usuarios = cargarUsuarios();
    renderizarTabla(usuarios);
    renderizarEstadisticas(usuarios);

    // Filtrar usuarios
    filtroInput?.addEventListener(
      "input",
      function () {
        const filtrados = filtrarUsuarios(
          usuarios,
          filtroInput.value
        );
        renderizarTabla(filtrados);
        renderizarEstadisticas(filtrados);
      }
    );
  }
);
