import React from 'react';
import ReporteServiciosSolicitados from './reporteServiciosSolicitados';
import ReporteProforma from './reporteProforma';
import ReporteSolicitudesPorMes from './reporteSolicitudesPorMes';
import ReporteGananciaMensual from './reporteGananciaMensual';

export default function Reportes() {
  return (
    <div className="container reportes-container" style={{ padding: '20px' }}>
      {/* Filas para los reportes */}
      <div className="row g-4">
        {/* Primera fila: Reporte Proforma y Solicitudes */}
        <div className="col-12">
          <ReporteProforma />
        </div>
      </div>
      <div className="row g-4">
        <div className="col-12">
          <ReporteServiciosSolicitados />
        </div>
      </div>
      <div className="row g-4">
        <div className="col-12">
          <ReporteSolicitudesPorMes />
        </div>
      </div>
      <div className="row g-4">
        <div className="col-12">
          <ReporteGananciaMensual />
        </div>
      </div>
    </div>
  );
}
