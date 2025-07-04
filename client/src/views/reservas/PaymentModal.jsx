import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, Form, Alert } from 'react-bootstrap';

const PaymentModal = ({ show, onHide, reservation, onPaymentSubmit }) => {
    // --- TODOS LOS HOOKS DEBEN IR AL PRINCIPIO Y SER LLAMADOS INCONDICIONALMENTE ---
    const [selectedCurrency, setSelectedCurrency] = useState('USD'); // Valor inicial por defecto
    const [paymentDetails, setPaymentDetails] = useState({
        reference: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0]
    });

    // useEffect para inicializar el estado basado en la prop 'reservation'
    useEffect(() => {
        if (show && reservation) {
            setSelectedCurrency(reservation.paymentMethod || 'USD');
            setPaymentDetails({
                reference: '', // Limpiar referencia al abrir
                amount: '',    // Limpiar monto al abrir
                paymentDate: new Date().toISOString().split('T')[0] // Fecha actual al abrir
            });
            console.log("PaymentModal: Modal opened for reservation:", reservation.id, "Paid status (from prop):", reservation.paid);
        }
    }, [show, reservation]); // Depende de 'show' y 'reservation'

    // --- AHORA PUEDES TENER LOGICA CONDICIONAL O RETURNS TEMPRANOS ---
    // Si la reserva es nula o indefinida, no renderizar nada para evitar errores
    if (!reservation) {
        console.warn("PaymentModal: reservation prop is null or undefined. Not rendering.");
        return null;
    }

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

    // Monedas disponibles (usamos las claves de activity.price si existen, si no, un conjunto por defecto)
    const availableCurrencies = activity?.price ? Object.keys(activity.price) : ['USD', 'VES', 'EUR', 'MXN', 'RUB', 'COP'];

    // Calcular total en la moneda seleccionada de forma segura
    const calculateTotal = () => {
        if (!activity?.price) {
            console.warn("calculateTotal: activity.price is undefined or null. Returning 0.");
            return 0;
        }
        const unitPrice = activity.price[selectedCurrency] || activity.price['USD'] || 0;
        const total = unitPrice * (people || 0);
        return isNaN(total) ? 0 : total;
    };

    // Calcular equivalente en dólares de forma segura
    const calculateDollarEquivalent = () => {
        if (!activity?.price) {
            console.warn("calculateDollarEquivalent: activity.price is undefined or null. Returning 0.");
            return 0;
        }
        const unitPriceUSD = activity.price['USD'] || 0;
        const totalUSD = unitPriceUSD * (people || 0);
        return isNaN(totalUSD) ? 0 : totalUSD;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('PaymentModal: handleSubmit triggered!');
        console.log('PaymentModal: Current reservation.paid status (inside handleSubmit):', paid);

        if (paid) {
            console.log('PaymentModal: Reservation is already paid. Not processing payment.');
            onHide();
            return;
        }

        const paymentData = {
            reservationId: reservation.id,
            currency: selectedCurrency,
            amount: parseFloat(calculateTotal()),
            reference: paymentDetails.reference,
            paymentDate: paymentDetails.paymentDate
        };
        console.log('PaymentModal: Payment data to submit:', paymentData);
        onPaymentSubmit(paymentData);
        onHide();
    };

    // Si la reserva ya está pagada, mostrar el mensaje de alerta
    if (paid) {
        console.log('PaymentModal: Reservation is marked as paid. Showing paid message and disabling form.');
        return (
            <Modal show={show} onHide={onHide} size="lg" className="payment-modal">
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Reservación Pagada - {reservationCode || 'N/A'}
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

    console.log('PaymentModal: Rendering main modal. "Confirmar Pago" button disabled status (from prop):', paid);

    return (
        <Modal show={show} onHide={onHide} size="lg" className="payment-modal">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <i className="bi bi-credit-card me-2"></i>
                    Procesar Pago - Reservación {reservationCode || 'N/A'}
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
                                <p className="form-control-static">{reservationCode || 'N/A'}</p>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Fecha:</label>
                                <p className="form-control-static">{reservationDate || 'N/A'}</p>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Actividad:</label>
                                <p className="form-control-static">
                                    <Badge bg="secondary" className="text-uppercase">
                                        {activity?.type || 'N/A'}
                                    </Badge>
                                </p>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Personas:</label>
                                <p className="form-control-static">{people || 0}</p>
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
                                    {client?.firstName || 'N/A'} {client?.lastName || 'N/A'}
                                </p>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Identificación:</label>
                                <p className="form-control-static">{client?.idNumber || 'N/A'}</p>
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
                                                            {(activity?.price?.[selectedCurrency] || activity?.price?.['USD'] || 0).toFixed(2)} {selectedCurrency}
                                                            {selectedCurrency !== 'USD' && (
                                                                <div className="text-muted small">
                                                                    ≈ {(activity?.price?.['USD'] || 0).toFixed(2)} USD
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Personas:</td>
                                                        <td className="text-end">{people || 0}</td>
                                                    </tr>
                                                    <tr className="table-active">
                                                        <th>Total a Pagar:</th>
                                                        <th className="text-end">
                                                            {calculateTotal().toFixed(2)} {selectedCurrency}
                                                            {selectedCurrency !== 'USD' && (
                                                                <div className="text-muted small">
                                                                    ≈ {calculateDollarEquivalent().toFixed(2)} USD
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