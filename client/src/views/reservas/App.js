import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/reservas.css';
import ReservationTable from './ReservationTable';
import CreateReservationModal from './CreateReservationModal';
import StatusReservationModal from './StatusReservationModal';
import CancelReservationModal from './CancelReservationModal';
import EditReservationModal from './EditReservationModal.js';
import ViewReservationModal from './ViewReservationModal';
import PaymentModal from './PaymentModal';

import { useAuth } from '../../../../src/contexts/authcontexts.js';

import { CSpinner, CAlert } from '@coreui/react';


function App() {
    const { user: currentUser } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentReservation, setCurrentReservation] = useState(null);
    

    const [availableClients, setAvailableClients] = useState([]);
    const [availableActivities, setAvailableActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const openViewModal = (reservation) => {
        setCurrentReservation(reservation);
        setShowViewModal(true);
    };

    const openPaymentModal = (reservation) => {
        setCurrentReservation(reservation);
        setShowPaymentModal(true);
    };

    const openEditModal = (reservation) => {
        setCurrentReservation(reservation);
        setShowEditModal(true);
    };

    const openStatusModal = (reservation) => {
        setCurrentReservation(reservation);
        setShowStatusModal(true);
    };

    const openCancelModal = (reservation) => {
        setCurrentReservation(reservation);
        setShowCancelModal(true);
    };

    const fetchData = useCallback(async (url, setter, transformer) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(url, { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setter(transformer ? data.map(transformer) : data);
            } else {
                const errData = await response.json();
                if (response.status === 401 || response.status === 403) {
                    setError('Acceso denegado o sesión expirada. Por favor, inicia sesión de nuevo.');
                } else {
                    setError(errData.message || `Error al cargar datos de ${url}.`);
                }
            }
        } catch (err) {
            console.error(`Error fetching ${url}:`, err);
            setError(`Error de conexión al cargar datos de ${url}.`);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchReservations = useCallback(() => {
        fetchData('/api/reservas', setReservations, (res) => {
            console.log("Frontend (App.js) received raw reservation object:", res); // Log para reservas
            return {
                id: res.id,
                reservationCode: `RES-${String(res.id || '').padStart(3, '0')}`,
                reservationDate: res.reservationDate,
                activity: {
                    id: res.activity.id,
                    type: res.activity.type,
                    description: res.activity.description,
                    location: res.activity.location,
                    price: res.activity.price,
                    originalDate: res.activity.originalDate,
                    originalTime: res.activity.originalTime,
                    status: res.activity.status
                },
                client: {
                    id: res.client.id,
                    firstName: res.client.firstName,
                    lastName: res.client.lastName,
                    idNumber: res.client.idNumber,
                    phone: res.client.phone
                },
                groupMembers: res.groupMembers || [],
                people: res.people || 1,
                paymentMethod: res.paymentMethod || 'USD',
                active: res.active,
                canceled: res.canceled,
                paid: res.paid
            };
        });
    }, [fetchData]);

    const fetchClients = useCallback(() => {
        fetchData('/api/reservas/clients', setAvailableClients, (client) => {
            console.log("Frontend (App.js) received raw client object:", client); // Log para clientes
            return {
                id: client.id,
                idNumber: client.numero_documento,
                firstName: client.primer_nombre,
                lastName: client.primer_apellido,
                phone: client.telefono
            };
        });
    }, [fetchData]);

    const fetchActivities = useCallback(() => {
        fetchData('/api/reservas/activities', setAvailableActivities, (activity) => {
            console.log("Frontend (App.js) received raw activity object:", activity); // Log para actividades
            return {
                id: activity.id,
                type: activity.type,
                description: activity.description,
                location: activity.location,
                price: activity.price,
                originalDate: activity.originalDate,
                originalTime: activity.originalTime,
                status: activity.status
            };
        });
    }, [fetchData]);

    useEffect(() => {
        if (currentUser) {
            fetchReservations();
            fetchClients();
            fetchActivities();
        } else {
            setError('Debes iniciar sesión para ver las reservas.');
            setLoading(false);
            setReservations([]);
            setAvailableClients([]);
            setAvailableActivities([]);
        }
    }, [currentUser, fetchReservations, fetchClients, fetchActivities]);

    // --- CONSOLE.LOGS CLAVE PARA VER EL ESTADO DE LAS LISTAS ---
    useEffect(() => {
        console.log("App.js: Current availableClients state:", availableClients);
        console.log("App.js: Current availableActivities state:", availableActivities);
    }, [availableClients, availableActivities]);


    const handleApiCall = useCallback(async (url, method, data, successMsg) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: data ? JSON.stringify(data) : undefined,
                credentials: 'include',
            });

            if (response.ok) {
                const responseData = await response.json();
                setSuccessMessage(responseData.message || successMsg);
                fetchReservations();
                return responseData;
            } else {
                const errData = await response.json();
                if (response.status === 401 || response.status === 403) {
                    setError('Acceso denegado o sesión expirada. Por favor, inicia sesión de nuevo.');
                } else {
                    setError(errData.message || `Error en la operación: ${method} ${url}`);
                }
                return null;
            }
        } catch (err) {
            console.error(`Error durante ${method} ${url}:`, err);
            setError(`Error de conexión durante la operación.`);
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchReservations]);

    const handleCreate = async (newReservationData) => {
        if (!currentUser || !currentUser.id) {
            setError('No se pudo obtener el ID del usuario logueado. Por favor, inicia sesión de nuevo.');
            return;
        }
        newReservationData.usuario_id = currentUser.id;

        const responseData = await handleApiCall(
            '/api/reservas',
            'POST',
            newReservationData,
            'Reserva creada exitosamente.'
        );
        if (responseData) {
            setShowCreateModal(false);
        }
    };

    const handleUpdate = async (updatedReservationData) => {
        const responseData = await handleApiCall(
            `/api/reservas/${updatedReservationData.id}`,
            'PUT',
            updatedReservationData,
            'Reserva actualizada exitosamente.'
        );
        if (responseData) {
            setShowEditModal(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const responseData = await handleApiCall(
            `/api/reservas/status/${id}`,
            'PUT',
            { estado: newStatus },
            'Estado de reserva actualizado exitosamente.'
        );
        if (responseData) {
            setShowStatusModal(false);
        }
    };

    const handleCancel = async (id) => {
        const responseData = await handleApiCall(
            `/api/reservas/cancel/${id}`,
            'PUT',
            null,
            'Reserva cancelada exitosamente.'
        );
        if (responseData) {
            setShowCancelModal(false);
        }
    };

    const handlePayment = async (paymentData) => {
        const responseData = await handleApiCall(
            `/api/reservas/payment/${currentReservation.id}`,
            'POST',
            paymentData,
            'Pago registrado exitosamente.'
        );
        if (responseData) {
            setShowPaymentModal(false);
        }
    };

    return (
        <div className="container mt-4">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h1>Gestión de Reservas</h1>
                <button
                    className="btn-primary-reserva"
                    onClick={() => setShowCreateModal(true)}
                    disabled={loading}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nueva Reservación
                </button>
            </header>

            {loading && <CSpinner color="primary" />}
            {error && <CAlert color="danger">{error}</CAlert>}
            {successMessage && <CAlert color="success">{successMessage}</CAlert>}

            {(!loading && !error && reservations.length > 0) || (!loading && error && reservations.length > 0) ? (
                <ReservationTable
                    reservations={reservations}
                    onEdit={openEditModal}
                    onStatusChange={openStatusModal}
                    onCancel={openCancelModal}
                    onView={openViewModal}
                    onPay={openPaymentModal}
                />
            ) : (
                !loading && !error && reservations.length === 0 && <CAlert color="info">No hay reservas para mostrar.</CAlert>
            )}
            
            <CreateReservationModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onCreate={handleCreate}
                availableClients={availableClients}
                availableActivities={availableActivities}
            />

            <ViewReservationModal
                show={showViewModal}
                onHide={() => setShowViewModal(false)}
                reservation={currentReservation}
            />

            <EditReservationModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                onUpdate={handleUpdate}
                reservation={currentReservation}
                availableActivities={availableActivities}
                availableClients={availableClients}
            />

            <StatusReservationModal
                show={showStatusModal}
                onHide={() => setShowStatusModal(false)}
                onConfirm={handleStatusChange}
                reservation={currentReservation}
            />

            <CancelReservationModal
                show={showCancelModal}
                onHide={() => setShowCancelModal(false)}
                onConfirm={handleCancel}
                reservation={currentReservation}
            />

            <PaymentModal
                show={showPaymentModal}
                onHide={() => setShowPaymentModal(false)}
                onPaymentSubmit={handlePayment}
                reservation={currentReservation}
            />
        </div>
    );
}

export default App;