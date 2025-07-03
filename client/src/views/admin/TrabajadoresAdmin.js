import React, { useState, useEffect, useCallback } from 'react';
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CSpinner,
    CAlert,
} from '@coreui/react';
import { useAuth } from '../../../../src/contexts/authcontexts.js';
import EditTrabajadorModal from './EditTrabajadorModal.js';
import CreateTrabajadorModal from './CreateTrabajadorModal.js'; // Importar el modal de creación

const TrabajadoresAdmin = () => {
    const { user: currentUser } = useAuth();
    const [trabajadores, setTrabajadores] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Estado para el modal de edición
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedTrabajador, setSelectedTrabajador] = useState(null);

    // Estado para el modal de creación
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    // Consolidar mensajes de error/éxito para ambos modales
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');


    const fetchTrabajadores = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/admin/trabajadores', {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const data = await response.json();
                setTrabajadores(data);
            } else {
                const errData = await response.json();
                if (response.status === 403) {
                    setError('Acceso denegado en el servidor para trabajadores.');
                } else {
                    setError(errData.message || 'Error al cargar trabajadores.');
                }
            }
        } catch (err) {
            console.error('Error fetching trabajadores:', err);
            setError('Error de conexión al cargar trabajadores.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await fetch('/api/roles');
            if (response.ok) {
                const data = await response.json();
                setRoles(data);
            } else {
                const errData = await response.json();
                setError(errData.message || 'Error al cargar roles disponibles.');
            }
        } catch (err) {
            console.error('Error fetching roles:', err);
            setError('Error de conexión al cargar roles disponibles.');
        }
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.role === 'superusuario') {
            fetchTrabajadores();
            fetchRoles();
        } else {
            setError('No tienes permisos para ver esta sección.');
            setLoading(false);
        }
    }, [currentUser, fetchTrabajadores, fetchRoles]);


    const handleEditClick = (trabajador) => {
        setSelectedTrabajador(trabajador);
        setIsEditModalVisible(true);
        setModalError(''); // Limpiar errores previos del modal
        setModalSuccess(''); // Limpiar éxitos previos del modal
    };

    // Función para manejar el guardado desde el modal de edición
    const handleSaveEditedTrabajador = async (id, updatedData) => {
        setLoading(true); // Puedes usar un loading específico para el modal si no quieres afectar la tabla
        setModalError('');
        setModalSuccess('');

        try {
            const response = await fetch(`/api/admin/trabajadores/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const responseData = await response.json(); // Obtener la respuesta del backend
                setModalSuccess(responseData.message || 'Trabajador actualizado exitosamente.');

                // Actualización directa del estado `trabajadores`
                setTrabajadores(prevTrabajadores => {
                    return prevTrabajadores.map(trabajador =>
                        trabajador.id === id
                            ? {
                                  ...trabajador,
                                  rol_id: responseData.trabajador.rol_id,
                                  estado: responseData.trabajador.estado,
                                  role: responseData.trabajador.role // Asume que el backend envía el nombre del rol
                              }
                            : trabajador
                    );
                });

                // Reducir el setTimeout para un cierre más rápido
                setTimeout(() => {
                    setIsEditModalVisible(false);
                    setModalSuccess(''); // Limpiar el mensaje de éxito después de cerrar
                }, 500); // 0.5 segundos

            } else {
                const errData = await response.json();
                setModalError(errData.message || 'Error al actualizar trabajador.');
            }
        } catch (err) {
            console.error('Error updating trabajador:', err);
            setModalError('Error de conexión al actualizar trabajador.');
        } finally {
            setLoading(false); // Restablecer el loading después de la operación
        }
    };


    // Nueva función para manejar la creación desde el modal de creación
    const handleCreateNewTrabajador = async (newTrabajadorData) => {
        setLoading(true); // Puedes usar un loading específico para el modal
        setModalError('');
        setModalSuccess('');

        try {
            const response = await fetch('/api/admin/trabajadores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTrabajadorData),
            });

            if (response.ok) {
                const responseData = await response.json();
                setModalSuccess(responseData.message || 'Trabajador creado exitosamente.');

                // *** CAMBIO CLAVE AQUÍ: Añadir directamente el nuevo trabajador al estado ***
                // Asegúrate que responseData.trabajador ya contiene 'role' (nombre del rol)
                // como se discutió en el Paso 3 de la respuesta anterior.
                const newTrabajadorWithRole = {
                    ...responseData.trabajador,
                    // Si el backend NO devuelve 'role', búscalo en el estado `roles`
                    role: roles.find(r => r.id === responseData.trabajador.rol_id)?.nombre || 'Desconocido'
                };

                setTrabajadores(prevTrabajadores => [...prevTrabajadores, newTrabajadorWithRole]);

                // Reducir el setTimeout para un cierre más rápido
                setTimeout(() => {
                    setIsCreateModalVisible(false);
                    setModalSuccess(''); // Limpiar el mensaje de éxito después de cerrar
                }, 500); // 0.5 segundos

            } else {
                const errData = await response.json();
                setModalError(errData.message || 'Error al crear trabajador.');
            }
        } catch (err) {
            console.error('Error creando trabajador:', err);
            setModalError('Error de conexión al crear trabajador.');
        } finally {
            setLoading(false); // Restablecer el loading después de la operación
        }
    };

    if (loading && currentUser && currentUser.role === 'superusuario') {
        return (
            <CContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <CSpinner color="primary" />
                <p className="ms-2">Cargando trabajadores...</p>
            </CContainer>
        );
    }

    if (!currentUser || currentUser.role !== 'superusuario') {
        return (
            <CContainer className="mt-4">
                <CAlert color="warning">No tienes permiso para acceder a esta página.</CAlert>
            </CContainer>
        );
    }

    if (error && error !== 'No tienes permisos para ver esta sección.') {
        return (
            <CContainer className="mt-4">
                <CAlert color="danger">{error}</CAlert>
            </CContainer>
        );
    }

    return (
        <CContainer className="mt-4">
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Gestión de Trabajadores</strong>
                        </CCardHeader>
                        <CCardBody>
                            {/* Puedes mostrar modalError/modalSuccess aquí o dentro de los modales */}
                            {modalSuccess && <CAlert color="success">{modalSuccess}</CAlert>}
                            {modalError && <CAlert color="danger">{modalError}</CAlert>}

                            {/* Botón para abrir el modal de creación */}
                            <CButton color="primary" className="mb-3" onClick={() => {
                                setIsCreateModalVisible(true);
                                setModalError(''); // Limpiar mensajes al abrir
                                setModalSuccess('');
                            }}>
                                Agregar Nuevo Trabajador
                            </CButton>

                            <CTable hover responsive className="text-nowrap">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                        <CTableHeaderCell>ID</CTableHeaderCell>
                                        <CTableHeaderCell>Correo</CTableHeaderCell>
                                        <CTableHeaderCell>Rol</CTableHeaderCell>
                                        <CTableHeaderCell>Estado</CTableHeaderCell>
                                        <CTableHeaderCell>Acciones</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {trabajadores.length === 0 && !loading && !error ? (
                                        <CTableRow>
                                            <CTableDataCell colSpan="6" className="text-center">
                                                No hay trabajadores registrados.
                                            </CTableDataCell>
                                        </CTableRow>
                                    ) : (
                                        trabajadores.map((trabajador, index) => (
                                            <CTableRow key={trabajador.id}>
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>{trabajador.id}</CTableDataCell>
                                                <CTableDataCell>{trabajador.correo}</CTableDataCell>
                                                <CTableDataCell>{trabajador.role}</CTableDataCell>
                                                <CTableDataCell>{trabajador.estado === 'activo' ? 'Activo' : 'Inactivo'}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CButton color="info" size="sm" onClick={() => handleEditClick(trabajador)}>
                                                        Editar
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    )}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Renderizar el modal de edición */}
            <EditTrabajadorModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                trabajador={selectedTrabajador}
                roles={roles}
                onSave={handleSaveEditedTrabajador}
                loading={loading} // Pasar el estado de loading para deshabilitar botones
                errorMessage={modalError}
                successMessage={modalSuccess}
                setErrorMessage={setModalError}
                setSuccessMessage={setModalSuccess}
            />

            {/* Renderizar el modal de creación */}
            <CreateTrabajadorModal
                visible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                roles={roles}
                onCreate={handleCreateNewTrabajador}
                loading={loading} // Pasar el estado de loading para deshabilitar botones
                errorMessage={modalError}
                successMessage={modalSuccess}
                setErrorMessage={setModalError}
                setSuccessMessage={setModalSuccess}
            />
        </CContainer>
    );
};

export default TrabajadoresAdmin;