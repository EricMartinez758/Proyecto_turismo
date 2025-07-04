import React, { useState, useEffect } from 'react';
import EventList from './EventList';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';
import ViewEvent from './ViewEvent';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../../assets/css/persona.css';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [guides, setGuides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [typesRes, guidesRes, driversRes, eventsRes] = await Promise.all([
          fetch('/api/events/types'),
          fetch('/api/events/guides'),
          fetch('/api/events/drivers'),
          fetch('/api/events') // Nuevo endpoint para obtener eventos
        ]);
        
        const typesData = await typesRes.json();
        const guidesData = await guidesRes.json();
        const driversData = await driversRes.json();
        const eventsData = await eventsRes.json();
        
        setActivityTypes(typesData);
        setGuides(guidesData.map(g => ({
          id: g.id,
          cedula: g.numero_documento,
          nombre: `${g.primer_nombre} ${g.primer_apellido}`
        })));
        setDrivers(driversData.map(d => ({
          id: d.id,
          cedula: d.numero_documento,
          nombre: `${d.primer_nombre} ${d.primer_apellido}`
        })));
        
        // Mapear los eventos del backend al formato esperado por el frontend
        setEvents(eventsData.map(event => ({
          id: event.id,
          name: event.descripcion,
          activityType: event.tipo_id, // Guardamos el ID para referencias
          activityTypeName: event.tipo_nombre, // Usamos el nombre que viene del backend
          startDate: `${event.fecha_actividad}T${event.hora_actividad}`,
          endDate: event.fecha_fin ? `${event.fecha_fin}T${event.hora_fin}` : null,
          maxClients: event.numero_total,
          precioDolares: event.precio_persona,
          active: event.estado === 'activo',
          guides: [], // Se cargarán luego si es necesario
          vehicles: [] // Se cargarán luego si es necesario
        })));
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleCreateEvent = async (newEvent) => {
    try {
      console.log('Datos del formulario:', newEvent);
      
      if (!newEvent.fechaInicio || !newEvent.horaInicio) {
        throw new Error('Fecha y hora de inicio son requeridas');
      }

      const eventData = {
        description: newEvent.name || '',
        tipo_id: newEvent.activityType,
        precio_persona: parseFloat(newEvent.precioDolares),
        fecha_actividad: newEvent.fechaInicio,
        hora_actividad: newEvent.horaInicio + ':00',
        fecha_fin: newEvent.fechaFin || null,
        hora_fin: newEvent.fechaFin ? newEvent.horaFin + ':00' : null,
        numero_total: parseInt(newEvent.maxClients),
        guias: newEvent.guides?.map(g => g.id) || [],
        conductores: newEvent.vehicles?.map(v => v.id) || []
      };

      console.log('Datos a enviar al backend:', eventData);
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Error al crear el evento');
      }
      
      setEvents([...events, { 
        ...newEvent, 
        id: result.eventId,
        active: true 
      }]);
      
      setShowCreate(false);
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error: ${error.message}`);
    }
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
      
      <Modal isOpen={showCreate} toggle={() => setShowCreate(false)} size="lg" className="persona-modal">
        <ModalHeader toggle={() => setShowCreate(false)}>Crear Evento</ModalHeader>
        <ModalBody>
          <CreateEvent
            guides={guides}
            drivers={drivers}
            activityTypes={activityTypes}
            onCreate={handleCreateEvent}
            onCancel={() => setShowCreate(false)}
          />
        </ModalBody>
      </Modal>
      
      <Modal isOpen={showView} toggle={() => setShowView(false)} size="lg" className="persona-modal">
        <ModalHeader toggle={() => setShowView(false)}>Detalles del Evento</ModalHeader>
        <ModalBody>
          <ViewEvent
            event={selectedEvent}
            onBack={() => setShowView(false)}
          />
        </ModalBody>
      </Modal>
      
      <Modal isOpen={showEdit} toggle={() => setShowEdit(false)} size="lg" className="persona-modal">
        <ModalHeader toggle={() => setShowEdit(false)}>Editar Evento</ModalHeader>
        <ModalBody>
          <EditEvent
            event={selectedEvent}
            guides={guides}
            vehicles={drivers}
            onUpdate={handleUpdateEvent}
            onCancel={() => setShowEdit(false)}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default EventManager;