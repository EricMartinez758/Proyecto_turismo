import React from 'react';
import { Table, Badge } from 'react-bootstrap';

const PersonaTable = ({ personas, onEdit, onToggleActive }) => {
    const getTipoPersonaBadge = (tipo) => {
        const variants = {
            guia: 'primary',
            administrativo: 'info',
            obrero: 'warning'
        };
        return <Badge bg={variants[tipo]}>{tipo}</Badge>;
    };

    const getEstadoBadge = (activo) => {
        return activo ? (
            <Badge bg="success">Activo</Badge>
        ) : (
            <Badge bg="danger">Inactivo</Badge>
        );
    };

    return (
        <Table responsive>
            <thead>
                <tr>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Documento</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {personas.map((persona) => (
                    <tr key={persona._id}>
                        <td>{persona.nombres}</td>
                        <td>{persona.apellidos}</td>
                        <td>{persona.numeroDocumento}</td>
                        <td>{persona.telefono}</td>
                        <td>{getEstadoBadge(persona.activo)}</td>
                        <td>
                            <button
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => onEdit(persona)}
                            >
                                Editar
                            </button>
                            <button
                                className={`btn btn-sm ${persona.activo ? 'btn-danger' : 'btn-success'}`}
                                onClick={() => onToggleActive(persona)}
                            >
                                {persona.activo ? 'Desactivar' : 'Activar'}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default PersonaTable;