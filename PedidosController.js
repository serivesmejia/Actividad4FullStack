const PedidosRepository = require('./PedidosRepository');

class PedidosController {
  constructor() {
    this.repository = new PedidosRepository();
  }

  getAll(req, res) {
    res.json(this.repository.findAll());
  }

  getById(req, res) {
    const id = Number(req.params.id);
    const pedido = this.repository.findById(id);

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json(pedido);
  }

  create(req, res) {
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

    const pedidoCreado = this.repository.create(nuevoPedido);
    res.status(201).json(pedidoCreado);
  }

  update(req, res) {
    const id = Number(req.params.id);
    const { estado } = req.body;

    const pedido = this.repository.findById(id);
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

    const actualizado = this.repository.update(id, { estado });
    res.json(actualizado);
  }

  delete(req, res) {
    const id = Number(req.params.id);
    const pedido = this.repository.findById(id);

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (pedido.estado !== 'pendiente') {
      return res.status(400).json({
        message: 'Solo se pueden eliminar pedidos pendientes'
      });
    }

    this.repository.delete(id);
    res.status(204).send();
  }
}

module.exports = new PedidosController();
