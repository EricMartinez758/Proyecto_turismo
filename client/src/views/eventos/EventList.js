import React from 'react';

const EventList = ({ events, onView, onEdit, onToggleStatus, onCreate }) => {
  return (
    <div className="event-list">
      <button onClick={onCreate} className="btn-persona-primary mb-3" >
        Crear Nuevo Evento
      </button>
     
      <table className="persona-table">
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
        <tbody style={{color: '#000',backgroundColor: '#fff'}}>
          {events.length > 0 ? (
            events.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.activityType}</td>
                <td>{event.startDate}</td>
                <td>{event.endDate}</td>
                <td>{event.maxClients}</td>
                <td>
                  <span className={event.active ? 'badge-active' : 'badge-inactive'}>
                    {event.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button onClick={() => onView(event)} className="btn btn-info btn-sm mr-2">
                    Ver
                  </button>
                  <button onClick={() => onEdit(event)} className="btn btn-warning btn-sm mr-2">
                    Editar
                  </button>
                  <button
                    onClick={() => onToggleStatus(event.id)}
                    className={`btn btn-sm ${event.active ? 'btn-danger-persona' : 'btn-primary-persona'}`}
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