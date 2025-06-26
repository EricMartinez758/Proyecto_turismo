import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PersonaForm from './PersonaForm'; // Ensure this path is correct

const PersonaModalCreate = ({ show, onHide, onSuccess }) => {
    const [persona, setPersona] = useState({
        nombres: '',
        apellidos: '',
        numeroDocumento: '',
        fechaNacimiento: '',
        telefono: '',
        tipoPersona: '',
        direccion: '',
        banco: '', // Added banco to initial state
        numeroCuentaBancaria: '', // Added numeroCuentaBancaria to initial state
        historialMedico: [], // Initialize as an empty array
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
        const nuevaCondicion = {
            diagnostico: '',
            fechaDiagnostico: '',
            medicamento: '',
            dosis: '',
            medicoTratante: '',
            observaciones: '',
            estado: '',
            prioridad: ''
        };
        setPersona(prev => ({
            ...prev,
            historialMedico: [...prev.historialMedico, nuevaCondicion]
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
            historialMedico: prev.historialMedico.map((condicion, i) =>
                i === index
                    ? { ...condicion, [campo]: valor }
                    : condicion
            )
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPersona = {
            ...persona,
            _id: Date.now().toString()
        };
        onSuccess(newPersona);
        // Resetear el formulario después de guardar
        setPersona({
            nombres: '',
            apellidos: '',
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
        onHide(); // Optionally close the modal on successful submission
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Crear Nueva Persona</Modal.Title>
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
                    <Button variant="primary" type="submit">
                        Guardar
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default PersonaModalCreate;