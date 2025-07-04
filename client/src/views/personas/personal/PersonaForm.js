import React from 'react';

const PersonaForm = ({ 
  persona, 
  handleChange, 
  onAddHistorialMedico,
  onRemoveHistorialMedico, 
  onUpdateHistorialMedico,
  bancos = [],
  tiposCondicion = []
}) => {
  const handleBankAccountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
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
    <div className="persona-form card mb-3">
      <div className="card-body">
        <div>
          {/* Información Personal */}
          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label">Primer Nombre*</label>
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
              <label className="form-label">Primer Apellido*</label>
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
            <div className="col-md-6">
              <label className="form-label">Número de Documento*</label>
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
              <label className="form-label">Fecha de Nacimiento*</label>
              <input
                type="date"
                className="form-control"
                name="fechaNacimiento"
                value={persona.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Teléfono*</label>
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
              <label className="form-label">Tipo de Persona*</label>
              <select
                className="form-control"
                name="tipoPersona"
                value={persona.tipoPersona || ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar tipo...</option>
                <option value="guia">Guía</option>
                 <option value="cliente">Chofer</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Dirección*</label>
            <input
              type="text"
              className="form-control"
              name="direccion"
              value={persona.direccion}
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
                    value={persona.banco?.id || ''}
                    onChange={(e) => {
                      const selectedBanco = bancos.find(b => b.id === parseInt(e.target.value));
                      handleChange({
                        target: {
                          name: 'banco',
                          value: selectedBanco
                        }
                      });
                    }}
                  >
                    <option value="">Seleccionar banco...</option>
                    {bancos.map((banco) => (
                      <option key={banco.id} value={banco.id}>
                        {banco.nombre}
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
                  />
                  <small className="form-text text-muted">
                    Ingrese los 20 dígitos de la cuenta (sin espacios ni guiones)
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Historial Médico Simplificado */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Historial Médico</h5>
              <button
                type="button"
                className="btn-secondary-persona btn-sm"
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
                          {tiposCondicion.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                              {tipo.nombre}
                            </option>
                          ))}
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
        </div>
      </div>
    </div>
  );
};

export default PersonaForm;