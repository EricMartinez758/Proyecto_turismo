import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
// Asegúrate de que formatDate exista y la ruta sea correcta
// Si no tienes formatDate, puedes comentarla temporalmente o definirla
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A'; // Definición temporal si no existe

const ReservationTable = ({ reservations, onEdit, onStatusChange, onCancel, onView, onPay }) => {
    return (
        <div className="reservation-list">
            <Table hover className="reserva-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Fecha</th>
                        <th>Actividad</th>
                        <th>Cliente</th>
                        <th>Personas</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.length > 0 ? (
                        reservations.map(reservation => {
                            // --- CONSOLE.LOGS CLAVE PARA DEPURACIÓN DEL BOTÓN PAGAR ---
                            console.log('--- Reservation ID:', reservation.id, '---');
                            console.log('  reservation.active:', reservation.active);
                            console.log('  reservation.canceled:', reservation.canceled);
                            console.log('  reservation.paid:', reservation.paid);

                            // La condición que deshabilita el botón "Pagar"
                            const isPayButtonDisabled = reservation.canceled || !reservation.active || reservation.paid;
                            console.log('  Is "Pagar" button disabled by logic?', isPayButtonDisabled);
                            // --- FIN CONSOLE.LOGS CLAVE ---

                            const currentPaymentMethod = reservation.paymentMethod || 'USD';
                            const currentPeople = reservation.people || 0;

                            const totalAmount = (
                                (reservation.activity?.price?.[currentPaymentMethod] || 0) * currentPeople
                            );
                            const totalUSDAmount = (
                                (reservation.activity?.price?.['USD'] || 0) * currentPeople
                            );

                            return (
                                <tr key={reservation.id}>
                                    <td>{reservation.reservationCode || 'N/A'}</td>
                                    <td>{formatDate(reservation.reservationDate)}</td>
                                    <td>
                                        <Badge bg="secondary" className="text-uppercase">
                                            {reservation.activity?.type || 'N/A'}
                                        </Badge>
                                    </td>
                                    <td>
                                        {reservation.client?.firstName || 'N/A'} {reservation.client?.lastName || 'N/A'}
                                        <br />
                                        <small className="text-muted">({reservation.client?.idNumber || 'N/A'})</small>
                                    </td>
                                    <td>{currentPeople}</td>
                                    <td>
                                        {totalAmount.toFixed(2)} {currentPaymentMethod}
                                        {currentPaymentMethod !== 'USD' && (
                                            <small className="text-muted ms-2">
                                                (≈{totalUSDAmount.toFixed(2)} USD)
                                            </small>
                                        )}
                                    </td>
                                    <td>
                                        {reservation.canceled ? (
                                            <Badge bg="danger" className="badge-inactive">
                                                Cancelada
                                            </Badge>
                                        ) : reservation.active ? (
                                            <Badge bg="success" className="badge-active">
                                                Activa
                                            </Badge>
                                        ) : (
                                            <Badge bg="warning" className="badge-inactive text-dark">
                                                Inactiva
                                            </Badge>
                                        )}
                                        {reservation.paid && (
                                            <Badge bg="info" className="ms-2">
                                                Pagada
                                            </Badge>
                                        )}
                                    </td>
                                    <td>
                                        <div className="d-flex flex-wrap gap-2">
                                            <Button
                                                variant="info"
                                                size="sm"
                                                className="btn-info-reserva2"
                                                onClick={() => onView(reservation)}
                                            >
                                                <i className="bi bi-eye-fill me-1"></i>
                                                Ver
                                            </Button>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                className="btn-info-reserva"
                                                onClick={() => onEdit(reservation)}
                                                disabled={reservation.canceled || reservation.paid}
                                            >
                                                <i className="bi bi-pencil-square me-1"></i>
                                                Editar
                                            </Button>
                                            <Button
                                                variant={reservation.active ? 'warning' : 'success'}
                                                size="sm"
                                                className={reservation.active ? 'btn-warning-reserva' : 'btn-success-reserva'}
                                                onClick={() => onStatusChange(reservation)}
                                                disabled={reservation.canceled || reservation.paid}
                                            >
                                                <i className={`bi ${reservation.active ? 'bi-pause-fill' : 'bi-play-fill'} me-1`}></i>
                                                {reservation.active ? 'Desactivar' : 'Activar'}
                                            </Button>
                                            <Button
                                                variant={reservation.paid ? "success" : "primary"}
                                                size="sm"
                                                className={reservation.paid ? "btn-success-reserva" : "btn-primary-reserva"}
                                                // El onClick solo se ejecuta si el botón NO está deshabilitado
                                                onClick={() => {
                                                    console.log("Pagar button clicked for reservation:", reservation.id);
                                                    onPay(reservation); // Llama a la función onPay
                                                }}
                                                disabled={isPayButtonDisabled} // Usa la variable calculada
                                            >
                                                <i className={`bi ${reservation.paid ? "bi-check-circle-fill" : "bi-credit-card"} me-1`}></i>
                                                {reservation.paid ? "Pagado" : "Pagar"}
                                            </Button>
                                            {!reservation.canceled && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="btn-danger-reserva"
                                                    onClick={() => onCancel(reservation)}
                                                    disabled={reservation.paid}
                                                >
                                                    <i className="bi bi-x-circle me-1"></i>
                                                    Cancelar
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
                                <div className="alert alert-info-reserva mb-0">
                                    <i className="bi bi-info-circle-fill me-2"></i>
                                    No hay reservaciones registradas
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ReservationTable;