let currentOffset = 0;
const limit = 6;
const tableBody = document.querySelector("#tablaVehiculos");

// Crear div de paginación
const paginationDiv = document.createElement("div");
paginationDiv.classList.add("pagination");

// Modales de Bootstrap
const modales = {
    delete: new bootstrap.Modal('#confirmDeleteModal'),
    update: new bootstrap.Modal('#confirmUpdateModal'),
    read: new bootstrap.Modal('#confirmReadModal'),
    alta: new bootstrap.Modal('#modalResultadoAlta')
};

// Elementos DOM frecuentes
const dom = {
    deleteModalBody: document.querySelector('#deleteModalBody'),
    updateModalBody: document.querySelector('#updateModalBody'),
    confirmDeleteBtn: document.querySelector('#confirmDeleteBtn'),
    confirmUpdateBtn: document.querySelector('#confirmUpdateBtn'),
    modalReadAtributos: document.querySelector('#modalReadAtributos'),
    modalReadImagenes: document.querySelector('#modalReadImagenes'),
    btnConsultar: document.querySelector('#btnConsultar'),
    btnBorrar: document.querySelector('#btnBorrar'),
    btnActualizar: document.querySelector('#btnActualizar'),
    formulario: document.querySelector("#formularioPrincipal")
};

// ============ FUNCIONES UTILITARIAS ============
function validarPatente(patente) {
    patente = patente.trim().toUpperCase();
    const formato = /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/;
    
    if (!patente) return { valido: false, mensaje: "Debe ingresar una patente." };
    if (!formato.test(patente)) return { valido: false, mensaje: "Formato inválido. Ej: ABC123 o AB123CD" };
    
    return { valido: true, patente: patente };
}

function obtenerFiltros() {
    return {
        patente: document.querySelector('input[name="patente"]').value.trim(),
        marca: document.querySelector('input[name="marca"]').value.trim(),
        modelo: document.querySelector('input[name="modelo"]').value.trim(),
        tipo: document.querySelector('#tipo').value,
        anio: document.querySelector('input[name="anio"]').value.trim(),
        precio: document.querySelector('input[name="precio"]').value.trim(),
        combustible: document.querySelector('#combustible').value
    };
}

function validarCamposCreacion() {
    const campos = {
        patente: document.querySelector('input[name="patente"]').value.trim(),
        marca: document.querySelector('input[name="marca"]').value.trim(),
        modelo: document.querySelector('input[name="modelo"]').value.trim(),
        tipo: document.querySelector('#tipo').value,
        anio: document.querySelector('input[name="anio"]').value.trim(),
        precio: document.querySelector('input[name="precio"]').value.trim(),
        combustible: document.querySelector('#combustible').value
    };

    const validacion = validarPatente(campos.patente);
    if (!validacion.valido) {
        alert(validacion.mensaje);
        return false;
    }

    for (const [campo, valor] of Object.entries(campos)) {
        if (!valor || valor === '') {
            alert(`El campo ${campo.toUpperCase()} es obligatorio.`);
            return false;
        }
    }
    
    return true;
}

function obtenerFilaPorPatente(patente) {
    return document.querySelector(`#tablaVehiculos tr[data-patente='${patente}']`);
}

// ============ FUNCIONES PRINCIPALES ============
function cargarVehiculos(offset = 0, filtros = {}) {
    const params = new URLSearchParams({ limit, offset, ...filtros });
    
    fetch(`read.php?${params.toString()}`)
        .then(res => res.text())
        .then(data => {
            tableBody.innerHTML = data;
            renderizarPaginacion(offset, filtros);
        })
        .catch(err => console.error("Error cargando vehículos:", err));
}

function renderizarPaginacion(offset, filtros) {
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
}

function cargarImagenesVehiculo(patente) {
    fetch(`imagenes.php?patente=${encodeURIComponent(patente)}`)
        .then(res => res.json())
        .then(imagenes => {
            let html = '<h6>Imágenes del vehículo:</h6>';
            
            if (imagenes.length > 0) {
                html += '<div class="d-flex flex-wrap gap-2">';
                imagenes.forEach(img => {
                    html += `<img src="fotos/${img.rutaImagen}" class="img-thumbnail" style="width: 100px; height: 80px; object-fit: cover;">`;
                });
                html += '</div>';
            } else {
                html += '<p class="text-muted">No hay imágenes disponibles</p>';
            }
            
            dom.modalReadImagenes.innerHTML = html;
        })
        .catch(err => {
            console.error("Error cargando imágenes:", err);
            dom.modalReadImagenes.innerHTML = '<p class="text-danger">Error al cargar imágenes</p>';
        });
}

// ============ MANEJADORES DE EVENTOS ============
function configurarEventos() {
    // Consultar
    dom.btnConsultar.addEventListener("click", () => {
        currentOffset = 0;
        cargarVehiculos(0, obtenerFiltros());
    });

    // Borrar
    dom.btnBorrar.addEventListener("click", (e) => {
        e.preventDefault();
        const patente = document.querySelector('input[name="patente"]').value.trim();
        
        if (!patente) {
            alert("Ingrese la Patente para eliminar.");
            return;
        }
        
        const fila = obtenerFilaPorPatente(patente);
        if (!fila) {
            alert("Vehículo no encontrado.");
            return;
        }

        dom.deleteModalBody.innerHTML = `
            <p>¿Seguro que querés borrar este vehículo?</p>
            <ul>
                <li><strong>Patente:</strong> ${patente}</li>
                <li><strong>Marca:</strong> ${fila.getAttribute("data-marca") || "No especificada"}</li>
                <li><strong>Modelo:</strong> ${fila.getAttribute("data-modelo") || "No especificado"}</li>
            </ul>
        `;

        dom.confirmDeleteBtn.dataset.patente = patente;
        modales.delete.show();
    });

    // Confirmar borrado
    dom.confirmDeleteBtn.addEventListener("click", () => {
        const patente = dom.confirmDeleteBtn.dataset.patente;
        
        fetch("delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `Patente=${encodeURIComponent(patente)}`
        })
        .then(res => res.text())
        .then(data => {
            alert(data);
            cargarVehiculos(currentOffset);
            modales.delete.hide();
        })
        .catch(err => console.error(err));
    });

    // Actualizar
    dom.btnActualizar.addEventListener("click", (e) => {
        e.preventDefault();
        const patente = document.querySelector('input[name="patente"]').value.trim();
        
        if (!patente) {
            alert("Ingrese la Patente para actualizar.");
            return;
        }
        
        const fila = obtenerFilaPorPatente(patente);
        if (!fila) {
            alert("Vehículo no encontrado.");
            return;
        }

        const campos = {
            patente: patente,
            marca: document.querySelector('input[name="marca"]').value || "Sin cambios",
            modelo: document.querySelector('input[name="modelo"]').value || "Sin cambios",
            fechaIngreso: document.querySelector('input[name="fechaIngreso"]').value || "Sin cambios",
            tipo: document.querySelector('#tipo').value || "Sin cambios",
            anio: document.querySelector('input[name="anio"]').value || "Sin cambios",
            precio: document.querySelector('input[name="precio"]').value || "Sin cambios",
            combustible: document.querySelector('#combustible').value || "Sin cambios",
            estadoMotor: document.querySelector('#estadoMotor').value || "Sin cambios",
            estadoInterior: document.querySelector('#estadoInterior').value || "Sin cambios",
            estadoExterior: document.querySelector('#estadoExterior').value || "Sin cambios"
        };

        let listaHTML = '';
        for (const [key, value] of Object.entries(campos)) {
            listaHTML += `<li><strong>${key}:</strong> ${value}</li>`;
        }

        dom.updateModalBody.innerHTML = `
            <p>¿Actualizar vehículo?</p>
            <ul>${listaHTML}</ul>
        `;

        dom.confirmUpdateBtn.dataset.patente = patente;
        modales.update.show();
    });

    // Confirmar actualización
    dom.confirmUpdateBtn.addEventListener("click", () => {
        const formData = new FormData(dom.formulario);
        
        fetch("update.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert(data.success ? data.message : "Error: " + data.message);
            if (data.success) {
                cargarVehiculos(currentOffset);
                modales.update.hide();
            }
        })
        .catch(err => console.error(err));
    });

    // Crear vehículo
    dom.formulario.addEventListener("submit", function(e) {
        e.preventDefault();
        
        if (!validarCamposCreacion()) return;
        
        fetch("create.php", {
            method: "POST",
            body: new FormData(this)
        })
        .then(res => res.json())
        .then(data => {
            const modalBody = document.getElementById("resultadoAltaBody");
            
            if (data.success) {
                modalBody.innerHTML = `<p><strong>${data.message}</strong></p>`;
            } else {
                modalBody.innerHTML = `<p class="text-danger"><strong>Error:</strong> ${data.message}</p>`;
            }
            
            modales.alta.show();
            cargarVehiculos(currentOffset);
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Ocurrió un error inesperado.");
        });
    });

    // Leer vehículo (click en fila)
    tableBody.addEventListener('click', (e) => {
        const fila = e.target.closest('tr');
        if (!fila) return;
        
        const datos = {
            patente: fila.getAttribute('data-patente'),
            marca: fila.getAttribute('data-marca'),
            modelo: fila.getAttribute('data-modelo'),
            tipo: fila.getAttribute('data-tipo'),
            anio: fila.getAttribute('data-anio'),
            kilometraje: fila.getAttribute('data-kilometraje'),
            combustible: fila.getAttribute('data-combustible'),
            precio: fila.getAttribute('data-precio'),
            fechaIngreso: fila.getAttribute('data-fechaIngreso')
        };

        dom.modalReadAtributos.innerHTML = `
            <div class="row">
                <div class="col-6">
                    <p><strong>Patente:</strong> ${datos.patente || 'N/A'}</p>
                    <p><strong>Marca:</strong> ${datos.marca || 'N/A'}</p>
                    <p><strong>Modelo:</strong> ${datos.modelo || 'N/A'}</p>
                    <p><strong>Tipo:</strong> ${datos.tipo || 'N/A'}</p>
                </div>
                <div class="col-6">
                    <p><strong>Año:</strong> ${datos.anio || 'N/A'}</p>
                    <p><strong>Kilometraje:</strong> ${datos.kilometraje ? datos.kilometraje + ' km' : 'N/A'}</p>
                    <p><strong>Combustible:</strong> ${datos.combustible || 'N/A'}</p>
                    <p><strong>Precio:</strong> ${datos.precio ? '$' + parseInt(datos.precio).toLocaleString() : 'N/A'}</p>
                </div>
            <p class="col-12 center"><strong>Fecha de ingreso:</strong> ${datos.fechaIngreso || 'N/A'}</p>
            </div>
        `;

        cargarImagenesVehiculo(datos.patente);
        modales.read.show();
    });
}

// ============ INICIALIZACIÓN ============
document.addEventListener("DOMContentLoaded", () => {
    cargarVehiculos();
    configurarEventos();
});
