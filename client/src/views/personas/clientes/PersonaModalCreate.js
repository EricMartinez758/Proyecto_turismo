import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PersonaForm from './PersonaForm';

const PersonaModalCreate = ({ show, onHide, onSuccess }) => {
    const [persona, setPersona] = useState({
        nombres: '',
        apellidos: '',
        numeroDocumento: '',
        fechaNacimiento: '',
        telefono: '',
        tipoPersona: '',
        direccion: '',
        historialMedico: {
            tipoNecesidadMedica: '',
            descripcion: ''
        },
        activo: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersona(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Generar un ID único simple para el nuevo registro
        const newPersona = {
            ...persona,
            _id: Date.now().toString()
        };
        onSuccess(newPersona);
        // Resetear el formulario
        setPersona({
            nombres: '',
            apellidos: '',
            numeroDocumento: '',
            fechaNacimiento: '',
            telefono: '',
            tipoPersona: '',
            direccion: '',
            historialMedico: {
                tipoNecesidadMedica: '',
                descripcion: ''
            },
            activo: true
        });
    };

    return (
        
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Crear Nueva Persona</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <PersonaForm persona={persona} handleChange={handleChange} />
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        Guardar
                    </Button>
                    
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default PersonaModalCreate;