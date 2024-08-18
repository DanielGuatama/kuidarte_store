const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

//configurar las rutas CRUD 
const session = require('express-session');

const app = express();
//const app = express();

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kuidarte_store'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM usuarios WHERE username = ? AND contrasena = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/main.html');
        } else {
            res.send('Usuario o contraseña incorrectos');
        }
    });
});

// Ruta de cierre de sesión
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/index.html');
    });
});

// Middleware para proteger las rutas
app.use((req, res, next) => {
    if (req.session.loggedin || req.path === '/login' || req.path === '/logout') {
        next();
    } else {
        res.redirect('/index.html');
    }
});

// CRUD de clientes

// Crear cliente
app.post('/clientes', (req, res) => {
    const { nombre, cedula_nit, correo, telefono, direccion, ciudad } = req.body;
    const query = 'INSERT INTO clientes (nombre, cedula_nit, correo, telefono, direccion, ciudad) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nombre, cedula_nit, correo, telefono, direccion, ciudad], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Cliente creado exitosamente');
    });
});


// Leer cliente por ID
app.get('/clientes/:id', (req, res) => {
    const id = req.params.id;
    if (id) {
    const query = 'SELECT * FROM clientes WHERE id_cliente = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Cliente no encontrado');
        res.json(result[0]);   
    });
    } 
    else {
    res.status(400).send('Debe proporcionar un ID');
    } 
    });


// Actualizar cliente
app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, cedula_nit, correo, telefono, direccion, ciudad } = req.body;
    const query = 'UPDATE clientes SET nombre = ?, cedula_nit = ?, correo = ?, telefono = ?, direccion = ?, ciudad = ? WHERE id_cliente = ?';
    db.query(query, [nombre, cedula_nit, correo, telefono, direccion, ciudad, id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.affectedRows === 0) return res.status(404).send('Cliente no encontrado');
        res.send('Cliente actualizado exitosamente');
    });
});

// Eliminar cliente
app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clientes WHERE id_cliente = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.affectedRows === 0) return res.status(404).send('Cliente no encontrado');
        res.send('Cliente eliminado exitosamente');
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});