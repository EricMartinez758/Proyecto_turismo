import React, { useState } from 'react';
import { format } from 'date-fns';
import '../../assets/css/tasas.css'; 

const CreateTasa = ({ monedas, tasasExistentes, onCreate, onCancel }) => {
  const [formData, setFormData] = useState({
    moneda: '',
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

  const monedasDisponibles = monedas.filter(moneda =>
    !tasasExistentes.some(tasa => tasa.moneda === moneda.codigo)
  );

  return (
    <div className="create-tasa">
      <form onSubmit={handleSubmit}>
        <div className="tasas-form-group">
          <label className="tasas-form-label">Moneda:</label>
          <select
            name="moneda"
            value={formData.moneda}
            onChange={handleChange}
            className="tasas-form-control"
            required
          >
            <option value="">Seleccione una moneda</option>
            {monedas.map(moneda => {
              const existe = tasasExistentes.some(t => t.moneda === moneda.codigo);
              return (
                <option
                  key={moneda.codigo}
                  value={moneda.codigo}
                  disabled={existe}
                >
                  {moneda.nombre} ({moneda.codigo}) {existe && "(Existente)"}
                </option>
              );
            })}
          </select>
          <small style={{ color: '#7f8c8d', fontSize: '12px' }}>
            Solo se muestran monedas que no tienen tasa registrada
          </small>
        </div>
        
        <div className="tasas-form-group">
          <label className="tasas-form-label">Valor equivalente a 1 USD:</label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            className="tasas-form-control"
            step="0.0001"
            min="0.0001"
            required
          />
        </div>
        
        <div className="tasas-form-group">
          <label className="tasas-form-label">Fecha de vigencia:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="tasas-form-control"
            required
          />
        </div>
        
        <div className="tasas-form-actions">
          <button type="submit" className="tasas-button tasas-button-primary">
            Guardar Tasa
          </button>
          <button type="button" className="tasas-button tasas-button-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTasa;