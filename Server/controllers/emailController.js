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


const sendGenericEmail = async (req, res) => {
    const { nombre, correo, mensaje, whatsapp, emailType } = req.body; // `emailType` indicates the type of email

    if (!nombre || !correo || !mensaje || !whatsapp || !emailType) {
        console.error("Missing fields in request body:", req.body);
        return res.status(400).json({ message: 'Missing fields' });
    }

    // Set up the email transporter
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

    // Define variables for email content based on `emailType`
    let subjectAdmin, htmlAdmin, subjectClient, htmlClient;

    // Determine email content based on `emailType`
    switch (emailType) {
        case "Citas":
            subjectAdmin = `Solicitud de Cita del cliente ${nombre}`;
            htmlAdmin = `Hola,<br>Tienes una nueva solicitud de cita del cliente ${nombre}. Correo de contacto: ${correo}, WhatsApp: <a href="https://wa.me/${whatsapp}">${whatsapp}</a>.<br><br>Mensaje:<br><i>"${mensaje}"</i>`;
            
            subjectClient = `Confirmación de solicitud de cita`;
            htmlClient = `Hola ${nombre},<br><br>Hemos recibido tu solicitud de cita. Nos pondremos en contacto contigo pronto.<br><br>Detalles:<br><b>Nombre:</b> ${nombre}<br><b>Correo:</b> ${correo}<br><b>WhatsApp:</b> <a href="https://wa.me/${whatsapp}">${whatsapp}</a><br><b>Mensaje:</b><br><i>"${mensaje}"</i><br><br>Saludos,<br>Equipo de Soporte`;
            break;
        
        case "Inventario":
            subjectAdmin = `Consulta de Inventario de ${nombre}`;
            htmlAdmin = `Hola,<br>El cliente ${nombre} ha realizado una consulta de inventario. Correo: ${correo}, WhatsApp: <a href="https://wa.me/${whatsapp}">${whatsapp}</a>.<br><br>Mensaje:<br><i>"${mensaje}"</i>`;
            
            subjectClient = `Confirmación de consulta de inventario`;
            htmlClient = `Hola ${nombre},<br><br>Gracias por tu consulta sobre inventario. Te contactaremos pronto.<br><br>Detalles:<br><b>Nombre:</b> ${nombre}<br><b>Correo:</b> ${correo}<br><b>WhatsApp:</b> <a href="https://wa.me/${whatsapp}">${whatsapp}</a><br><b>Mensaje:</b><br><i>"${mensaje}"</i><br><br>Saludos,<br>Equipo de Soporte`;
            break;

        // Add more cases here for different email types
        default:
            console.error('Invalid email type');
            return res.status(400).json({ message: 'Invalid email type' });
    }

    try {
        // Send email to admin
        await transporter.sendMail({
            from: correo,
            to: 'davidsalazarservicios@gmail.com',
            cc: 'davidsalazarservicios@gmail.com',
            subject: subjectAdmin,
            html: htmlAdmin,
        });

        // Send confirmation email to client
        await transporter.sendMail({
            from: 'davidsalazarservicios@gmail.com',
            to: correo,
            subject: subjectClient,
            html: htmlClient,
        });

        res.json({ message: 'Correo enviado con éxito' });
    } catch (error) {
        console.error('Error en la operación:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
};



module.exports = {
    sendEmail,
    sendEmailContacto,
    sendGenericEmail,
}