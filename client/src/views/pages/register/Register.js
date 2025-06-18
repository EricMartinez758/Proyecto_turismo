import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useAuth } from '../../../../../src/contexts/authcontexts.js'; 
import { useNavigate } from 'react-router-dom'; // Para la navegación

const Register = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Para mostrar errores al usuario
  const [successMessage, setSuccessMessage] = useState(''); // Para mostrar mensaje de éxito

  const { login } = useAuth(); // Obtenemos la función login del contexto
  const navigate = useNavigate(); // Hook para la navegación

  const handleRegister = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    setErrorMessage(''); // Limpiar errores anteriores
    setSuccessMessage(''); // Limpiar mensajes de éxito anteriores

    // Validaciones básicas del lado del cliente
    if (!correo || !contrasena || !confirmContrasena) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    if (contrasena !== confirmContrasena) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('/api/register', { // URL relativa gracias al proxy
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contraseña: contrasena }), // Envía correo y contraseña
      });

      const data = await response.json(); // Parsea la respuesta JSON

      if (response.ok) {
        setSuccessMessage(data.message || 'Registro exitoso.');
        // Si el registro fue exitoso y el backend envió la cookie,
        // necesitamos que el AuthContext sepa que el usuario está logueado.
        // La función `login` de tu AuthContext simplemente establece el estado `isAuthenticated` y `user`.
        // El backend en `register` ya está enviando la cookie y el `user` object.
        // Lo ideal sería que el `AuthContext` tenga una función para "establecer la sesión"
        // que también pueda ser llamada desde aquí, o simplemente llamar a `login` del contexto
        // con los datos del usuario.

        login(data.user); // Llama a la función login del AuthContext con los datos del usuario

        // Redirige al usuario al dashboard o a la página principal
        navigate('/dashboard'); // Ajusta esta ruta si tu dashboard está en otra URL
      } else {
        // Manejar errores de la respuesta del backend
        setErrorMessage(data.message || 'Error en el registro.');
      }
    } catch (error) {
      console.error('Error de red o del servidor:', error);
      setErrorMessage('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}> {/* Asociamos la función al evento onSubmit */}
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>

                  {/* Campo de Correo (anteriormente Username, ya que tu backend solo pide correo) */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Correo electrónico"
                      autoComplete="email"
                      type="email" // Importante para validación de email
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Campo de Contraseña */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
                      autoComplete="new-password"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Campo de Repetir Contraseña */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repetir Contraseña"
                      autoComplete="new-password"
                      value={confirmContrasena}
                      onChange={(e) => setConfirmContrasena(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Mensajes de error o éxito */}
                  {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="alert alert-success" role="alert">
                      {successMessage}
                    </div>
                  )}

                  <div className="d-grid">
                    {/* El botón ahora es type="submit" para que onSubmit se dispare */}
                    <CButton color="success" type="submit">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;