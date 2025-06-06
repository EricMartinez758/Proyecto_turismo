import React from 'react';

const ViewEvent = ({ event, onBack }) => {
  if (!event) return null;

  return (
    <div className="view-event">
      <h2>Detalles del Evento</h2>
      
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{event.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            Tipo: {event.activityType} | Estado: {event.active ? 'Activo' : 'Inactivo'}
          </h6>
          
          <div className="row mt-3">
            <div className="col-md-6">
              <p><strong>Fecha de Inicio:</strong> {event.startDate}</p>
              <p><strong>Fecha de Finalización:</strong> {event.endDate}</p>
              <p><strong>Número Máximo de Clientes:</strong> {event.maxClients}</p>
            </div>
            
            <div className="col-md-6">
              <p><strong>Guías a Cargo:</strong></p>
              <ul>
                {event.guides && event.guides.map((guide, index) => (
                  <li key={index}>
                    {guide.nombre} ({guide.cedula})
                  </li>
                ))}
              </ul>
              
              <p><strong>Vehículos Asignados:</strong></p>
              <ul>
                {event.vehicles && event.vehicles.map((vehicle, index) => (
                  <li key={index}>
                    {vehicle.placa} - {vehicle.conductor} ({vehicle.cedula})
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <button onClick={onBack} className="btn btn-primary mt-3">
            Volver a la lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;