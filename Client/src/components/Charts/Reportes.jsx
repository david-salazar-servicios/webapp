import React from 'react';
import ReporteServiciosSolicitados from './reporteServiciosSolicitados';
import ReporteProforma from './reporteProforma';
import ReporteSolicitudesPorMes from './reporteSolicitudesPorMes';
import ReporteGananciaMensual from './ReporteGananciaMensual';

export default function Reportes() {
  return (
    <div className="container reportes-container" style={{ padding: '20px' }}>
      {/* Reporte Ganancia Mensual y Reporte Proforma en el mismo row */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div>
            <ReporteProforma />
          </div>
        </div>
      </div>
      {/* Reporte Servicios Solicitados */}
      <div className="row g-4">
        <div className="col-12">
          <ReporteServiciosSolicitados />
        </div>
      </div>

      {/* Reporte Solicitudes Por Mes */}
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
