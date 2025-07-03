import React, { useState, useEffect } from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CFormSelect,
    CFormCheck,
    CSpinner,
    CAlert
} from '@coreui/react';

// Este componente recibirá props para controlar su visibilidad, datos, etc.
const EditTrabajadorModal = ({
    visible,
    onClose,
    trabajador, // El trabajador seleccionado para editar
    roles, // La lista de roles disponibles
    onSave, // Función para guardar los cambios (pasada desde el padre)
    loading, // Estado de carga para el botón de guardar
    successMessage, // Mensaje de éxito
    errorMessage, // Mensaje de error
    setErrorMessage, // Función para resetear mensaje de error si es necesario
    setSuccessMessage // Función para resetear mensaje de éxito
}) => {
    // Estados internos del modal para los campos editables
    const [editedRole, setEditedRole] = useState('');
    const [editedEstado, setEditedEstado] = useState(true);

    // Cuando el `trabajador` o `visible` cambian, actualiza los estados internos del modal
    useEffect(() => {
        if (trabajador) {
            setEditedRole(trabajador.rol_id);
            setEditedEstado(trabajador.estado === 'activo');
        }
        // Limpiar mensajes al abrir/cambiar trabajador
        setErrorMessage('');
        setSuccessMessage('');
    }, [trabajador, visible, setErrorMessage, setSuccessMessage]);

    const handleInternalSave = () => {
        // Llama a la función onSave que viene del componente padre (TrabajadoresAdmin)
        // Pasa el ID del trabajador y los datos actualizados
        if (onSave) {
            onSave(trabajador.id, {
                rol_id: editedRole,
                estado: editedEstado ? 'activo' : 'inactivo',
            });
        }
    };

    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader>
                <CModalTitle>Editar Trabajador</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {/* Mostrar mensajes de error/éxito dentro del modal */}
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                {successMessage && <CAlert color="success">{successMessage}</CAlert>}

                {trabajador && (
                    <>
                        <p>
                            <strong>ID:</strong> {trabajador.id}
                        </p>
                        <p>
                            <strong>Correo:</strong> {trabajador.correo}
                        </p>
                        <div className="mb-3">
                            <label htmlFor="selectRole" className="form-label">Rol:</label>
                            <CFormSelect
                                id="selectRole"
                                value={editedRole}
                                onChange={(e) => setEditedRole(parseInt(e.target.value))}
                            >
                                {/* Opción por defecto para seleccionar */}
                                <option value="">Selecciona un Rol</option>
                                {roles.map((rol) => (
                                    <option key={rol.id} value={rol.id}>
                                        {rol.nombre} {/* Asegúrate que sea `rol.nombre` o `rol.nombre_rol` */}
                                    </option>
                                ))}
                            </CFormSelect>
                        </div>
                        <div className="mb-3">
                            <CFormCheck
                                id="checkboxEstado"
                                label="Activo"
                                checked={editedEstado}
                                onChange={(e) => setEditedEstado(e.target.checked)}
                            />
                        </div>
                    </>
                )}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Cerrar
                </CButton>
                <CButton color="primary" onClick={handleInternalSave} disabled={loading}>
                    {loading ? <CSpinner size="sm" /> : 'Guardar Cambios'}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default EditTrabajadorModal;