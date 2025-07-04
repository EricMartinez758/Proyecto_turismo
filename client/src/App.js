// src/App.js
import React, { Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Si usas Redux
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import './scss/examples.scss';

// Importa tu hook useAuth
import { useAuth } from '../../src/contexts/authcontexts.js'; 

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
//const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);

  // *** Obtén el estado de autenticación de tu AuthContext ***
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* Rutas públicas (accesibles sin login) */}
          <Route exact path="/login" name="Login Page" element={<Login />} />
          {/*<Route exact path="/register" name="Register Page" element={<Register />} />*/}
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />

          {/* Ruta principal (/*) para manejar la lógica de autenticación y redirección.
            Esta es la lógica clave para la redirección al dashboard.
          */}
          <Route
            path="/*" // Coincide con cualquier ruta que no haya sido capturada por las anteriores
            element={
              // Si el contexto de autenticación aún está cargando (verificando la sesión inicial), muestra un spinner
              authLoading ? (
                <div className="pt-3 text-center">
                  <CSpinner color="primary" variant="grow" />
                </div>
              ) : 
              // Si ya terminó de cargar y el usuario está autenticado, muestra el DefaultLayout
              isAuthenticated ? (
                <DefaultLayout />
              ) : (
                // Si no está autenticado, redirige al login
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;