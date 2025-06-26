import React, { useState } from 'react';


const bancosVenezolanos = [
    'Banco de Venezuela',
    'Banesco',
    'Banco Mercantil',
    'Banco Provincial (BBVA)',
    'Banco Occidental de Descuento (BOD)',
    'Banco Exterior',
    'Bancaribe',
    'Banco del Caribe',
    'Banco Activo',
    'Banco Caroní',
    'Banco Plaza',
    'Banco Sofitasa',
    'Banco del Tesoro',
    'Banco Agrícola de Venezuela',
    'Banco Bicentenario',
    'Banco de la Fuerza Armada Nacional Bolivariana (BANFANB)',
    'Mi Banco',
    'Bancrecer',
    'Banco Nacional de Crédito (BNC)',
    'Banco Venezolano de Crédito',
    'Banco Industrial de Venezuela',
    'Banco Internacional de Desarrollo',
    'Banco de la Gente Emprendedora (Bangente)',
    'Banco de Exportación y Comercio (Bancoex)',
    '100% Banco',
    'BanPlus',
    'Instituto Municipal de Crédito Popular'
];

const PersonaForm = ({ persona, handleChange, onAddHistorialMedico, onRemoveHistorialMedico, onUpdateHistorialMedico }) => {

    const handleBankAccountChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Solo números
        const maxLength = 20;
        if (value.length <= maxLength) {
            handleChange({
                target: {
                    name: 'numeroCuentaBancaria',
                    value: value
                }
            });
        }
    };

    const historialMedico = Array.isArray(persona.historialMedico) ? persona.historialMedico : [];

    return (
        <div className="card">
            <div className="card-body">
                <div>
                    {/* Información Personal */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Nombres</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombres"
                                value={persona.nombres || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Apellidos</label>
                            <input
                                type="text"
                                className="form-control"
                                name="apellidos"
                                value={persona.apellidos || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Número de Documento</label>
                            <input
                                type="text"
                                className="form-control"
                                name="numeroDocumento"
                                value={persona.numeroDocumento || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaNacimiento"
                                value={persona.fechaNacimiento || ''}
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
                                value={persona.telefono || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Tipo de Persona</label>
                            <select
                                className="form-control"
                                name="tipoPersona"
                                value={persona.tipoPersona || ''}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="administrativo">Administrativo</option>
                                <option value="conductor">Conductor</option>
                                <option value="obrero">Obrero</option>
                                <option value="guia">Guía</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <input
                            type="text"
                            className="form-control"
                            name="direccion"
                            value={persona.direccion || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Información Bancaria */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="fas fa-university me-2"></i>
                                Información Bancaria
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Banco</label>
                                    <select
                                        className="form-control"
                                        name="banco"
                                        value={persona.banco || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar banco...</option>
                                        {bancosVenezolanos.map((banco) => (
                                            <option key={banco} value={banco}>
                                                {banco}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Número de Cuenta Bancaria</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="numeroCuentaBancaria"
                                        value={persona.numeroCuentaBancaria || ''}
                                        onChange={handleBankAccountChange}
                                        placeholder="20 dígitos (solo números)"
                                        maxLength="20"
                                        pattern="[0-9]{20}"
                                        title="Debe contener exactamente 20 dígitos"
                                        required
                                    />
                                    <small className="form-text text-muted">
                                        Ingrese los 20 dígitos de la cuenta (sin espacios ni guiones)
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historial Médico */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Historial Médico</h5>
                            <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={onAddHistorialMedico} // This will now correctly call the parent's function
                            >
                                <i className="fas fa-plus me-1"></i>
                                Agregar Condición Médica
                            </button>
                        </div>

                        {historialMedico.length === 0 ? (
                            <div className="alert alert-info">
                                <i className="fas fa-info-circle me-2"></i>
                                No hay condiciones médicas registradas. Haga clic en "Agregar Condición Médica" para añadir una.
                            </div>
                        ) : (
                            historialMedico.map((condicion, index) => (
                                <div key={index} className="card mb-3">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0">Condición Médica #{index + 1}</h6>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => onRemoveHistorialMedico(index)} // Correctly calls parent's function
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Diagnóstico</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={condicion.diagnostico || ''}
                                                    onChange={(e) => onUpdateHistorialMedico(index, 'diagnostico', e.target.value)}
                                                    placeholder="Ej: Diabetes tipo 2"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Fecha de Diagnóstico</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={condicion.fechaDiagnostico || ''}
                                                    onChange={(e) => onUpdateHistorialMedico(index, 'fechaDiagnostico', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Medicamento</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={condicion.medicamento || ''}
                                                    onChange={(e) => onUpdateHistorialMedico(index, 'medicamento', e.target.value)}
                                                    placeholder="Ej: Metformina"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Dosis</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={condicion.dosis || ''}
                                                    onChange={(e) => onUpdateHistorialMedico(index, 'dosis', e.target.value)}
                                                    placeholder="Ej: 500mg cada 12 horas"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Médico Tratante</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={condicion.medicoTratante || ''}
                                                onChange={(e) => onUpdateHistorialMedico(index, 'medicoTratante', e.target.value)}
                                                placeholder="Ej: Dr. Juan Pérez"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Observaciones</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={condicion.observaciones || ''}
                                                onChange={(e) => onUpdateHistorialMedico(index, 'observaciones', e.target.value)}
                                                placeholder="Observaciones adicionales sobre esta condición médica..."
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label className="form-label">Estado</label>
                                                <select
                                                    className="form-control"
                                                    value={condicion.estado || ''}
                                                    onChange={(e) => onUpdateHistorialMedico(index, 'estado', e.target.value)}
                                                >
                                                    <option value="">Seleccionar estado...</option>
                                                    <option value="activo">Activo</option>
                                                    <option value="controlado">Controlado</option>
                                                    <option value="curado">Curado</option>
                                                    <option value="inactivo">Inactivo</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Prioridad</label>
                                                <select
                                                    className="form-control"
                                                    value={condicion.prioridad || ''}
                                                    onChange={(e) => onUpdateHistorialMedico(index, 'prioridad', e.target.value)}
                                                >
                                                    <option value="">Seleccionar prioridad...</option>
                                                    <option value="alta">Alta</option>
                                                    <option value="media">Media</option>
                                                    <option value="baja">Baja</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PersonaForm;