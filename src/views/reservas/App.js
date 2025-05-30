import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../scss/App.css';
import ReservationTable from './ReservationTable';
import CreateReservationModal from './CreateReservationModal';
import StatusReservationModal from './StatusReservationModal';

function App() {
    const [reservations, setReservations] = useState([]);
    const [clients, setClients] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [currentReservation, setCurrentReservation] = useState(null);
    // Precios fijos por tipo de actividad
    const activityPrices = {
        tour: {
            USD: 50,
            EUR: 50 * 0.85, // Tasa de cambio aproximada EUR/USD
            COP: 50 * 3800, // Tasa de cambio aproximada COP/USD
            VES: 50 * 36.50 // Tasa de cambio BCV
        },
        'plan vacional': {
            USD: 200,
            EUR: 200 * 0.85,
            COP: 200 * 3800,
            VES: 200 * 36.50
        },
        maraton: {
            USD: 30,
            EUR: 30 * 0.85,
            COP: 30 * 3800,
            VES: 30 * 36.50
        }
    };
    const initialReservations = [
        { id: 1, cliente: 'Juan Pérez', fecha: '2023-05-15', estado: 'reservado' },
        { id: 2, cliente: 'María Gómez', fecha: '2023-05-16', estado: 'reservado' },
        { id: 3, cliente: 'Carlos Ruiz', fecha: '2023-05-17', estado: 'reservado' }
    ];


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

    const handleStatusChange = (id) => {
        setReservations(reservations.map(res =>
            res.id === id ? { ...res, estado: res.estado === 'reservado' ? 'cancelado' : 'reservado' } : res
        ));
        setShowStatusModal(false);
    };

    const openStatusModal = (reservation) => {
        setCurrentReservation(reservation);
        setShowStatusModal(true);
    };

    return (
        <div className="container mt-4">
            <header className="d-flex justify-content-between align-items-center mb-4">

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
                onEdit={(reservation) => handleEdit(reservation)}
                onStatusChange={(reservation) => toggleReservationStatus(reservation)}
                onToggleActive={(reservation) => toggleActiveStatus(reservation)}
            />

            <CreateReservationModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onCreate={handleCreate}
                activityPrices={activityPrices}
                clients={initialReservations} // Cambia esto por tus datos de clientes
            />
            {showStatusModal && currentReservation && (
                <StatusReservationModal
                    show={showStatusModal}
                    onHide={() => setShowStatusModal(false)}
                    onConfirm={handleStatusChange}
                    reservation={currentReservation}
                />
            )}
        </div>
    );
}

export default App;