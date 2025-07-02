import React, { useState } from 'react';
import EventList from './EventList';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';
import ViewEvent from './ViewEvent';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../../assets/css/persona.css'

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [guides] = useState([
    { id: 1, cedula: '1234567890', nombre: 'Juan Pérez' },
    { id: 2, cedula: '0987654321', nombre: 'María García' },
    { id: 3, cedula: '5432167890', nombre: 'Carlos López' }
  ]);

  const [vehicles] = useState([
    { placa: 'ABC-123', conductor: 'Pedro Martínez', cedula: '1357924680' },
    { placa: 'DEF-456', conductor: 'Ana Rodríguez', cedula: '2468013579' },
    { placa: 'GHI-789', conductor: 'Luisa Fernández', cedula: '9876543210' }
  ]);

  const handleCreateEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: Date.now(), active: true }]);
    setShowCreate(false);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents(events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    setShowEdit(false);
  };

  const toggleEventStatus = (eventId) => {
    setEvents(events.map(event =>
      event.id === eventId ? { ...event, active: !event.active } : event
    ));
  };

  return (
    <div className="event-manager container mt-4">
      <EventList
        events={events}
        onView={(event) => {
          setSelectedEvent(event);
          setShowView(true);
        }}
        onEdit={(event) => {
          setSelectedEvent(event);
          setShowEdit(true);
        }}
        onToggleStatus={toggleEventStatus}
        onCreate={() => setShowCreate(true)}
      />
      {/* Modal Crear */}
      <Modal isOpen={showCreate} toggle={() => setShowCreate(false)} size="lg" className="persona-modal">
        <ModalHeader toggle={() => setShowCreate(false)}>Crear Evento</ModalHeader>
        <ModalBody>
          <CreateEvent
            guides={guides}
            vehicles={vehicles}
            onCreate={handleCreateEvent}
            onCancel={() => setShowCreate(false)}
          />
        </ModalBody>
      </Modal>
      {/* Modal Ver */}
      <Modal isOpen={showView} toggle={() => setShowView(false)} size="lg" className="persona-modal">
        <ModalHeader toggle={() => setShowView(false)}>Detalles del Evento</ModalHeader>
        <ModalBody>
          <ViewEvent
            event={selectedEvent}
            onBack={() => setShowView(false)}
          />
        </ModalBody>
      </Modal>
      {/* Modal Editar */}
      <Modal isOpen={showEdit} toggle={() => setShowEdit(false)} size="lg" className="persona-modal">
        <ModalHeader toggle={() => setShowEdit(false)}>Editar Evento</ModalHeader>
        <ModalBody>
          <EditEvent
            event={selectedEvent}
            guides={guides}
            vehicles={vehicles}
            onUpdate={handleUpdateEvent}
            onCancel={() => setShowEdit(false)}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default EventManager;