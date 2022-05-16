# Desafio Clase 22: MOCKS Y NORMALIZACIÓN

## Iniciar proyecto con "node index.js"

# Consigna 1: Mocks de datos con Faker

<ul>
    <li>La ruta "api/productos-test" permite mostrar productos generados al azar en forma de tabla.</li>
    <li>Los productos se generan utilizando FakerJS como generador de información aleatoria en lugar de tomarse desde la base de datos.
    </li>
    <li>Por defecto se generan 10 objetos.</li>
    <li>Se puede especificar la cantidad de productos requeridos con el query param "cant" (ej: "api/productos-test?cant=5").
    <li>Para la cantidad 0, se muestra el mensaje "No hay productos".</li>
</ul>

# Consigna 2: Normalizr

<ul>
    <li>Se normaliza la base de datos de mensajes.</li>
    <li>Se devuelve por consola la longitud y el porcentaje de compresión cada vez que se agregan mensajes al chat.</li>
    <li>El porcentaje de compresión se muestra dinámicamente en el Front.</li>
</ul>