function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarPassword(pass) {
  if (!pass || pass.length < 6)
    return "La contraseña debe tener al menos 6 caracteres";
  return null;
}
function mostrarErrorCampo(el, texto) {
  if (!el) return;
  el.textContent = texto;
  el.style.display = "block";
}
document.addEventListener(
  "DOMContentLoaded",
  () => {
    const form = document.getElementById(
      "recuperarForm"
    );
    const nombreInput =
      document.getElementById("nombre");
    const correoInput =
      document.getElementById("correo");
    const nuevaConInput = document.getElementById(
      "nuevaContrasena"
    );
    const mensajeEl =
      document.getElementById("mensaje");

    const nombreError = document.getElementById(
      "nombreError"
    );
    const correoError = document.getElementById(
      "correoError"
    );
    const nuevaConError = document.getElementById(
      "nuevaConError"
    );

    function limpiarErrores() {
      [
        nombreError,
        correoError,
        nuevaConError,
      ].forEach((el) => {
        if (el) el.style.display = "none";
      });
      mensajeEl.textContent = "";
      mensajeEl.className = "";
    }

    function mostrarMensaje(
      texto,
      tipo = "info"
    ) {
      mensajeEl.textContent = texto;
      mensajeEl.className =
        tipo === "success"
          ? "text-success"
          : tipo === "error"
          ? "text-danger"
          : "text-info";
      mensajeEl.setAttribute(
        "aria-live",
        "polite"
      );
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      limpiarErrores();

      const nombre = nombreInput.value
        .trim()
        .toLowerCase();
      const correo = correoInput.value
        .trim()
        .toLowerCase();
      const nuevaCon = nuevaConInput.value.trim();

      if (!nombre) {
        mostrarErrorCampo(
          nombreError,
          "Ingrese su nombre completo."
        );
        return;
      }
      if (!correo) {
        mostrarErrorCampo(
          correoError,
          "Ingrese su correo electrónico."
        );
        return;
      }
      if (!validarEmail(correo)) {
        mostrarErrorCampo(
          correoError,
          "Correo no válido."
        );
        return;
      }
      const passErr = validarPassword(nuevaCon);
      if (passErr) {
        mostrarErrorCampo(nuevaConError, passErr);
        return;
      }

      const submitBtn = form.querySelector(
        'button[type="submit"]'
      );
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verificando...`;
      mostrarMensaje("Buscando usuario...");

      setTimeout(() => {
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
        );

        let actualizado = false;

        // helper para actualizar contraseña
        function actualizarPassword(
          arr,
          index,
          campo
        ) {
          arr[index][campo] = nuevaCon;
          localStorage.setItem(
            arr === estudiantes
              ? "estudiantes"
              : arr === representantes
              ? "representantes"
              : arr === nutricionistas
              ? "nutricionistas"
              : "usuarios",
            JSON.stringify(arr)
          );
          actualizado = true;
        }

        // --- Buscar en estudiantes ---
        const estIndex = estudiantes.findIndex(
          (s) =>
            s.nombres?.toLowerCase() === nombre &&
            s.correo?.toLowerCase() === correo
        );
        if (estIndex !== -1) {
          actualizarPassword(
            estudiantes,
            estIndex,
            "password"
          );
        }

        // --- Buscar en representantes ---
        if (!actualizado) {
          const repIndex =
            representantes.findIndex(
              (r) =>
                r.nombre?.toLowerCase() ===
                  nombre &&
                r.correo?.toLowerCase() === correo
            );
          if (repIndex !== -1) {
            actualizarPassword(
              representantes,
              repIndex,
              "contrasena"
            );
          }
        }

        // --- Buscar en nutricionistas ---
        if (!actualizado) {
          const nutIndex =
            nutricionistas.findIndex(
              (n) =>
                n.nombres?.toLowerCase() ===
                  nombre &&
                n.correo?.toLowerCase() === correo
            );
          if (nutIndex !== -1) {
            actualizarPassword(
              nutricionistas,
              nutIndex,
              "contrasena"
            );
          }
        }

        // --- Buscar en usuarios genéricos ---
        if (!actualizado) {
          const usuIndex = usuarios.findIndex(
            (u) =>
              u.nombres?.toLowerCase() ===
                nombre &&
              u.correo?.toLowerCase() === correo
          );
          if (usuIndex !== -1) {
            actualizarPassword(
              usuarios,
              usuIndex,
              "contrasena"
            );
          }
        }

        if (actualizado) {
          mostrarMensaje(
            "Contraseña actualizada correctamente. Redirigiendo al inicio de sesión...",
            "success"
          );
          setTimeout(() => {
            location.href =
              "../../auth/login/login.html";
          }, 1300);
        } else {
          mostrarMensaje(
            "No se encontró ningún usuario con esos datos. Verifique nombre y correo.",
            "error"
          );
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 700);
    });

    // Limpiar mensajes al escribir
    [
      nombreInput,
      correoInput,
      nuevaConInput,
    ].forEach((input) =>
      input.addEventListener(
        "input",
        limpiarErrores
      )
    );
  }
);
