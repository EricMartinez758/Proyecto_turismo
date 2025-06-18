import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const StatusReservationModal = ({ show, onHide, onConfirm, reservation }) => {
  // Return null if no reservation is provided
  if (!reservation) return null;

  const handleConfirm = () => {
    onConfirm(reservation.id);
  };

  const isActive = reservation?.active ?? false;
  const reservationCode = reservation?.reservationCode ?? '';
  const clientName = reservation?.client 
    ? `${reservation.client.firstName || ''} ${reservation.client.lastName || ''}`
    : '';

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Estado de Reservación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro que deseas {isActive ? 'desactivar' : 'activar'} la reservación 
          <strong> {reservationCode}</strong> del cliente 
          <strong> {clientName}</strong>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button 
          variant={isActive ? 'warning' : 'success'} 
          onClick={handleConfirm}
        >
          {isActive ? 'Desactivar' : 'Activar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusReservationModal;