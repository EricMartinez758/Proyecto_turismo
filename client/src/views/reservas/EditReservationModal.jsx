import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, ListGroup, Badge } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const clientesDisponibles = [
  { idNumber: '12345678', firstName: 'Juan', lastName: 'Pérez', phone: '04121234567' },
  { idNumber: '87654321', firstName: 'Ana', lastName: 'Gómez', phone: '04121112233' },
  { idNumber: '13579246', firstName: 'Carlos', lastName: 'Rodríguez', phone: '04149876543' },
  { idNumber: '24681357', firstName: 'María', lastName: 'López', phone: '04168765432' }
];

const actividadesDisponibles = [
  { type: 'tour', location: 'Canaima' },
  { type: 'plan vacional', location: 'Isla Margarita' },
  { type: 'maraton', location: 'Caracas' }
];

const EditReservationModal = ({ show, onHide, onUpdate, reservation, activityPrices }) => {
  const defaultReservation = {
    reservationCode: '',
    reservationDate: new Date().toISOString().split('T')[0],
    activity: { type: 'tour', location: 'Canaima', price: activityPrices?.tour },
    client: clientesDisponibles[0],
    groupMembers: [],
    paymentMethod: 'USD',
    active: true,
    people: 1
  };

  const [formData, setFormData] = useState(defaultReservation);
  const [showInvoice, setShowInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (reservation) {
      setFormData({
        ...reservation,
        groupMembers: reservation.groupMembers || []
      });
    } else {
      setFormData(defaultReservation);
    }
  }, [reservation]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const results = clientesDisponibles.filter(client =>
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
      const selected = clientesDisponibles.find(c => c.idNumber === value);
      setFormData(prev => ({ ...prev, client: selected }));
    } else if (name === 'activity') {
      const selected = actividadesDisponibles.find(a =>
        `${a.type}_${a.location}` === value
      );
      setFormData(prev => ({
        ...prev,
        activity: {
          ...selected,
          price: activityPrices[selected.type]
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
    onUpdate(formData);
    setShowInvoice(true);
  };

  const calculateTotal = () => {
    const base = formData?.activity?.price?.[formData.paymentMethod] || 0;
    return base * formData.people;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="persona-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          {formData.reservationCode ? `Editar Reservación ${formData.reservationCode}` : 'Editar Reservación'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="persona-form-card">
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Fecha de Reservación</Form.Label>
            <Form.Control
              type="date"
              name="reservationDate"
              value={formData?.reservationDate || ''}
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
              required
            >
              {actividadesDisponibles.map((a, i) => (
                <option key={i} value={`${a.type}_${a.location}`}>
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
              required
            >
              {clientesDisponibles.map((c, i) => (
                <option key={i} value={c.idNumber}>
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
                    disabled={client.idNumber === formData.client.idNumber}
                  >
                    {client.firstName} {client.lastName} ({client.idNumber})
                    {client.idNumber === formData.client.idNumber && (
                      <small className="text-muted ms-2">(Cliente principal)</small>
                    )}
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
              min="1"
              value={formData.people}
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
              Actualizar Reservación
            </Button>
          </div>
        </Form>

        {showInvoice && formData.reservationCode && (
          <div className="mt-4 p-3 border rounded medical-history-card">
            <h5>Factura Actualizada</h5>
            <PDFDownloadLink
              document={<InvoicePDF reservation={formData} total={calculateTotal()} />}
              fileName={`factura_${formData.reservationCode}.pdf`}
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

export default EditReservationModal;