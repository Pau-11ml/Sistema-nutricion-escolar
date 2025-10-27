// --- Helper functions ---
function mostrarError(el, msg) {
  const err = el.parentElement.querySelector(
    ".validation-error"
  );
  if (err) {
    err.style.display = "block";
    err.textContent = msg;
    el.classList.add("is-invalid");
  }
}

function limpiarError(el) {
  const err = el.parentElement.querySelector(
    ".validation-error"
  );
  if (err) {
    err.style.display = "none";
    err.textContent = "";
    el.classList.remove("is-invalid");
  }
}

// --- Validaciones ---
function validarTexto(valor) {
  const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return valor.length >= 3 && patron.test(valor);
}

function validarCorreo(email) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(email);
}

function validarPassword(pass, confirm) {
  if (pass.length < 6)
    return "La contraseña debe tener al menos 6 caracteres";
  if (pass !== confirm)
    return "Las contraseñas no coinciden";
  return null;
}

// --- Form submit ---
document.addEventListener(
  "DOMContentLoaded",
  () => {
    const form = document.getElementById(
      "registroNutriForm"
    );

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = form.nombre.value.trim();
      const correo = form.correo.value.trim();
      const password = form.password.value.trim();
      const confirmar =
        form.confirmar_password.value.trim();

      limpiarError(form.nombre);
      limpiarError(form.correo);
      limpiarError(form.password);
      limpiarError(form.confirmar_password);

      let valido = true;

      if (!nombre || !validarTexto(nombre)) {
        mostrarError(
          form.nombre,
          "Nombre inválido"
        );
        valido = false;
      }
      if (!correo || !validarCorreo(correo)) {
        mostrarError(
          form.correo,
          "Correo inválido"
        );
        valido = false;
      }
      const passError = validarPassword(
        password,
        confirmar
      );
      if (passError) {
        mostrarError(form.password, passError);
        mostrarError(
          form.confirmar_password,
          passError
        );
        valido = false;
      }

      if (!valido) return;

      // Guardar nutricionista en localStorage
      const nutricionistas = JSON.parse(
        localStorage.getItem("nutricionistas") ||
          "[]"
      );

      // Generar usuario a partir del nombre (sin espacios, minúsculas)
      const usuarioBase = nombre
        .toLowerCase()
        .replaceAll(/\s+/g, "");
      let usuario = usuarioBase;
      let contador = 1;
      while (
        nutricionistas.some(
          (n) => n.usuario === usuario
        )
      ) {
        usuario = usuarioBase + contador++;
      }

      nutricionistas.push({
        nombre,
        correo,
        usuario,
        contrasena: password,
        rol: "nutricionista",
      });
      localStorage.setItem(
        "nutricionistas",
        JSON.stringify(nutricionistas)
      );

      alert(
        `✅ Nutricionista registrado!\nUsuario: ${usuario}`
      );
    });
    setTimeout(
      () =>
        (location.href =
          "../../admin/admin/admin.html    "),
      1500
    );
  }
);
