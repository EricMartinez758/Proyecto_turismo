import React from 'react';
import { Modal, Badge, Card, ListGroup } from 'react-bootstrap';

const PersonaModalDetalles = ({ show, handleClose, persona }) => {
    if (!persona) return null;

    // Función para formatear el tipo de registro médico
    const formatTipoRegistro = (tipo) => {
        const tipos = {
            medicamento: 'Medicamento',
            discapacidad: 'Discapacidad',
            alergia: 'Alergia'
        };
        return tipos[tipo] || tipo;
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Detalles Completos de la Persona</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    {/* Columna izquierda - Datos personales */}
                    <div className="col-md-6">
                        <Card className="mb-4">
                            <Card.Header className="bg-light">
                                <h5 className="mb-0 text-dark">Información Personal</h5>
                            </Card.Header>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <strong>Primer Nombre:</strong> {persona.primerNombre || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Segundo Nombre:</strong> {persona.segundoNombre || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Primer Apellido:</strong> {persona.primerApellido || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Segundo Apellido:</strong> {persona.segundoApellido || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Documento:</strong> {persona.numeroDocumento || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Fecha Nacimiento:</strong> {persona.fechaNacimiento || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Nacionalidad:</strong> {persona.nacionalidad || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Teléfono:</strong> {persona.telefono || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Dirección:</strong> {persona.direccion || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Estado:</strong> {persona.activo ? (
                                            <Badge bg="success">Activo</Badge>
                                        ) : (
                                            <Badge bg="danger">Inactivo</Badge>
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Columna derecha - Historial Médico */}
                    <div className="col-md-6">
                        <Card>
                            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 text-dark">Historial Médico</h5>
                                <Badge bg="secondary" pill>
                                    {persona.historialMedico?.length || 0} registros
                                </Badge>
                            </Card.Header>
                            <Card.Body>
                                {persona.historialMedico && persona.historialMedico.length > 0 ? (
                                    <ListGroup>
                                        {persona.historialMedico.map((registro, index) => (
                                            <ListGroup.Item key={index} className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <strong>Registro #{index + 1}</strong>
                                                    <Badge bg="info">
                                                        {formatTipoRegistro(registro.tipo)}
                                                    </Badge>
                                                </div>
                                                <div className="mt-2">
                                                    <strong>Descripción:</strong>
                                                    <p className="mb-0">{registro.descripcion || 'Sin descripción'}</p>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <div className="alert alert-info mb-0">
                                        No hay registros médicos para esta persona.
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleClose}>
                    Cerrar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default PersonaModalDetalles;