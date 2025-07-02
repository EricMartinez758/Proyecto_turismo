import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const EditTasa = ({ tasa, monedas, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    moneda: '',
    valor: '',
    fecha: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    if (tasa) {
      setFormData({
        moneda: tasa.moneda,
        valor: tasa.valor,
        fecha: format(new Date(tasa.fecha), 'yyyy-MM-dd')
      });
    }
  }, [tasa]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...tasa,
      ...formData,
      valor: parseFloat(formData.valor)
    });
  };

  return (
    <div className="edit-tasa">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Moneda:</label>
          <select
            name="moneda"
            value={formData.moneda}
            onChange={handleChange}
            className="form-control"
            disabled
          >
            <option value={formData.moneda}>
              {monedas.find(m => m.codigo === formData.moneda)?.nombre} ({formData.moneda})
            </option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Nuevo valor equivalente a 1 USD:</label>
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
            Actualizar Tasa
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTasa;