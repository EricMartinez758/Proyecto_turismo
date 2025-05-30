import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../scss/App.css';
import ReservationTable from './ReservationTable';
import CreateReservationModal from './CreateReservationModal';
import EditReservationModal from './EditReservationModal';
import StatusReservationModal from './StatusReservationModal';

function App() {
    const [reservations, setReservations] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [currentReservation, setCurrentReservation] = useState(null);

    // Precios fijos por tipo de actividad
    const activityPrices = {
        tour: { USD: 50, VES: 50 * 36.50 },
        'plan vacional': { USD: 200, VES: 200 * 36.50 },
        maraton: { USD: 30, VES: 30 * 36.50 }
    };

    useEffect(() => {
        // Datos de ejemplo
        const initialData = [
            {
                id: 1,
                reservationCode: 'RES-001',
                reservationDate: '2023-05-15',
                activity: {
                    type: 'tour',
                    location: 'Canaima',
                    price: activityPrices.tour
                },
                client: {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    idNumber: '12345678',
                    phone: '04121234567'
                },
                paymentMethod: 'USD',
                active: true
            }
        ];
        setReservations(initialData);
    }, []);

    const handleCreate = (newReservation) => {
        newReservation.id = reservations.length + 1;
        newReservation.reservationCode = `RES-${String(newReservation.id).padStart(3, '0')}`;
        setReservations([...reservations, newReservation]);
        setShowCreateModal(false);
    };

    const handleUpdate = (updatedReservation) => {
        setReservations(reservations.map(res =>
            res.id === updatedReservation.id ? updatedReservation : res
        ));
        setShowEditModal(false);
    };

    const handleStatusChange = (id) => {
        setReservations(reservations.map(res =>
            res.id === id ? { ...res, active: !res.active } : res
        ));
        setShowStatusModal(false);
    };

    const openEditModal = (reservation) => {
        setCurrentReservation(reservation);
        setShowEditModal(true);
    };

    const openStatusModal = (reservation) => {
        setCurrentReservation(reservation);
        setShowStatusModal(true);
    };

    return (
        <div className="container mt-4">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Sistema de Reservaciones</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nueva Reservación
                </button>
            </header>

            <ReservationTable
                reservations={reservations}
                onEdit={openEditModal}
                onStatusChange={openStatusModal}
            />

            <CreateReservationModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onCreate={handleCreate}
                activityPrices={activityPrices}
            />

            <EditReservationModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                onUpdate={handleUpdate}
                reservation={currentReservation}
                activityPrices={activityPrices}
            />

            <StatusReservationModal
                show={showStatusModal}
                onHide={() => setShowStatusModal(false)}
                onConfirm={handleStatusChange}
                reservation={currentReservation}
            />
        </div>
    );
}

export default App;