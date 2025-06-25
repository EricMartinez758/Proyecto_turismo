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
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/Login.css'; 

const Register = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigatingToLogin, setIsNavigatingToLogin] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!correo || !contrasena || !confirmContrasena) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    if (contrasena !== confirmContrasena) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contraseña: contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Registro exitoso.');
        login(data.user);
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message || 'Error en el registro.');
      }
    } catch (error) {
      console.error('Error de red o del servidor:', error);
      setErrorMessage('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    setIsNavigatingToLogin(true);
    // Animación de 1.5 segundos antes de redirigir
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="custom-login-container">
      {/* Overlay de navegación a login */}
      {isNavigatingToLogin && (
        <div className="navigation-overlay">
          <div className="navigation-spinner">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Redirigiendo a Inicio de Sesión...</p>
          </div>
        </div>
      )}

      {/* Overlay de registro */}
      {isLoading && (
        <div className="register-loading-overlay">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Procesando registro...</p>
        </div>
      )}

      <CRow className="justify-content-center g-0">
        <CCol  md={9} lg={8} xl={7}>
          <CRow className="g-0">
            <CCol md={6}>
              <CCard className="custom-login-card rounded-0 end-0">
                <CCardBody className="custom-login-form">
                  <h1 className="custom-login-title">Registro</h1>
                  <p className="custom-login-subtitle">Crea tu cuenta</p>
                  
                  <CForm onSubmit={handleRegister}>
                    {/* Campos del formulario... (mantener igual que antes) */}
                    <CInputGroup className="custom-input-group mb-4">
                      <CInputGroupText className="custom-input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        className="custom-form-input"
                        placeholder="Correo electrónico"
                        autoComplete="email"
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CInputGroup className="custom-input-group mb-4">
                      <CInputGroupText className="custom-input-icon">
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        className="custom-form-input"
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="new-password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CInputGroup className="custom-input-group mb-4">
                      <CInputGroupText className="custom-input-icon">
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        className="custom-form-input"
                        type="password"
                        placeholder="Repetir Contraseña"
                        autoComplete="new-password"
                        value={confirmContrasena}
                        onChange={(e) => setConfirmContrasena(e.target.value)}
                        required
                      />
                    </CInputGroup>

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
                      <CButton 
                        color="success" 
                        type="submit" 
                        className="custom-login-btn"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="custom-spinner spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Creando cuenta...
                          </>
                        ) : (
                          'Crear Cuenta'
                        )}
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
            
            <CCol md={6}>
              <CCard className="custom-primary-card h-100 rounded-start-0">
                <CCardBody className="d-flex flex-column justify-content-center align-items-center text-center p-5">
                  <h2 className="custom-register-title">¡Bienvenido!</h2>
                  <p className="custom-register-text">
                    ¿Ya tienes una cuenta? Inicia sesión para acceder a todas las funcionalidades de nuestra plataforma.
                  </p>
                  <CButton 
                    className="custom-register-btn" 
                    onClick={handleNavigateToLogin}
                    disabled={isNavigatingToLogin}
                  >
                    {isNavigatingToLogin ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Redirigiendo...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </div>
  );
};

export default Register;