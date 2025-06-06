import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const ReservationTable = ({ reservations, onEdit, onStatusChange, onCancel }) => {
  const calculateTotal = (reservation) => {
    const unitPrice = reservation.activity?.price?.[reservation.paymentMethod] || 0;
    const people = reservation.people || 1;
    return unitPrice * people;
  };

  return (
    <div className="table-responsive">
      <Table className="mt-4">
        <thead className="table-light">
          <tr>
            <th>Código</th>
            <th>Fecha</th>
            <th>Actividad</th>
            <th>Ubicación</th>
            <th>Cliente</th>
            <th>Personas</th>
            <th>Pago</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => {
            const rowStyle = reservation.canceled
              ? 'table-danger'
              : !reservation.active
              ? 'table-secondary'
              : '';
            const total = calculateTotal(reservation);

            return (
              <tr key={reservation.id} className={rowStyle}>
                <td>{reservation.reservationCode}</td>
                <td>{reservation.reservationDate}</td>
                <td>{reservation.activity?.type}</td>
                <td>{reservation.activity?.location}</td>
                <td>
                  {reservation.client.firstName} {reservation.client.lastName}
                  <br />
                  <small className="text-muted">{reservation.client.idNumber}</small>
                </td>
                <td>{reservation.people || 1}</td>
                <td>
                  {reservation.paymentMethod}
                  <br />
                  <small>{total.toFixed(2)} {reservation.paymentMethod}</small>
                </td>
                <td>{total.toFixed(2)} {reservation.paymentMethod}</td>
                <td>
                  <Badge bg={reservation.canceled ? 'danger' : reservation.active ? 'success' : 'secondary'}>
                    {reservation.canceled ? 'Cancelada' : reservation.active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onEdit(reservation)}
                      disabled={reservation.canceled}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant={reservation.active ? 'outline-warning' : 'outline-success'}
                      size="sm"
                      onClick={() => onStatusChange(reservation)}
                      disabled={reservation.canceled}
                    >
                      {reservation.active ? (
                        <i className="bi bi-eye-slash"></i>
                      ) : (
                        <i className="bi bi-eye"></i>
                      )}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onCancel(reservation)}
                      disabled={reservation.canceled}
                    >
                      <i className="bi bi-x-circle"></i>
                    </Button>
                    <PDFDownloadLink
                      document={<InvoicePDF reservation={reservation} total={total} />}
                      fileName={`factura_${reservation.reservationCode}.pdf`}
                    >
                      {({ loading }) => (
                        <Button variant="outline-dark" size="sm" disabled={loading}>
                          {loading ? '...' : <i className="bi bi-file-earmark-pdf"></i>}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default ReservationTable;
