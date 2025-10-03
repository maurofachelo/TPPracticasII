<?php
include "conexion.php";

if ($conn->connect_error) {
    die("La conexion con tu Base de Datos falló: " . $conn->connect_error);
} else {
    echo "La conexion con tu Base de Datos fue exitosa<br>";
}

// Verificamos si se envió un idVehiculo desde el formulario
$idVehiculo = isset($_POST['idVehiculo']) ? $_POST['idVehiculo'] : ""; //isset() verifica si la variable existe y no es null.


if ($idVehiculo == "") { // Si el campo idVehiculo está vacío muestra todos los vehículos
    $sql = "SELECT v.idVehiculo, v.marca, v.modelo, v.tipo, v.anio, v.kilometraje,
                   v.combustible, v.precio, v.fechaIngreso,
                   e.estadoMotor, e.estadoInterior, e.estadoExterior
            FROM vehiculos AS v
            JOIN estadovehiculos AS e ON v.idVehiculo = e.idVehiculo";
} else {     // si el campo idVehiculo viene un valor filtramos por ese idVehiculo

    $sql = "SELECT v.idVehiculo, v.marca, v.modelo, v.tipo, v.anio, v.kilometraje,
                   v.combustible, v.precio, v.fechaIngreso,
                   e.estadoMotor, e.estadoInterior, e.estadoExterior
            FROM vehiculos AS v
            JOIN estadovehiculos AS e ON v.idVehiculo = e.idVehiculo
            WHERE v.idVehiculo = '$idVehiculo'";
}

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    echo "<table border='1'>
            <tr>
                <th>ID</th><th>Marca</th><th>Modelo</th><th>Tipo</th><th>Año</th>
                <th>Kilometraje</th><th>Combustible</th><th>Precio</th><th>Fecha Ingreso</th>
                <th>Estado Motor</th><th>Estado Interior</th><th>Estado Exterior</th>
            </tr>";
while ($row = $result->fetch_assoc()) {
    echo "<tr>
            <td>" . $row["idVehiculo"] . "</td>
            <td>" . $row["marca"] . "</td>
            <td>" . $row["modelo"] . "</td>
            <td>" . $row["tipo"] . "</td>
            <td>" . $row["anio"] . "</td>
            <td>" . $row["kilometraje"] . "</td>
            <td>" . $row["combustible"] . "</td>
            <td>" . $row["precio"] . "</td>
            <td>" . $row["fechaIngreso"] . "</td>
            <td>" . $row["estadoMotor"] . "</td>
            <td>" . $row["estadoInterior"] . "</td>
            <td>" . $row["estadoExterior"] . "</td>
            <td>";

    // fotos
    $idVehiculo2 = $row["idVehiculo"]; // le pongo el dos para diferenciarla de la variable del formulario
    $sqlImg = "SELECT rutaImagen FROM imagenesVehiculos WHERE idVehiculo = $idVehiculo2";
    $resImg = $conn->query($sqlImg);

    if ($resImg && $resImg->num_rows > 0) {
        while ($img = $resImg->fetch_assoc()) {
            echo "<img src='fotos/" . $img['rutaImagen'] . "' width='80' style='margin:2px;'>";
        }
    } else {
        echo "Sin imágenes";
    }

    echo "</td></tr>";
    } 

    echo "</table>"; 
} else {
    echo "No hay resultados.";
}

$conn->close();
?>
