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
    { codigo: 'EUR', nombre: 'Euro' },
    { codigo: 'COP', nombre: 'Peso Colombiano' },
    { codigo: 'BRL', nombre: 'Real Brasileño' },
    { codigo: 'MXN', nombre: 'Peso Mexicano' }
  ]);

  const handleCreateTasa = (newTasa) => {
    const existe = tasas.find(t => t.moneda === newTasa.moneda);
    
    if (existe) {
      alert(`Ya existe una tasa para ${newTasa.moneda}. Actualícela en lugar de crear una nueva.`);
      return;
    }

    setTasas([...tasas, { 
      ...newTasa, 
      id: Date.now(),
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