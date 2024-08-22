// Escucha el evento de clic en el botón 'cerrarSesion'
document.getElementById('cerrarSesion').addEventListener('click', function() {
    // Declarar la variable para la URL de cierre de sesión
    const logoutUrl = '/logout'; // URL de la API para cerrar sesión

    // Realiza la solicitud de cierre de sesión
    fetch(logoutUrl)
    .then(() => {
        // Redirige al usuario a la página de inicio
        window.location.href = '/index.html';
    })
    .catch(error => {
        // Maneja cualquier error que ocurra durante la solicitud
        console.error('Error:', error);
    });
});
