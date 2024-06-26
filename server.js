const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();

// Configurar CSP para permitir conexiones externas y recursos de imagen
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://aframe.io https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://cdn.glitch.global https://cdn.aframe.io; img-src 'self' data:"
    );
    next();
});

// Servir archivos estáticos desde el directorio raíz
app.use(express.static(path.join(__dirname, '/')));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'generated_AR_scene.html'));
});

// Ruta para Webhook de GitHub
app.post('/gitwebhook', (req, res) => {
    exec('git pull origin main', (err, stdout, stderr) => {
        if (err) {
            console.error('Error ejecutando git pull:', stderr);
            return res.status(500).send('Error al actualizar el proyecto');
        }
        console.log('Proyecto actualizado:', stdout);
        res.status(200).send('Proyecto actualizado correctamente');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
