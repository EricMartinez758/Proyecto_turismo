import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'


import { CBadge, CNavLink, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/react'
import {CIcon} from '@coreui/icons-react' 


import { useAuth } from '../../../src/contexts/authcontexts.js';


export const AppSidebarNav = ({ items }) => {
  
  const { user } = useAuth();

 
  console.log('AppSidebarNav: User del AuthContext:', user);
  if (user) {
    console.log('AppSidebarNav: Rol del usuario:', user.role);
   }
 

  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  // Modifica navItem para incluir la lógica del rol
  const navItem = (item, index, indent = false) => {
    // *** LÓGICA DE VISIBILIDAD POR ROL AÑADIDA AQUÍ ***
    // Si el ítem tiene una propiedad 'role' y el usuario NO tiene ese rol, no lo renderiza
    if (item.role && (!user || user.role !== item.role)) {
      return null;
    }
    // *************************************************

    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  // Modifica navGroup para incluir la lógica del rol
  const navGroup = (item, index) => {
    // *** LÓGICA DE VISIBILIDAD POR ROL AÑADIDA AQUÍ (para grupos) ***
    // Si el grupo tiene una propiedad 'role' y el usuario NO tiene ese rol, no lo renderiza
    if (item.role && (!user || user.role !== item.role)) {
      return null;
    }
    // ***************************************************************

    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {items?.map((subItem, subIndex) => // Cambiado a subItem, subIndex para claridad
          subItem.items ? navGroup(subItem, subIndex) : navItem(subItem, subIndex, true),
        )}
      </Component>
    )
  }

  // *** AÑADE ESTA FUNCIÓN para manejar los CNavTitle y su visibilidad por rol ***
  const navTitle = (item, index) => {
    if (item.role && (!user || user.role !== item.role)) {
      return null;
    }
    const { component, name, icon, ...rest } = item;
    const Component = component;
    return (
      <Component key={index} {...rest}>
        {navLink(name, icon)}
      </Component>
    );
  };


  // *** MODIFICA ESTA SECCIÓN para usar la función navType ***
  const navType = (item, index) => {
    if (item.component === CNavGroup) {
      return navGroup(item, index);
    }
    if (item.component === CNavItem) {
      return navItem(item, index);
    }
    if (item.component === CNavTitle) { // Maneja los CNavTitle
      return navTitle(item, index);
    }
    return null; // En caso de un tipo de componente no reconocido
  };

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => navType(item, index))} {/* Usa la función navType para el mapeo */}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}