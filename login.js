document.addEventListener("DOMContentLoaded", function() {
    
    // 1. REGISTRO DE USUARIO (manteniendo tu estructura básica)
    document.querySelector("#formularioRegistro").addEventListener("submit", function(e) {
        e.preventDefault();
        
        fetch("Login.php", {
            method: "POST",
            body: new FormData(this)
        })
        .then(r => r.json())
        .then(data => {
            const modal = new bootstrap.Modal(document.getElementById("modalRegistro"));
            document.getElementById("modalRegistroBody").innerHTML = 
                `<p class="${data.ok ? "text-success" : "text-danger"}"><strong>${data.msg}</strong></p>`;
            modal.show();
            
            if (data.ok) this.reset();
        })
        .catch(err => alert("Error de conexión"));
    });

    // 2. LOGIN DE USUARIO (versión simplificada)
    document.querySelector("#formularioLogin").addEventListener("submit", function(e) {
        e.preventDefault();
        
        fetch("Login.php", {
            method: "POST",
            body: new FormData(this)
        })
        .then(r => r.json())
        .then(data => {
            // Mostrar mensaje en modal
            const modal = new bootstrap.Modal(document.getElementById("modalLogin"));
            document.getElementById("modalLoginBody").innerHTML = 
                `<p class="${data.ok ? "text-success" : "text-danger"}"><strong>${data.msg}</strong></p>`;
            modal.show();
            
            // Si login es exitoso
            if (data.ok) {
                // Guardar datos del usuario
                localStorage.setItem('usuarioConcesionaria', data.legajo);
                localStorage.setItem('nombreUsuario', data.nombre);
                
                // Redirigir después de mostrar el modal brevemente
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000); // 1 segundo para que se vea el mensaje
            }
        })
        .catch(err => alert("Error de conexión"));
    });
});
