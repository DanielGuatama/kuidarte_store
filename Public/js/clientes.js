document.addEventListener('DOMContentLoaded', () => {
    // Declaración de variables para los elementos del DOM
    const buscarClienteForm = document.getElementById('buscarClienteForm');
    const clienteEncontradoSection = document.getElementById('clienteEncontradoSection');
    const clienteEncontradoDiv = document.getElementById('clienteEncontrado');
    const addClienteForm = document.getElementById('addClienteForm');
    const editSection = document.getElementById('editSection');
    const editClienteForm = document.getElementById('editClienteForm');
    const cancelEditButton = document.getElementById('cancelEdit');
    const editarClienteBtn = document.getElementById('editarClienteBtn');
    const eliminarClienteBtn = document.getElementById('eliminarClienteBtn');
    
    // Función para buscar cliente
    buscarClienteForm.addEventListener('submit', event => {
        event.preventDefault(); // Previene el comportamiento predeterminado
        
        // Obtención de datos del formulario
        const formData = new FormData(buscarClienteForm);
        const id_cliente = formData.get('id_cliente');
        
        // Validación del ID del cliente
        if (!id_cliente) {
            alert('Por favor, ingrese un ID para buscar.');
            return;
        }

        const query = `/clientes/${id_cliente}`;

        // Llamada a la API para buscar el cliente
        fetch(query)
            .then(response => {
                if (!response.ok) {
                    // Manejo de errores HTTP
                    if (response.status === 404) {
                        alert('Cliente no encontrado.');
                    } else {
                        alert('Ocurrió un error al buscar el cliente.');
                    }
                    throw new Error('Error al buscar cliente');
                }
                return response.json();
            })
            .then(cliente => {
                // Verifica si se recibió un cliente
                if (!cliente) {
                    alert('Cliente no encontrado.');
                    return;
                }

                // Muestra la información del cliente encontrado
                clienteEncontradoDiv.innerHTML = `
                    <p>ID: ${cliente.id_cliente}</p>
                    <p>Nombre: ${cliente.nombre}</p>
                    <p>Cédula/NIT: ${cliente.cedula_nit}</p>
                    <p>Correo: ${cliente.correo}</p>
                    <p>Teléfono: ${cliente.telefono || ''}</p>
                    <p>Dirección: ${cliente.direccion || ''}</p>
                    <p>Ciudad: ${cliente.ciudad || ''}</p>
                `;
                clienteEncontradoSection.style.display = 'block';

                // Asocia los botones de editar y eliminar con las funciones correspondientes
                editarClienteBtn.onclick = () => editCliente(cliente.id_cliente);
                eliminarClienteBtn.onclick = () => deleteCliente(cliente.id_cliente);
            })
            .catch(error => {
                console.error('Error al buscar el cliente:', error);
            })
            .finally(() => {
                // Limpia el campo de búsqueda después de realizar la búsqueda
                buscarClienteForm.reset();
            });
    });

    // Función para agregar cliente
    addClienteForm.addEventListener('submit', event => {
        event.preventDefault(); // Previene el comportamiento predeterminado
        
        // Obtención de datos del formulario
        const formData = new FormData(addClienteForm);
        const data = {
            nombre: formData.get('nombre'),
            cedula_nit: formData.get('cedula_nit'),
            correo: formData.get('correo'),
            telefono: formData.get('telefono'),
            direccion: formData.get('direccion'),
            ciudad: formData.get('ciudad')
        };
    
        // Llamada a la API para agregar un nuevo cliente
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
            addClienteForm.reset(); // Limpia el formulario después de agregar
        });
    });

    // Función para editar cliente
    function editCliente(id) {
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
                clienteEncontradoSection.style.display = 'none';
            });
    }

    // Función para manejar la edición del cliente
    editClienteForm.addEventListener('submit', event => {
        event.preventDefault(); // Previene el comportamiento predeterminado
        
        // Obtención de datos del formulario de edición
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

        // Llamada a la API para actualizar el cliente
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
            editSection.style.display = 'none'; // Ocultar formulario de edición
        });
    });

    // Función para cancelar la edición
    cancelEditButton.addEventListener('click', () => {
        editSection.style.display = 'none'; // Ocultar formulario de edición
    });

    // Función para eliminar cliente
    function deleteCliente(id) {
        fetch(`/clientes/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            clienteEncontradoSection.style.display = 'none'; // Ocultar sección de cliente encontrado
        });
    }
});
