//funcionalidad para mostrar la contrasena
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? 'Mostrar' : 'Ocultar'; // Cambiamos el texto del botón
});

// Manejo del evento de envío del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenimos el comportamiento por defecto del formulario

    const username = document.getElementById('username').value; // Obtenemos el nombre de usuario
    const password = document.getElementById('password').value; // Obtenemos la contraseña

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especificamos el tipo de contenido
        },
        body: JSON.stringify({ username, password }) // Enviamos los datos en formato JSON
    })
    .then(response => response.text())
    .then(data => {
        const loginMessage = document.getElementById('loginMessage');
        if (data === 'Usuario o contraseña incorrectos') {
            loginMessage.innerText = data; // Mostramos el mensaje de error
            loginMessage.style.color = 'red';  // Aseguramos que el texto sea rojo
            loginMessage.style.display = 'block';  // Mostramos el mensaje de error
        } else {
            window.location.href = '/main.html'; // Redirigimos al usuario a la página principal
        }
    })
    .catch(error => {
        console.error('Error:', error); // Mostramos el error en la consola
    });
});