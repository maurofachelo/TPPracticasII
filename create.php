<?php
include 'conexion.php';


$patente = $_POST['patente'] ?? '';
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

$response = []; // Array para la respuesta

$sqlVehiculo = "INSERT INTO vehiculos (patente, marca, modelo, tipo, anio, kilometraje, combustible, precio, fechaIngreso)
VALUES ('$patente', '$marca', '$modelo', '$tipo', '$anio', '$kilometraje', '$combustible', '$precio', '$fechaIngreso')";


if ($conn->query($sqlVehiculo) === TRUE) {
    //$patente = $conn->insert_id; 

    //echo "Vehículo agregado con éxito.<br> Patente del vehículo: " . $patente . "<br>";

    $sqlEstado = "INSERT INTO estadovehiculos (patente, estadoMotor, estadoInterior, estadoExterior)
    VALUES ('$patente', '$estadoMotor', '$estadoInterior', '$estadoExterior')";

    /*if ($conn->query($sqlEstado) === TRUE){
        echo "Estado del vehiculo fue agregado correctamente <br>";
    } else {
        echo "Error: " . $sqlEstado . "<br>" . $conn->error;
    }
}*/ 
    // Ejecutar el estado sin verificar para simplificar
    $conn->query($sqlEstado);

    $response = [
        'success' => true,
        'message' => "Vehículo cargado exitosamente",
        'detalle' => [
            'patente' => $patente,
            'marca' => 'Marca: '.$marca,
            'modelo' => 'Modelo: '.$modelo,
            'anio' => 'Año: '.$anio,
            'precio' => 'Precio: '.$precio,
            'fechaIngreso' => 'Fecha de ingreso: '.$fechaIngreso
        ]
    ];

    $carpeta = "Fotos/"; // fotos guardadas en la carpeta Fotos de mi proyecto
    $imagenesGuardadas = [];

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
                    $sqlImagen = "INSERT INTO imagenesVehiculos (patente, rutaImagen)
                                  VALUES ('$patente', '$nombreArchivo')"; // evnia a sql la ruta de la imagen
                    if ($conn->query($sqlImagen) === TRUE) {
                        $imagenesGuardadas[] = $nombreArchivo;
                    }
                }
            }
        }
        $response['imagenes'] = $imagenesGuardadas;
    }
}   else {
            $response = [
                'success' => false,
                'message' => 'Carga fallida: ' . $conn->error
            ];
        }
        echo json_encode($response);

$conn->close();
?>