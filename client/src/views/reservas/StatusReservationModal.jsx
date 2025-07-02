import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const StatusReservationModal = ({ show, onHide, onConfirm, reservation }) => {
  if (!reservation) return null;

  const handleConfirm = () => {
    onConfirm(reservation.id);
  };

  const reservationCode = reservation.reservationCode || '';
  const clientName = reservation.client
    ? `${reservation.client.firstName} ${reservation.client.lastName}`
    : '';
  const action = reservation.active ? 'desactivar' : 'activar';

  return (
    <Modal show={show} onHide={onHide} centered className="persona-modal">
      <Modal.Header closeButton>
        <Modal.Title>{reservation.active ? 'Desactivar' : 'Activar'} Reservación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que deseas <strong>{action}</strong> la reservación{' '}
          <strong>{reservationCode}</strong> del cliente{' '}
          <strong>{clientName}</strong>?
        </p>
        {reservation.active ? (
          <p className="text-warning">
            La reservación no estará disponible para nuevos clientes hasta que se active nuevamente.
          </p>
        ) : (
          <p className="text-success">
            La reservación estará disponible para nuevos clientes.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary-persona" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary-persona" onClick={handleConfirm}>
          {reservation.active ? 'Desactivar' : 'Activar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusReservationModal;