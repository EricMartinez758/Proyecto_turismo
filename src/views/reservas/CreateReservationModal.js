import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const CreateReservationModal = ({ show, onHide, onCreate, activityPrices, clients }) => {
    const [formData, setFormData] = useState({
        reservationDate: new Date().toISOString().split('T')[0],
        activity: {
            type: 'tour',
            location: '',
            price: activityPrices.tour
        },
        client: clients[0] || {},
        paymentMethod: 'USD',
        active: true

    });

    const [showInvoice, setShowInvoice] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        // Actualizar precio cuando cambia el tipo de actividad
        if (name === 'activity.type') {
            setFormData(prev => ({
                ...prev,
                activity: {
                    ...prev.activity,
                    price: activityPrices[value]
                }
            }));
        }
    };

    const handleClientChange = (clientId) => {
        const selectedClient = clients.find(c => c.id === parseInt(clientId));
        setFormData(prev => ({
            ...prev,
            client: selectedClient || {}
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
        setShowInvoice(true);
    };

    const calculateTotal = () => {
        return formData.activity.price[formData.paymentMethod] || 0;
    }

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Nueva Reservación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Reservación</Form.Label>
                        <Form.Control
                            type="date"
                            name="reservationDate"
                            value={formData.reservationDate}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Actividad</Form.Label>
                        <Form.Select
                            name="activity.type"
                            value={formData.activity.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="tour">Tour</option>
                            <option value="plan vacional">Plan Vacacional</option>
                            <option value="maraton">Maratón</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ubicación</Form.Label>
                        <Form.Control
                            type="text"
                            name="activity.location"
                            value={formData.activity.location}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <h5 className="mt-4 mb-3">Datos del Cliente</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Seleccionar Cliente</Form.Label>
                        <Form.Select
                            onChange={(e) => handleClientChange(e.target.value)}
                            value={formData.client.id || ''}
                            required
                        >
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.firstName} {client.lastName} - {client.idNumber}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Mostrar datos del cliente seleccionado */}
                    {formData.client.id && (
                        <div className="p-3 mb-3 bg-light rounded">
                            <p><strong>Nombre:</strong> {formData.client.firstName} {formData.client.lastName}</p>
                            <p><strong>Cédula:</strong> {formData.client.idNumber}</p>
                            <p><strong>Teléfono:</strong> {formData.client.phone}</p>
                        </div>
                    )}

                    {/* Sección de pago */}
                    <h5 className="mt-4 mb-3">Información de Pago</h5>
                    <div className="row">
                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>Método de Pago</Form.Label>
                            <Form.Select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                required
                            >
                                <option value="USD">Dólares (USD)</option>
                                <option value="EUR">Euros (EUR)</option>
                                <option value="COP">Pesos Colombianos (COP)</option>
                                <option value="VES">Bolívares (VES)</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>Precio ({formData.paymentMethod})</Form.Label>
                            <Form.Control
                                type="text"
                                value={calculateTotal().toFixed(2)}
                                readOnly
                            />
                        </Form.Group>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar Reservación
                        </Button>
                    </div>
                </Form>

                {showInvoice && (
                    <div className="mt-4 p-3 border rounded">
                        <h5>Factura Generada</h5>
                        <PDFDownloadLink
                            document={<InvoicePDF reservation={formData} total={calculateTotal()} />}
                            fileName={`factura_${formData.client.lastName}.pdf`}
                            className="btn btn-success"
                        >
                            {({ loading }) => (
                                loading ? 'Preparando factura...' : 'Descargar Factura'
                            )}
                        </PDFDownloadLink>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default CreateReservationModal;