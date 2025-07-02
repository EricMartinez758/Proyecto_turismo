import React from 'react';
import { Table, Button, Badge } from 'reactstrap';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const TasaList = ({ tasas, onView, onEdit, onCreate }) => {
  return (
    <div className="tasa-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Tasas de Cambio</h4>
        <Button color="primary" onClick={onCreate}>
          <i className="fas fa-plus mr-2"></i>
          Nueva Tasa
        </Button>
      </div>
      
      <Table striped hover responsive className="mt-3">
        <thead className="thead-dark">
          <tr>
            <th>Moneda</th>
            <th>Valor Actual</th>
            <th>Vigente desde</th>
            <th>Última Actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasas.length > 0 ? (
            tasas.map(tasa => (
              <tr key={tasa.id}>
                <td>
                  <Badge color="primary">
                    {tasa.moneda}
                  </Badge>
                </td>
                <td>
                  <Badge color="success">
                    1 USD = {tasa.valor} {tasa.moneda}
                  </Badge>
                </td>
                <td>{formatDate(tasa.fecha)}</td>
                <td>{formatDate(tasa.historial[tasa.historial.length - 1]?.fechaActualizacion)}</td>
                <td>
                  <Button color="info" size="sm" onClick={() => onView(tasa)} className="mr-2">
                    <i className="fas fa-eye"></i> Ver
                  </Button>
                  <Button color="warning" size="sm" onClick={() => onEdit(tasa)}>
                    <i className="fas fa-edit"></i> Editar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                <div className="alert alert-info mb-0">
                  No hay tasas registradas. Cree una nueva tasa para comenzar.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TasaList;