// perfil.js - Perfil escolar

document.addEventListener(
  "DOMContentLoaded",
  function () {
    let usuario = null;
    // Variable 'editando' eliminada por no usarse
    const form = {
      nombres: "",
      apellidos: "",
      usuario: "",
      cedula: "",
      fecha_nacimiento: "",
      curso: "",
      direccion: "",
      telefono: "",
      correo: "",
      foto: "",
      historial_trabajos: [],
      nuevoTrabajo: {
        empresa: "",
        cargo: "",
        fecha_inicio: "",
        fecha_fin: "",
      },
    };

    // Cargar usuario activo
    const usuarioActivo = localStorage.getItem(
      "estudianteActivo"
    );
    if (usuarioActivo) {
      usuario = JSON.parse(usuarioActivo);
      Object.assign(form, usuario);
    }

    const btnCerrarSesion =
      document.querySelector(
        "[aria-label='Cerrar sesión']"
      );

    // Manejar foto
    document
      .getElementById("fotoPerfil")
      ?.addEventListener("change", function (e) {
        const input = e.target;
        if (
          !input.files ||
          input.files.length === 0
        )
          return;
        const archivo = input.files[0];
        const lector = new FileReader();
        lector.onload = () => {
          form.foto = lector.result;
          document.getElementById(
            "imgPreview"
          ).src = form.foto;
        };
        lector.readAsDataURL(archivo);
      });

    // Cerrar sesión

    btnCerrarSesion?.addEventListener(
      "click",
      function () {
        localStorage.removeItem("usuarioActivo");
        location.href =
          "../../auth/login/login.html";
      }
    );
    // Activar edición
    document
      .getElementById("btnEditarPerfil")
      ?.addEventListener("click", function () {
        // Mostrar campos editables en el HTML
        // ...
      });

    // Guardar cambios
    document
      .getElementById("btnGuardarPerfil")
      ?.addEventListener("click", function () {
        if (!usuario) return;
        Object.assign(usuario, form);
        localStorage.setItem(
          "estudianteActivo",
          JSON.stringify(usuario)
        );
        // Actualizar en lista general
        let lista = JSON.parse(
          localStorage.getItem("estudiantes") ||
            "[]"
        );
        const i = lista.findIndex(
          (u) => u.usuario === usuario.usuario
        );
        if (i >= 0) lista[i] = usuario;
        localStorage.setItem(
          "estudiantes",
          JSON.stringify(lista)
        );
        // Mostrar mensaje de éxito
      });

    // Agregar trabajo anterior
    document
      .getElementById("btnAgregarTrabajo")
      ?.addEventListener("click", function () {
        const nuevo = { ...form.nuevoTrabajo };
        if (
          !nuevo.empresa ||
          !nuevo.cargo ||
          !nuevo.fecha_inicio
        )
          return;
        form.historial_trabajos.push(nuevo);
        form.nuevoTrabajo = {
          empresa: "",
          cargo: "",
          fecha_inicio: "",
          fecha_fin: "",
        };
        // Actualizar vista de historial
      });
  }
);
