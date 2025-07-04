import React, { useState } from 'react';

const CreateEvent = ({ guides, drivers, activityTypes, onCreate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    activityType: activityTypes.length > 0 ? activityTypes[0].id : '',
    fechaInicio: '',
    horaInicio: '08:00',
    fechaFin: '',
    horaFin: '18:00',
    guides: [],
    maxClients: 1,
    vehicles: [],
    precioDolares: 10.00
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuideSelect = (e) => {
    const guideId = e.target.value;
    const selectedGuide = guides.find(g => g.id === guideId);
   
    if (selectedGuide && formData.guides.length < 2) {
      setFormData({
        ...formData,
        guides: [...formData.guides, selectedGuide]
      });
    }
  };

  const handleDriverSelect = (e) => {
    const driverId = e.target.value;
    const selectedDriver = drivers.find(d => d.id === driverId);
   
    if (selectedDriver) {
      setFormData({
        ...formData,
        vehicles: [...formData.vehicles, selectedDriver]
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
    
    // Validaciones
    if (!formData.name.trim()) {
      alert('El nombre del evento es requerido');
      return;
    }
    
    if (!formData.fechaInicio) {
      alert('La fecha de inicio es requerida');
      return;
    }

    if (!formData.horaInicio) {
      alert('La hora de inicio es requerida');
      return;
    }

    if (formData.fechaFin && !formData.horaFin) {
      alert('Si especifica fecha final, debe indicar hora final');
      return;
    }

    if (formData.maxClients < 1) {
      alert('Debe haber al menos 1 cliente');
      return;
    }

    if (formData.precioDolares <= 0) {
      alert('El precio debe ser mayor que 0');
      return;
    }

    // Preparar datos para enviar
    const eventToCreate = {
      ...formData,
      startDate: `${formData.fechaInicio}T${formData.horaInicio}:00`,
      endDate: formData.fechaFin ? `${formData.fechaFin}T${formData.horaFin}:00` : null,
      precioDolares: parseFloat(formData.precioDolares),
      maxClients: parseInt(formData.maxClients)
    };

    onCreate(eventToCreate);
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
              {activityTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.nombre}
                </option>
              ))}
            </select>
          </div>

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
          
          <div className="form-row">
            <div className="form-group col-md-6">
              <label className="form-label">Fecha de Inicio:</label>
              <input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label className="form-label">Hora de Inicio:</label>
              <input
                type="time"
                name="horaInicio"
                value={formData.horaInicio}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group col-md-6">
              <label className="form-label">Fecha de Finalización:</label>
              <input
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group col-md-6">
              <label className="form-label">Hora de Finalización:</label>
              <input
                type="time"
                name="horaFin"
                value={formData.horaFin}
                onChange={handleChange}
                className="form-control"
                disabled={!formData.fechaFin}
              />
            </div>
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
            <label className="form-label">Conductores Asignados:</label>
            <select
              onChange={handleDriverSelect}
              className="form-control"
            >
              <option value="">Seleccione un conductor</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.nombre} ({driver.cedula})
                </option>
              ))}
            </select>
           
            <div className="selected-vehicles mt-2">
              {formData.vehicles.map((vehicle, index) => (
                <div key={index} className="badge badge-secondary-persona mr-2 p-2" style={{color: '#fff', backgroundColor: '#0b4817b7'}}>
                  {vehicle.nombre} ({vehicle.cedula})
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