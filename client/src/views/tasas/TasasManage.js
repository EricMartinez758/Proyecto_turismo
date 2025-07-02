import React, { useState } from 'react';
import TasaList from './TasaList';
import CreateTasa from './CreateTasa';
import EditTasa from './EditTasa';
import ViewTasa from './ViewTasa';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

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
    <div className="tasas-manager container mt-4">
      <h2 className="mb-4">Administración de Tasas de Cambio</h2>
      
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

      <Modal isOpen={showCreate} toggle={() => setShowCreate(false)}>
        <ModalHeader toggle={() => setShowCreate(false)}>Crear Nueva Tasa</ModalHeader>
        <ModalBody>
          <CreateTasa
            monedas={monedas}
            tasasExistentes={tasas}
            onCreate={handleCreateTasa}
            onCancel={() => setShowCreate(false)}
          />
        </ModalBody>
      </Modal>

      <Modal isOpen={showView} toggle={() => setShowView(false)} size="lg">
        <ModalHeader toggle={() => setShowView(false)}>Detalles de Tasa</ModalHeader>
        <ModalBody>
          <ViewTasa
            tasa={selectedTasa}
            onBack={() => setShowView(false)}
          />
        </ModalBody>
      </Modal>

      <Modal isOpen={showEdit} toggle={() => setShowEdit(false)}>
        <ModalHeader toggle={() => setShowEdit(false)}>Editar Tasa</ModalHeader>
        <ModalBody>
          <EditTasa
            tasa={selectedTasa}
            monedas={monedas}
            onUpdate={handleUpdateTasa}
            onCancel={() => setShowEdit(false)}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default TasasManager;