import React from "react";

export default function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-md-4 footer-item">
              <h4>Profesionalismo en Fontanería</h4>
              <p>Compromiso y calidad garantizada en cada servicio.</p>
              <ul className="social-icons">
                <li>
                  <a href="https://www.facebook.com/tuempresa">
                    <i className="bi bi-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/tuempresa">
                    <i className="bi bi-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/numerodetuempresa">
                    <i className="bi bi-whatsapp"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-4 footer-item">
              <h4>Enlaces Útiles</h4>
              <ul className="menu-list">
                <li>
                  <a href="/servicios">Nuestros Servicios</a>
                </li>
                <li>
                  <a href="/proyectos">Proyectos Recientes</a>
                </li>
                <li>
                  <a href="/testimonios">Testimonios de Clientes</a>
                </li>
                <li>
                  <a href="/consejos">Consejos de Mantenimiento</a>
                </li>
              </ul>
            </div>
            <div className="col-md-4 footer-item">
              <h4>Páginas Adicionales</h4>
              <ul className="menu-list">
                <li>
                  <a href="/acerca-de">Acerca De Nosotros</a>
                </li>
                <li>
                  <a href="/como-trabajamos">Cómo Trabajamos</a>
                </li>
                <li>
                  <a href="/soporte">Soporte Rápido</a>
                </li>
                <li>
                  <a href="/contacto">Contáctanos</a>
                </li>
                <li>
                  <a href="/politica-de-privacidad">Política de Privacidad</a>
                </li>
              </ul>
            </div>
            <div className="pt-5">
              <p>
                Derechos reservados 2024 Profesionalismo en Fontanería. Soluciones de confianza para cada necesidad.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
