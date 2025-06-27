import React from 'react';
import { Modal, Badge, ListGroup } from 'react-bootstrap';

const PersonaModalView = ({ show, onHide, persona }) => {
    if (!persona) return null;

    const getEstadoBadge = (activo) => {
        return activo ? (
            <Badge className="badge-active">Activo</Badge>
        ) : (
            <Badge className="badge-inactive">Inactivo</Badge>
        );
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="persona-modal">
            <Modal.Header  className="modal-header persona-modal">
                <Modal.Title>
                    <i className="fas fa-user me-2 icon-persona"></i>
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
                                <strong>Estado:</strong> {getEstadoBadge(persona.activo)}
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
                                    <div className="card h-100 medical-history-card">
                                        <div className="card-header">
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
            <Modal.Footer className="modal-footer persona-modal">
                <button className="btn btn-secondary-persona" onClick={onHide}>
                    Cerrar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default PersonaModalView;