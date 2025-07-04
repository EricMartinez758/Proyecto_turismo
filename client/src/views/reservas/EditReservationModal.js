import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, ListGroup, Badge } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF'; // Asegúrate de que esta ruta sea correcta

const EditReservationModal = ({
    show,
    onHide,
    onUpdate,
    reservation,
    availableClients, // <-- Recibido de App.js
    availableActivities // <-- Recibido de App.js
}) => {
    // Estructura esperada de actividad y cliente para valores por defecto
    const defaultActivityShape = { id: '', type: '', description: '', price: { USD: 0, VES: 0, EUR: 0, MXN: 0, RUB: 0 } };
    const defaultClientShape = { id: '', idNumber: '', firstName: '', lastName: '', phone: '' };

    const defaultReservationState = {
        id: null,
        reservationCode: '',
        reservationDate: new Date().toISOString().split('T')[0],
        activity: defaultActivityShape, // Usar la forma por defecto
        client: defaultClientShape,     // Usar la forma por defecto
        groupMembers: [],
        paymentMethod: 'USD',
        active: true,
        people: 1,
        canceled: false,
        paid: false
    };

    const [formData, setFormData] = useState(defaultReservationState);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [showInvoice, setShowInvoice] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    // Función auxiliar para calcular el total (para usar en useEffect y render)
    const calculateTotal = (activity = selectedActivity, people = formData.people, paymentMethod = formData.paymentMethod) => {
        const base = activity?.price?.[paymentMethod] || 0;
        return base * people;
    };

    useEffect(() => {
        console.log('--- EditReservationModal useEffect (show, reservation, availableClients, availableActivities) ---');
        console.log('show:', show);
        console.log('reservation prop:', reservation);
        console.log('availableClients prop:', availableClients);
        console.log('availableActivities prop:', availableActivities);

        if (show) {
            if (reservation) {
                // Buscar el objeto completo de cliente y actividad usando sus IDs
                const clientObj = availableClients.find(c => c.id === reservation.client?.id) || defaultClientShape;
                const activityObj = availableActivities.find(a => a.id === reservation.activity?.id) || defaultActivityShape;

                console.log('Found clientObj:', clientObj);
                console.log('Found activityObj:', activityObj);

                setFormData({
                    ...reservation,
                    groupMembers: reservation.groupMembers || [],
                    client: clientObj, // Usar el objeto completo del cliente
                    activity: activityObj, // Usar el objeto completo de la actividad
                    // Calcular 'people' basado en el cliente principal y miembros del grupo
                    people: (clientObj?.id ? 1 : 0) + (reservation.groupMembers ? reservation.groupMembers.length : 0)
                });
                setSelectedActivity(activityObj);
                // También inicializar calculatedPrice al abrir el modal
                setCalculatedPrice(calculateTotal(activityObj, (clientObj?.id ? 1 : 0) + (reservation.groupMembers ? reservation.groupMembers.length : 0), reservation.paymentMethod));
            } else {
                // Lógica para una nueva reserva (si `reservation` es null/undefined)
                const initialClient = availableClients.length > 0 ? availableClients[0] : defaultClientShape;
                const initialActivity = availableActivities.length > 0 ? availableActivities[0] : defaultActivityShape;
                const initialPeople = (initialClient?.id ? 1 : 0);

                setFormData({
                    ...defaultReservationState,
                    client: initialClient,
                    activity: initialActivity,
                    people: initialPeople
                });
                setSelectedActivity(initialActivity);
                setCalculatedPrice(calculateTotal(initialActivity, initialPeople, defaultReservationState.paymentMethod));
            }
            setShowInvoice(false); // Resetear estado de factura al abrir
            setSearchTerm(''); // Limpiar búsqueda
            setSearchResults([]);
            setShowSearchResults(false);
        }
        console.log('--- End of useEffect (show, reservation, availableClients, availableActivities) ---');
    }, [show, reservation, availableClients, availableActivities]);

    // Efecto para recalcular el precio cuando la actividad, cantidad de personas o método de pago cambian
    useEffect(() => {
        console.log('--- EditReservationModal useEffect (selectedActivity, formData.people, formData.paymentMethod) ---');
        console.log('selectedActivity for price calculation:', selectedActivity);
        console.log('formData.people for price calculation:', formData.people);
        console.log('formData.paymentMethod for price calculation:', formData.paymentMethod);

        if (selectedActivity && formData.people > 0) {
            const priceForCurrency = selectedActivity.price?.[formData.paymentMethod] || 0;
            setCalculatedPrice(priceForCurrency * formData.people);
        } else {
            setCalculatedPrice(0);
        }
        console.log('--- End of useEffect (selectedActivity, formData.people, formData.paymentMethod) ---');
    }, [selectedActivity, formData.people, formData.paymentMethod]);


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

    const addGroupMember = (clientToAdd) => {
        console.log('Adding group member:', clientToAdd);
        if (clientToAdd.id === formData.client.id) {
            console.log('Client is already main client, skipping.');
            return;
        }

        if (!formData.groupMembers.some(m => m.id === clientToAdd.id)) {
            setFormData(prev => {
                const newGroupMembers = [...prev.groupMembers, clientToAdd];
                const newPeopleCount = (prev.client?.id ? 1 : 0) + newGroupMembers.length;
                console.log('New group members:', newGroupMembers, 'New people count:', newPeopleCount);
                return {
                    ...prev,
                    groupMembers: newGroupMembers,
                    people: newPeopleCount
                };
            });
        }
        setSearchTerm('');
        setShowSearchResults(false);
    };

    const removeGroupMember = (idToRemove) => {
        console.log('Removing group member with ID:', idToRemove);
        setFormData(prev => {
            const newGroupMembers = prev.groupMembers.filter(m => m.id !== idToRemove);
            const newPeopleCount = (prev.client?.id ? 1 : 0) + newGroupMembers.length;
            console.log('Updated group members:', newGroupMembers, 'Updated people count:', newPeopleCount);
            return {
                ...prev,
                groupMembers: newGroupMembers,
                people: newPeopleCount
            };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
        console.log(`handleChange: name=${name}, value=${value}`);

        if (name === 'client') {
            const selectedClient = availableClients.find(c => c.id === value);
            console.log('Selected client object:', selectedClient);
            setFormData(prev => {
                const newGroupMembers = prev.groupMembers.filter(m => m.id !== selectedClient?.id);
                const newPeopleCount = (selectedClient?.id ? 1 : 0) + newGroupMembers.length;
                console.log('New client selected. New group members:', newGroupMembers, 'New people count:', newPeopleCount);
                return {
                    ...prev,
                    client: selectedClient || defaultClientShape,
                    groupMembers: newGroupMembers,
                    people: newPeopleCount
                };
            });
        } else if (name === 'activity') {
            const selectedActivityId = parseInt(value, 10);
            const activity = availableActivities.find(a => a.id === selectedActivityId);
            console.log('Selected activity object:', activity);
            setFormData(prev => ({
                ...prev,
                activity: activity || defaultActivityShape
            }));
            setSelectedActivity(activity || null); // <-- ACTUALIZAR selectedActivity AQUÍ
        } else if (name === 'people') {
            updatedValue = parseInt(value, value === '' ? 0 : 10); // Manejar input vacío para number
        }

        setFormData(prev => ({
            ...prev,
            [name]: updatedValue
        }));
        console.log('Updated formData after handleChange:', formData); // Nota: formData aquí podría no ser la última versión debido al cierre
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData);
        const dataToUpdate = {
            id: formData.id,
            cliente_id: formData.client.id,
            actividad_id: formData.activity.id,
            fecha: formData.reservationDate,
            estado: formData.active ? 'activa' : 'inactiva',
            cantidad_personas: formData.people,
            metodo_pago: formData.paymentMethod,
            pagado: formData.paid
        };
        onUpdate(dataToUpdate);
        setShowInvoice(true);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" className="reserva-modal">
            <Modal.Header closeButton>
                <Modal.Title>
                    {formData.reservationCode ? `Editar Reservación ${formData.reservationCode}` : 'Editar Reservación'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} className="reserva-form-card">
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
                            value={formData.activity.id || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona una actividad</option>
                            {availableActivities.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.type} - {a.description}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="form-label">Cliente Principal</Form.Label>
                        <Form.Select
                            name="client"
                            value={formData.client.id || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona un cliente</option>
                            {availableClients.map((c) => (
                                <option key={c.id} value={c.id}>
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
                                {searchResults.map((client) => (
                                    <ListGroup.Item
                                        key={client.id}
                                        action
                                        onClick={() => addGroupMember(client)}
                                        disabled={client.id === formData.client.id || formData.groupMembers.some(m => m.id === client.id)}
                                    >
                                        {client.firstName} {client.lastName} ({client.idNumber})
                                        {client.id === formData.client.id && (
                                            <small className="text-muted ms-2">(Cliente principal)</small>
                                        )}
                                        {formData.groupMembers.some(m => m.id === client.id) && (
                                            <small className="text-muted ms-2">(Ya en grupo)</small>
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
                                {formData.groupMembers.map((member) => (
                                    <Badge key={member.id} bg="info" className="badge-guia me-2 mb-2 d-inline-flex align-items-center">
                                        {member.firstName} {member.lastName} ({member.idNumber})
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="text-white p-0 ms-2"
                                            onClick={() => removeGroupMember(member.id)}
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
                        />
                        <Form.Text className="text-muted">
                            Incluye al cliente principal ({formData.client.firstName} {formData.client.lastName}) {formData.groupMembers.length > 0 && `y ${formData.groupMembers.length} integrante(s) del grupo.`}
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
                                {selectedActivity?.price && Object.keys(selectedActivity.price).map(currency => (
                                    <option key={currency} value={currency}>{currency}</option>
                                ))}
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
                        <Button variant="secondary-reserva" onClick={onHide} className="me-2">
                            Cancelar
                        </Button>
                        <Button variant="primary-reserva" type="submit">
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
