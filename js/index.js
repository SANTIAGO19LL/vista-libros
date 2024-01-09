const tabla = document.getElementById("tablaLibros");
const titulo = document.getElementById("titulo");
const form = document.getElementById("formulario");
const template = document.getElementById("crudTemplate").content;
const fragmento = document.createDocumentFragment();
const boton = document.getElementById("boton");

const baseUrl = "http://localhost:3000/api/libros";
const getAll = async () => {
  try {
    let res = await fetch(baseUrl);
    const json = await res.json();

    if (!res.ok) throw { status: res.status, statusText: res.statusText };
    json.forEach((el) => {
      template.querySelector(".titulo").textContent = el.titulo;
      template.querySelector(".autor").textContent = el.autor;
      template.querySelector(".isbn").textContent = el.isbn;
      template.querySelector(".anioPublicacion").textContent =
        el.anioPublicacion;
      template.querySelector(".genero").textContent = el.genero;
      template.querySelector(".numeroPaginas").textContent = el.numeroPaginas;
      template.querySelector("#edit").dataset.id = el.id;
      template.querySelector("#edit").dataset.titulo = el.titulo;
      template.querySelector("#edit").dataset.autor = el.autor;
      template.querySelector("#edit").dataset.isbn = el.isbn;
      template.querySelector("#edit").dataset.anioPublicacion =
        el.anioPublicacion;
      template.querySelector("#edit").dataset.genero = el.genero;
      template.querySelector("#edit").dataset.editorial = el.editorial;
      template.querySelector("#edit").dataset.numeroPaginas = el.numeroPaginas;
      template.querySelector("#delete").dataset.id = el.id;

      let clone = document.importNode(template, true);
      fragmento.appendChild(clone);
    });

    tabla.querySelector("tbody").appendChild(fragmento);
  } catch (error) {
    let message = error.statusText || "Ocurrio un error";
    tabla.insertAdjacentHTML(
      "afterend",
      `<p><b>Error: ${error.status} ${message}</b></p>`
    );
  }
};

document.addEventListener("DOMContentLoaded", getAll);
document.addEventListener("submit", async (e) => {
  if (e.target === form) {
    e.preventDefault();

    const isValid = validateForm(e.target);

    if (isValid) {
      if (!e.target.id.value) {
        //crear
        let options = {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            titulo: e.target.titulo.value,
            autor: e.target.autor.value,
            isbn: e.target.isbn.value,
            editorial: e.target.editorial.value,
            anioPublicacion: e.target.anioPublicacion.value,
            genero: e.target.genero.value,
            numeroPaginas: e.target.numeroPaginas.value,
          }),
        };
        try {
          let res = await fetch(baseUrl, options);
          const json = await res.json();
          if (!res.ok) throw { status: res.status, statusText: res.statusText };
          location.reload();
        } catch (err) {
          let message = err.statusText || "Ocurrio un error";
          tabla.insertAdjacentHTML(
            "afterend",
            `<p><b>Error: ${err.status} ${message}</b></p>`
          );
        }
      } else {
        // actualizar
        let options = {
          method: "PUT",
          headers: {
            "Content-type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            titulo: e.target.titulo.value,
            autor: e.target.autor.value,
            isbn: e.target.isbn.value,
            editorial: e.target.editorial.value,
            anioPublicacion: e.target.anioPublicacion.value,
            genero: e.target.genero.value,
            numeroPaginas: e.target.numeroPaginas.value,
          }),
        };
        try {
          let res = await fetch(`${baseUrl}/${e.target.id.value}`, options);
          const json = await res.json();
          console.log(res);
          if (!res.ok) throw { status: res.status, statusText: res.statusText };
          location.reload();
        } catch (err) {
          let message = err.statusText || "Ocurrio un error";
          tabla.insertAdjacentHTML(
            "afterend",
            `<p><b>Error: ${err.status} ${message}</b></p>`
          );
        }
      }
    }
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.matches("#edit")) {
    titulo.textContent = "Editar Libro";
    boton.textContent = "Actualizar Libro";
    form.titulo.value = e.target.dataset.titulo;
    form.autor.value = e.target.dataset.autor;
    form.isbn.value = e.target.dataset.isbn;
    form.anioPublicacion.value = e.target.dataset.anioPublicacion;
    form.genero.value = e.target.dataset.genero;
    form.editorial.value = e.target.dataset.editorial;
    form.numeroPaginas.value = e.target.dataset.numeroPaginas;
    form.id.value = e.target.dataset.id;
  }

  if (e.target.matches("#delete")) {
    let isDelete = confirm(`Estas seguro de eliminar este libro`);
    if (isDelete) {
      let options = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json;charset=utf-8",
        },
      };
      try {
        const res = await fetch(`${baseUrl}/${e.target.dataset.id}`, options);
        const json = await res.json();
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        location.reload();
      } catch (error) {
        let message = error.statusText || "Ocurrio un error";
        alert(`Error: ${error.status} ${message}`);
      }
    }
  }
});

function validateForm(form) {
  let isValid = true;

  // Limpiar mensajes de error anteriores
  clearErrorMessages();

  // Validar campos requeridos
  const requiredFields = [
    "titulo",
    "autor",
    "isbn",
    "editorial",
    "anioPublicacion",
    "genero",
    "numeroPaginas",
  ];
  requiredFields.forEach((field) => {
    const input = form[field];
    if (!input.value.trim()) {
      displayErrorMessage(input, "Este campo es obligatorio");
      isValid = false;
    }
  });

  // Validar tipos de datos
  const numericFields = ["anioPublicacion", "numeroPaginas"];
  numericFields.forEach((field) => {
    const input = form[field];
    if (!isNumeric(input.value.trim())) {
      displayErrorMessage(input, "Debe ser un valor numérico");
      isValid = false;
    }
  });

  return isValid;
}

function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

function displayErrorMessage(input, message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;

  input.parentNode.appendChild(errorDiv);
}

function clearErrorMessages() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((error) => {
    error.parentNode.removeChild(error);
  });
}
