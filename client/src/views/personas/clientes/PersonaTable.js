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
                    <th>Documento</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {personas.length > 0 ? (
                    personas.map((persona) => (
                        <tr key={persona._id || persona.numeroDocumento}>
                            <td>{persona._id}</td>
                            <td>{persona.primerNombre}</td>
                            <td>{persona.primerApellido}</td>
                            <td>{persona.numeroDocumento}</td>
                            <td>{persona.telefono}</td>
                            <td>{getEstadoBadge(persona.activo !== false)}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-secondary-persona"
                                        onClick={() => onView(persona)}
                                    >
                                        <i className="fas fa-eye"></i> Ver
                                    </button>
                                    <button
                                        className="btn btn-sm btn-primary-persona"
                                        onClick={() => onEdit(persona)}
                                    >
                                        <i className="fas fa-edit"></i> Editar
                                    </button>
                                     <button
    className={`btn btn-sm ${persona.activo ? 'btn btn-light' : 'btn btn-dark'}`}
    onClick={() => onToggleActive(persona)}
>
    {persona.activo ? (
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