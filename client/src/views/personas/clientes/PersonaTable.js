import React from 'react';
import { Table, Badge } from 'react-bootstrap';

const PersonaTable = ({ personas, onEdit, onToggleActive, onShowDetails }) => {
    const getEstadoBadge = (activo) => {
        return activo ? (
            <Badge bg="success">Activo</Badge>
        ) : (
            <Badge bg="danger">Inactivo</Badge>
        );
    };

    return (
        <Table responsive striped hover>
            <thead>
                <tr>
                    <th>Primer Nombre</th>
                    <th>Primer Apellido</th>
                    <th>Documento</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {personas.map((persona) => (
                    <tr key={persona._id}>
                        <td>{persona.primerNombre}</td>
                        <td>{persona.primerApellido}</td>
                        <td>{persona.numeroDocumento}</td>
                        <td>{persona.telefono}</td>
                        <td>{getEstadoBadge(persona.activo)}</td>
                        <td>
                            <button
                                className="btn btn-sm btn-info me-2"
                                onClick={() => onShowDetails(persona)}
                            >
                                <i className="fas fa-eye"></i> Detalles
                            </button>
                            <button
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => onEdit(persona)}
                            >
                                <i className="fas fa-edit"></i> Editar
                            </button>
                            <button
                                className={`btn btn-sm ${persona.activo ? 'btn-danger' : 'btn-success'}`}
                                onClick={() => onToggleActive(persona)}
                            >
                                {persona.activo ? <><i className="fas fa-ban"></i> Desactivar</> : <><i className="fas fa-check"></i> Activar</>}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default PersonaTable;