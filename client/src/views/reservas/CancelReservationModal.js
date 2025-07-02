import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CancelReservationModal = ({ show, onHide, onConfirm, reservation }) => {
  if (!reservation) return null;

  const handleConfirm = () => {
    onConfirm(reservation.id);
  };

  const reservationCode = reservation.reservationCode || '';
  const clientName = reservation.client
    ? `${reservation.client.firstName} ${reservation.client.lastName}`
    : '';

  return (
    <Modal show={show} onHide={onHide} centered className="persona-modal">
      <Modal.Header closeButton>
        <Modal.Title>Cancelar Reservación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que deseas <strong>cancelar</strong> la reservación{' '}
          <strong>{reservationCode}</strong> del cliente{' '}
          <strong>{clientName}</strong>?
        </p>
        <p className="text-danger">
          Esta acción marcará la reservación como cancelada y no podrá editarse ni activarse.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary-persona" onClick={onHide}>
          No Cancelar
        </Button>
        <Button variant="danger-persona" onClick={handleConfirm}>
          Cancelar Reservación
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelReservationModal;