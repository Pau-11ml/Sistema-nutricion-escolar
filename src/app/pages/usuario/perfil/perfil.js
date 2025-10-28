function capitalizar(texto) {
  return texto
    ? texto
        .toLowerCase()
        .replaceAll(/\b\w/g, (l) =>
          l.toUpperCase()
        )
    : "";
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
    const btnCerrarSesion =
      document.querySelector(
        "[aria-label='Cerrar sesión']"
      );
    btnCerrarSesion?.addEventListener(
      "click",
      () => {
        localStorage.removeItem("usuarioActivo");
        location.href =
          "../../auth/login/login.html";
      }
    );

    const btnEditar =
      document.getElementById("btnEditar");
    const formEditar = document.getElementById(
      "formEditarPerfil"
    );
    const datosPerfil = document.getElementById(
      "datosPerfil"
    );
    const previewFoto = document.getElementById(
      "previewFoto"
    );

    const usuarioActivo = JSON.parse(
      localStorage.getItem("usuarioActivo") ||
        "{}"
    );
    const estudiantes = JSON.parse(
      localStorage.getItem("estudiantes") || "[]"
    );
    const representantes = JSON.parse(
      localStorage.getItem("representantes") ||
        "[]"
    );

    const representante = representantes.find(
      (r) => r.usuario === usuarioActivo.usuario
    );
    if (!representante)
      return alert("No hay representante activo");

    const estudiante = estudiantes.find(
      (e) =>
        e.usuario ===
        representante.estudianteUsuario
    );
    if (!estudiante)
      return alert(
        "No se encontró información del estudiante"
      );

    // Mostrar datos
    const ids = [
      "nombreEstudiante",
      "usuarioEstudiante",
      "cedulaEstudiante",
      "fechaNacimientoEstudiante",
      "edadEstudiante",
      "cursoEstudiante",
      "telefonoEstudiante",
      "correoRepresentanteEstudiante",
    ];
    const keys = [
      "nombres",
      "usuario",
      "cedula",
      "fecha_nacimiento",
      "fecha_nacimiento",
      "curso",
      "telefono",
      "correo",
    ];

    for (const [i, id] of ids.entries()) {
      const el = document.getElementById(id);
      if (!el) continue;

      if (
        keys[i] === "fecha_nacimiento" &&
        id !== "edadEstudiante"
      ) {
        el.textContent =
          estudiante[keys[i]] || "-";
      } else if (id === "edadEstudiante") {
        el.textContent =
          estudiante.fecha_nacimiento
            ? calcularEdad(
                estudiante.fecha_nacimiento
              ) + " años"
            : "-";
      }
    }

    document.getElementById("fotoPerfil").src =
      estudiante.foto ||
      "/assets/images/default-user.png";

    // Editar
    btnEditar?.addEventListener("click", () => {
      datosPerfil.classList.add("d-none");
      formEditar.classList.remove("d-none");

      document.getElementById(
        "inputNombre"
      ).value = estudiante.nombres;
      document.getElementById(
        "inputUsuario"
      ).value = estudiante.usuario;
      document.getElementById(
        "inputCedula"
      ).value = estudiante.cedula || "";
      document.getElementById(
        "inputFechaNacimiento"
      ).value = estudiante.fecha_nacimiento || "";
      document.getElementById(
        "inputCurso"
      ).value = estudiante.curso || "";
      document.getElementById(
        "inputTelefono"
      ).value = estudiante.telefono || "";
      document.getElementById(
        "inputCorreo"
      ).value = representante.correo || "";
      previewFoto.src =
        estudiante.foto ||
        "/assets/images/default-user.png";
    });

    // Vista previa foto
    document
      .getElementById("inputFoto")
      ?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file)
          previewFoto.src =
            URL.createObjectURL(file);
      });

    // Guardar cambios
    formEditar?.addEventListener(
      "submit",
      (e) => {
        e.preventDefault();

        estudiante.nombres =
          document.getElementById(
            "inputNombre"
          ).value;
        estudiante.usuario =
          document.getElementById(
            "inputUsuario"
          ).value;
        estudiante.cedula =
          document.getElementById(
            "inputCedula"
          ).value;
        estudiante.fecha_nacimiento =
          document.getElementById(
            "inputFechaNacimiento"
          ).value;
        estudiante.curso =
          document.getElementById(
            "inputCurso"
          ).value;
        estudiante.telefono =
          document.getElementById(
            "inputTelefono"
          ).value;
        representante.correo =
          document.getElementById(
            "inputCorreo"
          ).value;

        if (
          document.getElementById("inputFoto")
            .files[0]
        ) {
          estudiante.foto = previewFoto.src;
        }

        // Guardar en localStorage
        localStorage.setItem(
          "estudiantes",
          JSON.stringify(estudiantes)
        );
        localStorage.setItem(
          "representantes",
          JSON.stringify(representantes)
        );

        alert("✅ Cambios guardados");

        // Actualizar vista
        formEditar.classList.add("d-none");
        datosPerfil.classList.remove("d-none");

        document.getElementById(
          "fotoPerfil"
        ).src =
          estudiante.foto ||
          "/assets/images/default-user.png";
        document.getElementById(
          "nombreEstudiante"
        ).textContent = estudiante.nombres;
        document.getElementById(
          "usuarioEstudiante"
        ).textContent = estudiante.usuario;
        document.getElementById(
          "cedulaEstudiante"
        ).textContent = estudiante.cedula;
        document.getElementById(
          "fechaNacimientoEstudiante"
        ).textContent =
          estudiante.fecha_nacimiento;
        document.getElementById(
          "edadEstudiante"
        ).textContent =
          estudiante.fecha_nacimiento
            ? calcularEdad(
                estudiante.fecha_nacimiento
              ) + " años"
            : "-";
        document.getElementById(
          "cursoEstudiante"
        ).textContent = estudiante.curso;
        document.getElementById(
          "telefonoEstudiante"
        ).textContent = estudiante.telefono;
        document.getElementById(
          "correoRepresentanteEstudiante"
        ).textContent =
          representante.correo || "-";
      }
    );
  }
);
