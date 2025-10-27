// recuperar-contrasena.js - Recuperar contraseña escolar

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const form = document.getElementById(
      "recuperarForm"
    );
    const mensaje = document.getElementById(
      "mensajeRecuperar"
    );

    form?.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const {
          usuario,
          cedula,
          nuevaContrasena,
        } = Object.fromEntries(formData);
        if (
          !usuario ||
          !cedula ||
          !nuevaContrasena
        ) {
          mensaje.textContent =
            "Completa TODOS los campos requeridos.";
          mensaje.className = "text-danger";
          return;
        }
        let estudiantes = JSON.parse(
          localStorage.getItem("estudiantes") ||
            "[]"
        );
        const index = estudiantes.findIndex(
          (e) =>
            e.usuario === usuario &&
            e.cedula === cedula
        );
        if (index === -1) {
          mensaje.textContent =
            "Usuario o cédula incorrecta.";
          mensaje.className = "text-danger";
          return;
        }
        estudiantes[index].contrasena =
          nuevaContrasena;
        localStorage.setItem(
          "estudiantes",
          JSON.stringify(estudiantes)
        );
        mensaje.textContent =
          "✅ Contraseña actualizada correctamente. Redirigiendo...";
        mensaje.className = "text-success";
        form.reset();
        setTimeout(() => {
          globalThis.location.href =
            "src/app/pages/usuario/login/login.html";
        }, 1500);
      }
    );
  }
);
