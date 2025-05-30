import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const StatusReservationModal = ({ show, onHide, onConfirm, reservation }) => {
  if (!reservation) return null;

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
          ¿Estás seguro que deseas {reservation.estado === 'reservado' ? 'cancelar' : 'reactivar'} la reservación
          <strong> {reservation.reservationCode}</strong> del cliente
          <strong> {reservation.client.firstName} {reservation.client.lastName}</strong>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant={reservation.estado === 'reservado' ? 'danger' : 'success'}
          onClick={handleConfirm}
        >
          {reservation.estado === 'reservado' ? 'Cancelar' : 'Reactivar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusReservationModal;