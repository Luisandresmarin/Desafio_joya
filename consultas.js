const { Pool } = require('pg');
const format = require('pg-format');


// Configuración del pool (conexión a PostgreSQL)
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'lucho0402',
    database: 'joyas',
    allowExitOnIdle: true,
});

// Función para obtener todas las joyas con HATEOAS
const obtenerJoyas = async ({ limit = 10, order_by = 'id_ASC', page = 1 }) => {
    const [campo, direccion] = order_by.split('_');
    const offset = (page - 1) * limit;
    const query = format(
        'SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s',
        campo,
        direccion,
        limit,
        offset
    );
    const { rows: joyas } = await pool.query(query);
    return joyas;
};
// Función para obtener joyas por filtros
const obtenerJoyasPorFiltros = async ({ precio_min, precio_max, categoria, metal }) => {
    let filtros = [];
    let valores = [];
    let index = 1;

    if (precio_min) {
        filtros.push(`precio >= $${index}`);
        valores.push(precio_min);
        index++;
    }

    if (precio_max) {
        filtros.push(`precio <= $${index}`);
        valores.push(precio_max);
        index++;
    }

    if (categoria) {
        filtros.push(`categoria = $${index}`);
        valores.push(categoria);
        index++;
    }

    if (metal) {
        filtros.push(`metal = $${index}`);
        valores.push(metal);
        index++;
    }

    let query = 'SELECT * FROM inventario';
    if (filtros.length > 0) {
        query += ` WHERE ${filtros.join(' AND ')}`;
    }

    const { rows: joyas } = await pool.query(query, valores);
    return joyas;
};
// Función para preparar la estructura HATEOAS
const prepararHATEOAS = (joyas) => {
    const results = joyas.map((j) => ({
        nombre: j.nombre,
        href: `/joyas/joya/${j.id}`,
    }));

    return {
        total: joyas.length,
        results,
    };
};
module.exports = { obtenerJoyas, obtenerJoyasPorFiltros, prepararHATEOAS };

