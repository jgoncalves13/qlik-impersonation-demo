// Importar librerías necesarias
const express = require('express');
const fetch = require('node-fetch'); // Para hacer la solicitud a la API de Qlik
const path = require('path');
const app = express();
const port = 3000;

// Configuración sensible (¡Guarda esto en variables de entorno, no en el código real!)
const QLIK_HOST = 'https://tudominio.eu.qlikcloud.com'; // Sustituye por tu dominio
const CLIENT_ID = 'tu_client_id_de_impersonacion'; // Sustituye por tu Client ID
const CLIENT_SECRET = 'tu_client_secret_de_impersonacion'; // Sustituye por tu Client Secret

// Sirve el archivo HTML estático
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para generar el token de impersonation
app.get('/api/get-impersonation-token', async (req, res) => {
    // El 'userId' del usuario que quieres personificar (puede venir de la sesión de tu usuario)
    const userId = 'un_usuario_valido@dominio.com';

    // Opciones para la solicitud del token
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
            throw new Error(`Error de la API de Qlik: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data); // Envía el token al frontend
    } catch (error) {
        console.error('Error al obtener el token:', error);
        res.status(500).send('Error al generar el token de impersonation.');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});