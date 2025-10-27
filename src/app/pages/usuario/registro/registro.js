// === Función para poner la primera letra de cada palabra en mayúscula ===
function capitalizarPalabras(texto) {
  return texto
    .toLowerCase()
    .replaceAll(/\b\w/g, (letra) =>
      letra.toUpperCase()
    );
}

// === Funciones de validación ===
function validarTexto(valor) {
  const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return valor.length >= 3 && patron.test(valor);
}

function validarFechaNacimiento(fecha) {
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
  return edad >= 4 && edad <= 13;
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

function validarTelefono(telefono) {
  return /^\d{10}$/.test(telefono);
}

function validarCedula(cedula) {
  return /^\d{10}$/.test(cedula);
}

function validarPassword(pass, confirm) {
  if (pass.length < 6)
    return "La contraseña debe tener al menos 6 caracteres";
  if (pass !== confirm)
    return "Las contraseñas no coinciden";
  return null;
}

// === Control de pasos ===
let pasoActual = 1;
const totalPasos = 3;
const pasos =
  document.querySelectorAll(".form-step");
const barraProgreso = document.getElementById(
  "registroProgress"
);
const textoProgreso = document.getElementById(
  "progressText"
);
const btnAtras =
  document.getElementById("btnAtras");
const btnSiguiente = document.getElementById(
  "btnSiguiente"
);
const pasosTexto =
  document.querySelectorAll(".step");

function mostrarPaso() {
  for (const p of pasos)
    p.classList.remove("active");
  pasos[pasoActual - 1].classList.add("active");

  // Actualizar la barra de progreso
  barraProgreso.style.width = `${
    (pasoActual / totalPasos) * 100
  }%`;
  textoProgreso.textContent = `Paso ${pasoActual} de ${totalPasos}`;

  // Actualizar los indicadores de texto (los círculos o títulos)
  let index = 0;
  for (const s of pasosTexto) {
    s.classList.remove("active", "completed");

    if (index + 1 < pasoActual) {
      s.classList.add("completed");
    } else if (index + 1 === pasoActual) {
      s.classList.add("active");
    }

    index++;
  }

  // Botones
  btnAtras.disabled = pasoActual === 1;
  btnSiguiente.textContent =
    pasoActual === totalPasos
      ? "Finalizar"
      : "Siguiente";
}

btnAtras.disabled = true;
btnSiguiente.textContent = "Siguiente";

btnSiguiente.addEventListener("click", () => {
  if (pasoActual < totalPasos) {
    if (validarPaso(pasoActual)) {
      pasoActual++;
      if (pasoActual === 3) generarResumen();
      mostrarPaso();
    }
  } else {
    guardarRegistro();
  }
});

btnAtras.addEventListener("click", () => {
  if (pasoActual > 1) {
    pasoActual--;
    mostrarPaso();
  }
});

mostrarPaso();

// === Validación de cada paso ===
function validarPaso(paso) {
  const campos =
    pasos[paso - 1].querySelectorAll("input");
  let valido = true;

  for (const campo of campos) {
    const valor = campo.value.trim();
    limpiarError(campo);

    if (!valor) {
      mostrarError(
        campo,
        "Este campo es obligatorio"
      );
      valido = false;
    } else if (
      (campo.name === "nombres" ||
        campo.name === "apellidos" ||
        campo.name.includes("nombre")) &&
      !validarTexto(valor)
    ) {
      mostrarError(
        campo,
        "Solo se permiten letras"
      );
      valido = false;
    } else if (
      campo.name === "telefono" &&
      !validarTelefono(valor)
    ) {
      mostrarError(
        campo,
        "Debe tener 10 dígitos numéricos"
      );
      valido = false;
    } else if (
      campo.name === "fecha_nacimiento" &&
      !validarFechaNacimiento(valor)
    ) {
      mostrarError(
        campo,
        "La edad debe estar entre 4 y 13 años"
      );
      valido = false;
    } else if (
      campo.name === "cedula" &&
      !validarCedula(valor)
    ) {
      mostrarError(
        campo,
        "La cédula debe tener 10 dígitos numéricos"
      );
      valido = false;
    }
  }

  if (paso === 2) {
    const pass = document
      .getElementById("password")
      .value.trim();
    const confirm = document
      .getElementById("confirmar_password")
      .value.trim();
    const error = validarPassword(pass, confirm);
    if (error) {
      mostrarError(
        document.getElementById("password"),
        error
      );
      mostrarError(
        document.getElementById(
          "confirmar_password"
        ),
        error
      );
      valido = false;
    }
  }

  return valido;
}

// === Mostrar errores ===
function mostrarError(elemento, mensaje) {
  const error =
    elemento.parentElement.querySelector(
      ".validation-error"
    );
  if (error) {
    error.textContent = mensaje;
    error.style.display = "block";
    elemento.classList.add("is-invalid");
  }
}

function limpiarError(elemento) {
  const error =
    elemento.parentElement.querySelector(
      ".validation-error"
    );
  if (error) {
    error.textContent = "";
    error.style.display = "none";
    elemento.classList.remove("is-invalid");
  }
}

// === Mostrar edad calculada dinámicamente ===
const fechaInput = document.getElementById(
  "fecha_nacimiento"
);
const edadLabel = document.createElement("small");
edadLabel.className = "text-muted d-block mt-1";
fechaInput.parentElement.appendChild(edadLabel);

fechaInput.addEventListener(
  "change",
  function () {
    const fecha = this.value;
    if (fecha && validarFechaNacimiento(fecha)) {
      const edad = calcularEdad(fecha);
      edadLabel.textContent = `Edad: ${edad} años`;
      limpiarError(this);
      actualizarEdadEnResumen(edad);
    } else {
      edadLabel.textContent = "";
      mostrarError(
        this,
        "La edad debe estar entre 4 y 13 años"
      );
    }
  }
);

// === Generar resumen ===
function generarResumen() {
  const formData = new FormData(
    document.getElementById("registroForm")
  );
  const datos = Object.fromEntries(formData);

  const nombres = capitalizarPalabras(
    datos.nombres
  );
  const apellidos = capitalizarPalabras(
    datos.apellidos
  );
  const curso = capitalizarPalabras(datos.curso);
  const escuela = capitalizarPalabras(
    datos.escuela
  );
  const padre = capitalizarPalabras(
    datos.nombre_padre
  );
  const madre = capitalizarPalabras(
    datos.nombre_madre
  );
  const representante = capitalizarPalabras(
    datos.representante
  );
  const edad = calcularEdad(
    datos.fecha_nacimiento
  );

  const nombreUsuario =
    nombres.toLowerCase().split(" ")[0] +
    apellidos.toLowerCase().split(" ")[0];

  const resumenDiv = document.getElementById(
    "resumenDatos"
  );
  resumenDiv.innerHTML = `
    <ul class="list-group" id="resumenLista">
      <li class="list-group-item"><strong>Nombres:</strong> ${nombres}</li>
      <li class="list-group-item"><strong>Apellidos:</strong> ${apellidos}</li>
      <li class="list-group-item" id="resumenEdad"><strong>Edad:</strong> ${edad} años</li>
      <li class="list-group-item"><strong>Fecha de Nacimiento:</strong> ${datos.fecha_nacimiento}</li>
      <li class="list-group-item"><strong>Cédula:</strong> ${datos.cedula}</li>
      <li class="list-group-item"><strong>Teléfono:</strong> ${datos.telefono}</li>
      <li class="list-group-item"><strong>Curso:</strong> ${curso}</li>
      <li class="list-group-item"><strong>Escuela:</strong> ${escuela}</li>
      <li class="list-group-item"><strong>Padre:</strong> ${padre}</li>
      <li class="list-group-item"><strong>Madre:</strong> ${madre}</li>
      <li class="list-group-item"><strong>Representante:</strong> ${representante}</li>
      <li class="list-group-item bg-light"><strong>Usuario generado:</strong> ${nombreUsuario}</li>
    </ul>
  `;
}

// === Actualizar edad en el resumen ===
function actualizarEdadEnResumen(edad) {
  const resumenEdad = document.getElementById(
    "resumenEdad"
  );
  if (resumenEdad)
    resumenEdad.innerHTML = `<strong>Edad:</strong> ${edad} años`;
}

// === Guardar en localStorage ===
function guardarRegistro() {
  const formData = new FormData(
    document.getElementById("registroForm")
  );
  const estudiante = Object.fromEntries(formData);

  estudiante.nombres = capitalizarPalabras(
    estudiante.nombres
  );
  estudiante.apellidos = capitalizarPalabras(
    estudiante.apellidos
  );
  estudiante.curso = capitalizarPalabras(
    estudiante.curso
  );
  estudiante.escuela = capitalizarPalabras(
    estudiante.escuela
  );
  estudiante.nombre_padre = capitalizarPalabras(
    estudiante.nombre_padre
  );
  estudiante.nombre_madre = capitalizarPalabras(
    estudiante.nombre_madre
  );
  estudiante.representante = capitalizarPalabras(
    estudiante.representante
  );

  estudiante.activo = false; // Usuario no activo hasta autorizar
  estudiante.pendiente = true;

  const estudiantes = JSON.parse(
    localStorage.getItem("estudiantes") || "[]"
  );

  if (
    estudiantes.some(
      (e) =>
        e.nombres === estudiante.nombres &&
        e.apellidos === estudiante.apellidos &&
        e.fecha_nacimiento ===
          estudiante.fecha_nacimiento
    )
  ) {
    alert(
      "⚠️ Este estudiante ya está registrado."
    );
    return;
  }

  const nombreUsuario =
    estudiante.nombres
      .toLowerCase()
      .split(" ")[0] +
    estudiante.apellidos
      .toLowerCase()
      .split(" ")[0];

  estudiante.usuario = nombreUsuario;
  estudiante.fecha_registro =
    new Date().toISOString();

  estudiantes.push(estudiante);
  localStorage.setItem(
    "estudiantes",
    JSON.stringify(estudiantes)
  );

  // Guardar representante
  const representantes = JSON.parse(
    localStorage.getItem("representantes") || "[]"
  );

  representantes.push({
    nombre: estudiante.representante,
    estudianteUsuario: nombreUsuario,
    usuario: nombreUsuario + "_rep",
    contrasena: estudiante.password,
    rol: "representante",
  });

  localStorage.setItem(
    "representantes",
    JSON.stringify(representantes)
  );

  alert(
    `✅ ¡Registro exitoso!\n\nUsuario: ${nombreUsuario}\nContraseña: (la que ingresaste)\n\nSerás redirigido al inicio de sesión.`
  );

  setTimeout(() => {
    location.href = "../../auth/login/login.html";
  }, 1500);
}
