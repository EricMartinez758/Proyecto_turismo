import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PersonaForm from './PersonaForm';

const PersonaModalEdit = ({ show, onHide, persona: initialPersona, onSuccess }) => {
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

    useEffect(() => {
        if (initialPersona) {
            setPersona(initialPersona);
        }
    }, [initialPersona]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersona(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSuccess(persona);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Editar Persona</Modal.Title>
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
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default PersonaModalEdit;