const mysql = require("mysql2/promise");

class PedidosRepository {
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
    const [rows] = await this.pool.query("SELECT * FROM pedidos");
    return rows;
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      "SELECT * FROM pedidos WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  }

  async create(pedido) {
    const { cliente, producto, cantidad } = pedido;

    const [result] = await this.pool.query(
      "INSERT INTO pedidos (cliente, producto, cantidad) VALUES (?, ?, ?)",
      [cliente, producto, cantidad]
    );

    return { id: result.insertId, ...pedido };
  }

  async search({ producto, minPrecio, maxPrecio, page = 1, limit = 5 }) {
    let query = "SELECT * FROM productos WHERE 1=1";
    const params = [];

    if (producto) {
      query += " AND producto LIKE ?";
      params.push(`%${producto}%`);
    }

    if (minPrecio !== undefined) {
      query += " AND precio >= ?";
      params.push(minPrecio);
    }

    if (maxPrecio !== undefined) {
      query += " AND precio <= ?";
      params.push(maxPrecio);
    }

    query += " ORDER BY id DESC LIMIT ? OFFSET ?";

    const offset = (page - 1) * limit;

    const [rows] = await this.pool.query(query, params);

    return rows;
  }

  async update(id, data) {
    const fields = Object.keys(data);
    if (!fields.length) return null;

    const values = Object.values(data);
    const setClause = fields.map(f => `${f} = ?`).join(", ");

    const [result] = await this.pool.query(
      `UPDATE pedidos SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) return null;
    return this.findById(id);
  }

  async delete(id) {
    const [result] = await this.pool.query(
      "DELETE FROM pedidos WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  }
}

module.exports = PedidosRepository;
