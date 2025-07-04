import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const StatusReservationModal = ({ show, onHide, onConfirm, reservation }) => {
    if (!reservation) return null;

    // Determinar el nuevo estado basado en el estado actual de la reserva
    const newStatus = reservation.active ? 'inactiva' : 'activa';
    const actionText = reservation.active ? 'desactivar' : 'activar';
    const variant = reservation.active ? 'warning' : 'success';
    const iconClass = reservation.active ? 'bi-pause-circle-fill' : 'bi-play-circle-fill';

    // Añadir console.log para depuración
    console.log('StatusReservationModal: Reservation ID:', reservation.id);
    console.log('StatusReservationModal: Current active status:', reservation.active);
    console.log('StatusReservationModal: Calculated new status:', newStatus);

    const handleConfirmClick = () => {
        // Al confirmar, pasar el ID de la reserva y el nuevo estado
        onConfirm(reservation.id, newStatus);
    };

    return (
        <Modal show={show} onHide={onHide} className="status-modal">
            <Modal.Header closeButton className={`bg-${variant} text-white`}>
                <Modal.Title>
                    <i className={`bi ${iconClass} me-2`}></i>
                    Confirmar {actionText.charAt(0).toUpperCase() + actionText.slice(1)} Reservación
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant={variant} className="text-center">
                    <i className={`bi ${iconClass} fs-1`}></i>
                    <h4 className="mt-3">
                        ¿Estás seguro de que deseas {actionText} la reservación{' '}
                        <strong>{reservation.reservationCode || 'N/A'}</strong>?
                    </h4>
                    <p className="mb-0">Esta acción cambiará el estado de la reserva a '{newStatus}'.</p>
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    <i className="bi bi-x-circle me-1"></i>
                    Cancelar
                </Button>
                <Button variant={variant} onClick={handleConfirmClick}>
                    <i className="bi bi-check-circle me-1"></i>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StatusReservationModal;