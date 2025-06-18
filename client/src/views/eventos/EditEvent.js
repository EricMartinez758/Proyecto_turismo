import React, { useState, useEffect } from 'react';

const EditEvent = ({ event, guides, vehicles, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    activityType: 'maraton',
    startDate: '',
    endDate: '',
    guides: [],
    maxClients: 0,
    vehicles: [],
    active: true
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        activityType: event.activityType || 'maraton',
        startDate: event.startDate || '',
        endDate: event.endDate || '',
        guides: event.guides || [],
        maxClients: event.maxClients || 0,
        vehicles: event.vehicles || [],
        active: event.active !== undefined ? event.active : true
      });
    }
  }, [event]);

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
    onUpdate({ ...formData, id: event.id });
  };

  return (
    <div className="edit-event">
      <h2>Editar Evento</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Evento:</label>
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
          <label>Tipo de Actividad:</label>
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
        
        <div className="form-group">
          <label>Fecha de Inicio:</label>
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
          <label>Fecha de Finalización:</label>
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
          <label>Número Máximo de Clientes:</label>
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
          <label>Estado:</label>
          <select
            name="active"
            value={formData.active}
            onChange={handleChange}
            className="form-control"
          >
            <option value={true}>Activo</option>
            <option value={false}>Inactivo</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Guías a Cargo (Máx 2):</label>
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
              <div key={index} className="badge badge-primary mr-2 p-2">
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
          <label>Vehículos Asignados:</label>
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
              <div key={index} className="badge badge-secondary mr-2 p-2">
                {vehicle.placa} - {vehicle.conductor}
                <button 
                  type="button" 
                  className="close ml-2" 
                  onClick={() => removeVehicle(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <button type="submit" className="btn btn-primary mr-2">
            Actualizar Evento
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;