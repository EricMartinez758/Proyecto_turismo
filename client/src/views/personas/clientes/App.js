import React, { useState, Component } from 'react';
import { CContainer } from '@coreui/react';
import PersonaTable from './PersonaTable';
import PersonaModalCreate from './PersonaModalCreate';
import PersonaModalEdit from './PersonaModalEdit';
import PersonaModalToggleActive from './PersonaModalToggleActivate';
import PersonaModalView from './PersonaModalView';
import '../../../assets/css/persona.css'; 

const initialPersonas = [
    { _id: '1',
        primerNombre: 'Juan',
        segundoNombre: '',
        primerApellido: 'Pérez',
        segundoApellido: '',
        numeroDocumento: '12345678',
        fechaNacimiento: '1990-05-15',
        telefono: '5551234',
        direccion: 'Calle 123, Ciudad',
        historialMedico: [
            {
                tipo: 'alergias',
                descripcion: 'Alergia a los mariscos'
            }
        ],
        activo: true
    },
    { _id: '2',
        primerNombre: 'María',
        segundoNombre: 'Elena',
        primerApellido: 'Gómez',
        segundoApellido: 'López',
        numeroDocumento: '87654321',
        fechaNacimiento: '1985-08-20',
        telefono: '5556789',
        direccion: 'Avenida 456, Ciudad',
        historialMedico: [
            {
                tipo: 'enfermedad crónica',
                descripcion: 'Diabetes tipo 2'
            }
        ],
        activo: true
    },
    { _id: '3',
        primerNombre: 'Carlos',
        segundoNombre: 'Andrés',
        primerApellido: 'Martínez',
        segundoApellido: '',
        numeroDocumento: '11223344',
        fechaNacimiento: '1992-12-01',
        telefono: '5559876',
        direccion: 'Calle 789, Ciudad',
        historialMedico: [],
        activo: true
    }
];


const App = () => {
    const [personas, setPersonas] = useState(initialPersonas);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
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
                className="btn-persona-primary mb-3"
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
                onView={(persona) => {
                    setSelectedPersona(persona);
                    setShowViewModal(true);
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
            
            <PersonaModalView
                show={showViewModal}
                onHide={() => setShowViewModal(false)}
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