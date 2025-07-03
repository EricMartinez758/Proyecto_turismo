import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import '../../assets/css/tasas.css'; 

const EditTasa = ({ tasa, monedas, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    valor: '',
    fecha: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    if (tasa) {
      setFormData({
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
      valor: parseFloat(formData.valor),
      fecha: formData.fecha
    });
  };

  const monedaInfo = monedas.find(m => m.codigo === tasa?.moneda) || {};

  return (
    <div className="edit-tasa">
      <form onSubmit={handleSubmit}>
        <div className="tasas-form-group">
          <label className="tasas-form-label">Moneda:</label>
          <div>
            <h5>
              <strong>{monedaInfo.nombre}</strong> ({tasa?.moneda} {monedaInfo.simbolo && `- ${monedaInfo.simbolo}`})
            </h5>
          </div>
        </div>
        
        <div className="tasas-form-group">
          <label className="tasas-form-label">Nuevo valor equivalente a 1 USD:</label>
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
            Actualizar Tasa
          </button>
          <button type="button" className="tasas-button tasas-button-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTasa;