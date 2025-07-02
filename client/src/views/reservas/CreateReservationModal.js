import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, ListGroup, Badge } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const actividadesDisponibles = [
  { type: 'tour', location: 'Canaima' },
  { type: 'plan vacional', location: 'Isla Margarita' },
  { type: 'maraton', location: 'Caracas' }
];

const CreateReservationModal = ({ show, onHide, onCreate, activityPrices, availableClients }) => {
  const [formData, setFormData] = useState({
    reservationDate: new Date().toISOString().split('T')[0],
    activity: {
      ...actividadesDisponibles[0],
      price: activityPrices[actividadesDisponibles[0].type]
    },
    client: availableClients[0],
    groupMembers: [],
    paymentMethod: 'USD',
    active: true,
    people: 1
  });

  const [showInvoice, setShowInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const results = availableClients.filter(client =>
        client.idNumber.includes(term) ||
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const addGroupMember = (client) => {
    if (!formData.groupMembers.some(m => m.idNumber === client.idNumber)) {
      setFormData(prev => ({
        ...prev,
        groupMembers: [...prev.groupMembers, client],
        people: prev.groupMembers.length + 2
      }));
    }
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const removeGroupMember = (idNumber) => {
    setFormData(prev => ({
      ...prev,
      groupMembers: prev.groupMembers.filter(m => m.idNumber !== idNumber),
      people: prev.groupMembers.length
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'client') {
      const selectedClient = availableClients.find(c => c.idNumber === value);
      setFormData(prev => ({
        ...prev,
        client: selectedClient
      }));
    } else if (name === 'activity') {
      const selectedActivity = actividadesDisponibles.find(a =>
        `${a.type}_${a.location}` === value
      );
      setFormData(prev => ({
        ...prev,
        activity: {
          ...selectedActivity,
          price: activityPrices[selectedActivity.type]
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'people' ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    setShowInvoice(true);
  };

  const calculateTotal = () => {
    const priceObj = formData.activity?.price || {};
    const base = priceObj[formData.paymentMethod] || 0;
    return base * formData.people;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="persona-modal">
      <Modal.Header closeButton>
        <Modal.Title>Nueva Reservación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="persona-form-card">
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Fecha de Reservación</Form.Label>
            <Form.Control
              type="date"
              name="reservationDate"
              value={formData.reservationDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Seleccionar Actividad</Form.Label>
            <Form.Select
              name="activity"
              value={`${formData.activity.type}_${formData.activity.location}`}
              onChange={handleChange}
            >
              {actividadesDisponibles.map((a, index) => (
                <option key={index} value={`${a.type}_${a.location}`}>
                  {a.type.toUpperCase()} - {a.location}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Cliente Principal</Form.Label>
            <Form.Select
              name="client"
              value={formData.client.idNumber}
              onChange={handleChange}
            >
              {availableClients.map((c, index) => (
                <option key={index} value={c.idNumber}>
                  {c.firstName} {c.lastName} ({c.idNumber})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Agregar Integrantes al Grupo</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar por cédula o nombre"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>
            
            {showSearchResults && (
              <ListGroup className="mt-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {searchResults.map((client, index) => (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={() => addGroupMember(client)}
                  >
                    {client.firstName} {client.lastName} ({client.idNumber})
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form.Group>

          {formData.groupMembers.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label className="form-label">Integrantes del Grupo</Form.Label>
              <div className="border p-2 rounded" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {formData.groupMembers.map((member, index) => (
                  <Badge key={index} bg="info" className="badge-guia me-2 mb-2 d-inline-flex align-items-center">
                    {member.firstName} {member.lastName} ({member.idNumber})
                    <Button
                      variant="link"
                      size="sm"
                      className="text-white p-0 ms-2"
                      onClick={() => removeGroupMember(member.idNumber)}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </Badge>
                ))}
              </div>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Cantidad Total de Personas</Form.Label>
            <Form.Control
              type="number"
              name="people"
              value={formData.people}
              min="1"
              onChange={handleChange}
              required
              readOnly
            />
            <Form.Text className="text-muted">
              Incluye al cliente principal {formData.groupMembers.length > 0 && `y ${formData.groupMembers.length} integrantes`}
            </Form.Text>
          </Form.Group>

          <h5 className="mt-4 mb-3">Información de Pago</h5>

          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="form-label">Método de Pago</Form.Label>
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
              <Form.Label className="form-label">Total ({formData.paymentMethod})</Form.Label>
              <Form.Control
                type="text"
                value={calculateTotal().toFixed(2)}
                readOnly
              />
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary-persona" onClick={onHide} className="me-2">
              Cancelar
            </Button>
            <Button variant="primary-persona" type="submit">
              Guardar Reservación
            </Button>
          </div>
        </Form>

        {showInvoice && (
          <div className="mt-4 p-3 border rounded medical-history-card">
            <h5>Factura Generada</h5>
            <PDFDownloadLink
              document={<InvoicePDF reservation={formData} total={calculateTotal()} />}
              fileName={`factura_${formData.client.lastName}.pdf`}
              className="btn btn-success"
            >
              {({ loading }) => loading ? 'Preparando factura...' : 'Descargar Factura'}
            </PDFDownloadLink>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CreateReservationModal;