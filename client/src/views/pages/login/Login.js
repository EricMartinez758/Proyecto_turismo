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
import { CIcon } from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useAuth } from '../../../../../src/contexts/authcontexts.js';
import '../../../assets/css/Login.css';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [credentials, setCredentials] = useState({
    correo: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!credentials.correo || !credentials.contrasena) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: credentials.correo,
          contraseña: credentials.contrasena
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        
        authLogin(data.user); 
        navigate('/dashboard', { replace: true });
      } else {
        setError(data.message || 'Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error de conexión. Por favor, revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    setRegisterLoading(true);
    setTimeout(() => {
      navigate('/register');
    }, 1500); 
  };

  return (
    <div className="custom-login-container">
      <AnimatePresence>
        {registerLoading && (
          <motion.div
            className="register-loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CSpinner color="primary" size="lg" />
            <p className="mt-3">Redirigiendo al registro...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <CContainer>
        <CRow className="justify-content-end">
          <CCol md={9} lg={8} xl={7}>
            <CCardGroup>
              <CCard className="custom-login-card">
                <CCardBody className="custom-login-form">
                  <CForm onSubmit={handleLogin} noValidate>
                    <h1 className="custom-login-title">Iniciar Sesión</h1>
                    <p className="custom-login-subtitle">
                      Ingresa tus credenciales para acceder a tu cuenta
                    </p>

                    {error && (
                      <CAlert color="danger" className="mb-4">
                        {error}
                      </CAlert>
                    )}

                    <CInputGroup className="custom-input-group">
                      <CInputGroupText className="custom-input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        autoComplete="email"
                        value={credentials.correo}
                        onChange={handleChange}
                        required
                        className="custom-form-input"
                        invalid={isSubmitted && !credentials.correo}
                      />
                    </CInputGroup>

                    <CInputGroup className="custom-input-group">
                      <CInputGroupText className="custom-input-icon">
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="contrasena"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={credentials.contrasena}
                        onChange={handleChange}
                        required
                        className="custom-form-input"
                        invalid={isSubmitted && !credentials.contrasena}
                      />
                    </CInputGroup>

                    <CRow className="mt-4">
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="custom-login-btn"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <CSpinner size="sm" className="custom-spinner" />
                              Cargando...
                            </>
                          ) : (
                            'Iniciar Sesión'
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <Link to="/forgot-password">
                          <CButton color="link" className="custom-forgot-password">
                            ¿Olvidaste tu contraseña?
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
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