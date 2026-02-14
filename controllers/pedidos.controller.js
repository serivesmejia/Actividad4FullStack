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
      const { producto, cantidad } = req.body;

      if (!producto || cantidad <= 0) {
        return res.status(400).json({
          message: 'La cantidad debe ser mayor a 0 y el producto es obligatorio'
        });
      }

      const nuevoPedido = {
        producto,
        cantidad,
        estado: 'pendiente'
      };

      const pedidoCreado = await this.repository.create(nuevoPedido);
      res.status(201).json(pedidoCreado);
    } catch (err) {
      res.status(500).json({ message: err.message });
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
        return res.status(400).json({
          message: 'Cambio de estado inválido'
        });
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
