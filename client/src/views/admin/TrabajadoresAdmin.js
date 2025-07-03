// client/src/views/admin/TrabajadoresAdmin.js
import React, { useState, useEffect } from 'react';
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormCheck,
} from '@coreui/react';
// La ruta es correcta según tus imágenes
import { useAuth } from '../../../../src/contexts/authcontexts.js'; 

const TrabajadoresAdmin = () => {
  const { user: currentUser } = useAuth(); 
  const [trabajadores, setTrabajadores] = useState([]);
  const [roles, setRoles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Estos console.log ya confirmaron que el rol es 'superusuario'
  console.log('CurrentUser en TrabajadoresAdmin:', currentUser);
  if (currentUser) {
    console.log('Rol del CurrentUser:', currentUser.role);
  }

  // Estado para el modal de edición
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTrabajador, setSelectedTrabajador] = useState(null);
  const [editedRole, setEditedRole] = useState(''); // ID del rol
  const [editedEstado, setEditedEstado] = useState(true); // true para 'activo', false para 'inactivo'

  useEffect(() => {
    // Solo si el usuario es superusuario, carga los datos
    if (currentUser && currentUser.role === 'superusuario') { // <--- ¡CAMBIADO AQUÍ!
      fetchTrabajadores();
      fetchRoles();
    } else {
      // Si no es superusuario, establece el error de permisos y detiene la carga
      setError('No tienes permisos para ver esta sección.');
      setLoading(false);
    }
  }, [currentUser]); // Dependencia en currentUser para reaccionar a cambios de usuario/rol

  const fetchTrabajadores = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/trabajadores', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTrabajadores(data);
      } else {
        const errData = await response.json();
        // Si el backend envía un 403 por falta de permisos, lo manejamos aquí
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
  };

  const fetchRoles = async () => {
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
  };

  const handleEditClick = (trabajador) => {
    setSelectedTrabajador(trabajador);
    setEditedRole(trabajador.rol_id); 
    setEditedEstado(trabajador.estado === 'activo'); 
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedTrabajador) return;

    setLoading(true);
    setSuccessMessage('');
    setError('');

    try {
      const response = await fetch(`/api/admin/trabajadores/${selectedTrabajador.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rol_id: editedRole,
          estado: editedEstado ? 'activo' : 'inactivo', 
        }),
      });

      if (response.ok) {
        setSuccessMessage('Trabajador actualizado exitosamente.');
        fetchTrabajadores(); 
        setIsModalVisible(false);
      } else {
        const errData = await response.json();
        setError(errData.message || 'Error al actualizar trabajador.');
      }
    } catch (err) {
      console.error('Error updating trabajador:', err);
      setError('Error de conexión al actualizar trabajador.');
    } finally {
      setLoading(false);
    }
  };

  // Esto maneja el estado de carga si el usuario es superusuario
  if (loading && currentUser && currentUser.role === 'superusuario') {
    return (
      <CContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <CSpinner color="primary" />
        <p className="ms-2">Cargando trabajadores...</p>
      </CContainer>
    );
  }

  // Si no hay usuario o el rol NO es 'superusuario', muestra el mensaje de alerta de permisos.
  if (!currentUser || currentUser.role !== 'superusuario') { // <--- ¡CAMBIADO AQUÍ!
      return (
          <CContainer className="mt-4">
              <CAlert color="warning">No tienes permiso para acceder a esta página.</CAlert>
          </CContainer>
      );
  }

  // Este `if` se ejecutará si `error` es verdadero y NO es el mensaje de permisos inicial.
  // Por ejemplo, si hay un error de red o de backend después de verificar los permisos.
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
              {successMessage && <CAlert color="success">{successMessage}</CAlert>}
              {/* Aquí se mostraría el mensaje de error si, por ejemplo, el fetch falló después de los permisos */}
              {error && <CAlert color="danger">{error}</CAlert>} 

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

      {/* Modal de Edición */}
      <CModal visible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Editar Trabajador</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTrabajador && (
            <>
              <p>
                <strong>ID:</strong> {selectedTrabajador.id}
              </p>
              <p>
                <strong>Correo:</strong> {selectedTrabajador.correo}
              </p>
              <div className="mb-3">
                <label htmlFor="selectRole" className="form-label">Rol:</label>
                <CFormSelect
                  id="selectRole"
                  value={editedRole}
                  onChange={(e) => setEditedRole(parseInt(e.target.value))} 
                >
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre} {/* Cambiado de `rol.nombre` a `rol.nombre_rol` si tu API devuelve así */}
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
          <CButton color="secondary" onClick={() => setIsModalVisible(false)}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={handleSaveEdit} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Guardar Cambios'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default TrabajadoresAdmin;