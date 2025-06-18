// src/views/pages/login/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

// *** Importa tu hook useAuth ***
import { useAuth } from '../../../../../src/contexts/authcontexts.js'; 

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login: authLogin, checkLoginStatus } = useAuth(); // <-- Usa el hook de tu AuthContext

 const handleLogin = async (e) => {
  e.preventDefault();

  setError('');
  setLoading(true);

  try {
    const response = await fetch('/api/login', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, contraseña: contrasena }),
      
    });

      if (response.ok) { 
        const data = await response.json();
        console.log('Inicio de sesión exitoso:', data);
        
        // *** 1. Actualiza el estado de autenticación a través del AuthContext ***
        authLogin(data.user); // Asume que tu backend devuelve { user: { id, correo } }

        // *** 2. Redirige al dashboard ***
        navigate('/dashboard'); 
        
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error en el inicio de sesión.');
        // Opcional: Si el login falla, asegúrate de que el estado de autenticación se reinicie
        // (Aunque en este punto, el AuthContext debería estar en 'no autenticado' por defecto)
      }
    } catch (err) {
      console.error('Error de red o de la solicitud:', err);
      setError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}> 
                    <h1>Login</h1>
                    <p className="text-body-secondary">Inicia sesión en tu cuenta</p>

                    {error && <CAlert color="danger">{error}</CAlert>}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        placeholder="Correo electrónico" 
                        autoComplete="email" 
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required 
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required 
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit" disabled={loading}>
                          {loading ? <CSpinner size="sm" aria-hidden="true" className="me-2" /> : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          ¿Olvidaste tu contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Registrarse</h2>
                    <p>
                      Si aún no tienes una cuenta, regístrate para acceder a todas las funcionalidades.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        ¡Regístrate ahora!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;