import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Card, Badge, Alert } from 'react-bootstrap';

const PersonaModalEdit = ({ show, onHide, persona: initialPersona, onSuccess }) => {
    const [persona, setPersona] = useState({
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        numeroDocumento: '',
        fechaNacimiento: '',
        nacionalidad: '',
        telefono: '',
        direccion: '',
        historialMedico: [],
        activo: true
    });

    // Transforma initialPersona al nuevo formato si es necesario
    useEffect(() => {
        if (initialPersona) {
            const personaActualizada = initialPersona.nombres 
                ? {
                    ...initialPersona,
                    primerNombre: initialPersona.nombres?.split(' ')[0] || '',
                    segundoNombre: initialPersona.nombres?.split(' ')[1] || '',
                    primerApellido: initialPersona.apellidos?.split(' ')[0] || '',
                    segundoApellido: initialPersona.apellidos?.split(' ')[1] || '',
                    historialMedico: initialPersona.historialMedico || []
                }
                : initialPersona; // Si ya está en formato nuevo, úsalo directamente
            setPersona(personaActualizada);
        }
    }, [initialPersona]);

    // Manejadores de cambios
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersona(prev => ({ ...prev, [name]: value }));
    };

    const handleAddHistorialMedico = () => {
        setPersona(prev => ({
            ...prev,
            historialMedico: [...prev.historialMedico, { tipo: '', descripcion: '' }]
        }));
    };

    const handleRemoveHistorialMedico = (index) => {
        setPersona(prev => ({
            ...prev,
            historialMedico: prev.historialMedico.filter((_, i) => i !== index)
        }));
    };

    const handleUpdateHistorialMedico = (index, campo, valor) => {
        setPersona(prev => ({
            ...prev,
            historialMedico: prev.historialMedico.map((item, i) => 
                i === index ? { ...item, [campo]: valor } : item
            )
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSuccess(persona);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Editar Persona</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            {/* Información Personal */}
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <Form.Label>Primer Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="primerNombre"
                                        value={persona.primerNombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Form.Label>Segundo Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="segundoNombre"
                                        value={persona.segundoNombre}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Form.Label>Primer Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="primerApellido"
                                        value={persona.primerApellido}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Form.Label>Segundo Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="segundoApellido"
                                        value={persona.segundoApellido}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Documento, Fecha Nacimiento, Nacionalidad */}
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <Form.Label>Número de Documento</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="numeroDocumento"
                                        value={persona.numeroDocumento}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Form.Label>Fecha de Nacimiento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="fechaNacimiento"
                                        value={persona.fechaNacimiento}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Form.Label>Nacionalidad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nacionalidad"
                                        value={persona.nacionalidad}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Teléfono y Dirección */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="telefono"
                                        value={persona.telefono}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="direccion"
                                        value={persona.direccion}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Historial Médico */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>Historial Médico</h5>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={handleAddHistorialMedico}
                                    >
                                        <i className="fas fa-plus me-1"></i>
                                        Agregar Registro
                                    </Button>
                                </div>

                                {persona.historialMedico.length === 0 ? (
                                    <Alert variant="info">
                                        No hay registros médicos.
                                    </Alert>
                                ) : (
                                    persona.historialMedico.map((registro, index) => (
                                        <Card key={index} className="mb-3">
                                            <Card.Header className="d-flex justify-content-between align-items-center">
                                                <span>Registro #{index + 1}</span>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleRemoveHistorialMedico(index)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <Form.Label>Tipo</Form.Label>
                                                        <Form.Select
                                                            value={registro.tipo || ''}
                                                            onChange={(e) => handleUpdateHistorialMedico(index, 'tipo', e.target.value)}
                                                        >
                                                            <option value="">Seleccionar...</option>
                                                            <option value="medicamento">Medicamento</option>
                                                            <option value="discapacidad">Discapacidad</option>
                                                            <option value="alergia">Alergia</option>
                                                        </Form.Select>
                                                    </div>
                                                </div>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Descripción</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        value={registro.descripcion || ''}
                                                        onChange={(e) => handleUpdateHistorialMedico(index, 'descripcion', e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Card.Body>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default PersonaModalEdit;