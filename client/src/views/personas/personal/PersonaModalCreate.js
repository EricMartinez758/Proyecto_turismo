import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PersonaForm from './PersonaForm';

const PersonaModalCreate = ({ show, onHide, onSuccess, bancos, tiposCondicion }) => {
  const [persona, setPersona] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    telefono: '',
    tipoPersona: '',
    direccion: '',
    banco: null,
    numeroCuentaBancaria: '',
    historialMedico: [],
    activo: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersona(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddHistorialMedico = () => {
    setPersona(prev => ({
      ...prev,
      historialMedico: [
        ...prev.historialMedico,
        { tipo: '', descripcion: '' }
      ]
    }));
  };

  const handleRemoveHistorialMedico = (index) => {
    setPersona(prev => ({
      ...prev,
      historialMedico: prev.historialMedico.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateHistorialMedico = (index, campo, valor) => {
    setPersona(prev => ({
      ...prev,
      historialMedico: prev.historialMedico.map((registro, i) =>
        i === index ? { ...registro, [campo]: valor } : registro
      )
    }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validación básica
  const requiredFields = [
    'primerNombre', 'primerApellido', 'numeroDocumento', 
    'fechaNacimiento', 'telefono', 'direccion', 'tipoPersona'
  ];
  
  const newErrors = {};
  requiredFields.forEach(field => {
    if (!persona[field]) {
      newErrors[field] = 'Este campo es requerido';
    }
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // Validación de número de cuenta si hay banco seleccionado
  if (persona.banco && !persona.numeroCuentaBancaria) {
    setErrors(prev => ({ ...prev, numeroCuentaBancaria: 'Requerido cuando se selecciona un banco' }));
    return;
  }

  onSuccess(persona);
};

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registro de personal</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <PersonaForm
            persona={persona}
            handleChange={handleChange}
            onAddHistorialMedico={handleAddHistorialMedico}
            onRemoveHistorialMedico={handleRemoveHistorialMedico}
            onUpdateHistorialMedico={handleUpdateHistorialMedico}
            bancos={bancos}
            tiposCondicion={tiposCondicion}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" className='btn-primary-persona' type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default PersonaModalCreate;