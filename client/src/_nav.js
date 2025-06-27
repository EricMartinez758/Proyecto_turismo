import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPeople,
  cibReadTheDocs,
  cilCart,
  cibEventStore,
  cilCarAlt
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
  }
 

]

export default _nav
