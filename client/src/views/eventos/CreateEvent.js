import React, { useState } from 'react';

const CreateEvent = ({ guides, vehicles, onCreate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    activityType: 'maraton',
    startDate: '',
    endDate: '',
    guides: [],
    maxClients: 0,
    vehicles: [],
    precioDolares: 0 // Nuevo campo agregado
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuideSelect = (e) => {
    const guideId = parseInt(e.target.value);
    const selectedGuide = guides.find(g => g.id === guideId);
   
    if (selectedGuide && formData.guides.length < 2) {
      setFormData({
        ...formData,
        guides: [...formData.guides, selectedGuide]
      });
    }
  };

  const handleVehicleSelect = (e) => {
    const placa = e.target.value;
    const selectedVehicle = vehicles.find(v => v.placa === placa);
   
    if (selectedVehicle) {
      setFormData({
        ...formData,
        vehicles: [...formData.vehicles, selectedVehicle]
      });
    }
  };

  const removeGuide = (index) => {
    const updatedGuides = formData.guides.filter((_, i) => i !== index);
    setFormData({ ...formData, guides: updatedGuides });
  };

  const removeVehicle = (index) => {
    const updatedVehicles = formData.vehicles.filter((_, i) => i !== index);
    setFormData({ ...formData, vehicles: updatedVehicles });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      ...formData,
      precioDolares: parseFloat(formData.precioDolares) // Asegurar que es número
    });
  };

  return (
    <div className="persona-form-card">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre del Evento:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
         
          <div className="form-group">
            <label className="form-label">Tipo de Actividad:</label>
            <select
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="maraton">Maratón</option>
              <option value="tour">Tour</option>
              <option value="caminata">Caminata</option>
            </select>
          </div>

          {/* Nuevo campo: Precio en dólares */}
          <div className="form-group">
            <label className="form-label">Precio en dólares por persona:</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                name="precioDolares"
                value={formData.precioDolares}
                onChange={handleChange}
                className="form-control"
                min="0"
                step="0.01"
                required
              />
              <div className="input-group-append">
                <span className="input-group-text">USD</span>
              </div>
            </div>
          </div>
         
          <div className="form-group">
            <label className="form-label">Fecha de Inicio:</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
         
          <div className="form-group">
            <label className="form-label">Fecha de Finalización:</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
         
          <div className="form-group">
            <label className="form-label">Número Máximo de Clientes:</label>
            <input
              type="number"
              name="maxClients"
              value={formData.maxClients}
              onChange={handleChange}
              className="form-control"
              min="1"
              required
            />
          </div>
         
          <div className="form-group">
            <label className="form-label">Guías a Cargo (Máx 2):</label>
            <select
              onChange={handleGuideSelect}
              className="form-control"
              disabled={formData.guides.length >= 2}
            >
              <option value="">Seleccione un guía</option>
              {guides.map(guide => (
                <option key={guide.id} value={guide.id}>
                  {guide.nombre} ({guide.cedula})
                </option>
              ))}
            </select>
           
            <div className="selected-guides mt-2">
              {formData.guides.map((guide, index) => (
                <div key={index} className="badge badge-guia mr-2 p-2">
                  {guide.nombre} ({guide.cedula})
                  <button
                    type="button"
                    className="close ml-2"
                    onClick={() => removeGuide(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
         
          <div className="form-group">
            <label className="form-label">Vehículos Asignados:</label>
            <select
              onChange={handleVehicleSelect}
              className="form-control"
            >
              <option value="">Seleccione un vehículo</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.placa} value={vehicle.placa}>
                  {vehicle.placa} - {vehicle.conductor} ({vehicle.cedula})
                </option>
              ))}
            </select>
           
            <div className="selected-vehicles mt-2">
              {formData.vehicles.map((vehicle, index) => (
                <div key={index} className="badge badge-secondary-persona mr-2 p-2" style={{color: '#fff', backgroundColor: '#0b4817b7'}}>
                  {vehicle.placa} - {vehicle.conductor}
                  <button
                    type="button"
                    className="closing ml-2"
                    onClick={() => removeVehicle(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
         
          <div className="form-group">
            <button type="submit" className="btn btn-primary-persona mr-2">
              Guardar Evento
            </button>
            <button type="button" className="btn btn-secondary-persona" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;