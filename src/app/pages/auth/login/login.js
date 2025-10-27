// --- Helper functions moved to outer scope ---
function mostrarError(el, msg) {
  const err = el.parentElement.nextElementSibling;
  if (
    err?.classList.contains("validation-error")
  ) {
    err.style.display = "flex";
    err.innerHTML = `<i class="bi bi-exclamation-circle"></i> <span>${msg}</span>`;
    el.classList.add("is-invalid");
  }
}

function limpiarError(el, globalError) {
  const err = el.parentElement.nextElementSibling;
  if (
    err?.classList.contains("validation-error")
  ) {
    err.style.display = "none";
    el.classList.remove("is-invalid");
  }
  if (globalError)
    globalError.style.display = "none";
}

// --- Main script ---
document.addEventListener(
  "DOMContentLoaded",
  () => {
    const form =
      document.getElementById("loginForm");
    const usuarioInput = form.usuario;
    const contrasenaInput = form.contrasena;
    const submitBtn = form.querySelector(
      'button[type="submit"]'
    );

    // Crear mensaje global de error
    const globalError =
      document.createElement("div");
    globalError.className =
      "validation-message error text-center mb-3";
    globalError.style.display = "none";
    form.prepend(globalError);

    // Mostrar/ocultar contraseña
    const toggleBtn =
      document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.innerHTML =
      '<i class="bi bi-eye"></i>';
    toggleBtn.className =
      "btn btn-outline-secondary";
    toggleBtn.style.position = "absolute";
    toggleBtn.style.right = "0.25rem";
    toggleBtn.style.top = "50%";
    toggleBtn.style.transform =
      "translateY(-50%)";
    toggleBtn.style.padding = "0.25rem 0.5rem";
    contrasenaInput.parentElement.style.position =
      "relative";
    contrasenaInput.parentElement.appendChild(
      toggleBtn
    );

    toggleBtn.addEventListener("click", () => {
      if (contrasenaInput.type === "password") {
        contrasenaInput.type = "text";
        toggleBtn.innerHTML =
          '<i class="bi bi-eye-slash"></i>';
      } else {
        contrasenaInput.type = "password";
        toggleBtn.innerHTML =
          '<i class="bi bi-eye"></i>';
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const usuario = usuarioInput.value.trim();
      const contrasena =
        contrasenaInput.value.trim();

      limpiarError(usuarioInput, globalError);
      limpiarError(contrasenaInput, globalError);

      if (!usuario)
        return mostrarError(
          usuarioInput,
          "El usuario es obligatorio"
        );
      if (!contrasena)
        return mostrarError(
          contrasenaInput,
          "La contraseña es obligatoria"
        );

      // Spinner en botón
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Iniciando...`;

      setTimeout(() => {
        // Simula tiempo de carga
        const usuarios = [
          {
            usuario: "admin",
            contrasena: "admin123",
            rol: "admin",
          },
          {
            usuario: "nutri",
            contrasena: "nutri123",
            rol: "nutricionista",
          },
        ];

        const estudiantes = JSON.parse(
          localStorage.getItem("estudiantes") ||
            "[]"
        );

        const usuarioEncontrado =
          usuarios.find(
            (u) =>
              u.usuario === usuario &&
              u.contrasena === contrasena
          ) ||
          estudiantes.find(
            (e) => e.usuario === usuario
          );

        if (!usuarioEncontrado) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          globalError.style.display = "block";
          globalError.textContent =
            "Usuario o contraseña incorrectos";
          return;
        }

        // Validación estudiante
        if (usuarioEncontrado.fecha_nacimiento) {
          const fecha = new Date(
            usuarioEncontrado.fecha_nacimiento
          );
          const claveEsperada = fecha
            .toISOString()
            .split("T")[0]
            .replaceAll("-", "");
          if (contrasena !== claveEsperada) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            return mostrarError(
              contrasenaInput,
              "Contraseña incorrecta"
            );
          }
        }

        localStorage.setItem(
          "usuarioActivo",
          JSON.stringify(usuarioEncontrado)
        );

        const rol =
          usuarioEncontrado.rol || "estudiante";
        const rutas = {
          admin: "../../admin/admin/admin.html",
          nutricionista:
            "../../usuario/nutricionista/nutricionista.html",
          padre:
            "../../usuario/inicio/inicio.html",
        };

        location.href = rutas[rol];
      }, 800);
    });

    usuarioInput.addEventListener("input", (e) =>
      limpiarError(e.target, globalError)
    );
    contrasenaInput.addEventListener(
      "input",
      (e) => limpiarError(e.target, globalError)
    );
  }
);
