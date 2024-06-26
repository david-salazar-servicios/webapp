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
    const { nombre, correo, mensaje, whatsapp } = req.body; // Ensure these keys match your form fields

    if (!nombre || !correo || !mensaje || !whatsapp) {
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

        const mailAdminOptions = {
            from: correo,
            to: 'davidsalazarservicios@gmail.com', // Primary recipient
            cc: 'davidsalazarservicios@gmail.com', // CC servicios.rc.cr@gmail.com
            subject: `El cliente ${nombre} envió un mensaje.`,
            html: `Hola,<br>Tienes un nuevo mensaje del cliente ${nombre} enviado desde la página web, su correo de contacto es ${correo} y el número de WhatsApp es <a href="https://wa.me/${whatsapp}">${whatsapp}.</a><br><br>Mensaje del cliente:<br><i>"${mensaje}"</i>`
        };

        const mailClientOptions = {
            from: 'davidsalazarservicios@gmail.com', // Business email as the sender
            to: correo, // Customer email as the recipient
            subject: `Confirmación de mensaje enviado`,
            html: `Hola ${nombre},<br><br>Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.<br><br>Detalles de tu mensaje:<br><b>Nombre:</b> ${nombre}<br><b>Correo:</b> ${correo}<br><b>WhatsApp:</b> <a href="https://wa.me/${whatsapp}">${whatsapp}</a><br><b>Mensaje:</b><br><i>"${mensaje}"</i><br><br>Saludos,<br>Equipo Soporte David Salazar`
        };

        await transporter.sendMail(mailAdminOptions);
        await transporter.sendMail(mailClientOptions);

        res.json({ message: 'correo fue enviado con éxito'});
    } catch (error) {
        console.error('Error en la operación:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
};


module.exports = {
    sendEmail,
    sendEmailContacto
}