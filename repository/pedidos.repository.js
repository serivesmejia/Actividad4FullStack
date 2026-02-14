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
    let numericId = Number(id);
    if (isNaN(numericId) || numericId < 1) {
      return null;
    }
    
    const [rows] = await this.pool.query(
      "SELECT * FROM pedidos WHERE id = ?",
      [numericId]
    );
    return rows[0] || null;
  }

  async create(pedido) {
    const { cliente, producto, cantidad, estado } = pedido;

    const [result] = await this.pool.query(
      "INSERT INTO pedidos (cliente, producto, cantidad, estado) VALUES (?, ?, ?, ?)",
      [cliente, producto, cantidad, estado || 'pendiente']
    );

    return { id: result.insertId, ...pedido };
  }

  async search({ producto, cliente, page = 1, limit = 5 }) {
    let query = "SELECT * FROM pedidos WHERE 1=1";
    const params = [];

    if (producto && producto.trim() !== "") {
      query += " AND producto LIKE ?";
      params.push(`%${producto}%`);
    }

    if (cliente && cliente.trim() !== "") {
      query += " AND cliente LIKE ?";
      params.push(`%${cliente}%`);
    }

    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 5;

    const offset = (page - 1) * limit;

    // limit y offset ya fueron validados para que solo puedan ser numeros
    // no hay sql injection, en teoria...
    query += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;

    console.log("Query:", query, "Params:", params);

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
