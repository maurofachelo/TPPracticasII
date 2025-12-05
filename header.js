document.addEventListener('DOMContentLoaded', function() {
    // 1. Mostrar nombre del usuario
    const nombre = localStorage.getItem('nombreUsuario');
    const elemNombre = document.getElementById('userName');
    
    if (elemNombre && nombre) {
        elemNombre.textContent = `Usuario: ${nombre}`;
    }
    
    // 2. Configurar botón de logout
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        if (confirm('¿Cerrar sesión?')) {
            localStorage.removeItem('nombreUsuario');
            localStorage.removeItem('usuarioConcesionaria');
            window.location.href = 'login.html';
        }
    });
});
