<?php
include "conexion.php";

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Necesitamos el ID o Patente sí o sí
$patente = $_POST['patente'] ?? '';
if (empty($patente)) {
    echo json_encode(['success' => false, 'message' => 'Debe especificar la Patente/ID del vehículo para actualizar.']);
    exit;
}

// Traemos los valores enviados
$marca = $_POST['marca'] ?? '';
$modelo = $_POST['modelo'] ?? '';
$tipo = $_POST['tipo'] ?? '';
$anio = $_POST['anio'] ?? '';
$kilometraje = $_POST['kilometraje'] ?? '';
$precio = $_POST['precio'] ?? '';
$combustible = $_POST['combustible'] ?? '';
$fechaIngreso = $_POST['fechaIngreso'] ?? '';
$estadoMotor = $_POST['estadoMotor'] ?? '';
$estadoInterior = $_POST['estadoInterior'] ?? '';
$estadoExterior = $_POST['estadoExterior'] ?? '';

// --- Actualización dinámica para tabla vehiculos ---
$camposVehiculo = [];

if (!empty($marca)) $camposVehiculo[] = "marca = '$marca'";
if (!empty($modelo)) $camposVehiculo[] = "modelo = '$modelo'";
if (!empty($tipo)) $camposVehiculo[] = "tipo = '$tipo'";
if (!empty($anio)) $camposVehiculo[] = "anio = '$anio'";
if (!empty($kilometraje)) $camposVehiculo[] = "kilometraje = '$kilometraje'";
if (!empty($precio)) $camposVehiculo[] = "precio = '$precio'";
if (!empty($combustible)) $camposVehiculo[] = "combustible = '$combustible'";
if (!empty($fechaIngreso)) $camposVehiculo[] = "fechaIngreso = '$fechaIngreso'";

if (!empty($camposVehiculo)) {
    $sql = "UPDATE vehiculos SET " . implode(", ", $camposVehiculo) . " WHERE patente = '$patente'";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Datos del vehículo actualizados correctamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar vehículo: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No se proporcionaron datos para actualizar.']);
}

$conn->close();
?>