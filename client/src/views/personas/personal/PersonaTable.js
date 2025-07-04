import React from 'react';
import { Table, Badge } from 'react-bootstrap';

const PersonaTable = ({ personas, onEdit, onToggleActive, onView }) => {
  const getEstadoBadge = (activo) => {
    return activo ? (
      <Badge className="badge-active">Activo</Badge>
    ) : (
      <Badge className="badge-inactive">Inactivo</Badge>
    );
  };

  return (
    <Table responsive hover className="persona-table mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Primer Nombre</th>
          <th>Primer Apellido</th>
          <th>Tipo de empleado</th>
          <th>Teléfono</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {personas.length > 0 ? (
          personas.map((persona) => (
            <tr key={persona.id || persona.numero_documento}>
              <td>{persona.numero_documento}</td>
              <td>{persona.primer_nombre}</td>
              <td>{persona.primer_apellido}</td>
              <td>{persona.tipo_persona}</td>
              <td>{persona.telefono}</td>
              <td>{getEstadoBadge(persona.estado === 'activo')}</td>
              <td>
                <div className="d-flex gap-2">
                  <button
  className="btn btn-sm btn-secondary-persona"
  onClick={() => onView(persona)} 
>
  Ver
  <i className="fas fa-eye"></i>
</button>
                  <button
  className="btn btn-sm btn-primary-persona"
  onClick={() => {
    
    if (persona && persona.id) {
      onEdit(persona.id); // Solo pasa el ID
    } else {
      console.error('Persona o ID no definido:', persona);
    }
  }}
>
  Editar
  <i className="fas fa-edit"></i>
</button>
                  <button
                    className={`btn btn-sm ${persona.estado === 'activo' ? 'btn btn-light' : 'btn btn-dark'}`}
                    onClick={() => onToggleActive({
                      ...persona,
                      _id: persona.id,
                      activo: persona.estado === 'activo'
                    })}
                  >
                    {persona.estado === 'activo' ? (
                      <>
                        <i className="fas fa-ban me-1"></i> Desactivar
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-1"></i> Activar
                      </>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-4 text-muted">
              <i className="fas fa-users fa-2x mb-3"></i>
              <p>No hay personas registradas</p>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default PersonaTable;