import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import PersonaForm from './PersonaForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const PersonaModalEdit = ({ show, onHide, personaId, onSuccess, bancos, tiposCondicion }) => {
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
   const [formData, setFormData] = useState({
    // Inicializar con valores por defecto
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    tipoPersona: '',
    banco: null,
    numeroCuentaBancaria: '',
    tipoCuenta: 'corriente',
    historialMedico: []
  });

  // Cargar datos cuando el modal se abre o la persona cambia
 useEffect(() => {
  if (show && persona) {
    console.log('Inicializando formulario con:', persona);
    setFormData({
      primerNombre: persona.primerNombre || '',
      segundoNombre: persona.segundoNombre || '',
      primerApellido: persona.primerApellido || '',
      segundoApellido: persona.segundoApellido || '',
      numeroDocumento: persona.numeroDocumento || '',
      fechaNacimiento: persona.fechaNacimiento || '',
      telefono: persona.telefono || '',
      direccion: persona.direccion || '',
      tipoPersona: persona.tipoPersona || '',
      banco: persona.banco || null,
      numeroCuentaBancaria: persona.numeroCuentaBancaria || '',
      historialMedico: persona.historialMedico || []
    });
  }
}, [show, persona]);
useEffect(() => {
  const loadFullData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/personal/${personaId}`);
      const fullData = await response.json();

      setPersona({
        ...fullData,
        fechaNacimiento: fullData.fecha_nacimiento?.split('T')[0] || fullData.fechaNacimiento,
        banco: fullData.banco ? {
          id: fullData.banco.id,
          nombre: fullData.banco.nombre
        } : null,
        numeroCuentaBancaria: fullData.numero_cuenta || fullData.numeroCuentaBancaria || '',
        historialMedico: fullData.historial_medico?.map(item => ({
          id: item.id,
          tipo: item.tipo_condicion_medica_id || item.tipo,
          descripcion: item.descripcion,
          tipoNombre: item.tipo_condicion_medica?.nombre || item.tipoNombre
        })) || []
      });
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar datos completos');
    } finally {
      setLoading(false);
    }
  };

  if (show && personaId) loadFullData();
}, [show, personaId]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError(null);
    
    // Validar datos antes de enviar
    if (!persona.primerNombre || !persona.primerApellido || !persona.numeroDocumento) {
      throw new Error('Nombre, apellido y número de documento son requeridos');
    }
    
    await onSuccess(persona);
  } catch (err) {
    console.error('Error al guardar cambios:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  if (!persona) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {loading ? 'Cargando...' : 'Error'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Cargando datos del personal...</p>
            </div>
          ) : (
            <Alert variant="danger">
              {error || 'No se pudieron cargar los datos'}
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>
          <i className="fas fa-user-edit me-2"></i>
          Editar Personal
        </Modal.Title>
      </Modal.Header>
      
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <PersonaForm
            persona={persona}
            handleChange={(e) => {
              const { name, value } = e.target;
              setPersona(prev => ({ ...prev, [name]: value }));
            }}
            onAddHistorialMedico={() => {
              setPersona(prev => ({
                ...prev,
                historialMedico: [
                  ...prev.historialMedico,
                  { tipo: '', descripcion: '' }
                ]
              }));
            }}
            onRemoveHistorialMedico={(index) => {
              setPersona(prev => ({
                ...prev,
                historialMedico: prev.historialMedico.filter((_, i) => i !== index)
              }));
            }}
            onUpdateHistorialMedico={(index, field, value) => {
              setPersona(prev => {
                const updated = [...prev.historialMedico];
                updated[index] = { ...updated[index], [field]: value };
                return { ...prev, historialMedico: updated };
              });
            }}
            bancos={bancos}
            tiposCondicion={tiposCondicion}
          />
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Guardando...</span>
              </>
            ) : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default PersonaModalEdit;