import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const EditReservationModal = ({ show, onHide, onUpdate, reservation, activityPrices }) => {
  const [formData, setFormData] = useState(reservation);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setShowInvoice(true);
  };

  const calculateTotal = () => {
    return formData.activity.price[formData.paymentMethod] || formData.activity.price.USD;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Reservación {formData.reservationCode}</Modal.Title>
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

          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                name="client.firstName"
                value={formData.client.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                name="client.lastName"
                value={formData.client.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </div>

          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Cédula/Número de Identificación</Form.Label>
              <Form.Control
                type="text"
                name="client.idNumber"
                value={formData.client.idNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="client.phone"
                value={formData.client.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </div>

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
              Actualizar Reservación
            </Button>
          </div>
        </Form>

        {showInvoice && (
          <div className="mt-4 p-3 border rounded">
            <h5>Factura Actualizada</h5>
            <PDFDownloadLink
              document={<InvoicePDF reservation={formData} total={calculateTotal()} />}
              fileName={`factura_${formData.reservationCode}_actualizada.pdf`}
              className="btn btn-success"
            >
              {({ loading }) => (
                loading ? 'Preparando factura...' : 'Descargar Factura Actualizada'
              )}
            </PDFDownloadLink>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditReservationModal;