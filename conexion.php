<?php
                    // Parámetros de conexión
$host = "localhost";
$usuario = "root";
$contrasena = ""; 
$baseDatos = "concesionaria"; 
                    //http://localhost/Practicas%20II/CRUD/TP%20final/index.html

                    // Conectar a la base de datos
$conn = new mysqli($host, $usuario, $contrasena, $baseDatos);

                    // Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
//echo "La conexion con tu Base de Datos fue exitosa <br>";

?>
