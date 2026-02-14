const PedidosRepository = require('../repository/pedidos.repository');

class PedidosController {
  constructor() {
    this.repository = new PedidosRepository();
  }

  async getAll(req, res) {
    try {
      const pedidos = await this.repository.findAll();
      res.json(pedidos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req, res) {
    try {
      const id = Number(req.params.id);
      const pedido = await this.repository.findById(id);

      if (!pedido) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      res.json(pedido);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async create(req, res) {
    try {
      const { cliente, producto, cantidad } = req.body;

      if (!cliente || !producto || cantidad <= 0) {
        return res.status(400).json({
          message: 'Cliente, producto y cantidad válida son obligatorios'
        });
      }

      const nuevoPedido = { cliente, producto, cantidad, estado: 'pendiente' };
      const pedidoCreado = await this.repository.create(nuevoPedido);
      res.status(201).json(pedidoCreado);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async search(req, res) {
    try {
      const { producto, cliente } = req.query;
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);

      if (!producto && !cliente) {
        return res.status(400).json({ message: "Debes enviar producto o cliente" });
      }

      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1) limit = 5;

      const result = await this.repository.search({
        producto,
        cliente,
        page,
        limit
      });

      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "error" });
    }
  }

  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const { estado } = req.body;

      const pedido = await this.repository.findById(id);
      if (!pedido) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      if (pedido.estado !== 'pendiente') {
        return res.status(400).json({
          message: `No se puede modificar un pedido en estado ${pedido.estado}`
        });
      }

      if (!['confirmado', 'cancelado'].includes(estado)) {
        return res.status(400).json({ message: 'Cambio de estado inválido' });
      }

      const actualizado = await this.repository.update(id, { estado });
      res.json(actualizado);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const id = Number(req.params.id);
      const pedido = await this.repository.findById(id);

      if (!pedido) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      if (pedido.estado !== 'pendiente') {
        return res.status(400).json({
          message: 'Solo se pueden eliminar pedidos pendientes'
        });
      }

      await this.repository.delete(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new PedidosController();
