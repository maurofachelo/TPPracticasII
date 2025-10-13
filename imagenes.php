<?php
include 'conexion.php';

$patente = $_GET['patente'] ?? '';

if (empty($patente)) {
    echo json_encode([]);
    exit;
}

// Consulta preparada para seguridad
$sql = "SELECT rutaImagen FROM imagenesVehiculos WHERE patente = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("s", $patente);
    $stmt->execute();
    $result = $stmt->get_result();

    $imagenes = [];
    while ($row = $result->fetch_assoc()) {
        $imagenes[] = $row;
    }

    echo json_encode($imagenes);
    $stmt->close();
} else {
    echo json_encode([]);
}

$conn->close();
?>