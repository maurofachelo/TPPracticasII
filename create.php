<?php
include 'conexion.php';

$marca = $_POST['marca'] ?? '';
$modelo = $_POST['modelo'] ?? '';
$tipo = $_POST['tipo'] ?? '';
$anio = $_POST['anio'] ?? '';
$kilometraje = $_POST['kilometraje'] ?? '';
$combustible = $_POST['combustible'] ?? '';
$precio = $_POST['precio'] ?? '';
$fechaIngreso = $_POST['fechaIngreso'] ?? '';
$estadoMotor = $_POST['estadoMotor'] ?? '';
$estadoInterior = $_POST['estadoInterior'] ?? '';
$estadoExterior = $_POST['estadoExterior'] ?? '';

$sqlVehiculo = "INSERT INTO vehiculos (marca, modelo, tipo, anio, kilometraje, combustible, precio, fechaIngreso)
VALUES ('$marca', '$modelo', '$tipo', '$anio', '$kilometraje', '$combustible', '$precio', '$fechaIngreso')";


if ($conn->query($sqlVehiculo) === TRUE) {
    $idVehiculo = $conn->insert_id; //devuelve el ID autogenerado de la última fila insertada con AUTO_INCREMENT y lo asigna a la variable

    echo "Nuevo vehículo agregado con éxito.<br> ID del vehículo: " . $idVehiculo . "<br>";

    $sqlEstado = "INSERT INTO estadovehiculos (idVehiculo, estadoMotor, estadoInterior, estadoExterior)
    VALUES ('$idVehiculo', '$estadoMotor', '$estadoInterior', '$estadoExterior')";

    if ($conn->query($sqlEstado) === TRUE){
        echo "Estado del vehiculo fue agregado correctamente";
    } else {
        echo "Error: " . $sqlEstado . "<br>" . $conn->error;
    }
} else {
    echo "Error: " . $sqlVehiculo . "<br>" . $conn->error;
}

    $carpeta = "Fotos/"; // fotos guardadas en la carpeta Fotos de mi proyecto

    if (!empty($_FILES['imagenes']['name'][0])) {  //$_FILES es el array superglobal que PHP rellena con los archivos subidos.
    //name contiene los nombres originales; cuando el input fue name="imagenes[]" y multiple, $_FILES['imagenes']['name'] es un array.
        foreach ($_FILES['imagenes']['tmp_name'] as $key => $tmp_name) { 
    //key es el índice (0,1,2....) que coincide con las otras subarrays (name, error, size, type).
            if ($_FILES['imagenes']['error'][$key] === UPLOAD_ERR_OK) { //Comprueba que no hubo error en la subida para ese índice
                $nombreArchivo = uniqid() . "_" . basename($_FILES['imagenes']['name'][$key]);  //uniqid() antepone una cadena única (basada en tiempo) 
                                                                                                // para evitar colisiones de nombres (dos usuarios 
                                                                                                // subiendo foto.jpg no sobreescriben).

                $rutaDestino = $carpeta . $nombreArchivo; //Construye la ruta final donde vas a guardar el archivo (Fotos/650a3f_img.jpg).

                if (move_uploaded_file($tmp_name, $rutaDestino)) { //move_uploaded_file() mueve el archivo desde la ubicación temporal a la final.
                    $sqlImagen = "INSERT INTO imagenesVehiculos (idVehiculo, rutaImagen)
                                  VALUES ('$idVehiculo', '$nombreArchivo')"; // evnia a sql la ruta de la imagen
                    if ($conn->query($sqlImagen) === TRUE) {
                        echo "Imagen guardada: " . $nombreArchivo . "<br>";
                    } else {
                        echo "Error al insertar imagen: " . $conn->error . "<br>";
                    }
                }
            }
        }
    } else {
        echo "No se cargaron imágenes.<br>";
    }




$conn->close();

?>