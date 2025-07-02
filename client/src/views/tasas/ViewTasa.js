import React from 'react';
import { Card, CardBody, Button, Table, Badge } from 'reactstrap';

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const ViewTasa = ({ tasa, onBack }) => {
  if (!tasa) return null;

  return (
    <div className="view-tasa">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Detalles de Tasa</h4>
            <Button color="secondary" onClick={onBack} size="sm">
              Volver
            </Button>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-4">
              <strong>Moneda:</strong>
              <Badge color="primary" className="ml-2">
                {tasa.moneda}
              </Badge>
            </div>
            <div className="col-md-4">
              <strong>Valor actual:</strong>
              <Badge color="success" className="ml-2">
                1 USD = {tasa.valor} {tasa.moneda}
              </Badge>
            </div>
            <div className="col-md-4">
              <strong>Vigente desde:</strong>
              <Badge color="info" className="ml-2">
                {formatDateTime(tasa.fecha)}
              </Badge>
            </div>
          </div>
          
          <h5 className="mt-4 mb-3">Historial de Cambios</h5>
          <Table striped bordered responsive>
            <thead className="thead-dark">
              <tr>
                <th>Valor</th>
                <th>Fecha Vigencia</th>
                <th>Actualizado el</th>
              </tr>
            </thead>
            <tbody>
              {[...tasa.historial].reverse().map((item, index) => (
                <tr key={index}>
                  <td>1 USD = {item.valor} {tasa.moneda}</td>
                  <td>{formatDateTime(item.fecha)}</td>
                  <td>{formatDateTime(item.fechaActualizacion)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ViewTasa;