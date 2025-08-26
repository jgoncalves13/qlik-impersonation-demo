// Importa las librerías necesarias
const express = require('express');
const fetch = require('node-fetch'); // Usado para hacer la llamada a la API de Qlik
const path = require('path');
const app = express();
const port = 3000;

// Configura el servidor para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para generar el token de impersonation
// Se accede a esta ruta desde el frontend (index.html)
app.get('/api/get-impersonation-token', async (req, res) => {
    // Estas credenciales deben estar en un archivo .env en producción
    // En este ejemplo, las leeremos desde las variables de entorno de Vercel
    const QLIK_HOST = process.env.QLIK_HOST;
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;

    // Puedes cambiar el 'userId' según la lógica de tu aplicación
    const userId = 'cavida.pt/ivida.hugo.santos'; 

    // Opciones para la solicitud del token a la API de Qlik
    const payload = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'urn:qlik:oauth:user-impersonation',
        user_lookup: {
            field: 'subject', 
            value: userId,
        },
        scope: 'user_default',
    };

    try {
        const response = await fetch(`${QLIK_HOST}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error de la API de Qlik: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        res.json(data); // Envía el token al frontend
    } catch (error) {
        console.error('Error al obtener el token:', error);
        res.status(500).send('Error al generar el token de impersonation.');
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
