const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { obtenerJoyas, obtenerJoyasPorFiltros, prepararHATEOAS } = require('./consultas');
 
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(3000, console.log('Server ON'))

// Middleware para registrar las rutas consultadas
app.use((req, res, next) => {
    console.log(`Ruta consultada: ${req.method} ${req.url}`);
    next();
});
// Rutas
app.get('/joyas', async (req, res) => {
    try {
        const queryStrings = req.query;
         const joyas = await obtenerJoyas(queryStrings);
        const HATEOAS = prepararHATEOAS(joyas);
        res.json(HATEOAS);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las joyas', error });
    }
});

app.get('/joyas/filtros', async (req, res) => {
    try {
        const queryStrings = req.query;
        const joyas = await obtenerJoyasPorFiltros(queryStrings);
        res.json(joyas);
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar las joyas', error });
    }
});
// Ruta para manejar errores 404
app.get('*', (req, res) => {
    res.status(404).send('Esta ruta no existe');
});

