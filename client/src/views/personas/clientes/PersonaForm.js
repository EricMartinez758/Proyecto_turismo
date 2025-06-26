import React, { useState } from 'react';

const PersonaForm = ({ persona, handleChange, onAddHistorialMedico, onRemoveHistorialMedico, onUpdateHistorialMedico, onSubmit }) => {
    return (
        <div className="card">
            <div className="card-body">
                <div>
                    {/* Información Personal (se mantiene igual) */}
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label className="form-label">Primer Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                name="primerNombre"
                                value={persona.primerNombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Segundo Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                name="segundoNombre"
                                value={persona.segundoNombre}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Primer Apellido</label>
                            <input
                                type="text"
                                className="form-control"
                                name="primerApellido"
                                value={persona.primerApellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Segundo Apellido</label>
                            <input
                                type="text"
                                className="form-control"
                                name="segundoApellido"
                                value={persona.segundoApellido}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Número de Documento</label>
                            <input
                                type="text"
                                className="form-control"
                                name="numeroDocumento"
                                value={persona.numeroDocumento}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaNacimiento"
                                value={persona.fechaNacimiento}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Nacionalidad</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nacionalidad"
                                value={persona.nacionalidad}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="telefono"
                                value={persona.telefono}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <input
                            type="text"
                            className="form-control"
                            name="direccion"
                            value={persona.direccion}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Historial Médico Simplificado */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Historial Médico</h5>
                            <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={onAddHistorialMedico}
                            >
                                <i className="fas fa-plus me-1"></i>
                                Agregar Registro Médico
                            </button>
                        </div>

                        {persona.historialMedico.length === 0 ? (
                            <div className="alert alert-info">
                                <i className="fas fa-info-circle me-2"></i>
                                No hay registros médicos. Haga clic en "Agregar Registro Médico" para añadir uno.
                            </div>
                        ) : (
                            persona.historialMedico.map((registro, index) => (
                                <div key={index} className="card mb-3">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0">Registro Médico #{index + 1}</h6>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => onRemoveHistorialMedico(index)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Tipo</label>
                                                <select
                                                    className="form-control"
                                                    value={registro.tipo || ''}
                                                    onChange={(e) => onUpdateHistorialMedico(index, 'tipo', e.target.value)}
                                                >
                                                    <option value="">Seleccionar tipo...</option>
                                                    <option value="medicamento">Medicamento</option>
                                                    <option value="discapacidad">Discapacidad</option>
                                                    <option value="alergia">Alergia</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Descripción</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={registro.descripcion || ''}
                                                onChange={(e) => onUpdateHistorialMedico(index, 'descripcion', e.target.value)}
                                                placeholder="Descripción detallada del registro médico..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="d-grid gap-2">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onSubmit}
                        >
                            <i className="fas fa-save me-1"></i>
                            Guardar Persona
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [persona, setPersona] = useState({
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        numeroDocumento: '',
        fechaNacimiento: '',
        nacionalidad: '',
        telefono: '',
        direccion: '',
        historialMedico: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersona(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Función para agregar un nuevo registro médico
    const handleAddHistorialMedico = () => {
        const nuevoRegistro = {
            tipo: '',
            descripcion: ''
        };

        setPersona(prev => ({
            ...prev,
            historialMedico: [...prev.historialMedico, nuevoRegistro]
        }));
    };

    // Función para eliminar un registro médico
    const handleRemoveHistorialMedico = (index) => {
        setPersona(prev => ({
            ...prev,
            historialMedico: prev.historialMedico.filter((_, i) => i !== index)
        }));
    };

    // Función para actualizar un registro médico específico
    const handleUpdateHistorialMedico = (index, campo, valor) => {
        setPersona(prev => ({
            ...prev,
            historialMedico: prev.historialMedico.map((registro, i) =>
                i === index
                    ? { ...registro, [campo]: valor }
                    : registro
            )
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos de la persona:', persona);
        alert('Persona guardada exitosamente! Revisa la consola para ver los datos.');
    };

    return (
        <div className="container mt-4">
            <div>
                <PersonaForm
                    persona={persona}
                    handleChange={handleChange}
                    onAddHistorialMedico={handleAddHistorialMedico}
                    onRemoveHistorialMedico={handleRemoveHistorialMedico}
                    onUpdateHistorialMedico={handleUpdateHistorialMedico}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default App;