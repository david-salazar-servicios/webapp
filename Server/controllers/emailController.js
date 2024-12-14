const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); // Agrega esta línea
const pool = require('../db'); // Asegúrate de que esta ruta sea correcta.
const bcrypt = require("bcryptjs");


const sendEmail = async (req, res) => {
    const email = req.body.email; // The email entered by the user.

    try {
        // Check if the email exists in the database
        const userResult = await pool.query(
            "SELECT * FROM usuario WHERE correo_electronico = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            // If the user does not exist, send a response indicating the email is not registered.
            return res.status(404).json({ message: "Correo electrónico no registrado." });
        }

        // Generate a temporary password
        const tempPassword = uuidv4().slice(0, 8); // Limit to 8 characters for simplicity

        // Hash the temporary password before storing it
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.GMAIL_USERNAME, // Your email
            to: email, // Recipient's email
            subject: "Tu contraseña temporal",
            text: `Aquí está tu contraseña temporal: ${tempPassword}. Se recomienda cambiarla después de iniciar sesión.`,
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);

        // Update the password and password_reset flag in the database
        await pool.query(
            "UPDATE usuario SET contrasena = $1, password_reset = true WHERE correo_electronico = $2",
            [hashedPassword, email]
        );

        res.json({ message: "Correo enviado con éxito", info });
    } catch (error) {
        console.error("Error en la operación:", error);
        res.status(500).send("Error al procesar la solicitud");
    }
};

module.exports = { sendEmail };


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
    const { nombre, correo, mensaje, telefono, type } = req.body; // `emailType` indicates the type of email

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


    switch (type) {

        case "RestaurarSolicitud":
            subjectAdmin = `Solicitud Restaurada: ${nombre}`;
            htmlAdmin = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Solicitud Restaurada</h2>
                    <p>Hola,</p>
                    <p>La solicitud del cliente <strong>${nombre}</strong> ha sido restaurada al estado "Pendiente".</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                </div>`;
    
            subjectClient = `Confirmación de restauración de solicitud`;
            htmlClient = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Confirmación de restauración de solicitud</h2>
                    <p>Hola ${nombre},</p>
                    <p>Tu solicitud ha sido restaurada exitosamente al estado "Pendiente".</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nombre</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                    <p style="margin-top: 20px;">Saludos,<br>Equipo de Soporte</p>
                </div>`;
            break;
        case "Revertir_A_Aagenda":
            subjectAdmin = `Solicitud Revertida a En Agenda: ${nombre}`;
            htmlAdmin = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Solicitud Revertida a En Agenda</h2>
                    <p>Hola,</p>
                    <p>La solicitud del cliente <strong>${nombre}</strong> ha sido revertida al estado "En Agenda".</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                </div>`;
    
            subjectClient = `Tu solicitud ha sido movida a En Agenda`;
            htmlClient = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Confirmación de Reversión a En Agenda</h2>
                    <p>Hola ${nombre},</p>
                    <p>Tu solicitud ha sido revertida exitosamente al estado "En Agenda".</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nombre</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                    <p style="margin-top: 20px;">Saludos,<br>Equipo de Soporte</p>
                </div>`;
            break;
        case "ActualizarSolicitud":
            // New case for ActualizarSolicitud
            subjectAdmin = `Actualización de Solicitud: ${nombre}`;
            htmlAdmin = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Actualización de Solicitud</h2>
                    <p>Hola,</p>
                    <p>La solicitud del cliente <strong>${nombre}</strong> ha sido actualizada con una nueva fecha y estado.</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                </div>`;

            subjectClient = `Confirmación de actualización de solicitud`;
            htmlClient = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Confirmación de actualización de solicitud</h2>
                    <p>Hola ${nombre},</p>
                    <p>Tu solicitud ha sido actualizada exitosamente con una nueva fecha y estado.</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nombre</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                    <p style="margin-top: 20px;">Saludos,<br>Equipo de Soporte</p>
                </div>`;
            break;
        case "CrearCita":
            subjectAdmin = `Nueva Cita Programada para la solicitud ${nombre}`;
            htmlAdmin = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Nueva Cita Programada</h2>
                    <p>Hola,</p>
                    <p>El cliente <strong>${nombre}</strong> ha programado una nueva cita.</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                </div>`;
        
            subjectClient = `Confirmación de Cita Programada`;
            htmlClient = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Confirmación de Cita Programada</h2>
                    <p>Hola ${nombre},</p>
                    <p>Gracias por programar una cita con nosotros. Aquí están los detalles:</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nombre</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                    <p style="margin-top: 20px;">Saludos,<br>Equipo de Soporte</p>
                </div>`;
            break;
        case "RechazarSolicitud":
            subjectAdmin = `Solicitud Rechazada para ${nombre}`;
            htmlAdmin = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Solicitud Rechazada</h2>
                    <p>Hola,</p>
                    <p>La solicitud del cliente <strong>${nombre}</strong> ha sido rechazada.</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                </div>`;
    
            subjectClient = `Notificación de Rechazo de Solicitud`;
            htmlClient = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Solicitud Rechazada</h2>
                    <p>Hola ${nombre},</p>
                    <p>Tu solicitud ha sido rechazada. Para más detalles, puedes comunicarte con nosotros.</p>
                    <p style="margin-top: 20px;">Saludos,<br>Equipo de Soporte</p>
                </div>`;
            break;            
        case "ConfirmarSolicitud":
            subjectAdmin = `Solicitud Confirmada para el cliente ${nombre}`;
            htmlAdmin = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Solicitud Confirmada</h2>
                    <p>Hola,</p>
                    <p>La solicitud del cliente <strong>${nombre}</strong> ha sido confirmada.</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                </div>`;
        
            subjectClient = `Confirmación de Solicitud`;
            htmlClient = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Confirmación de Solicitud</h2>
                    <p>Hola ${nombre},</p>
                    <p>Tu solicitud ha sido confirmada. Aquí están los detalles:</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nombre</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                    <p style="margin-top: 20px;">Saludos,<br>Equipo de Soporte</p>
                </div>`;
            break;
        case "NuevaSolicitud":
            subjectAdmin = `Nueva Solicitud de Servicio de ${nombre}`;
            htmlAdmin = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Nueva Solicitud de Servicio</h2>
                    <p>Hola,</p>
                    <p>El cliente <strong>${nombre}</strong> ha realizado una nueva solicitud de servicio.</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                </div>`;
        
            subjectClient = `Notificación de Nueva Solicitud de Servicio`;
            htmlClient = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Solicitud de Servicio Recibida</h2>
                    <p>Hola ${nombre},</p>
                    <p>Gracias por enviar tu solicitud de servicio. Hemos recibido tu petición y la estaremos procesando. Aquí tienes los detalles:</p>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nombre</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;"><strong>Mensaje:</strong><br><i>"${mensaje}"</i></p>
                    <p style="margin-top: 20px;">Saludos,<br>Equipo de Soporte</p>
                </div>`;
            break;
            
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