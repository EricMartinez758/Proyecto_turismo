// src/components/CreateReservationModal.js

import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CButton, CFormSelect, CFormInput, CFormCheck, CSpinner, CAlert
} from '@coreui/react';

const CreateReservationModal = ({
    show, onHide, onCreate, availableClients, availableActivities
}) => {
    const [newReservationData, setNewReservationData] = useState({
        cliente_id: '',
        actividad_id: '',
        fecha: '',
        cantidad_personas: 1,
        metodo_pago: 'USD',
        pagado: false
    });
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (show) {
            const initialClientId = availableClients.length > 0 ? availableClients[0].id : '';
            const initialActivityId = availableActivities.length > 0 ? availableActivities[0].id : '';
            const initialActivity = availableActivities.find(act => String(act.id) === String(initialActivityId)); 

            setNewReservationData({
                cliente_id: initialClientId,
                actividad_id: initialActivityId,
                fecha: new Date().toISOString().slice(0, 10),
                cantidad_personas: 1,
                metodo_pago: 'USD',
                pagado: false
            });
            setCalculatedPrice(0);
            setErrorMessage('');
            setSelectedActivity(initialActivity || null);
        }
    }, [show, availableClients, availableActivities]);

    useEffect(() => {
        if (selectedActivity && newReservationData.cantidad_personas > 0) {
            const priceForCurrency = selectedActivity.price?.[newReservationData.metodo_pago] || 0;
            setCalculatedPrice(priceForCurrency * newReservationData.cantidad_personas);
        } else {
            setCalculatedPrice(0);
        }
    }, [selectedActivity, newReservationData.cantidad_personas, newReservationData.metodo_pago]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = value;

        if (type === 'number') {
            newValue = parseInt(value, 10);
            if (isNaN(newValue)) newValue = '';
        } else if (type === 'checkbox') {
            newValue = checked;
        }

        setNewReservationData(prevData => ({
            ...prevData,
            [name]: newValue
        }));

        if (name === 'actividad_id') {
            const activity = availableActivities.find(act => String(act.id) === String(newValue));
            setSelectedActivity(activity || null);
            setNewReservationData(prevData => ({
                ...prevData,
                metodo_pago: 'USD'
            }));
        }
    };

    const handleSubmit = () => {
        if (!newReservationData.cliente_id || newReservationData.cliente_id === '') {
            setErrorMessage('Por favor, selecciona un cliente.');
            return;
        }
        if (!newReservationData.actividad_id || newReservationData.actividad_id === '') {
            setErrorMessage('Por favor, selecciona una actividad.');
            return;
        }
        if (!newReservationData.fecha) {
            setErrorMessage('Por favor, selecciona una fecha.');
            return;
        }
        if (newReservationData.cantidad_personas <= 0 || isNaN(newReservationData.cantidad_personas)) {
            setErrorMessage('La cantidad de personas debe ser un número mayor a 0.');
            return;
        }
        if (!selectedActivity) {
             setErrorMessage('No se pudo determinar la actividad seleccionada. Por favor, selecciona una actividad válida.');
             return;
        }

        // Preparar los datos para enviar al procedimiento almacenado
        const dataToSend = {
            ...newReservationData,
            total_pago: calculatedPrice // Envía el precio calculado para el procedimiento
        };

        if (onCreate) {
            onCreate(dataToSend); // Envía todos los datos, incluyendo el total_pago
            setErrorMessage('');
        }
    };

    return (
        <CModal visible={show} onClose={onHide}>
            <CModalHeader>
                <CModalTitle>Crear Nueva Reserva</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}

                <div className="mb-3">
                    <label htmlFor="cliente_id" className="form-label">Cliente:</label>
                    <CFormSelect
                        id="cliente_id"
                        name="cliente_id"
                        value={newReservationData.cliente_id}
                        onChange={handleChange}
                    >
                        <option value="">Selecciona un cliente</option>
                        {availableClients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.firstName} {client.lastName} ({client.idNumber})
                            </option>
                        ))}
                    </CFormSelect>
                </div>

                <div className="mb-3">
                    <label htmlFor="actividad_id" className="form-label">Actividad:</label>
                    <CFormSelect
                        id="actividad_id"
                        name="actividad_id"
                        value={newReservationData.actividad_id}
                        onChange={handleChange}
                    >
                        <option value="">Selecciona una actividad</option>
                        {availableActivities.map(activity => (
                            <option key={activity.id} value={activity.id}>
                                {activity.type} - {activity.description}
                            </option>
                        ))}
                    </CFormSelect>
                </div>

                <div className="mb-3">
                    <label htmlFor="fecha" className="form-label">Fecha de Actividad:</label>
                    <CFormInput
                        type="date"
                        id="fecha"
                        name="fecha"
                        value={newReservationData.fecha}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="cantidad_personas" className="form-label">Cantidad de Personas:</label>
                    <CFormInput
                        type="number"
                        id="cantidad_personas"
                        name="cantidad_personas"
                        value={newReservationData.cantidad_personas}
                        onChange={handleChange}
                        min="1"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="metodo_pago" className="form-label">Método de Pago:</label>
                    <CFormSelect
                        id="metodo_pago"
                        name="metodo_pago"
                        value={newReservationData.metodo_pago}
                        onChange={handleChange}
                        disabled={!selectedActivity || !selectedActivity.price || Object.keys(selectedActivity.price).length === 0}
                    >
                        {selectedActivity?.price && Object.keys(selectedActivity.price).map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                        {(!selectedActivity || !selectedActivity.price || Object.keys(selectedActivity.price).length === 0) && (
                            <option value="">Selecciona actividad primero</option>
                        )}
                    </CFormSelect>
                </div>

                <div className="mb-3">
                    <label className="form-label">Precio Calculado:</label>
                    <p className="fw-bold">{calculatedPrice.toFixed(2)} {newReservationData.metodo_pago}</p>
                </div>

                <div className="mb-3">
                    <CFormCheck
                        id="pagado"
                        name="pagado"
                        label="Pagado"
                        checked={newReservationData.pagado}
                        onChange={handleChange}
                    />
                </div>

            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onHide}>Cancelar</CButton>
                <CButton color="primary" onClick={handleSubmit}>Crear Reserva</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default CreateReservationModal;