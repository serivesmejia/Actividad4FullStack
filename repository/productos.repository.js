const mysql = require("mysql2/promise");

class ProductosRepository {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10
    });
  }

  async findAll() {
    const [rows] = await this.pool.query("SELECT * FROM productos");
    return rows;
  }

  async findById(id) {
    const numericId = Number(id);
    if (isNaN(numericId) || numericId < 1) return null;

    const [rows] = await this.pool.query(
      "SELECT * FROM productos WHERE id = ?",
      [numericId]
    );
    return rows[0] || null;
  }

  async create(producto) {
    const { nombre, precio } = producto;

    const [result] = await this.pool.query(
      "INSERT INTO productos (nombre, precio) VALUES (?, ?)",
      [nombre, precio]
    );

    return { id: result.insertId, ...producto };
  }

  async search({ nombre, minPrecio, maxPrecio, page = 1, limit = 5 }) {
    const params = [];
    let query = "SELECT * FROM productos WHERE 1=1";

    if (nombre && nombre.trim() !== "") {
      query += " AND nombre LIKE ?";
      params.push(`%${nombre}%`);
    }

    if (minPrecio !== undefined && !isNaN(Number(minPrecio))) {
      query += " AND precio >= ?";
      params.push(Number(minPrecio));
    }

    if (maxPrecio !== undefined && !isNaN(Number(maxPrecio))) {
      query += " AND precio <= ?";
      params.push(Number(maxPrecio));
    }

    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 5;

    const offset = (page - 1) * limit;
    query += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await this.pool.query(query, params);
    return rows;
  }

  async update(id, data) {
    const { nombre, precio } = data;

    // solo actualiza lo que venga en el body
    if (nombre !== undefined && precio !== undefined) {
      await this.pool.query(
        "UPDATE productos SET nombre = ?, precio = ? WHERE id = ?",
        [nombre, precio, id]
      );
    } else if (nombre !== undefined) {
      await this.pool.query(
        "UPDATE productos SET nombre = ? WHERE id = ?",
        [nombre, id]
      );
    } else if (precio !== undefined) {
      await this.pool.query(
        "UPDATE productos SET precio = ? WHERE id = ?",
        [precio, id]
      );
    } else {
      return null; // no hay campos para actualizar
    }

    // devuelve el registro actualizado
    return this.findById(id);
  }
}

module.exports = ProductosRepository;
