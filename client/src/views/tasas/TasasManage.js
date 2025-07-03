import React, { useState } from 'react';
import TasaList from './TasaList';
import CreateTasa from './CreateTasa';
import EditTasa from './EditTasa';
import ViewTasa from './ViewTasa';
import '../../assets/css/tasas.css';

const TasasManager = () => {
  const [tasas, setTasas] = useState([]);
  const [selectedTasa, setSelectedTasa] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [monedas] = useState([
    { codigo: 'EUR', nombre: 'Euro', simbolo: '€' },
    { codigo: 'COP', nombre: 'Peso Colombiano', simbolo: '$' },
    { codigo: 'BRL', nombre: 'Real Brasileño', simbolo: 'R$' },
    { codigo: 'MXN', nombre: 'Peso Mexicano', simbolo: '$' },
    { codigo: 'PEN', nombre: 'Sol Peruano', simbolo: 'S/' },
    { codigo: 'CLP', nombre: 'Peso Chileno', simbolo: '$' },
    { codigo: 'ARS', nombre: 'Peso Argentino', simbolo: '$' },
    { codigo: 'GBP', nombre: 'Libra Esterlina', simbolo: '£' },
    { codigo: 'JPY', nombre: 'Yen Japonés', simbolo: '¥' },
    { codigo: 'CNY', nombre: 'Yuan Chino', simbolo: '¥' },
    { codigo: 'CHF', nombre: 'Franco Suizo', simbolo: 'CHF' },
    { codigo: 'CAD', nombre: 'Dólar Canadiense', simbolo: 'CA$' },
    { codigo: 'AUD', nombre: 'Dólar Australiano', simbolo: 'A$' },
    { codigo: 'NZD', nombre: 'Dólar Neozelandés', simbolo: 'NZ$' },
    { codigo: 'KRW', nombre: 'Won Surcoreano', simbolo: '₩' },
    { codigo: 'SGD', nombre: 'Dólar de Singapur', simbolo: 'S$' },
    { codigo: 'HKD', nombre: 'Dólar de Hong Kong', simbolo: 'HK$' },
    { codigo: 'SEK', nombre: 'Corona Sueca', simbolo: 'kr' },
    { codigo: 'NOK', nombre: 'Corona Noruega', simbolo: 'kr' },
    { codigo: 'DKK', nombre: 'Corona Danesa', simbolo: 'kr' },
    { codigo: 'ZAR', nombre: 'Rand Sudafricano', simbolo: 'R' },
    { codigo: 'INR', nombre: 'Rupia India', simbolo: '₹' },
    { codigo: 'RUB', nombre: 'Rublo Ruso', simbolo: '₽' },
    { codigo: 'TRY', nombre: 'Lira Turca', simbolo: '₺' }
  ]);

  const handleCreateTasa = (newTasa) => {
    setTasas([...tasas, {
      ...newTasa,
      id: Date.now(),
      nombreMoneda: monedas.find(m => m.codigo === newTasa.moneda)?.nombre,
      simbolo: monedas.find(m => m.codigo === newTasa.moneda)?.simbolo,
      historial: [{
        valor: newTasa.valor,
        fecha: newTasa.fecha,
        fechaActualizacion: new Date().toISOString()
      }]
    }]);
    setShowCreate(false);
  };

  const handleUpdateTasa = (updatedTasa) => {
    setTasas(tasas.map(tasa => {
      if (tasa.id === updatedTasa.id) {
        return {
          ...tasa,
          valor: updatedTasa.valor,
          fecha: updatedTasa.fecha,
          historial: [
            ...tasa.historial,
            {
              valor: updatedTasa.valor,
              fecha: updatedTasa.fecha,
              fechaActualizacion: new Date().toISOString()
            }
          ]
        };
      }
      return tasa;
    }));
    setShowEdit(false);
  };

  return (
    <div className="tasas-container">
      <h2 className="tasas-title">Administración de Tasas de Cambio</h2>
      
      <TasaList
        tasas={tasas}
        monedas={monedas}
        onView={(tasa) => {
          setSelectedTasa(tasa);
          setShowView(true);
        }}
        onEdit={(tasa) => {
          setSelectedTasa(tasa);
          setShowEdit(true);
        }}
        onCreate={() => setShowCreate(true)}
      />
      
      {/* Modal para crear nueva tasa */}
      {showCreate && (
        <div className="tasas-modal">
          <div className="tasas-modal-content">
            <div className="tasas-modal-header">
              <h3 className="tasas-modal-title">Crear Nueva Tasa</h3>
              <button 
                className="tasas-modal-close" 
                onClick={() => setShowCreate(false)}
                aria-label="Cerrar modal"
              >
                &times;
              </button>
            </div>
            <div className="tasas-modal-body">
              <CreateTasa
                monedas={monedas}
                tasasExistentes={tasas}
                onCreate={handleCreateTasa}
                onCancel={() => setShowCreate(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para ver detalles de tasa */}
      {showView && (
        <div className="tasas-modal">
          <div className="tasas-modal-content" style={{ maxWidth: '800px' }}>
            <div className="tasas-modal-header">
              <h3 className="tasas-modal-title">Detalles de Tasa</h3>
              <button 
                className="tasas-modal-close" 
                onClick={() => setShowView(false)}
                aria-label="Cerrar modal"
              >
                &times;
              </button>
            </div>
            <div className="tasas-modal-body">
              <ViewTasa
                tasa={selectedTasa}
                onBack={() => setShowView(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para editar tasa */}
      {showEdit && (
        <div className="tasas-modal">
          <div className="tasas-modal-content">
            <div className="tasas-modal-header">
              <h3 className="tasas-modal-title">Editar Tasa</h3>
              <button 
                className="tasas-modal-close" 
                onClick={() => setShowEdit(false)}
                aria-label="Cerrar modal"
              >
                &times;
              </button>
            </div>
            <div className="tasas-modal-body">
              <EditTasa
                tasa={selectedTasa}
                monedas={monedas}
                onUpdate={handleUpdateTasa}
                onCancel={() => setShowEdit(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasasManager;