const ProductosRepository = require('../repository/productos.repository');

class ProductosController {
  constructor() {
    this.repository = new ProductosRepository();
  }

  async getAll(req, res) {
    try {
      const productos = await this.repository.findAll();
      res.json(productos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req, res) {
    try {
      const id = req.params.id;
      const producto = await this.repository.findById(id);
      if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(producto);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async create(req, res) {
    try {
      const { nombre, precio } = req.body;
      if (!nombre || precio === undefined) return res.status(400).json({ message: 'Nombre y precio son obligatorios' });

      const nuevoProducto = { nombre, precio };
      const productoCreado = await this.repository.create(nuevoProducto);
      res.status(201).json(productoCreado);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async search(req, res) {
    try {
      const { nombre, minPrecio, maxPrecio } = req.query;
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);

      page = isNaN(page) || page < 1 ? 1 : page;
      limit = isNaN(limit) || limit < 1 ? 5 : limit;

      const result = await this.repository.search({ nombre, minPrecio, maxPrecio, page, limit });
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const actualizado = await this.repository.update(id, data);
      if (!actualizado) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(actualizado);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const deleted = await this.repository.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new ProductosController();
