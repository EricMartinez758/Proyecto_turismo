// PersonaModalView.js
import React from 'react';
import { Modal, Badge, ListGroup, Row, Col, Alert } from 'react-bootstrap';

const PersonaModalView = ({ show, onHide, persona }) => {
 const formatDate = (dateString) => {
  if (!dateString) return 'No especificado';
  
  try {
    // Si la fecha viene en formato ISO (backend)
    if (dateString.includes('T')) {
      return new Date(dateString).toLocaleDateString();
    }
    // Si ya viene en formato local
    return dateString;
  } catch {
    return dateString;
  }
}

  if (!persona) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">No se encontraron datos para mostrar</Alert>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          <i className="fas fa-user me-2"></i>
          Detalles Completos de la Persona
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={6}>
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5>Información Personal</h5>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Nombre Completo:</strong> {[
                    persona.primerNombre,
                    persona.segundoNombre,
                    persona.primerApellido,
                    persona.segundoApellido
                  ].filter(Boolean).join(' ') || 'No especificado'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Documento:</strong> {persona.numeroDocumento || 'No especificado'}
                </ListGroup.Item>
               <ListGroup.Item>
  <strong>Fecha Nacimiento:</strong> {formatDate(persona.fechaNacimiento)}
</ListGroup.Item>
              </ListGroup>
            </div>
          </Col>

          <Col md={6}>
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5>Información de Contacto</h5>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Teléfono:</strong> {persona.telefono || 'No especificado'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Dirección:</strong> {persona.direccion || 'No especificada'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Tipo:</strong> {persona.tipoPersona ? (
                    <Badge bg="info">{persona.tipoPersona}</Badge>
                  ) : 'No especificado'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Estado:</strong> {persona.estado ? (
                    <Badge bg={persona.estado === 'activo' ? 'success' : 'danger'}>
                      {persona.estado}
                    </Badge>
                  ) : 'No especificado'}
                </ListGroup.Item>
              </ListGroup>
            </div>
          </Col>
        </Row>

        {/* Información Bancaria */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5>Información Bancaria</h5>
          </div>
          <div className="card-body">
            <Row>
              <Col md={4}>
                <strong>Banco:</strong> {persona.banco?.nombre || 'No especificado'}
              </Col>
              <Col md={4}>
                <strong>Número de Cuenta:</strong> {persona.numeroCuentaBancaria || 'No especificado'}
              </Col>
              <Col md={4}>
                <strong>Tipo de Cuenta:</strong> {persona.tipoCuenta || 'No especificado'}
              </Col>
            </Row>
          </div>
        </div>

        {/* Historial Médico */}
       {persona.historialMedico?.length > 0 ? (
  <div className="card">
    <div className="card-header bg-primary text-white">
      <h5>Historial Médico</h5>
    </div>
    <div className="card-body">
      <Row>
        {persona.historialMedico.map((item, index) => (
          <Col md={6} key={index} className="mb-3">
            <div className="card h-100">
              <div className="card-header">
                <strong>Registro {index + 1}</strong>
              </div>
              <div className="card-body">
                <p><strong>Tipo:</strong> {item.tipoNombre || item.tipo || 'No especificado'}</p>
                <p><strong>Descripción:</strong> {item.descripcion || 'No especificada'}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  </div>
) : (
  <div className="alert alert-info">
    No hay registros médicos para mostrar
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