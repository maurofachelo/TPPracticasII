<?php
include "conexion.php";

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 6;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

// Filtros desde la URL
$patente = $_GET['patente'] ?? '';
$marca = $_GET['marca'] ?? '';
$modelo = $_GET['modelo'] ?? '';
$tipo = $_GET['tipo'] ?? '';
$anio = $_GET['anio'] ?? '';
$precio = $_GET['precio'] ?? '';
$combustible = $_GET['combustible'] ?? '';

$sql = "SELECT v.patente, v.marca, v.modelo, v.tipo, v.anio, v.kilometraje,
               v.combustible, v.precio, v.fechaIngreso
        FROM vehiculos AS v
        WHERE 1=1";

// filtros dinámicos
if ($patente !== '') $sql .= " AND v.patente = '$patente'";
if ($marca !== '') $sql .= " AND v.marca LIKE '%$marca%'";
if ($modelo !== '') $sql .= " AND v.modelo LIKE '%$modelo%'";
if ($tipo !== '') $sql .= " AND v.tipo = '$tipo'";
if ($anio !== '') $sql .= " AND v.anio = '$anio'";
if ($precio !== '') $sql .= " AND v.precio <= '$precio'";  // remarcar en manual que trae los de menor precio que...
if ($combustible !== '') $sql .= " AND v.combustible = '$combustible'";

$sql .= " ORDER BY v.fechaIngreso DESC LIMIT $limit OFFSET $offset";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
echo "<tr 
        data-patente='{$row['patente']}' 
        data-marca='{$row['marca']}' 
        data-modelo='{$row['modelo']}' 
        data-tipo='{$row['tipo']}'
        data-anio='{$row['anio']}'
        data-kilometraje='{$row['kilometraje']}'
        data-combustible='{$row['combustible']}'
        data-precio='{$row['precio']}'
        data-fechaIngreso='{$row['fechaIngreso']}'
        >
        <td>{$row['patente']}</td>
        <td>{$row['marca']}</td>
        <td>{$row['modelo']}</td>
        <td>{$row['anio']}</td>
        <td>$" . number_format($row['precio'], 0, ',', '.') . "</td>
        <td>{$row['fechaIngreso']}</td>
        <td>";

$patente = $row['patente'];
$sqlImg = "SELECT rutaImagen FROM imagenesVehiculos WHERE patente = '$patente' LIMIT 1";
$resImg = $conn->query($sqlImg);

if ($resImg && $resImg->num_rows > 0) {
    $img = $resImg->fetch_assoc();
    echo "<img src='fotos/{$img['rutaImagen']}' width='80' style='border-radius:6px;'> ";
    } else {
    echo "Sin imagen ";
    }
echo "</td></tr>";

}
} else {
    echo "<tr><td colspan='7' class='text-center'>No se encontraron vehículos.</td></tr>";
}

$conn->close();
?>
