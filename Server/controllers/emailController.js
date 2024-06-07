const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); // Agrega esta línea
const pool = require('../db'); // Asegúrate de que esta ruta sea correcta.

const sendEmail = async (req, res) => {
    const email = req.body.email; // El correo electrónico ingresado por el usuario.
    try {
        // Verifica si el email existe en la base de datos
        const userResult = await pool.query('SELECT * FROM usuario WHERE correo_electronico = $1', [email]);

        if (userResult.rows.length === 0) {
            // Si no existe el usuario, enviar una respuesta indicando que no está registrado.
            return res.status(404).json({ message: 'Correo electrónico no registrado.' });
        }

        // Genera una contraseña temporal
        const tempPassword = uuidv4();
        console.log("Email", req.body, "TempPassword:", tempPassword);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: 'davidsalazarservicios@gmail.com', // Reemplaza con tu correo
            to: email, // El destinatario del correo
            subject: 'Tu contraseña temporal',
            text: `Aquí está tu contraseña temporal: ${tempPassword}. Se recomienda cambiarla después de iniciar sesión.`,
        };

        let info = await transporter.sendMail(mailOptions);

        // Actualiza la contraseña en la base de datos para el usuario correspondiente
        await pool.query('UPDATE usuario SET contrasena = $1 WHERE correo_electronico = $2', [tempPassword, email]);
        await pool.query('UPDATE usuario SET password_reset = true WHERE correo_electronico = $1', [email]);
        res.json({ message: 'Correo enviado con éxito', info });
    } catch (error) {
        console.error('Error en la operación:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
};

const sendEmailContacto = async (req, res) => {
    console.log("Received body:", req.body);  // Log the received body

    const { nombre, correo, asunto, mensaje } = req.body; // Ensure these keys match your form fields

    if (!nombre || !correo || !asunto || !mensaje) {
        console.error("Missing fields in request body:", req.body);
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: 'davidsalazarservicios@gmail.com', // Reemplaza con tu correo
            to: email.correo, // El destinatario del correo
            subject: email.asunto,
            text: email.mensaje,
        };

        let info = await transporter.sendMail(mailOptions);

        res.json({ message: email.nombre + ' su correo fue enviado con éxito', info });
    } catch (error) {
        console.error('Error en la operación:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
};

module.exports = {
    sendEmail,
    sendEmailContacto
}