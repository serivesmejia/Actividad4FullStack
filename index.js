require("dotenv").config();

const express = require('express');
const routes = require('./routes/productos.routes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/productos', routes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});