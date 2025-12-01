console.log("🔧 header.js cargado - Iniciando configuración...");

// Función para obtener y mostrar el nombre del usuario
function actualizarHeader() {
    console.log("🔄 Actualizando header...");
    
    // Obtener el nombre del usuario desde localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const userNameElement = document.getElementById('userName');
    
    console.log("📝 Nombre de usuario encontrado:", nombreUsuario);
    console.log("🔍 Elemento userName:", userNameElement);
    
    if (userNameElement) {
        if (nombreUsuario && nombreUsuario !== 'null' && nombreUsuario !== 'undefined') {
            userNameElement.innerHTML = `Usuario: <span class="user-name">${nombreUsuario}</span>`;
            console.log("✅ Header actualizado con:", nombreUsuario);
        } else {
            userNameElement.innerHTML = `Usuario: <span class="user-name">nombre usuario</span>`;
            console.log("⚠️  Usando valor por defecto - No hay usuario en localStorage");
        }
    } else {
        console.error("❌ Elemento userName no encontrado en el DOM");
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    console.log("🚪 Iniciando cierre de sesión...");
    
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Limpiar datos de localStorage
        localStorage.removeItem('usuarioConcesionaria');
        localStorage.removeItem('nombreUsuario');
        
        console.log("🧹 Datos limpiados, redirigiendo...");
        
        // Redirigir a la página de login
        window.location.href = 'login.html';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM cargado - Configurando header...");
    
    actualizarHeader();
    
    // Asignar evento al botón de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        console.log("🔘 Botón logout encontrado, asignando evento...");
        logoutBtn.addEventListener('click', cerrarSesion);
    } else {
        console.error("❌ Botón logout no encontrado");
    }
});

// También ejecutar cuando la página termine de cargar
window.addEventListener('load', function() {
    console.log("🖼️  Página completamente cargada - Verificación final del header");
    actualizarHeader();
});

// Forzar actualización después de 1 segundo (por si acaso)
setTimeout(() => {
    console.log("⏰ Actualización forzada del header después de 1s");
    actualizarHeader();
}, 1000);
