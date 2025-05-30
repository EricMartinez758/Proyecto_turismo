import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const ReservationTable = ({ reservations, onEdit, onStatusChange }) => {
  const calculateTotal = (reservation) => {
    return reservation.activity.price[reservation.paymentMethod] || 
           reservation.activity.price.USD;
  };

  return (
    <div className="table-responsive">
      <Table striped bordered hover className="mt-4">
        <thead className="table-dark">
          <tr>
            <th>Código</th>
            <th>Fecha</th>
            <th>Actividad</th>
            <th>Ubicación</th>
            <th>Cliente</th>
            <th>Pago</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <tr key={reservation.id} className={!reservation.active ? 'table-secondary' : ''}>
              <td>{reservation.reservationCode}</td>
              <td>{reservation.reservationDate}</td>
              <td>{reservation.activity.type}</td>
              <td>{reservation.activity.location}</td>
              <td>
                {reservation.client.firstName} {reservation.client.lastName}
                <br />
                <small className="text-muted">{reservation.client.idNumber}</small>
              </td>
              <td>
                {reservation.paymentMethod}
                <br />
                <small>{calculateTotal(reservation).toFixed(2)} {reservation.paymentMethod}</small>
              </td>
              <td>
                {reservation.activity.price.VES.toFixed(2)} Bs
              </td>
              <td>
                <Badge bg={reservation.active ? 'success' : 'secondary'}>
                  {reservation.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td>
                <div className="d-flex flex-wrap gap-1">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => onEdit(reservation)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant={reservation.active ? 'outline-warning' : 'outline-success'}
                    size="sm"
                    onClick={() => onStatusChange(reservation)}
                  >
                    {reservation.active ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </Button>
                  <PDFDownloadLink
                    document={<InvoicePDF reservation={reservation} total={calculateTotal(reservation)} />}
                    fileName={`factura_${reservation.reservationCode}.pdf`}
                  >
                    {({ loading }) => (
                      <Button variant="outline-danger" size="sm" disabled={loading}>
                        {loading ? '...' : <i className="bi bi-file-earmark-pdf"></i>}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ReservationTable;