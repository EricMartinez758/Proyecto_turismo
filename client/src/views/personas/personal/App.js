import React, { useState, Component } from 'react';
import { CContainer } from '@coreui/react';
import PersonaTable from './PersonaTable';
import PersonaModalCreate from './PersonaModalCreate';
import PersonaModalEdit from './PersonaModalEdit';
import PersonaModalToggleActive from './PersonaModalToggleActivate';

const initialPersonas = [
    {
        _id: '1',
        nombres: 'Juan',
        apellidos: 'Pérez',
        numeroDocumento: '12345678',
        fechaNacimiento: '1990-05-15',
        telefono: '5551234',
        tipoPersona: 'guia',
        direccion: 'Calle 123, Ciudad',
        banco: 'Banco de Venezuela',
        numeroCuentaBancaria: '01020123456789012345',
        historialMedico: {
            tipoNecesidadMedica: 'alergias',
            descripcion: 'Alergia a los mariscos'
        },
        activo: true
    },
    {
        _id: '2',
        nombres: 'María',
        apellidos: 'Gómez',
        numeroDocumento: '87654321',
        fechaNacimiento: '1985-10-22',
        telefono: '5555678',
        tipoPersona: 'administrativo',
        direccion: 'Avenida Principal 456',
        banco: 'Banesco',
        numeroCuentaBancaria: '01340987654321098765',
        historialMedico: {
            tipoNecesidadMedica: 'medicamentos',
            descripcion: 'Toma medicamento para la presión'
        },
        activo: true
    },
    {
        _id: '3',
        nombres: 'Carlos',
        apellidos: 'Rodríguez',
        numeroDocumento: '56781234',
        fechaNacimiento: '1978-03-30',
        telefono: '5559012',
        tipoPersona: 'obrero',
        direccion: 'Carrera 7 # 45-89',
        banco: 'Banco Mercantil',
        numeroCuentaBancaria: '01050123456789012345',
        historialMedico: {
            tipoNecesidadMedica: 'discapacidad',
            descripcion: 'Discapacidad auditiva parcial'
        },
        activo: false
    }
];


const App = () => {
    const [personas, setPersonas] = useState(initialPersonas);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showToggleActiveModal, setShowToggleActiveModal] = useState(false);

    const handleCreateSuccess = (newPersona) => {
        setPersonas([...personas, newPersona]);
        setShowCreateModal(false);
    };

    const handleEditSuccess = (updatedPersona) => {
        setPersonas(personas.map(p =>
            p._id === updatedPersona._id ? updatedPersona : p
        ));
        setShowEditModal(false);
    };

    const handleToggleActiveSuccess = (id) => {
        setPersonas(personas.map(p =>
            p._id === id ? { ...p, activo: !p.activo } : p
        ));
        setShowToggleActiveModal(false);
    };

    return (
        <CContainer>

            <button
                className="btn btn-primary mb-3"
                onClick={() => setShowCreateModal(true)}
            >
                Crear Persona
            </button>

            <PersonaTable
                personas={personas}
                onEdit={(persona) => {
                    setSelectedPersona(persona);
                    setShowEditModal(true);
                }}
                onToggleActive={(persona) => {
                    setSelectedPersona(persona);
                    setShowToggleActiveModal(true);
                }}
            />

            <PersonaModalCreate
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />

            <PersonaModalEdit
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                onSuccess={handleEditSuccess}
                persona={selectedPersona}
            />

            <PersonaModalToggleActive
                show={showToggleActiveModal}
                onHide={() => setShowToggleActiveModal(false)}
                onSuccess={() => handleToggleActiveSuccess(selectedPersona?._id)}
                persona={selectedPersona}
            />
        </CContainer>
    );
};

export default App;