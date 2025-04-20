const express = require('express');
const path = require('path');
const app = express();

// Sirve los archivos estáticos de Angular
app.use(express.static(path.join(__dirname, 'dist/os-meus-livros-w')));

// Redirige todas las rutas al index.html (para SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/os-meus-livros-w/browser/index.html'));
});

// Puerto configurable para Render.com
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
