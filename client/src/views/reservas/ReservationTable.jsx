import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
const ReservationTable = ({ reservations, onEdit, onStatusChange, onCancel, onView }) => {
  return (
    <div className="reservation-list">
      <Table hover className="persona-table">
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
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      variant="info"
                      size="sm"
                      className="btn-info-persona2"
                      onClick={() => onView(reservation)}
                    >
                      <i className="bi bi-eye-fill me-1"></i>
                      Ver
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      className="btn-info-persona"
                      onClick={() => onEdit(reservation)}
                      disabled={reservation.canceled}
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Editar
                    </Button>
                    <Button
                      variant={reservation.active ? 'warning' : 'success'}
                      size="sm"
                      className={reservation.active ? 'btn-warning-persona' : 'btn-success-persona'}
                      onClick={() => onStatusChange(reservation)}
                      disabled={reservation.canceled}
                    >
                      <i className={`bi ${reservation.active ? 'bi-pause-fill' : 'bi-play-fill'} me-1`}></i>
                      {reservation.active ? 'Desactivar' : 'Activar'}
                    </Button>
                    {!reservation.canceled && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="btn-danger-persona"
                        onClick={() => onCancel(reservation)}
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
                <div className="alert alert-info-persona mb-0">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  No hay reservaciones registradas
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>


      <style jsx>{`
        .reservation-list {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          overflow: hidden;
        }
        .persona-table th {
          background-color: #0e41156a;
          color: white;
        }
        .persona-table td {
          vertical-align: middle;
        }
         .btn-info-persona2 {
          background-color:rgb(45, 147, 62);
          border-color:rgb(11, 71, 37);
        }
        .btn-info-persona2:hover {
          background-color:rgb(67, 179, 97);
          border-color:rgb(17, 91, 23);
        } 
        .btn-info-persona {
          background-color:rgb(80, 191, 208);
          border-color: #17a2b8;
        }
        .btn-info-persona:hover {
          background-color: #138496;
          border-color: #117a8b;
        }
        .btn-warning-persona {
          background-color: #ffc107;
          border-color: #ffc107;
          color: #212529;
        }
        .btn-warning-persona:hover {
          background-color: #e0a800;
          border-color: #d39e00;
          color: #212529;
        }
        .btn-success-persona {
          background-color: #28a745;
          border-color: #28a745;
        }
        .btn-success-persona:hover {
          background-color: #218838;
          border-color: #1e7e34;
        }
        @media (max-width: 768px) {
          .persona-table td:nth-child(4),
          .persona-table th:nth-child(4),
          .persona-table td:nth-child(5),
          .persona-table th:nth-child(5) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ReservationTable;