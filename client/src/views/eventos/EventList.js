import React from 'react';

const EventList = ({ events, onView, onEdit, onToggleStatus, onCreate }) => {
  return (
    <div className="event-list">
      <button onClick={onCreate} className="btn btn-primary mb-3">
        Crear Nuevo Evento
      </button>
      
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Clientes Máx</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.activityType}</td>
                <td>{event.startDate}</td>
                <td>{event.endDate}</td>
                <td>{event.maxClients}</td>
                <td>{event.active ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <button onClick={() => onView(event)} className="btn btn-info btn-sm mr-2">
                    Ver
                  </button>
                  <button onClick={() => onEdit(event)} className="btn btn-warning btn-sm mr-2">
                    Editar
                  </button>
                  <button 
                    onClick={() => onToggleStatus(event.id)} 
                    className={`btn btn-sm ${event.active ? 'btn-danger' : 'btn-success'}`}
                  >
                    {event.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No hay eventos registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;