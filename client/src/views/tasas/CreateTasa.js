import React, { useState } from 'react';
import { format } from 'date-fns';

const CreateTasa = ({ monedas, onCreate, onCancel }) => {
  const [formData, setFormData] = useState({
    moneda: monedas[0]?.codigo || '',
    valor: '',
    fecha: format(new Date(), 'yyyy-MM-dd')
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.moneda || !formData.valor) {
      alert('Por favor complete todos los campos');
      return;
    }
    onCreate({
      ...formData,
      valor: parseFloat(formData.valor)
    });
  };

  return (
    <div className="create-tasa">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Moneda:</label>
          <select
            name="moneda"
            value={formData.moneda}
            onChange={handleChange}
            className="form-control"
            required
          >
            {monedas.map(moneda => (
              <option key={moneda.codigo} value={moneda.codigo}>
                {moneda.nombre} ({moneda.codigo})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Valor equivalente a 1 USD:</label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            className="form-control"
            step="0.0001"
            min="0.0001"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Fecha de vigencia:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group mt-4">
          <button type="submit" className="btn btn-primary mr-2">
            Guardar Tasa
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTasa;