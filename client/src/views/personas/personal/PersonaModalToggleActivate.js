import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PersonaModalToggleActive = ({ show, onHide, persona, onSuccess }) => {
    const handleConfirm = () => {
        onSuccess();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {persona?.activo ? 'Desactivar' : 'Activar'} Persona
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Estás seguro que deseas {persona?.activo ? 'desactivar' : 'activar'} a {persona?.nombres} {persona?.apellidos}?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button
                    variant={persona?.activo ? 'danger' : 'success'}
                    onClick={handleConfirm}
                >
                    {persona?.activo ? 'Desactivar' : 'Activar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PersonaModalToggleActive;