import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CButton, CFormSelect, CFormInput, CFormCheck, CSpinner, CAlert
} from '@coreui/react';

const CreateTrabajadorModal = ({
    visible, onClose, roles, onCreate, loading,
    successMessage, errorMessage, setErrorMessage, setSuccessMessage
}) => {
    const [newTrabajadorData, setNewTrabajadorData] = useState({
        correo: '',
        contrasena: '',
        rol_id: '', // Debe ser el ID del rol (integer)
        estado: true // Activo por defecto
    });

    useEffect(() => {
        if (visible) {
            setNewTrabajadorData({
                correo: '',
                contrasena: '',
                rol_id: roles.length > 0 ? roles[0].id : '', // Asegúrate de que roles[0].id es un número
                estado: true
            });
            setErrorMessage('');
            setSuccessMessage('');
        }
    }, [visible, roles, setErrorMessage, setSuccessMessage]);

    const handleInternalCreate = () => {
        if (!newTrabajadorData.correo || !newTrabajadorData.contrasena || !newTrabajadorData.rol_id) {
            setErrorMessage('Por favor, completa todos los campos.');
            return;
        }
        if (onCreate) {
            onCreate(newTrabajadorData);
        }
    };

    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader>
                <CModalTitle>Agregar Nuevo Trabajador</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                {successMessage && <CAlert color="success">{successMessage}</CAlert>}

                <div className="mb-3">
                    <label htmlFor="newCorreo" className="form-label">Correo:</label>
                    <CFormInput
                        type="email" id="newCorreo" value={newTrabajadorData.correo}
                        onChange={(e) => setNewTrabajadorData({...newTrabajadorData, correo: e.target.value})}
                        placeholder="ejemplo@dominio.com"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="newContrasena" className="form-label">Contraseña:</label>
                    <CFormInput
                        type="password" id="newContrasena" value={newTrabajadorData.contrasena}
                        onChange={(e) => setNewTrabajadorData({...newTrabajadorData, contrasena: e.target.value})}
                        placeholder="Contraseña inicial"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="newRole" className="form-label">Rol:</label>
                    <CFormSelect
                        id="newRole"
                        value={newTrabajadorData.rol_id}
                        onChange={(e) => setNewTrabajadorData({...newTrabajadorData, rol_id: parseInt(e.target.value)})} // Mantener parseInt
                    >
                        <option value="">Selecciona un Rol</option>
                        {roles.map((rol) => (
                            <option key={rol.id} value={rol.id}> {/* rol.id es INTEGER */}
                                {rol.nombre}
                            </option>
                        ))}
                    </CFormSelect>
                </div>
                <div className="mb-3">
                    <CFormCheck
                        id="newEstado" label="Activo" checked={newTrabajadorData.estado}
                        onChange={(e) => setNewTrabajadorData({...newTrabajadorData, estado: e.target.checked})}
                    />
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>Cancelar</CButton>
                <CButton color="primary" onClick={handleInternalCreate} disabled={loading}>
                    {loading ? <CSpinner size="sm" /> : 'Crear Trabajador'}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default CreateTrabajadorModal;