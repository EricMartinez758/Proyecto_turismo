import React, { useState } from 'react';
import { CContainer } from '@coreui/react';
import PersonaTable from './PersonaTable';
import PersonaModalCreate from './PersonaModalCreate';
import PersonaModalEdit from './PersonaModalEdit';
import PersonaModalToggleActive from './PersonaModalToggleActivate';
import PersonaModalDetalles from './PersonaModalDetalles';

// Datos fríos iniciales
const initialPersonas = [
    {
        _id: '1',
        primerNombre: 'Juan',
        segundoNombre: 'Carlos',
        primerApellido: 'Pérez',
        segundoApellido: 'González',
        numeroDocumento: '12345678',
        fechaNacimiento: '1990-05-15',
        nacionalidad: 'Venezolano',
        telefono: '5551234',
        direccion: 'Calle 123, Ciudad',
        historialMedico: [
            {
                tipo: 'alergia',
                descripcion: 'Alergia a los mariscos'
            }
        ],
        activo: true
    },
    {
        _id: '2',
        primerNombre: 'María',
        segundoNombre: 'Isabel',
        primerApellido: 'Gómez',
        segundoApellido: 'López',
        numeroDocumento: '87654321',
        fechaNacimiento: '1985-10-22',
        nacionalidad: 'Colombiana',
        telefono: '5555678',
        direccion: 'Avenida Principal 456',
        historialMedico: [
            {
                tipo: 'medicamento',
                descripcion: 'Toma medicamento para la presión'
            }
        ],
        activo: true
    },
    {
        _id: '3',
        primerNombre: 'Carlos',
        segundoNombre: 'Alberto',
        primerApellido: 'Rodríguez',
        segundoApellido: 'Martínez',
        numeroDocumento: '56781234',
        fechaNacimiento: '1978-03-30',
        nacionalidad: 'Ecuatoriano',
        telefono: '5559012',
        direccion: 'Carrera 7 # 45-89',
        historialMedico: [
            {
                tipo: 'discapacidad',
                descripcion: 'Discapacidad auditiva parcial'
            }
        ],
        activo: false
    },
    {
        _id: '4',
        primerNombre: 'Ana',
        segundoNombre: 'María',
        primerApellido: 'Fernández',
        segundoApellido: '',
        numeroDocumento: '34567890',
        fechaNacimiento: '1992-07-18',
        nacionalidad: 'Peruana',
        telefono: '5553456',
        direccion: 'Calle 56 # 12-34',
        historialMedico: [
            {
                tipo: 'medicamento',
                descripcion: 'Insulina diaria'
            },
            {
                tipo: 'alergia',
                descripcion: 'Alergia a la penicilina'
            }
        ],
        activo: true
    }
];

const App = () => {
    const [personas, setPersonas] = useState(initialPersonas);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showToggleActiveModal, setShowToggleActiveModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

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
                onShowDetails={(persona) => {
                    setSelectedPersona(persona);
                    setShowDetailsModal(true);
                }}
            />

            {/* Modals */}
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

            <PersonaModalDetalles
                show={showDetailsModal}
                handleClose={() => setShowDetailsModal(false)}
                persona={selectedPersona}
            />
        </CContainer>
    );
};

export default App;