document.addEventListener('DOMContentLoaded', () => {
    const clientesTable = document.getElementById('clientesTable').getElementsByTagName('tbody')[0];
    const addClienteForm = document.getElementById('addClienteForm');
    const editSection = document.getElementById('editSection');
    const editClienteForm = document.getElementById('editClienteForm');
    const cancelEditButton = document.getElementById('cancelEdit');

   // Función para cargar clientes
   function loadClientes() {
    fetch('/clientes')
        .then(response => response.json())
        .then(clientes => {
            clientesTable.innerHTML = '';
            clientes.forEach(cliente => {
                const row = clientesTable.insertRow();
                row.innerHTML = `
                    <td>${cliente.id_cliente}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.cedula_nit}</td>
                    <td>${cliente.correo}</td>
                    <td>${cliente.telefono || ''}</td>
                    <td>${cliente.direccion || ''}</td>
                    <td>${cliente.ciudad || ''}</td>
                    <td>
                        <button onclick="editCliente(${cliente.id_cliente})">Editar</button>
                        <button onclick="deleteCliente(${cliente.id_cliente})">Eliminar</button>
                    </td>
                `;
            });
        });
}

// Función para agregar cliente
addClienteForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(addClienteForm);
    const data = {
        nombre: formData.get('nombre'),
        cedula_nit: formData.get('cedula_nit'),
        correo: formData.get('correo'),
        telefono: formData.get('telefono'),
        direccion: formData.get('direccion'),
        ciudad: formData.get('ciudad')
    };

    fetch('/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        loadClientes(); // Recargar la lista de clientes
        addClienteForm.reset();
    });
});

// Función para eliminar cliente
window.deleteCliente = function(id) {
    fetch(`/clientes/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        loadClientes(); // Recargar la lista de clientes
    });
};

// Función para editar cliente (para ilustrar; necesitarás implementar el formulario de edición)
window.editCliente = function(id) {
    fetch(`/clientes/${id}`)
        .then(response => response.json())
        .then(cliente => {
            // Rellenar el formulario de edición con los datos del cliente
            document.getElementById('editIdCliente').value = cliente.id_cliente;
            document.getElementById('editNombre').value = cliente.nombre;
            document.getElementById('editCedulaNit').value = cliente.cedula_nit;
            document.getElementById('editCorreo').value = cliente.correo;
            document.getElementById('editTelefono').value = cliente.telefono || '';
            document.getElementById('editDireccion').value = cliente.direccion || '';
            document.getElementById('editCiudad').value = cliente.ciudad || '';

            // Mostrar la sección de edición
            editSection.style.display = 'block';
        });
};

editClienteForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(editClienteForm);
    const data = {
        id_cliente: formData.get('id_cliente'),
        nombre: formData.get('nombre'),
        cedula_nit: formData.get('cedula_nit'),
        correo: formData.get('correo'),
        telefono: formData.get('telefono'),
        direccion: formData.get('direccion'),
        ciudad: formData.get('ciudad')
    };

    fetch(`/clientes/${data.id_cliente}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        loadClientes(); // Recargar la lista de clientes
        editSection.style.display = 'none'; // Ocultar formulario de edición
    });
});

cancelEditButton.addEventListener('click', () => {
    editSection.style.display = 'none'; // Ocultar formulario de edición
});

loadClientes(); // Cargar clientes al inicio
});