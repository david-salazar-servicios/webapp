import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Card, Row, Col, Button } from 'antd';
import { useInView } from 'react-intersection-observer';
const { Meta } = Card;

const profiles = [
  "https://www.facebook.com/profile.php?id=100037466996673",
  "https://www.facebook.com/profile.php?id=100041823116102",
  "https://www.facebook.com/profile.php?id=100093514793577",
  "https://www.facebook.com/profile.php?id=100062304109587",
  "https://www.facebook.com/profile.php?id=100063553915196",
  "https://www.facebook.com/phcerofugasCR",
  "https://www.facebook.com/fontaneroCR1",
  "https://www.facebook.com/profile.php?id=61550243357875",
  "https://www.facebook.com/profile.php?id=61550671803224",
];

const ServiceCard = ({ profile, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [controls, inView]);

  const handleButtonClick = () => {
    window.open(profile, '_blank');
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
    >
      <Card
        hoverable
        style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        cover={
          <iframe
            src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(profile)}&tabs=timeline&width=800&height=300&small_header=false&adapt_container_width=true&hide_cover=true&show_facepile=true&appId&locale=es_ES`}
            width="100%"
            height="300"
            style={{ border: 'none', overflow: 'hidden' }}
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        }
      >

        <div className="text-center mt-2">
          <Button className="btn btn-info btn-block d-flex justify-content-center  btn-animated-border " onClick={handleButtonClick}
            style={{
              fontSize: '0.85em',
              width: '100%',
            }}>
            Ver Más
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

const Novedades = () => {
  return (
    <section className="news-section light">
      <div className="container py-4">
        <div className="section-title text-center">
          <h2 className="h2-title">Novedades en Redes</h2>
          <p>
            En esta sección, compartimos las últimas novedades y actualizaciones publicadas por nuestra empresa en nuestras redes sociales.
            Mantente al tanto de nuestras actividades, proyectos, y noticias relevantes visitando nuestras páginas oficiales en Facebook.
            ¡No te pierdas ninguna de nuestras actualizaciones!
          </p>
        </div>
        <Row gutter={[16, 16]} justify="center">
          {profiles.map((profile, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <ServiceCard profile={profile} index={index} />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Novedades;
