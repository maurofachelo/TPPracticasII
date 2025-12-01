<?php
session_start();
header("Content-Type: application/json");

// Incluir conexión
include 'conexion.php';   // define $conn

// Respuesta por defecto
$respuesta = ["ok" => false, "msg" => ""];

// Verificar que haya POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // ----------------------------------------------------
    // ============== INICIAR SESIÓN ======================
    // ----------------------------------------------------
    if (isset($_POST['login'])) {

        $legajo    = $_POST['legajo'] ?? '';
        $password  = $_POST['password'] ?? '';

        if ($legajo === '' || $password === '') {
            $respuesta["msg"] = "Completa todos los campos.";
            echo json_encode($respuesta);
            exit;
        }

        // Buscar usuario
        $stmt = $conn->prepare("SELECT id, legajo, nombre, email, password FROM usuarios WHERE legajo = ?");
        $stmt->bind_param("s", $legajo);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows === 1) {

            $row = $resultado->fetch_assoc();

            if (password_verify($password, $row['password'])) {
                // Guardar sesión
                $_SESSION["id"]     = $row["id"];
                $_SESSION["legajo"] = $row["legajo"];
                $_SESSION["nombre"] = $row["nombre"];
                $_SESSION["email"]  = $row["email"];

                $respuesta["ok"]  = true;
                $respuesta["msg"] = "Ingreso exitoso.";
                $respuesta["legajo"] = $row["legajo"];
                $respuesta["nombre"] = $row["nombre"];
            } else {
                $respuesta["msg"] = "Contraseña incorrecta.";
            }

        } else {
            $respuesta["msg"] = "El usuario no existe.";
        }

        echo json_encode($respuesta);
        exit;
    }

    // ----------------------------------------------------
    // ============== REGISTRAR USUARIO ===================
    // ----------------------------------------------------
    if (isset($_POST['registrar'])) {

        $legajo   = $_POST['legajo'] ?? '';
        $nombre   = $_POST['nombre'] ?? '';
        $email    = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        if ($legajo === '' || $nombre === '' || $email === '' || $password === '') {
            $respuesta["msg"] = "Completa todos los campos del registro.";
            echo json_encode($respuesta);
            exit;
        }

        // Verificar si ya existe el legajo
        $stmt = $conn->prepare("SELECT id FROM usuarios WHERE legajo = ?");
        $stmt->bind_param("s", $legajo);
        $stmt->execute();
        $res = $stmt->get_result();

        if ($res->num_rows > 0) {
            $respuesta["msg"] = "El usuario ya existe.";
            echo json_encode($respuesta);
            exit;
        }

        // Hashear contraseña
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // Insertar usuario nuevo
        $stmt = $conn->prepare("INSERT INTO usuarios (legajo, nombre, email, password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $legajo, $nombre, $email, $passwordHash);

        if ($stmt->execute()) {
            $respuesta["ok"]  = true;
            $respuesta["msg"] = "Registro exitoso.";
        } else {
            $respuesta["msg"] = "Error al registrar usuario.";
        }

        echo json_encode($respuesta);
        exit;
    }

}

// Si entra sin POST
$respuesta["msg"] = "Acceso inválido.";
echo json_encode($respuesta);
?>