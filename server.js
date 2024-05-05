const express = require('express');
const app = express();
const { exec } = require('child_process');

app.post('/gitwebhook', (req, res) => {
    exec('git pull', (err, stdout, stderr) => {
        if (err) {
            console.error('Error ejecutando git pull:', stderr);
            return res.status(500).send('Error al actualizar el proyecto');
        }
        console.log('Proyecto actualizado:', stdout);
        res.status(200).send('Proyecto actualizado correctamente');
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor escuchando');
});
