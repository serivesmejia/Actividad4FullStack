class PedidosRepository {
  constructor() {
    this.pedidos = [];
    this.currentId = 1;
  }

  findAll() {
    return this.pedidos;
  }

  findById(id) {
    return this.pedidos.find(p => p.id === id);
  }

  create(pedido) {
    pedido.id = this.currentId++;
    this.pedidos.push(pedido);
    return pedido;
  }

  update(id, data) {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.pedidos[index] = { ...this.pedidos[index], ...data };
    return this.pedidos[index];
  }

  delete(id) {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.pedidos.splice(index, 1);
    return true;
  }
}

module.exports = PedidosRepository;
