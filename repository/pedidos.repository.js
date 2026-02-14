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
