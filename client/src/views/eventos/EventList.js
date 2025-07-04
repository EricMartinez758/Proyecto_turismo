import React from 'react';

const EventList = ({ events, onView, onEdit, onToggleStatus, onCreate }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };



  // Función para obtener el nombre del tipo de actividad
  const getActivityTypeName = (typeId) => {
    if (!activityTypes || !typeId) return 'Sin tipo';
    const type = activityTypes.find(t => t.id === typeId);
    return type ? type.nombre : 'Desconocido';
  };

  return (
    <div className="event-list">
      <button onClick={onCreate} className="btn-persona-primary mb-3">
        Crear Nuevo Evento
      </button>
     
      <table className="persona-table">
        <thead>
  <tr>
    <th>Nombre</th>
    <th>Tipo</th>
    <th>Fecha y hora inicio</th>
    <th>Fecha y hora fin</th>
    <th>Clientes Máx</th>
    <th>Precio por persona</th>
    <th>Estado</th>
    <th>Acciones</th>
  </tr>
</thead>
        <tbody style={{color: '#000', backgroundColor: '#fff'}}>
          {events.length > 0 ? (
            events.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>
                  <span className="badge-guia">
                    {event.activityTypeName || 'Sin tipo'}
                  </span>
                </td>
                <td>
  {event.fecha_actividad || 'N/A'} | {event.hora_actividad?.substring(0, 5) || 'N/A'}
</td>
<td>
  {event.fecha_fin ? `${event.fecha_fin} | ${event.hora_fin?.substring(0, 5)}` : 'N/A'}
</td>
                <td className="text-center">{event.maxClients}</td>
                <td className="text-right" style={{ color: '#000' }}>
                  {formatCurrency(event.precioDolares || 0)}
                </td>
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
              <td colSpan="8" className="text-center">No hay eventos registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;