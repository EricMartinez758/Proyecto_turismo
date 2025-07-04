import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, ListGroup, Badge } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const EditReservationModal = ({
    show,
    onHide,
    onUpdate,
    reservation,
    availableClients,
    availableActivities
}) => {
    // Estructuras por defecto mejoradas y más seguras
    const defaultActivityShape = { 
        id: null, 
        type: '', 
        description: '', 
        price: { USD: 0, VES: 0, EUR: 0, MXN: 0, RUB: 0 } 
    };

    const defaultClientShape = { 
        id: null, 
        idNumber: '', 
        firstName: '', 
        lastName: '', 
        phone: '' 
    };

    const defaultReservationState = {
        id: null,
        reservationCode: '',
        reservationDate: new Date().toISOString().split('T')[0],
        activity: { ...defaultActivityShape }, // Copia para evitar mutaciones directas
        client: { ...defaultClientShape },     // Copia para evitar mutaciones directas
        groupMembers: [],
        paymentMethod: 'USD',
        active: true,
        people: 1,
        canceled: false,
        paid: false
    };

    const [formData, setFormData] = useState(() => ({ ...defaultReservationState }));
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [showInvoice, setShowInvoice] = useState(false); // Mantener este para la lógica del PDF
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    // Función segura para calcular totales
    const calculateTotal = (
        activity = selectedActivity, 
        people = formData.people || 1, 
        paymentMethod = formData.paymentMethod || 'USD'
    ) => {
        // Asegurarse de que activity y activity.price no sean null/undefined
        if (!activity || !activity.price) {
            console.warn('calculateTotal: activity or activity.price is missing.', { activity, people, paymentMethod });
            return 0;
        }
        const basePrice = activity.price[paymentMethod] || 0;
        const total = basePrice * (people || 1);
        
        // Depuración:
        console.log(`calculateTotal: basePrice=${basePrice}, people=${people}, total=${total}`);
        
        return isNaN(total) ? 0 : total;
    };

    useEffect(() => {
        console.log('--- EditReservationModal useEffect (initialization) ---');
        console.log('Current reservation prop:', reservation);
        console.log('Available clients prop:', availableClients);
        console.log('Available activities prop:', availableActivities);

        if (show) {
            let initialData = { ...defaultReservationState };
            
            if (reservation) {
                // Asegurarse de encontrar el objeto completo del cliente y la actividad
                const clientObj = availableClients.find(c => c?.id === reservation.client?.id) || { ...defaultClientShape };
                const activityObj = availableActivities.find(a => a?.id === reservation.activity?.id) || { ...defaultActivityShape };
                
                console.log('Found client object for reservation:', clientObj);
                console.log('Found activity object for reservation:', activityObj);

                initialData = {
                    ...reservation,
                    groupMembers: Array.isArray(reservation.groupMembers) ? reservation.groupMembers : [],
                    client: clientObj, // Usar el objeto completo
                    activity: activityObj, // Usar el objeto completo
                    people: (clientObj?.id ? 1 : 0) + (Array.isArray(reservation.groupMembers) ? reservation.groupMembers.length : 0)
                };
                setSelectedActivity(activityObj); // Establecer la actividad seleccionada
            } else {
                // Lógica para inicializar si no hay reserva (ej. si se reusa el modal para crear)
                const initialClient = availableClients[0] || { ...defaultClientShape };
                const initialActivity = availableActivities[0] || { ...defaultActivityShape };
                
                initialData = {
                    ...defaultReservationState,
                    client: initialClient,
                    activity: initialActivity,
                    people: initialClient?.id ? 1 : 0
                };
                setSelectedActivity(initialActivity);
            }
            
            setFormData(initialData);
            // Calcular el precio inicial con los datos iniciales
            setCalculatedPrice(calculateTotal(
                initialData.activity, 
                initialData.people, 
                initialData.paymentMethod
            ));
            setShowInvoice(false);
            setSearchTerm('');
            setSearchResults([]);
            setShowSearchResults(false);
        }
        console.log('--- End of useEffect (initialization) ---');
    }, [show, reservation, availableClients, availableActivities]);

    // Efecto para recalcular el precio cuando la actividad, cantidad de personas o método de pago cambian
    useEffect(() => {
        console.log('--- EditReservationModal useEffect (recalculate price) ---');
        console.log('selectedActivity (for recalculation):', selectedActivity);
        console.log('formData.people (for recalculation):', formData.people);
        console.log('formData.paymentMethod (for recalculation):', formData.paymentMethod);
        
        const newCalculatedPrice = calculateTotal();
        setCalculatedPrice(newCalculatedPrice);
        console.log('newCalculatedPrice:', newCalculatedPrice);
        console.log('--- End of useEffect (recalculate price) ---');
    }, [selectedActivity, formData.people, formData.paymentMethod]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.length > 0) {
            const results = availableClients.filter(client =>
                client?.idNumber?.includes(term) ||
                `${client?.firstName || ''} ${client?.lastName || ''}`.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(results);
            setShowSearchResults(true);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    };

    const addGroupMember = (clientToAdd) => {
        console.log('addGroupMember: clientToAdd', clientToAdd);
        if (!clientToAdd?.id || clientToAdd.id === formData.client?.id) {
            console.log('Client to add is invalid or already main client.');
            return;
        }

        if (!formData.groupMembers.some(m => m?.id === clientToAdd.id)) {
            setFormData(prev => {
                const newGroupMembers = [...prev.groupMembers, clientToAdd];
                const newPeopleCount = (prev.client?.id ? 1 : 0) + newGroupMembers.length;
                console.log('addGroupMember: New formData people count:', newPeopleCount);
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
        console.log('removeGroupMember: idToRemove', idToRemove);
        setFormData(prev => {
            const newGroupMembers = prev.groupMembers.filter(m => m?.id !== idToRemove);
            const newPeopleCount = (prev.client?.id ? 1 : 0) + newGroupMembers.length;
            console.log('removeGroupMember: New formData people count:', newPeopleCount);
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

        setFormData(prev => {
            let newState = { ...prev };

            if (name === 'client') {
                const selectedClient = availableClients.find(c => c?.id === value) || { ...defaultClientShape };
                console.log('handleChange: selectedClient object:', selectedClient);
                const newGroupMembers = prev.groupMembers.filter(m => m?.id !== selectedClient?.id);
                const newPeopleCount = (selectedClient?.id ? 1 : 0) + newGroupMembers.length;
                newState = {
                    ...prev,
                    client: selectedClient,
                    groupMembers: newGroupMembers,
                    people: newPeopleCount
                };
            } else if (name === 'activity') {
                const activity = availableActivities.find(a => a?.id === parseInt(value, 10)) || { ...defaultActivityShape };
                console.log('handleChange: selectedActivity object:', activity);
                newState = {
                    ...prev,
                    activity: activity
                };
                setSelectedActivity(activity); // Actualizar selectedActivity
            } else if (name === 'people') {
                updatedValue = parseInt(value, 10);
                if (isNaN(updatedValue) || updatedValue < 1) updatedValue = 1; // Asegurar que sea al menos 1
                newState = { ...prev, [name]: updatedValue };
            } else if (name === 'paymentMethod') {
                newState = { ...prev, [name]: updatedValue };
            } else {
                newState = { ...prev, [name]: updatedValue };
            }
            console.log('handleChange: New formData state:', newState);
            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit: Submitting formData:', formData);

        // Validaciones finales antes de enviar
        if (!formData.client?.id) {
            console.error('handleSubmit: Cliente principal no seleccionado.');
            alert('Por favor, selecciona un cliente principal.'); // Usa un modal de alerta si tienes uno
            return;
        }
        if (!formData.activity?.id) {
            console.error('handleSubmit: Actividad no seleccionada.');
            alert('Por favor, selecciona una actividad.'); // Usa un modal de alerta
            return;
        }
        if (!formData.reservationDate) {
            console.error('handleSubmit: Fecha de reserva no seleccionada.');
            alert('Por favor, selecciona una fecha de reserva.'); // Usa un modal de alerta
            return;
        }
        if (formData.people < 1) {
            console.error('handleSubmit: Cantidad de personas inválida.');
            alert('La cantidad de personas debe ser al menos 1.'); // Usa un modal de alerta
            return;
        }

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
        console.log('handleSubmit: Data to send to onUpdate:', dataToUpdate);

        // onUpdate debe ser asíncrona y devolver true/false o un objeto de éxito
        const result = await onUpdate(dataToUpdate); 

        if (result) { // Asumiendo que onUpdate devuelve true en éxito
            console.log('handleSubmit: Reserva actualizada exitosamente. Mostrando opción de factura.');
            setShowInvoice(true); // Mostrar la opción de descarga
        } else {
            console.error('handleSubmit: Fallo al actualizar la reserva. No se muestra la opción de factura.');
            setShowInvoice(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" className="reserva-modal">
            <Modal.Header closeButton>
                <Modal.Title>
                    {formData.reservationCode ? `Editar Reservación ${formData.reservationCode}` : 'Nueva Reservación'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} className="reserva-form-card">
                    {/* Sección de Fecha */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Reservación</Form.Label>
                        <Form.Control
                            type="date"
                            name="reservationDate"
                            value={formData.reservationDate || ''}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* Sección de Actividad */}
                    <Form.Group className="mb-3">
                        <Form.Label>Actividad</Form.Label>
                        <Form.Select
                            name="activity"
                            value={formData.activity?.id || ''} // Usar encadenamiento opcional
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

                    {/* Sección de Cliente */}
                    <Form.Group className="mb-3">
                        <Form.Label>Cliente Principal</Form.Label>
                        <Form.Select
                            name="client"
                            value={formData.client?.id || ''} // Usar encadenamiento opcional
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

                    {/* Búsqueda de Miembros del Grupo */}
                    <Form.Group className="mb-3">
                        <Form.Label>Agregar Integrantes</Form.Label>
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
                                        disabled={client.id === formData.client?.id || 
                                                  formData.groupMembers.some(m => m?.id === client.id)}
                                    >
                                        {client.firstName} {client.lastName} ({client.idNumber})
                                        {client.id === formData.client?.id && (
                                            <small className="text-muted ms-2">(Cliente principal)</small>
                                        )}
                                        {formData.groupMembers.some(m => m?.id === client.id) && (
                                            <small className="text-muted ms-2">(Ya en grupo)</small>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Form.Group>

                    {/* Lista de Miembros del Grupo */}
                    {formData.groupMembers.length > 0 && (
                        <Form.Group className="mb-3">
                            <Form.Label>Integrantes del Grupo</Form.Label>
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

                    {/* Cantidad de Personas */}
                    <Form.Group className="mb-3">
                        <Form.Label>Cantidad Total de Personas</Form.Label>
                        <Form.Control
                            type="number"
                            name="people"
                            min="1"
                            value={formData.people || 1}
                            onChange={handleChange}
                            required
                        />
                        <Form.Text className="text-muted">
                            Incluye al cliente principal ({formData.client?.firstName} {formData.client?.lastName}) 
                            {formData.groupMembers.length > 0 && ` y ${formData.groupMembers.length} integrante(s)`}
                        </Form.Text>
                    </Form.Group>

                    {/* Sección de Pago */}
                    <h5 className="mt-4 mb-3">Información de Pago</h5>
                    <div className="row">
                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>Método de Pago</Form.Label>
                            <Form.Select
                                name="paymentMethod"
                                value={formData.paymentMethod || 'USD'}
                                onChange={handleChange}
                                required
                            >
                                {selectedActivity?.price && Object.keys(selectedActivity.price).map(currency => (
                                    <option key={currency} value={currency}>{currency}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>Total ({formData.paymentMethod})</Form.Label>
                            <Form.Control
                                type="text"
                                value={(calculatedPrice || 0).toFixed(2)}
                                readOnly
                            />
                        </Form.Group>
                    </div>

                    {/* Botones */}
                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            {formData.id ? 'Actualizar' : 'Crear'} Reservación
                        </Button>
                    </div>
                </Form>

                {/* Sección de Factura */}
                {showInvoice && formData.reservationCode && formData.client?.id && formData.activity?.id && (
                    <div className="mt-4 p-3 border rounded">
                        <h5>Factura Actualizada</h5>
                        <PDFDownloadLink
                            document={<InvoicePDF 
                                reservation={formData} 
                                total={calculatedPrice}
                            />}
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
