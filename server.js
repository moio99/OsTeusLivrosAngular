const express = require('express');
const path = require('path');
const app = express();

// Solo sirve archivos estáticos (sin rutas adicionales)
app.use(express.static(path.join(__dirname, 'dist/os-meus-livros-w/browser')));

// Captura TODAS las rutas y redirige al index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/os-meus-livros-w/browser/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
