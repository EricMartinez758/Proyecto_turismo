import React from 'react';
import { format } from 'date-fns';
import '../../assets/css/tasas.css';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const TasaList = ({ tasas, monedas, onView, onEdit, onCreate }) => {
  const getMonedaInfo = (codigo) => {
    return monedas.find(m => m.codigo === codigo) || {};
  };

  return (
    <div className="tasas-list-container">
      <div className="tasas-list-header">
        <h4 className="tasas-list-title">Tasas de Cambio</h4>
        <button className="tasas-button tasas-button-primary" onClick={onCreate}>
          <span>+</span> Nueva Tasa
        </button>
      </div>
      
      <table className="tasas-table">
        <thead>
          <tr>
            <th>Moneda</th>
            <th>Valor Actual</th>
            <th>Vigente desde</th>
            <th>Última Actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasas.length > 0 ? (
            tasas.map(tasa => {
              const monedaInfo = getMonedaInfo(tasa.moneda);
              return (
                <tr key={tasa.id}>
                  <td>
                    <div>
                      <strong>{monedaInfo.nombre}</strong>
                      <div>
                        <span className="tasas-badge tasas-badge-primary">
                          {tasa.moneda} {monedaInfo.simbolo && `(${monedaInfo.simbolo})`}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="tasas-badge tasas-badge-success">
                      1 USD = {tasa.valor} {tasa.moneda}
                    </span>
                  </td>
                  <td>{formatDate(tasa.fecha)}</td>
                  <td>{formatDate(tasa.historial[tasa.historial.length - 1]?.fechaActualizacion)}</td>
                  <td>
                    <button 
                      className="tasas-button tasas-button-info" 
                      onClick={() => onView(tasa)}
                    >
                      <span></span> Ver
                    </button>
                    
                
                    <button 
                      className="tasas-button tasas-button-warning" 
                      onClick={() => onEdit(tasa)}
                    >
                      <span></span> Editar
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">
                <div className="tasas-alert tasas-alert-info">
                  No hay tasas registradas. Cree una nueva tasa para comenzar.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TasaList;