import React, { useState } from 'react';
import { Modal, Button, Badge, Form, Alert } from 'react-bootstrap';

const PaymentModal = ({ show, onHide, reservation, onPaymentSubmit }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(reservation?.paymentMethod || 'USD');
  const [paymentDetails, setPaymentDetails] = useState({
    reference: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });

  if (!reservation) return null;

  const {
    reservationCode,
    reservationDate,
    activity,
    client,
    people,
    active,
    canceled,
    paid
  } = reservation;

  // Monedas disponibles
  const availableCurrencies = ['USD', 'EUR', 'BS', 'MXN', 'RUB'];

  // Calcular total en la moneda seleccionada
  const calculateTotal = () => {
    const unitPrice = activity.price[selectedCurrency] || activity.price['USD'];
    return (unitPrice * people).toFixed(2);
  };

  // Calcular equivalente en dólares
  const calculateDollarEquivalent = () => {
    const unitPriceUSD = activity.price['USD'];
    return (unitPriceUSD * people).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentData = {
      reservationId: reservation.id,
      currency: selectedCurrency,
      amount: calculateTotal(),
      ...paymentDetails
    };
    onPaymentSubmit(paymentData);
  };

  if (paid) {
    return (
      <Modal show={show} onHide={onHide} size="lg" className="payment-modal">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <i className="bi bi-check-circle-fill me-2"></i>
            Reservación Pagada - {reservationCode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success" className="text-center">
            <i className="bi bi-check-circle-fill fs-1"></i>
            <h4 className="mt-3">Esta reservación ya ha sido pagada</h4>
            <p className="mb-0">No se requieren acciones adicionales</p>
          </Alert>
          <div className="text-center mt-4">
            <Button variant="success" onClick={onHide}>
              <i className="bi bi-check-circle me-1"></i>
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" className="payment-modal">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="bi bi-credit-card me-2"></i>
          Procesar Pago - Reservación {reservationCode}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <div className="payment-form-card p-4">
          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="text-primary mb-3">
                <i className="bi bi-calendar-event me-2"></i>
                Información de la Reservación
              </h5>
              
              <div className="mb-3">
                <label className="form-label">Código:</label>
                <p className="form-control-static">{reservationCode}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Fecha:</label>
                <p className="form-control-static">{reservationDate}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Actividad:</label>
                <p className="form-control-static">
                  <Badge bg="secondary" className="text-uppercase">
                    {activity.type}
                  </Badge>
                </p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Personas:</label>
                <p className="form-control-static">{people}</p>
              </div>
            </div>
            
            <div className="col-md-6">
              <h5 className="text-primary mb-3">
                <i className="bi bi-person-lines-fill me-2"></i>
                Información del Cliente
              </h5>
              
              <div className="mb-3">
                <label className="form-label">Cliente:</label>
                <p className="form-control-static">
                  {client.firstName} {client.lastName}
                </p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Identificación:</label>
                <p className="form-control-static">{client.idNumber}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Estado:</label>
                <p className="form-control-static">
                  {canceled ? (
                    <Badge bg="danger">Cancelada</Badge>
                  ) : active ? (
                    <Badge bg="success">Activa</Badge>
                  ) : (
                    <Badge bg="warning" className="text-dark">Inactiva</Badge>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-12">
              <h5 className="text-primary mb-3">
                <i className="bi bi-cash-stack me-2"></i>
                Detalles del Pago
              </h5>
              
              <Form onSubmit={handleSubmit}>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <Form.Group controlId="paymentCurrency" className="mb-3">
                      <Form.Label>Moneda de Pago:</Form.Label>
                      <Form.Select 
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        required
                        disabled={paid}
                      >
                        {availableCurrencies.map(currency => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group controlId="paymentReference" className="mb-3">
                      <Form.Label>Descripción:</Form.Label>
                      <Form.Control
                        type="text"
                        value={paymentDetails.reference}
                        onChange={(e) => setPaymentDetails({...paymentDetails, reference: e.target.value})}
                        required
                        disabled={paid}
                      />
                    </Form.Group>
                  </div>
                  
                  <div className="col-md-6">
                    <Form.Group controlId="paymentDate" className="mb-3">
                      <Form.Label>Fecha del Pago:</Form.Label>
                      <Form.Control
                        type="date"
                        value={paymentDetails.paymentDate}
                        onChange={(e) => setPaymentDetails({...paymentDetails, paymentDate: e.target.value})}
                        required
                        disabled={paid}
                      />
                    </Form.Group>
                    
                    <div className="payment-summary p-3 bg-light rounded">
                      <h6>Resumen de Pago</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td>Precio por persona:</td>
                            <td className="text-end">
                              {activity.price[selectedCurrency] || activity.price['USD']} {selectedCurrency}
                              {selectedCurrency !== 'USD' && (
                                <div className="text-muted small">
                                  ≈ {activity.price['USD']} USD
                                </div>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Personas:</td>
                            <td className="text-end">{people}</td>
                          </tr>
                          <tr className="table-active">
                            <th>Total a Pagar:</th>
                            <th className="text-end">
                              {calculateTotal()} {selectedCurrency}
                              {selectedCurrency !== 'USD' && (
                                <div className="text-muted small">
                                  ≈ {calculateDollarEquivalent()} USD
                                </div>
                              )}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" onClick={onHide}>
                    <i className="bi bi-x-circle me-1"></i>
                    Cancelar
                  </Button>
                  <Button variant="success" type="submit" disabled={paid}>
                    <i className="bi bi-check-circle me-1"></i>
                    Confirmar Pago
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;