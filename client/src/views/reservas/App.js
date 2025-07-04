import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/reservas.css'; // Asegúrate de que esta ruta sea correcta
import ReservationTable from './ReservationTable';
import CreateReservationModal from './CreateReservationModal';
import StatusReservationModal from './StatusReservationModal';
import CancelReservationModal from './CancelReservationModal';
import EditReservationModal from './EditReservationModal.js';
import ViewReservationModal from './ViewReservationModal';
import PaymentModal from './PaymentModal';

// Importa useAuth para obtener el usuario logueado
import { useAuth } from '../../../../src/contexts/authcontexts.js'; // Asegúrate de que esta ruta sea correcta

// Importa CSpinner y CAlert de CoreUI para los indicadores de carga y mensajes
import { CSpinner, CAlert } from '@coreui/react';


function App() {
    const { user: currentUser } = useAuth(); // Obtener el usuario logueado
    const [reservations, setReservations] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentReservation, setCurrentReservation] = useState(null);

    const [availableClients, setAvailableClients] = useState([]); // Ahora se cargan de la API
    const [availableActivities, setAvailableActivities] = useState([]); // Ahora se cargan de la API
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- Funciones para abrir modales y establecer la reserva actual ---
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

    // --- Función de utilidad para todas las llamadas GET a la API ---
    // Incluye `credentials: 'include'` para enviar cookies de autenticación
    const fetchData = useCallback(async (url, setter, transformer) => {
        setLoading(true); // Activa el loading general
        setError(''); // Limpia errores previos
        try {
            const response = await fetch(url, { credentials: 'include' }); // ¡CRÍTICO para la autenticación!
            if (response.ok) {
                const data = await response.json();
                setter(transformer ? data.map(transformer) : data);
            } else {
                const errData = await response.json();
                // Si es 401 o 403, el error puede ser de permisos/autenticación
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
            setLoading(false); // Desactiva el loading
        }
    }, []); // No hay dependencias aquí porque es una función de utilidad general

    // --- Funciones específicas para cargar datos (usan fetchData) ---

    const fetchReservations = useCallback(() => {
        fetchData('/api/reservas', setReservations, (res) => ({
            id: res.reservation_id,
            reservationCode: `RES-${String(res.reservation_id).padStart(3, '0')}`, // Si tu BD no lo genera
            reservationDate: res.reservation_date,
            activity: {
                id: res.actividad_id,
                type: res.activity_type_name, // <-- Ahora es el nombre del tipo de actividad (de Turtmtac)
                description: res.activity_description, // <-- La descripción de la actividad (de turttact)
                location: 'N/A', // No hay ubicación directa en turttact según tus imágenes
                price: { // Mapea los precios usando precio_persona y calculando las divisas en el frontend
                    USD: res.activity_price_per_person,
                    VES: res.activity_price_per_person ? res.activity_price_per_person * 36.5 : 0, // Ejemplo de cálculo, ajusta tu tasa
                    EUR: res.activity_price_per_person ? res.activity_price_per_person * 0.92 : 0,
                    MXN: res.activity_price_per_person ? res.activity_price_per_person * 18.5 : 0,
                    RUB: res.activity_price_per_person ? res.activity_price_per_person * 90 : 0
                },
                originalDate: res.activity_original_date, // Fecha original de la actividad de turttact
                originalTime: res.activity_original_time, // Hora original de la actividad de turttact
                status: res.activity_status // Estado de la actividad de turttact
            },
            client: {
                id: res.cliente_id,
                firstName: res.client_first_name,
                lastName: res.client_last_name,
                idNumber: res.client_id_number,
                phone: res.client_phone
            },
            groupMembers: [], // Si no manejado por la BD directamente
            people: res.cantidad_personas, // Si la añadiste a turttres, descomenta en backend y frontend
            paymentMethod: res.metodo_pago, // Si la añadiste a turttres, descomenta en backend y frontend
            active: res.reservation_status === 'activa', // Ajusta según tus estados
            canceled: res.reservation_status === 'cancelada',
            paid: res.pagado // Si la añadiste a turttres, descomenta en backend y frontend
        }));
    }, [fetchData]);

    const fetchClients = useCallback(() => {
        fetchData('/api/reservas/clients', setAvailableClients, (client) => ({
            id: client.id, // ID del cliente (UUID)
            idNumber: client.numero_documento,
            firstName: client.primer_nombre,
            lastName: client.primer_apellido,
            phone: client.telefono
        }));
    }, [fetchData]);

    const fetchActivities = useCallback(() => {
        fetchData('/api/reservas/activities', setAvailableActivities, (activity) => ({
            id: activity.id, // ID de la actividad (INTEGER)
            type: activity.tipo_actividad_nombre, // <-- Nombre del tipo de actividad (de Turtmtac)
            description: activity.descripcion, // <-- Descripción de la actividad (de turttact)
            location: 'N/A', // No hay ubicación directa en turttact
            price: { // Mapea los precios usando precio_persona y calculando las divisas en el frontend
                USD: activity.precio_persona,
                VES: activity.precio_persona ? activity.precio_persona * 36.5 : 0,
                EUR: activity.precio_persona ? activity.precio_persona * 0.92 : 0,
                MXN: activity.precio_persona ? activity.precio_persona * 18.5 : 0,
                RUB: activity.precio_persona ? activity.precio_persona * 90 : 0
            },
            originalDate: activity.fecha_actividad,
            originalTime: activity.hora_actividad,
            status: activity.estado
        }));
    }, [fetchData]);

    // --- useEffect para cargar datos al inicio o cuando el usuario cambia ---
    useEffect(() => {
        if (currentUser) { // Solo carga datos si hay un usuario logueado
            fetchReservations();
            fetchClients();
            fetchActivities();
        } else {
            setError('Debes iniciar sesión para ver las reservas.');
            setLoading(false);
            setReservations([]); // Limpiar reservas si no hay usuario
            setAvailableClients([]);
            setAvailableActivities([]);
        }
    }, [currentUser, fetchReservations, fetchClients, fetchActivities]);

    // --- Función de utilidad para todas las llamadas POST/PUT a la API ---
    // Incluye `credentials: 'include'` para enviar cookies de autenticación
    const handleApiCall = useCallback(async (url, method, data, successMsg) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: data ? JSON.stringify(data) : undefined,
                credentials: 'include', // ¡CRÍTICO para la autenticación!
            });

            if (response.ok) {
                const responseData = await response.json();
                setSuccessMessage(responseData.message || successMsg);
                // Después de cualquier operación exitosa, recargar todas las reservas
                fetchReservations();
                return responseData; // Retornar datos para manejo específico en cada handler
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
    }, [fetchReservations]); // Depende de fetchReservations para recargar datos

    // --- Funciones para enviar datos a la API (CRUD) ---

    const handleCreate = async (newReservationData) => {
        if (!currentUser || !currentUser.id) {
            setError('No se pudo obtener el ID del usuario logueado. Por favor, inicia sesión de nuevo.');
            return;
        }
        // Añadir el usuario_id del usuario logueado (UUID)
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

    const handleStatusChange = async (id, newStatus) => { // Recibe el ID y el nuevo estado
        const responseData = await handleApiCall(
            `/api/reservas/status/${id}`,
            'PUT',
            { estado: newStatus }, // Envía el nuevo estado
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
            null, // No se envía body, se usa el ID en la URL
            'Reserva cancelada exitosamente.'
        );
        if (responseData) {
            setShowCancelModal(false);
        }
    };

    const handlePayment = async (paymentData) => {
        // Asume que paymentData incluye el ID de la reserva y otros detalles de pago
        // y que tu backend tiene un endpoint para procesar pagos de reservas
        // Necesitarás crear la ruta `/api/reservas/payment/:id` en tu backend si no existe.
        const responseData = await handleApiCall(
            `/api/reservas/payment/${currentReservation.id}`,
            'POST', // O 'PUT' si es solo para marcar como pagada
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
                <h1>Gestión de Reservas</h1> {/* Título añadido para claridad */}
                <button
                    className="btn-primary-reserva"
                    onClick={() => setShowCreateModal(true)}
                    disabled={loading} // Deshabilita el botón mientras carga
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nueva Reservación
                </button>
            </header>

            {/* Indicadores de carga y mensajes de alerta */}
            {loading && <CSpinner color="primary" />}
            {error && <CAlert color="danger">{error}</CAlert>}
            {successMessage && <CAlert color="success">{successMessage}</CAlert>}

            {/* Solo muestra la tabla si no hay errores graves y los datos se están cargando o ya se cargaron */}
            {/* O si hay datos para mostrar aunque haya habido un error previo no crítico */}
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
                // Mensaje si no hay reservas y no está cargando o hay un error
                !loading && !error && reservations.length === 0 && <CAlert color="info">No hay reservas para mostrar.</CAlert>
            )}
            
            {/* Modales */}
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