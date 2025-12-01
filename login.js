document.addEventListener("DOMContentLoaded", function() {
    
    // Modal REGISTRO USUARIO
    document.querySelector("#formularioRegistro").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        formData.append('registrar', '1');

        fetch("Login.php", {
            method: "POST",
            body: formData
        })
        .then(r => r.json())
        .then(data => {
            const body = document.getElementById("modalRegistroBody");
            const modal = new bootstrap.Modal(document.getElementById("modalRegistro"));
            
            body.innerHTML = `<p class="${data.ok ? "text-success" : "text-danger"}"><strong>${data.msg}</strong></p>`;
            modal.show();
            
            if (data.ok) {
                this.reset();
            }
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Error de conexión");
        });
    });

    // Modal LOGIN USUARIO
    document.querySelector("#formularioLogin").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        formData.append('login', '1');

        fetch("Login.php", {
            method: "POST",
            body: formData
        })
        .then(r => r.json())
        .then(data => {
            const body = document.getElementById("modalLoginBody");
            const modal = new bootstrap.Modal(document.getElementById("modalLogin"));
            
            body.innerHTML = `<p class="${data.ok ? "text-success" : "text-danger"}"><strong>${data.msg}</strong></p>`;
            modal.show();

            // Si el login es exitoso, guardar datos del usuario
            if (data.ok) {
                // Guardar en localStorage para usar en el header
                localStorage.setItem('usuarioConcesionaria', data.legajo || 'Usuario');
                localStorage.setItem('nombreUsuario', data.nombre || 'Usuario');
                
                // Redirigir después de un breve delay
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            }
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Error de conexión");
        });
    });
});
