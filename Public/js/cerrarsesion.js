document.getElementById('cerrarSesion').addEventListener('click', function() {
    fetch('/logout')
    .then(() => {
        window.location.href = '/index.html';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
