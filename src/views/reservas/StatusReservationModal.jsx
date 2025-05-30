import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const StatusReservationModal = ({ show, onHide, onConfirm, reservation }) => {
  const handleConfirm = () => {
    onConfirm(reservation.id);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Estado de Reservación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro que deseas {reservation.active ? 'desactivar' : 'activar'} la reservación 
          <strong> {reservation.reservationCode}</strong> del cliente 
          <strong> {reservation.client.firstName} {reservation.client.lastName}</strong>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button 
          variant={reservation.active ? 'warning' : 'success'} 
          onClick={handleConfirm}
        >
          {reservation.active ? 'Desactivar' : 'Activar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusReservationModal;