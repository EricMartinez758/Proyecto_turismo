import React, { useState, useEffect } from 'react';
import { CContainer, CAlert } from '@coreui/react';
import PersonaTable from './PersonaTable';
import PersonaModalCreate from './PersonaModalCreate.js';
import PersonaModalEdit from './PersonaModalEdit.js';
import PersonaModalToggleActive from './PersonaModalToggleActivate.js';
import PersonaModalView from './PersonaModalView.js';
import {
  fetchPersonas,
  fetchBancos,
  fetchTiposCondicionMedica,
  createPersona,
  updatePersona,
  togglePersonaStatus,
  fetchPersonaById
} from '../../services/personal.service.js';
import 'src/assets/css/persona.css';

const App = () => {
  const [personas, setPersonas] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [tiposCondicion, setTiposCondicion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showToggleActiveModal, setShowToggleActiveModal] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [personasData, bancosData, tiposData] = await Promise.all([
          fetchPersonas(),
          fetchBancos(),
          fetchTiposCondicionMedica()
        ]);
        
        setPersonas(personasData);
        setBancos(bancosData);
        setTiposCondicion(tiposData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Manejar clic en Ver
// Modifica la función handleViewClick
const handleViewClick = async (persona) => {
  try {
    setLoading(true);
    setError(null);
    
    // Asegúrate de obtener el ID correctamente
    const personaId = persona.id || persona._id;
    if (!personaId) {
      throw new Error('ID de persona no válido');
    }
    
    const personaData = await fetchPersonaById(personaId);
    
    // Transformar datos para el modal de vista
     const formattedPersona = {
        ...personaData,
        numeroDocumento: personaData.numero_documento || personaData.numeroDocumento,
        primerNombre: personaData.primer_nombre || personaData.primerNombre,
        segundoNombre: personaData.segundo_nombre || personaData.segundoNombre,
        primerApellido: personaData.primer_apellido || personaData.primerApellido,
        segundoApellido: personaData.segundo_apellido || personaData.segundoApellido,
        fechaNacimiento: personaData.fecha_nacimiento || personaData.fechaNacimiento,
        telefono: personaData.telefono,
        direccion: personaData.direccion,
        tipoPersona: personaData.tipo_persona || personaData.tipoPersona,
        estado: personaData.estado,
        nacionalidad: personaData.nacionalidad || 'Venezolana',
        banco: personaData.banco || null,
        numeroCuentaBancaria: personaData.numero_cuenta || personaData.numeroCuentaBancaria || '',
        tipoCuenta: personaData.tipo_cuenta || personaData.tipoCuenta || 'corriente',
        historialMedico: personaData.historial_medico || personaData.historialMedico || []
      };
    
    setSelectedPersona(formattedPersona);
    setShowViewModal(true);
  } catch (error) {
    console.error('Error al obtener persona:', error);
    setError('No se pudo cargar la información de la persona');
  } finally {
    setLoading(false);
  }
};

  // Manejar clic en Editar

const handleEditClick = async (id) => {
  try {
    setLoading(true);
    setError(null);
    
    // Verificación extra del ID
    if (!id || typeof id !== 'string') {
      console.error('ID inválido recibido:', id);
      throw new Error('ID de persona no válido');
    }

    const personaData = await fetchPersonaById(id);
    console.log('Datos recibidos del backend:', personaData);

    // Transformación segura de datos
    const formattedPersona = {
      id: personaData.id,
      numeroDocumento: personaData.numero_documento || '',
      primerNombre: personaData.primer_nombre || '',
      segundoNombre: personaData.segundo_nombre || '',
      primerApellido: personaData.primer_apellido || '',
      segundoApellido: personaData.segundo_apellido || '',
      fechaNacimiento: personaData.fecha_nacimiento 
        ? formatDateForInput(personaData.fecha_nacimiento) 
        : '',
      telefono: personaData.telefono || '',
      direccion: personaData.direccion || '',
      tipoPersona: personaData.tipo_persona || '',
      banco: personaData.banco 
        ? bancos.find(b => b.id === personaData.banco.id) 
        : null,
      numeroCuentaBancaria: personaData.numero_cuenta || '',
      historialMedico: personaData.historial_medico || []
    };

    console.log('Datos formateados para edición:', formattedPersona);
    setSelectedPersona(formattedPersona);
    setShowEditModal(true);
  } catch (error) {
    console.error('Error al cargar datos para edición:', error);
    setError(`Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

// Función auxiliar para formato de fecha
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};
  // Manejar creación exitosa
  const handleCreateSuccess = async (newPersona) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createPersona(newPersona);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      const updatedPersonas = await fetchPersonas();
      setPersonas(updatedPersonas);
      setShowCreateModal(false);
      alert('Persona creada exitosamente!');
    } catch (error) {
      console.error('Error al crear persona:', error);
      let errorMessage = error.message;
      
      if (error.response) {
        try {
          const errorData = await error.response.json();
          errorMessage = errorData.message || error.message;
        } catch (e) {
          console.error('Error al parsear respuesta de error:', e);
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Manejar edición exitosa
  const handleEditSuccess = async (updatedPersona) => {
    try {
      setLoading(true);
      setError(null);
      
      const personaId = updatedPersona.id || updatedPersona._id;
      if (!personaId) {
        throw new Error('ID de persona no definido');
      }
      
      await updatePersona(personaId, updatedPersona);
      const updatedPersonas = await fetchPersonas();
      setPersonas(updatedPersonas);
      setShowEditModal(false);
      alert('Persona actualizada exitosamente!');
    } catch (err) {
      console.error('Error updating persona:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de estado
  const handleToggleActiveSuccess = async (id) => {
    try {
      await togglePersonaStatus(id);
      const updatedPersonas = await fetchPersonas();
      setPersonas(updatedPersonas);
      setShowToggleActiveModal(false);
      alert('Estado de persona actualizado!');
    } catch (err) {
      setError(err.message);
      console.error('Error toggling status:', err);
    }
  };

  if (loading) return <div className="text-center my-5"><p>Cargando...</p></div>;
  if (error) return <CAlert color="danger">{error}</CAlert>;

  return (
    <CContainer>
      <button
        className="btn-persona-primary mb-3"
        onClick={() => setShowCreateModal(true)}
      >
        Crear Persona
      </button>

      {error && <CAlert color="danger">{error}</CAlert>}

      <PersonaTable
        personas={personas}
        onEdit={handleEditClick}
        onView={handleViewClick}
        onToggleActive={(persona) => {
          setSelectedPersona(persona);
          setShowToggleActiveModal(true);
        }}
      />

      <PersonaModalCreate
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        bancos={bancos}
        tiposCondicion={tiposCondicion}
      />

      <PersonaModalEdit
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        personaId={selectedPersona?.id}
        bancos={bancos}
        tiposCondicion={tiposCondicion}
      />

      <PersonaModalView
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        persona={selectedPersona}
      />

      <PersonaModalToggleActive
        show={showToggleActiveModal}
        onHide={() => setShowToggleActiveModal(false)}
        onSuccess={() => handleToggleActiveSuccess(selectedPersona?.id)}
        persona={selectedPersona}
      />
    </CContainer>
  );
};

export default App;