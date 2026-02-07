
const controller = require('./controllers/PedidosController');
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/productos', controller.getAll.bind(controller));
app.get('/productos/:id', controller.getById.bind(controller));
app.post('/productos/', controller.create.bind(controller));
app.put('/productos/:id', controller.update.bind(controller));
app.delete('/productos/:id', controller.delete.bind(controller));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});