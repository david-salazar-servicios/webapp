import '../../vendor/bootstrap/css/privacidad.css';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaCookieBite, FaLink, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Privacidad = () => {
    const boxVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={boxVariants}>
            <div className="privacy-policy">
                <div className="text-center">
                    <h1>Política de Privacidad</h1>
                </div>
                <p><strong>Última actualización: 8 de junio del 2024</strong></p>

                <section>
                    <h2>1. Introducción</h2>
                    <p>En <strong>SERVICIOS RESIDENCIALES & COMERCIALES CRLTDA</strong>, estamos comprometidos a proteger la privacidad y los datos personales de nuestros usuarios. Esta Política de Privacidad explica cómo recopilamos, usamos, compartimos y protegemos su información cuando visita nuestro sitio web <a href="https://davidsalazarservicios.com">https://davidsalazarservicios.com</a> y utiliza nuestros servicios. Al acceder a nuestro sitio, usted acepta los términos y condiciones descritos en esta política.</p>
                </section>

                <section>
                    <h2>2. Información que Recopilamos</h2>
                    <p><FaUser /> <strong>Información Personal:</strong> Recopilamos datos como su nombre, dirección de correo electrónico, número de teléfono, dirección postal y otros datos de contacto.</p>
                    <p><FaLock /> <strong>Información de Uso:</strong> Recopilamos detalles sobre sus visitas a nuestro sitio, incluyendo datos de tráfico, datos de ubicación y weblogs.</p>
                    <p><FaLock /> <strong>Información Técnica:</strong> Recopilamos datos técnicos como su dirección IP, tipo de navegador, versiones del sistema operativo y otros datos tecnológicos.</p>
                </section>

                <section>
                    <h2>3. Uso de la Información</h2>
                    <ul>
                        <li>Proveer y mejorar nuestros servicios.</li>
                        <li>Personalizar su experiencia en nuestro sitio web.</li>
                        <li>Enviar comunicaciones, promociones y noticias relacionadas con nuestros servicios.</li>
                        <li>Cumplir con nuestras obligaciones legales y regulatorias.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Compartir la Información</h2>
                    <ul>
                        <li><strong>Con su Consentimiento:</strong> Podemos compartir su información si usted nos da su consentimiento explícito.</li>
                        <li><strong>Proveedores de Servicios:</strong> Podemos compartir información con terceros que nos ayudan a operar nuestro sitio web y prestar nuestros servicios, siempre que estas partes acuerden mantener esta información confidencial.</li>
                        <li><strong>Obligaciones Legales:</strong> Podemos divulgar su información si estamos obligados por ley o en respuesta a una orden judicial.</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Seguridad de la Información</h2>
                    <p>Adoptamos medidas técnicas y organizativas para proteger sus datos personales contra el acceso no autorizado, la alteración, divulgación o destrucción. Sin embargo, ninguna transmisión de datos por Internet es completamente segura, por lo que no podemos garantizar la seguridad absoluta de la información transmitida a través de nuestro sitio web.</p>
                </section>

                <section>
                    <h2>6. Sus Derechos</h2>
                    <ul>
                        <li>Acceder a sus datos personales que tenemos en nuestro poder.</li>
                        <li>Solicitar la rectificación de datos inexactos o incompletos.</li>
                        <li>Solicitar la eliminación de sus datos personales, salvo en los casos en que estemos obligados a conservarlos por ley.</li>
                        <li>Oponerse al tratamiento de sus datos personales en ciertos casos.</li>
                    </ul>
                    <p>Para ejercer estos derechos, puede contactarnos en <a href="mailto:davidsalazarservicios@gmail.com">davidsalazarservicios@gmail.com</a>.</p>
                </section>

                <section>
                    <h2>7. Cookies</h2>
                    <p><FaCookieBite /> Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación. Las cookies son pequeños archivos de datos que se almacenan en su dispositivo. Usted puede optar por deshabilitar las cookies a través de la configuración de su navegador, pero esto puede afectar el funcionamiento de nuestro sitio web.</p>
                </section>

                <section>
                    <h2>8. Enlaces a Sitios de Terceros</h2>
                    <p><FaLink /> Nuestro sitio web puede contener enlaces a sitios web de terceros. No somos responsables de las prácticas de privacidad ni del contenido de esos sitios. Le recomendamos leer las políticas de privacidad de cada sitio que visite.</p>
                </section>

                <section>
                    <h2>9. Cambios a esta Política de Privacidad</h2>
                    <p>Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Las modificaciones serán efectivas desde el momento de su publicación en nuestro sitio web. Le notificaremos sobre cambios significativos a través de un aviso en nuestro sitio web.</p>
                </section>

                <section>
                    <h2>10. Contacto</h2>
                    <ul>
                        <li><FaEnvelope /> <strong>Correo Electrónico:</strong> <a href="mailto:davidsalazarservicios@gmail.com">davidsalazarservicios@gmail.com</a></li>
                        <li><FaMapMarkerAlt /> <strong>Dirección:</strong> C. Escobal, Heredia, Belén</li>
                    </ul>
                </section>

                <section>
                    <h2>11. Cumplimiento con las Regulaciones de Costa Rica</h2>
                    <p>Esta política se ajusta a la Ley de Protección de la Persona Frente al Tratamiento de sus Datos Personales (Ley No. 8968) de 2011, que establece principios clave como notificación, propósito, consentimiento, seguridad, divulgación, acceso y responsabilidad. Seguimos las mejores prácticas recomendadas por la Agencia de Protección de Datos de los Habitantes (PRODHAB) y mantenemos nuestras políticas actualizadas para reflejar cualquier cambio en las leyes y regulaciones de Costa Rica.</p>
                </section>
            </div>
        </motion.div>
    );
};

export default Privacidad;
