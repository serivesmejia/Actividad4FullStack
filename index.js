const pedidosRoutes = require('./PedidosRoutes');

const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/pedidos', pedidosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});