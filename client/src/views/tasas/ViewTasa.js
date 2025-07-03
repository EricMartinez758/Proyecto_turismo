import React from 'react';
import '../../assets/css/tasas.css';

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const ViewTasa = ({ tasa, onBack }) => {
  if (!tasa) return null;

  return (
    <div className="view-tasa">
      <div className="tasas-card">
        <div className="tasas-card-body">
          <div className="tasas-list-header">
            <h4 className="tasas-list-title">Detalles de Tasa</h4>
            <button className="tasas-button tasas-button-secondary" onClick={onBack}>
              Volver
            </button>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <strong className="tasas-form-label">Moneda:</strong>
              <div style={{ marginTop: '8px' }}>
                <h5>
                  <span className="tasas-badge tasas-badge-primary">
                    {tasa.nombreMoneda} ({tasa.moneda} {tasa.simbolo && `- ${tasa.simbolo}`})
                  </span>
                </h5>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <strong className="tasas-form-label">Valor actual:</strong>
              <div style={{ marginTop: '8px' }}>
                <h4>
                  <span className="tasas-badge tasas-badge-success">
                    1 USD = {tasa.valor} {tasa.moneda}
                  </span>
                </h4>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <strong className="tasas-form-label">Vigente desde:</strong>
              <div style={{ marginTop: '8px' }}>
                <span className="tasas-badge tasas-badge-info">
                  {formatDateTime(tasa.fecha)}
                </span>
              </div>
            </div>
          </div>
          
          <h5 style={{ marginTop: '20px', marginBottom: '15px' }}>Historial de Cambios</h5>
          <table className="tasas-table">
            <thead>
              <tr>
                <th>Valor</th>
                <th>Fecha Vigencia</th>
                <th>Actualizado el</th>
              </tr>
            </thead>
            <tbody>
              {[...tasa.historial].reverse().map((item, index) => (
                <tr key={index}>
                  <td>1 USD = {item.valor} {tasa.moneda}</td>
                  <td>{formatDateTime(item.fecha)}</td>
                  <td>{formatDateTime(item.fechaActualizacion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewTasa;