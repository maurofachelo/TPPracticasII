let currentOffset = 0;
const limit = 6;

const tableBody = document.querySelector("#tablaVehiculos");
const paginationDiv = document.createElement("div");
paginationDiv.classList.add("pagination"); //<div class="pagination"></div>

const btnBorrar = document.querySelector("#btnBorrar");
const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
const deleteModalBody = document.querySelector('#deleteModalBody');
const confirmDeleteBtn = document.querySelector('#confirmDeleteBtn');

const btnActualizar = document.querySelector("#btnActualizar");
const confirmUpdateModal = new bootstrap.Modal(document.getElementById('confirmUpdateModal'));
const updateModalBody = document.querySelector('#updateModalBody');
const confirmUpdateBtn = document.querySelector('#confirmUpdateBtn');

const confirmReadModal = new bootstrap.Modal(document.getElementById('confirmReadModal'));
const modalReadAtributos = document.querySelector('#modalReadAtributos');
const modalReadImagenes = document.querySelector('#modalReadImagenes');


                                          //funcion validar patente ABC123 o AB123CD
function validarPatente(patente) {
  
  patente = patente.trim().toUpperCase(); //saca espacios y pone en mayusculas

  const formatoPatente = /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/;

  if (!patente) {
    alert("Debe ingresar una patente.");
    return false;
  }

  if (!formatoPatente.test(patente)) {
    alert("Formato de patente inválido. Ejemplos válidos: ABC123 o AB123CD");
    return false;
  }

  return true;
}


// Función principal para cargar vehículos (leer)
function cargarVehiculos(offset = 0, filtros = {}) { //offset para paginacion por defecto =0, pag 2=5, pag 3=15
  const params = new URLSearchParams({
    limit,
    offset,
    ...filtros
  });

  fetch(`read.php?${params.toString()}`)  //peticion al servicdor
    .then(res => res.text())              //parsea a texto
    .then(data => {                     
      tableBody.innerHTML = data;         //inserta en la tabla


      // paginación prev next
      paginationDiv.innerHTML = `
        <button id="prevBtn" ${offset === 0 ? "disabled" : ""}>&lt;&lt; Anterior</button>
        <button id="nextBtn">Siguiente &gt;&gt;</button>
      `;
      document.querySelector("table").after(paginationDiv);

      document.querySelector("#prevBtn").addEventListener("click", () => {
        if (currentOffset >= limit) {
          currentOffset -= limit;
          cargarVehiculos(currentOffset, filtros);
        }
      });

      document.querySelector("#nextBtn").addEventListener("click", () => {
        currentOffset += limit;
        cargarVehiculos(currentOffset, filtros);
      });
    })
    .catch(err => console.error("Error cargando vehículos:", err));
}

// Carga de primeros vehículos al iniciar
document.addEventListener("DOMContentLoaded", () => {
  cargarVehiculos();
});

// Botón Consultar: leer todos los filtros
document.querySelector("#btnConsultar").addEventListener("click", () => {
  const filtros = {
    patente: document.querySelector('input[name="patente"]').value.trim(),
    marca: document.querySelector('input[name="marca"]').value.trim(),
    modelo: document.querySelector('input[name="modelo"]').value.trim(),
    tipo: document.querySelector('#tipo').value,
    anio: document.querySelector('input[name="anio"]').value.trim(),
    precio: document.querySelector('input[name="precio"]').value.trim(),
    combustible: document.querySelector('#combustible').value
  };
  
  console.log("Filtros aplicados:", filtros); // ← Para ver en consola
  
  currentOffset = 0;
  cargarVehiculos(0, filtros);
});

// Botón Borrar del formulario
btnBorrar.addEventListener("click", (e) => {
  e.preventDefault();     // Evita enviar el formulario

  const patente = document.querySelector('input[name="patente"]').value.trim();
  if (!patente) {
    alert("Debe ingresar la Patente para eliminar.");
    return;
  }

  // Buscar la fila correspondiente en la tabla usando data-atributos
  const fila = document.querySelector(`#tablaVehiculos tr[data-patente='${patente}']`);
  if (!fila) {
    alert("No se encontró el vehículo en la tabla.");
    return;
  }

  const marca = fila.getAttribute("data-marca");
  const modelo = fila.getAttribute("data-modelo");
  const fechaIngreso = fila.getAttribute("data-fechaIngreso");

  // Mostrar datos en el modal
  deleteModalBody.innerHTML = `
    <p>¿Seguro que querés borrar el vehículo con los siguientes datos?</p>
    <ul>
      <li><strong>Patente:</strong> ${patente}</li>
      <li><strong>Marca:</strong> ${marca || "No especificada"}</li>
      <li><strong>Modelo:</strong> ${modelo || "No especificado"}</li>
      <li><strong>Fecha de Ingreso:</strong> ${fechaIngreso || "No especificada"}</li>
    </ul>
  `;

  confirmDeleteBtn.dataset.patente = patente; // Guarda patente en el botón
  confirmDeleteModal.show();
});

            // confirmar en el modal
confirmDeleteBtn.addEventListener("click", () => {
  const patente = confirmDeleteBtn.dataset.patente;

  fetch("delete.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `Patente=${encodeURIComponent(patente)}`
  })
  .then(res => res.text())
  .then(data => {
    alert(data);                    // Mensaje de delete.php
    cargarVehiculos(currentOffset); // Refresca la tabla
    confirmDeleteModal.hide();      // Oculta el modal
  })
  .catch(err => console.error(err));
});




// Botón ACTUALIZAR del formulario
btnActualizar.addEventListener("click", (e) => {
  e.preventDefault();     // Evita enviar el formulario

  const patente = document.querySelector('input[name="patente"]').value.trim();
  if (!patente) {
    alert("Debe ingresar la Patente para Actualizar.");
    return;
  }

  // Buscar la fila correspondiente en la tabla usando data-atributos
  const fila = document.querySelector(`#tablaVehiculos tr[data-patente='${patente}']`);
  if (!fila) {
    alert("No se encontró el vehículo en la tabla.");
    return;
  }

  
const marca = document.querySelector('input[name="marca"]').value || "Sin cambios";
const modelo = document.querySelector('input[name="modelo"]').value || "Sin cambios";
const fechaIngreso = document.querySelector('input[name="fechaIngreso"]').value || "Sin cambios";
const tipo = document.querySelector('#tipo').value || "Sin cambios";
const anio = document.querySelector('input[name="anio"]').value || "Sin cambios";
const precio = document.querySelector('input[name="precio"]').value || "Sin cambios";
const combustible = document.querySelector('#combustible').value || "Sin cambios";
const estadoMotor = document.querySelector('#estadoMotor').value || "Sin cambios";
const estadoInterior = document.querySelector('#estadoInterior').value || "Sin cambios";
const estadoExterior = document.querySelector('#estadoExterior').value || "Sin cambios";

  // Mostrar datos en el modal
  updateModalBody.innerHTML = `
    <p>¿Seguro que querés Actualizar el vehículo con los siguientes datos?</p>
    <ul>
      <li><strong>Patente:</strong> ${patente}</li>
      <li><strong>Marca:</strong> ${marca || "No especificada"}</li>
      <li><strong>Modelo:</strong> ${modelo || "No especificado"}</li>
      <li><strong>Fecha de Ingreso:</strong> ${fechaIngreso || "No especificada"}</li>
      <li><strong>Tipo:</strong> ${tipo || "No especificado"}</li>
      <li><strong>Año:</strong> ${anio || "No especificada"}</li>
      <li><strong>Precio:</strong> ${precio || "No especificado"}</li>
      <li><strong>Combustible:</strong> ${combustible || "No especificada"}</li>
      <li><strong>Estado del Motor:</strong> ${estadoMotor || "No especificado"}</li>
      <li><strong>Estado del Interior:</strong> ${estadoInterior || "No especificada"}</li>
      <li><strong>Estado del Exterior:</strong> ${estadoExterior || "No especificado"}</li>
    </ul>
  `;

  confirmUpdateBtn.dataset.patente = patente; // Guarda patente en el botón
  confirmUpdateModal.show();
});

            // confirmar en el modal
confirmUpdateBtn.addEventListener("click", () => {
  const patente = confirmUpdateBtn.dataset.patente;
  
  // Crear FormData del formulario completo
  const formData = new FormData(document.getElementById("formularioPrincipal"));
  
  fetch("update.php", {
    method: "POST",
    body: formData  // envía TODOS los datos del formulario
  })
  .then(res => res.json())  // Asegúrate que update.php devuelva JSON
  .then(data => {
    if (data.success) {
      alert(data.message);
      cargarVehiculos(currentOffset);
      confirmUpdateModal.hide();
    } else {
      alert("Error: " + data.message);
    }
  })
  .catch(err => console.error(err));
});



// modal Crear Vehiculo
document.querySelector("#formularioPrincipal").addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("Formulario enviado"); // ← Para ver si se ejecuta

  fetch("create.php", {
    method: "POST",
    body: new FormData(this)
  })
  .then(res => {
    console.log("Respuesta recibida, status:", res.status); // ← Para ver la respuesta HTTP
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
    .then(data => {
    console.log("Datos parseados:", data); // ← Para ver los datos
    const modalBody = document.getElementById("resultadoAltaBody");
    const modal = new bootstrap.Modal(document.getElementById("modalResultadoAlta"));

    if (data.success) {
      modalBody.innerHTML = `
        <p><strong>${data.message}</strong></p>
        <ul>
          <li>Patente: ${data.detalle.patente}</li>
        </ul>
      `;
    } else {
      modalBody.innerHTML = `<p class="text-danger"><strong>Error:</strong> ${data.message}</p>`;
    }

    modal.show();
  })
  .catch(err => {
    console.error("Error completo:", err); // ← Para ver el error real
    console.error("Error al agregar vehículo:", err);
    alert("Ocurrió un error inesperado.");
  });
});




// modal READ
function cargarImagenesVehiculo(patente) {
    fetch(`imagenes.php?patente=${encodeURIComponent(patente)}`)
        .then(res => res.json())
        .then(imagenes => {
            let htmlImagenes = '<h6>Imágenes del vehículo:</h6>';
            
            if (imagenes.length > 0) {
                htmlImagenes += '<div class="d-flex flex-wrap gap-2">';
                imagenes.forEach(imagen => {
                    htmlImagenes += `
                        <img src="fotos/${imagen.rutaImagen}" 
                        class="img-thumbnail" 
                        style="width: 100px; height: 80px; object-fit: cover;"
                        alt="Vehículo ${patente}">
                    `;
                });
                htmlImagenes += '</div>';
            } else {
                htmlImagenes += '<p class="text-muted">No hay imágenes disponibles</p>';
            }
            
            modalReadImagenes.innerHTML = htmlImagenes;
        })
        .catch(err => {
            console.error("Error cargando imágenes:", err);
            modalReadImagenes.innerHTML = '<p class="text-danger">Error al cargar imágenes</p>';
        });
}

// Event listener para clic en filas de la tabla
tableBody.addEventListener('click', (e) => {
    // Encontrar la fila clickeada
    const fila = e.target.closest('tr');
    if (!fila) return;
    
    // Obtener todos los data-atributos de la fila
    const patente = fila.getAttribute('data-patente');
    const marca = fila.getAttribute('data-marca');
    const modelo = fila.getAttribute('data-modelo');
    const tipo = fila.getAttribute('data-tipo');
    const anio = fila.getAttribute('data-anio');
    const kilometraje = fila.getAttribute('data-kilometraje');
    const combustible = fila.getAttribute('data-combustible');
    const precio = fila.getAttribute('data-precio');
    const fechaIngreso = fila.getAttribute('data-fechaIngreso');
    
    // Construir HTML para los atributos
    const htmlAtributos = `
        <div class="row">
            <div class="col-6">
                <p><strong>Patente:</strong> ${patente || 'N/A'}</p>
                <p><strong>Marca:</strong> ${marca || 'N/A'}</p>
                <p><strong>Modelo:</strong> ${modelo || 'N/A'}</p>
                <p><strong>Tipo:</strong> ${tipo || 'N/A'}</p>
            </div>
            <div class="col-6">
                <p><strong>Año:</strong> ${anio || 'N/A'}</p>
                <p><strong>Kilometraje:</strong> ${kilometraje ? kilometraje + ' km' : 'N/A'}</p>
                <p><strong>Combustible:</strong> ${combustible || 'N/A'}</p>
                <p><strong>Precio:</strong> ${precio ? '$' + parseInt(precio).toLocaleString() : 'N/A'}</p>
            </div>
        <p class= "col-12 center"><strong>Fecha de ingreso:</strong> ${fechaIngreso || 'N/A'}</p>
        </div>
    `;
    
    // Mostrar atributos
    modalReadAtributos.innerHTML = htmlAtributos;
    
    // Cargar imágenes
    cargarImagenesVehiculo(patente);
    
    // Mostrar modal
    confirmReadModal.show();
});
