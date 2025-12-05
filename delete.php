<?php
include "conexion.php";

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// borramos por patente
$patente = $_POST['Patente'] ?? '';

if (empty($patente)) {
    die("Error: Debe especificar la Patente/ID del vehículo para eliminar.");
}

// Primero borramos las imágenes asociadas
$sqlImg = "DELETE FROM imagenesVehiculos WHERE patente = '$patente'";
$conn->query($sqlImg);

// Luego borramos los estados
$sqlEstado = "DELETE FROM estadovehiculos WHERE patente = '$patente'";
$conn->query($sqlEstado);

// Finalmente borramos el vehículo
$sql = "DELETE FROM vehiculos WHERE patente = '$patente'";

if ($conn->query($sql) === TRUE) {
    echo "Vehículo eliminado correctamente.";
} else {
    echo "Error al eliminar vehículo: " . $conn->error;
}

$conn->close();
?>
