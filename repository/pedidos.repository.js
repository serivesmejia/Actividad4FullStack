const mysql = require("mysql2/promise");

class PedidosRepository {
  constructor() {
    this.pedidos = [];
    this.currentId = 1;
  }

  findAll() {
    return this.pedidos;
  }

  findById(id) {
    return this.pedidos.find(p => p.id === id); // Busca el pedido por su ID
  }

  create(pedido) {
    pedido.id = this.currentId++;
    this.pedidos.push(pedido); // Agrega el nuevo pedido al array
    return pedido;
  }

  update(id, data) {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index === -1) return null;
 
    this.pedidos[index] = { ...this.pedidos[index], ...data }; // Solo actualizamos los campos proporcionados
    return this.pedidos[index];
  }

  delete(id) {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.pedidos.splice(index, 1); // Elimina el pedido del array
    return true;
  }
}

module.exports = PedidosRepository;
