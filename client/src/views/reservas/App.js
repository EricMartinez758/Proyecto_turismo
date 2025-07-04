import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/reservas.css';
import ReservationTable from './ReservationTable';
import CreateReservationModal from './CreateReservationModal';
import StatusReservationModal from './StatusReservationModal';
import CancelReservationModal from './CancelReservationModal';
import EditReservationModal from './EditReservationModal';
import ViewReservationModal from './ViewReservationModal';
import PaymentModal from './PaymentModal';

function App() {
  const [reservations, setReservations] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);

  const openViewModal = (reservation) => {
    setCurrentReservation(reservation);
    setShowViewModal(true);
  };

  const openPaymentModal = (reservation) => {
    setCurrentReservation(reservation);
    setShowPaymentModal(true);
  };

  const [availableClients] = useState([
    { idNumber: '12345678', firstName: 'Juan', lastName: 'Pérez', phone: '04121234567' },
    { idNumber: '87654321', firstName: 'Ana', lastName: 'Gómez', phone: '04121112233' },
    { idNumber: '13579246', firstName: 'Carlos', lastName: 'Rodríguez', phone: '04149876543' },
    { idNumber: '24681357', firstName: 'María', lastName: 'López', phone: '04168765432' }
  ]);

  const activityPrices = {
    tour: { USD: 60, VES: 50 * 36.5, EUR: 55, MXN: 1100, RUB: 4500 },
    'plan vacional': { USD: 200, VES: 200 * 36.5, EUR: 180, MXN: 3600, RUB: 15000 },
    maraton: { USD: 30, VES: 30 * 36.5, EUR: 28, MXN: 550, RUB: 2200 }
  };

  useEffect(() => {
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
        groupMembers: [],
        paymentMethod: 'USD',
        active: true,
        canceled: false,
        paid: false, // Estado inicial de pago
        people: 1
      }
    ];
    setReservations(initialData);
  }, []);

  const handleCreate = (newReservation) => {
    const nextId = reservations.length + 1;
    newReservation.id = nextId;
    newReservation.reservationCode = `RES-${String(nextId).padStart(3, '0')}`;
    newReservation.canceled = false;
    newReservation.paid = false; // Por defecto no pagado
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

  const handleCancel = (id) => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, canceled: true } : res
    ));
    setShowCancelModal(false);
  };

  const handlePayment = (paymentData) => {
  console.log('Pago registrado:', paymentData);
  setReservations(reservations.map(res =>
    res.id === currentReservation.id ? { 
      ...res, 
      paid: true,
      paymentCurrency: paymentData.currency,
      paymentDate: paymentData.paymentDate
    } : res
    ));
    setShowPaymentModal(false);
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

  return (
    <div className="container mt-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn-primary-reserva"
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
        onCancel={openCancelModal}
        onView={openViewModal}
        onPay={openPaymentModal}
      />
      <CreateReservationModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onCreate={handleCreate}
        activityPrices={activityPrices}
        availableClients={availableClients}
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
        activityPrices={activityPrices}
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