import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const ReservationTable = ({ 
  reservations, 
  onEdit = () => console.log('Editar reservación'), 
  onStatusChange = () => console.log('Cambiar estado de reservación'),
  onToggleActive = () => console.log('Activar/desactivar reservación') 
}) => {
  if (!reservations) return null;

  const calculateTotal = (reservation) => {
    return reservation.activity.price[reservation.paymentMethod] || 
           reservation.activity.price.USD;
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
            <th>Pago</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <tr key={reservation.id} className={reservation.estado === 'cancelado' ? 'table-secondary' : ''}>
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
                <Badge bg={reservation.estado === 'reservado' ? 'success' : 'danger'}>
                  {reservation.estado}
                </Badge>
              </td>
              <td>
                <div className="d-flex gap-2">
                  {/* Botón para ver/editar */}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onEdit(reservation)}
                    title="Ver/Editar reservación"
                  >
                    <i className="bi bi-eye"></i>
                  </Button>

                  {/* Botón para cambiar estado */}
                  <Button
                    variant={reservation.estado === 'reservado' ? 'outline-danger' : 'outline-success'}
                    size="sm"
                    onClick={() => onStatusChange(reservation)}
                    title={reservation.estado === 'reservado' ? 'Cancelar reservación' : 'Reactivar reservación'}
                  >
                    {reservation.estado === 'reservado' ? (
                      <i className="bi bi-x-circle"></i>
                    ) : (
                      <i className="bi bi-check-circle"></i>
                    )}
                  </Button>

                  {/* Botón para activar/desactivar */}
                  <Button
                    variant={reservation.active ? 'outline-warning' : 'outline-secondary'}
                    size="sm"
                    onClick={() => onToggleActive(reservation)}
                    title={reservation.active ? 'Desactivar reservación' : 'Activar reservación'}
                  >
                    {reservation.active ? (
                      <i className="bi bi-toggle-on"></i>
                    ) : (
                      <i className="bi bi-toggle-off"></i>
                    )}
                  </Button>

                  {/* Botón para descargar PDF */}
                  <PDFDownloadLink
                    document={<InvoicePDF reservation={reservation} total={calculateTotal(reservation)} />}
                    fileName={`factura_${reservation.reservationCode}.pdf`}
                  >
                    {({ loading }) => (
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        disabled={loading}
                        title="Descargar factura PDF"
                      >
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