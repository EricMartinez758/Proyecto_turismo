import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';

const ViewReservationModal = ({ show, onHide, reservation }) => {
  if (!reservation) return null;

  const {
    reservationCode,
    reservationDate,
    activity,
    client,
    groupMembers = [],
    paymentMethod,
    people,
    active,
    canceled
  } = reservation;

  return (
    <Modal show={show} onHide={onHide} size="lg" className="persona-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-eye-fill me-2"></i>
          Detalles de Reservación {reservationCode}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <div className="persona-form-card p-4">
          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="text-primary mb-3">
                <i className="bi bi-calendar-event me-2"></i>
                Información General
              </h5>
              
              <div className="mb-3">
                <label className="form-label">Fecha de Reservación:</label>
                <p className="form-control-static">{reservationDate}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Actividad:</label>
                <p className="form-control-static">
                  <Badge bg="secondary" className="text-uppercase">
                    {activity.type} - {activity.location}
                  </Badge>
                </p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Estado:</label>
                <p className="form-control-static">
                  {canceled ? (
                    <Badge bg="danger" className="badge-inactive">
                      Cancelada
                    </Badge>
                  ) : active ? (
                    <Badge bg="success" className="badge-active">
                      Activa
                    </Badge>
                  ) : (
                    <Badge bg="warning" className="badge-inactive text-dark">
                      Inactiva
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            
            <div className="col-md-6">
              <h5 className="text-primary mb-3">
                <i className="bi bi-person-lines-fill me-2"></i>
                Información del Cliente
              </h5>
              
              <div className="mb-3">
                <label className="form-label">Cliente Principal:</label>
                <p className="form-control-static">
                  {client.firstName} {client.lastName} ({client.idNumber})
                </p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Teléfono:</label>
                <p className="form-control-static">{client.phone}</p>
              </div>
              
              {groupMembers.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">Integrantes del Grupo:</label>
                  <div className="border p-2 rounded" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {groupMembers.map((member, index) => (
                      <Badge key={index} bg="info" className="badge-guia me-2 mb-2">
                        {member.firstName} {member.lastName} ({member.idNumber})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-primary mb-3">
                <i className="bi bi-currency-exchange me-2"></i>
                Información de Pago
              </h5>
              
              <div className="mb-3">
                <label className="form-label">Método de Pago:</label>
                <p className="form-control-static text-uppercase">{paymentMethod}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Precio por Persona:</label>
                <p className="form-control-static">
                  {activity.price[paymentMethod]} {paymentMethod}
                </p>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="payment-summary p-3 bg-light rounded">
                <h6 className="mb-3">Resumen de Pago</h6>
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td>Personas:</td>
                      <td className="text-end">{people}</td>
                    </tr>
                    <tr>
                      <td>Precio Unitario:</td>
                      <td className="text-end">
                        {activity.price[paymentMethod]} {paymentMethod}
                      </td>
                    </tr>
                    <tr className="table-active">
                      <th>Total:</th>
                      <th className="text-end">
                        {(activity.price[paymentMethod] * people).toFixed(2)} {paymentMethod}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer className="persona-modal-footer">
        <Button variant="secondary-persona" onClick={onHide}>
          <i className="bi bi-x-circle me-2"></i>
          Cerrar
        </Button>
        
      </Modal.Footer>
    </Modal>
  );
};

export default ViewReservationModal;