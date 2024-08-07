document.addEventListener('DOMContentLoaded', () => {
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
        event.preventDefault();
        const formData = new FormData(buscarClienteForm);
        const id_cliente = formData.get('id_cliente');
        const cedula_nit = formData.get('cedula_nit');

        let query = '';
        if (id_cliente) {
            query = `/clientes/${id_cliente}`;
        } else if (cedula_nit) {
            query = `/clientes?cedula_nit=${cedula_nit}`;
        } else {
            alert('Por favor, ingrese un ID o Cédula/NIT para buscar.');
            return;
        }

        fetch(query)
            .then(response => response.json())
            .then(cliente => {
                if (Array.isArray(cliente) && cliente.length > 0) {
                    cliente = cliente[0]; // En caso de múltiples resultados, tomar el primero
                }
                if (!cliente || cliente.length === 0) {
                    alert('Cliente no encontrado.');
                    return;
                }
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
                
                editarClienteBtn.onclick = () => editCliente(cliente.id_cliente);
                eliminarClienteBtn.onclick = () => deleteCliente(cliente.id_cliente);
            });
    });

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
                addClienteForm.reset();
            });
        });
    

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
            editSection.style.display = 'none'; // Ocultar formulario de edición
        });
    });

    cancelEditButton.addEventListener('click', () => {
        editSection.style.display = 'none'; // Ocultar formulario de edición
    });

    function deleteCliente(id) {
        fetch(`/clientes/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            clienteEncontradoSection.style.display = 'none';
        });
    }
});
