import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PersonaForm from './PersonaForm';

const PersonaModalEdit = ({ show, onHide, persona: initialPersona, onSuccess }) => {
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
        banco: '',
        numeroCuentaBancaria: '',
        historialMedico: [],
        activo: true
    });

    useEffect(() => {
        if (initialPersona) {
            // Convertir historial médico a array si es un objeto
            const historialMedico = initialPersona.historialMedico 
                ? Array.isArray(initialPersona.historialMedico) 
                    ? initialPersona.historialMedico 
                    : [initialPersona.historialMedico]
                : [];
            
            setPersona({
                ...initialPersona,
                historialMedico
            });
        }
    }, [initialPersona]);

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
                {
                    tipo: '',
                    descripcion: ''
                }
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
        onSuccess(persona);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="modal-header">
                <Modal.Title>
                    <i className="fas fa-user-edit me-2"></i>
                    Editar Persona
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <PersonaForm
                        persona={persona}
                        handleChange={handleChange}
                        onAddHistorialMedico={handleAddHistorialMedico}
                        onRemoveHistorialMedico={handleRemoveHistorialMedico}
                        onUpdateHistorialMedico={handleUpdateHistorialMedico}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" className='btn-primary-persona' type="submit">
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default PersonaModalEdit;