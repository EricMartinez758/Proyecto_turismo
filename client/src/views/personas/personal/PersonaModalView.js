import React from 'react';
import { Modal, Badge, ListGroup } from 'react-bootstrap';

const PersonaModalView = ({ show, onHide, persona }) => {
    if (!persona) return null;

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
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>
                    <i className="fas fa-user me-2"></i>
                    Detalles de la Persona
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row mb-4">
                    <div className="col-md-6">
                        <h5>Información Personal</h5>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Nombre Completo:</strong> {persona.primerNombre} {persona.segundoNombre} {persona.primerApellido} {persona.segundoApellido}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Documento:</strong> {persona.numeroDocumento}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Fecha Nacimiento:</strong> {new Date(persona.fechaNacimiento).toLocaleDateString()}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Teléfono:</strong> {persona.telefono}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Dirección:</strong> {persona.direccion}
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                    
                    <div className="col-md-6">
                        <h5>Información Adicional</h5>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Tipo:</strong> {getTipoPersonaBadge(persona.tipoPersona)}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Estado:</strong> {getEstadoBadge(persona.activo)}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Banco:</strong> {persona.banco || 'No especificado'}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Cuenta Bancaria:</strong> {persona.numeroCuentaBancaria || 'No especificada'}
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                </div>
                
                {persona.historialMedico?.length > 0 && (
                    <div className="mt-4">
                        <h5>Historial Médico</h5>
                        <div className="row">
                            {persona.historialMedico.map((registro, index) => (
                                <div key={index} className="col-md-6 mb-3">
                                    <div className="card h-100">
                                        <div className="card-header bg-light">
                                            <strong>Registro #{index + 1}</strong>
                                        </div>
                                        <div className="card-body">
                                            <p><strong>Tipo:</strong> {registro.tipo}</p>
                                            <p><strong>Descripción:</strong> {registro.descripcion}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={onHide}>
                    Cerrar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default PersonaModalView;