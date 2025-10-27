// recuperar-contrasena.js
document.addEventListener(
  "DOMContentLoaded",
  () => {
    const form = document.getElementById(
      "recuperarForm"
    );
    const usuarioInput =
      document.getElementById("usuario");
    const cedulaInput =
      document.getElementById("cedula");
    const nuevaConInput = document.getElementById(
      "nuevaContrasena"
    );
    const mensajeEl =
      document.getElementById("mensaje");

    const usuarioRecError =
      document.getElementById("usuarioRecError");
    const cedulaRecError =
      document.getElementById("cedulaRecError");
    const nuevaConError = document.getElementById(
      "nuevaConError"
    );

    function limpiarErrores() {
      [
        usuarioRecError,
        cedulaRecError,
        nuevaConError,
      ].forEach((el) => {
        if (el) el.style.display = "none";
      });
      mensajeEl.textContent = "";
      mensajeEl.className = "";
    }

    function mostrarErrorCampo(el, texto) {
      if (!el) return;
      el.textContent = texto;
      el.style.display = "block";
      el.focus();
    }

    function mostrarMensaje(
      texto,
      tipo = "info"
    ) {
      // tipo: "info", "success", "error"
      mensajeEl.textContent = texto;
      mensajeEl.className =
        tipo === "success"
          ? "text-success"
          : tipo === "error"
          ? "text-danger"
          : "text-info";
      // para accesibilidad
      mensajeEl.setAttribute(
        "aria-live",
        "polite"
      );
    }

    function validarCedulaFormato(cedula) {
      return /^\d{10}$/.test(cedula);
    }

    function validarPassword(pass) {
      if (!pass || pass.length < 6)
        return "La contraseña debe tener al menos 6 caracteres";
      return null;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      limpiarErrores();

      const usuario = usuarioInput.value.trim();
      const cedula = cedulaInput.value.trim();
      const nuevaCon = nuevaConInput.value.trim();

      // Validaciones básicas
      if (!usuario) {
        mostrarErrorCampo(
          usuarioRecError,
          "Ingrese su usuario."
        );
        return;
      }
      if (!cedula) {
        mostrarErrorCampo(
          cedulaRecError,
          "Ingrese su cédula."
        );
        return;
      }
      if (!validarCedulaFormato(cedula)) {
        mostrarErrorCampo(
          cedulaRecError,
          "La cédula debe tener 10 dígitos numéricos."
        );
        return;
      }
      const passErr = validarPassword(nuevaCon);
      if (passErr) {
        mostrarErrorCampo(nuevaConError, passErr);
        return;
      }

      // Desactivar botón y mostrar feedback
      const submitBtn = form.querySelector(
        'button[type="submit"]'
      );
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Actualizando...`;
      mostrarMensaje("Buscando usuario...");

      setTimeout(() => {
        // Cargar datos desde localStorage
        const representantes = JSON.parse(
          localStorage.getItem(
            "representantes"
          ) || "[]"
        );
        const estudiantes = JSON.parse(
          localStorage.getItem("estudiantes") ||
            "[]"
        );
        const nutricionistas = JSON.parse(
          localStorage.getItem(
            "nutricionistas"
          ) || "[]"
        );
        const usuarios = JSON.parse(
          localStorage.getItem("usuarios") || "[]"
        ); // opcional, si lo usas

        // 1) Intentar encontrar representante (y comprobar cédula en su estudiante vinculado)
        let repIndex = representantes.findIndex(
          (r) => r.usuario === usuario
        );
        if (repIndex !== -1) {
          const rep = representantes[repIndex];
          // Buscar el estudiante vinculado por estudianteUsuario
          const estudiante = estudiantes.find(
            (s) =>
              s.usuario === rep.estudianteUsuario
          );
          if (!estudiante) {
            // no podemos verificar cédula si no hay estudiante vinculado
            mostrarMensaje(
              "No se pudo verificar la cédula: estudiante no encontrado. Contacte con el administrador.",
              "error"
            );
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            return;
          }
          if (estudiante.cedula !== cedula) {
            mostrarMensaje(
              "Cédula no coincide con el registro del representante.",
              "error"
            );
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            return;
          }

          // Todo OK: actualizar contraseña del representante
          representantes[repIndex].contrasena =
            nuevaCon;
          // Asegurar rol si no existe
          representantes[repIndex].rol =
            representantes[repIndex].rol ||
            "representante";
          localStorage.setItem(
            "representantes",
            JSON.stringify(representantes)
          );
          mostrarMensaje(
            "Contraseña actualizada correctamente. Redirigiendo al inicio de sesión...",
            "success"
          );

          setTimeout(() => {
            // opcional: redirigir al login
            location.href =
              "../../auth/login/login.html";
          }, 1200);

          return;
        }

        // 2) Intentar nutricionista (si existe y tiene campo cedula para validar)
        let nutIndex = nutricionistas.findIndex(
          (n) => n.usuario === usuario
        );
        if (nutIndex !== -1) {
          const nut = nutricionistas[nutIndex];
          if (nut.cedula) {
            if (nut.cedula !== cedula) {
              mostrarMensaje(
                "Cédula no coincide con el registro del nutricionista.",
                "error"
              );
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
              return;
            }
            // actualizar contraseña
            nutricionistas[nutIndex].contrasena =
              nuevaCon;
            localStorage.setItem(
              "nutricionistas",
              JSON.stringify(nutricionistas)
            );
            mostrarMensaje(
              "Contraseña actualizada correctamente. Redirigiendo al inicio de sesión...",
              "success"
            );
            setTimeout(
              () =>
                (location.href =
                  "../../auth/login/login.html"),
              1200
            );
            return;
          } else {
            // no hay cedula almacenada para nutricionista: pedir contactar admin
            mostrarMensaje(
              "No se puede verificar al nutricionista sin cédula almacenada. Contacte al administrador.",
              "error"
            );
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            return;
          }
        }

        // 3) Intentar en 'usuarios' genéricos (si usas ese array y guardas cedula ahí)
        let usuIndex = usuarios.findIndex(
          (u) => u.usuario === usuario
        );
        if (usuIndex !== -1) {
          const u = usuarios[usuIndex];
          if (u.cedula) {
            if (u.cedula !== cedula) {
              mostrarMensaje(
                "Cédula no coincide con el registro.",
                "error"
              );
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
              return;
            }
            usuarios[usuIndex].contrasena =
              nuevaCon;
            localStorage.setItem(
              "usuarios",
              JSON.stringify(usuarios)
            );
            mostrarMensaje(
              "Contraseña actualizada correctamente. Redirigiendo al inicio de sesión...",
              "success"
            );
            setTimeout(
              () =>
                (location.href =
                  "../../auth/login/login.html"),
              1200
            );
            return;
          } else {
            mostrarMensaje(
              "No se puede verificar el usuario sin cédula almacenada. Contacte al administrador.",
              "error"
            );
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            return;
          }
        }

        // Si no encontró en ningún lado
        mostrarMensaje(
          "Usuario no encontrado o los datos no coinciden. Verifique e inténtelo de nuevo o contacte al administrador.",
          "error"
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 700);
    });

    // Limpieza de errores al escribir
    usuarioInput.addEventListener("input", () => {
      if (usuarioRecError)
        usuarioRecError.style.display = "none";
      mensajeEl.textContent = "";
    });
    cedulaInput.addEventListener("input", () => {
      if (cedulaRecError)
        cedulaRecError.style.display = "none";
      mensajeEl.textContent = "";
    });
    nuevaConInput.addEventListener(
      "input",
      () => {
        if (nuevaConError)
          nuevaConError.style.display = "none";
        mensajeEl.textContent = "";
      }
    );
  }
);
