import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

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
            reservations.map(reservation => (
              <tr key={reservation.id}>
                <td>{reservation.reservationCode}</td>
                <td>{reservation.reservationDate}</td>
                <td>
                  <Badge bg="secondary" className="text-uppercase">
                    {reservation.activity.type}
                  </Badge>
                </td>
                <td>
                  {reservation.client.firstName} {reservation.client.lastName}
                  <br />
                  <small className="text-muted">({reservation.client.idNumber})</small>
                </td>
                <td>{reservation.people}</td>
                <td>
                  {(reservation.activity.price[reservation.paymentMethod] * reservation.people).toFixed(2)} {reservation.paymentMethod}
                  {reservation.paymentMethod !== 'USD' && (
                    <small className="text-muted ms-2">
                      (≈{(reservation.activity.price['USD'] * reservation.people).toFixed(2)} USD)
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
                      onClick={() => !reservation.paid && onPay(reservation)}
                      disabled={reservation.canceled || !reservation.active || reservation.paid}
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
            ))
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