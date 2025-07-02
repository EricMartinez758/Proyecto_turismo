import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPeople,
  cibReadTheDocs,
  cilCart,
  cibEventStore,
  cilSync,
  cilCarAlt, // Mantengo este aunque no se use en el nuevo item, por si lo usas en otro lado
  cilBriefcase, // Icono para "Trabajadores"
  cilShieldAlt // Icono para "Administración" (opcional, si quieres un icono para el título)
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

import '../src/assets/css/AppSidebar.css'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Personas',
  },
  {
    component: CNavItem,
    name: 'Personal',
    to: '/personas/personal/',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Clientes',
    to: '/personas/clientes/',
    icon: <CIcon icon={cibReadTheDocs} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Experiencias',
  },
  {
    component: CNavItem,
    name: 'Eventos',
    to: '/eventos/',
    icon: <CIcon icon={cibEventStore} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reservas',
    to: '/reservas/',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tasas',
    to: '/tasas/',
    icon: <CIcon icon={cilSync} customClassName="nav-icon" />,
  },
  // *** NUEVA SECCIÓN: ADMINISTRACIÓN (PARA SUPERUSUARIOS) ***
  {
    component: CNavTitle,
    name: 'Administración',
    role: 'superusuario', // Indicador para la visibilidad condicional
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />, // Icono opcional para el título
  },
  {
    component: CNavItem,
    name: 'Trabajadores',
    to: '/admin/trabajadores', // Nueva ruta para la gestión de trabajadores
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />, // Icono de maletín
    role: 'superusuario', // Indicador para la visibilidad condicional
  },
]

export default _nav