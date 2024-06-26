import React from "react";
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <footer style={{ backgroundColor: '#002347' }}>
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-md-4 footer-item">
              <h4>Profesionalismo en Fontanería</h4>
              <p className="fst-italic">Compromiso y calidad garantizada en cada servicio.</p>
              <ul className="social-icons">
                <li><a href="https://wa.me/50686096382" target='_blank'><i className="bi bi-whatsapp"></i></a></li>
                <li><a href="https://www.tiktok.com/@davidsalazarcr" target='_blank'><i className="bi bi-tiktok"></i></a></li>
                <li><a href="https://www.instagram.com/davidsalazar_cr" target='_blank'><i className="bi bi-instagram"></i></a></li>
                <li><a href="https://www.facebook.com/profile.php?id=100037466996673" target='_blank'><i className="bi bi-facebook"></i></a></li>
                <li><a href="https://www.facebook.com/profile.php?id=100011746801863&mibextid=2JQ9oc" target='_blank'><i className="bi bi-droplet"></i></a></li>
              </ul>
            </div>
            <div className="col-md-4 footer-item">
              <h4>Enlaces Útiles</h4>
              <ul className="menu-list">
                <li>
                  <NavLink to="/">Inicio</NavLink>
                </li>
                <li>
                  <NavLink to="/servicios">Nuestros Servicios</NavLink>
                </li>
                <li>
                  <NavLink to="/proyectos">Galería de Proyectos</NavLink>
                </li>
                <li>
                  <NavLink to="/testimonios">Testimonios de Clientes</NavLink>
                </li>
              </ul>
            </div>
            <div className="col-md-4 footer-item">
              <h4>Páginas Adicionales</h4>
              <ul className="menu-list">
                <li>
                  <NavLink to="/novedades">Novedades</NavLink>
                </li>
                <li>
                  <NavLink to="/About">Acerca de Nosotros</NavLink>
                </li>
                <li>
                  <NavLink to="/contacto">Contáctanos</NavLink>
                </li>
                <li>
                  <NavLink to="/privacidad">Política de Privacidad</NavLink>
                </li>
              </ul>
            </div>
            <div className="pt-5">
              <p>
                All rights reserved. Copyright © 2024 David Salazar Servicios, Costa Rica.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
