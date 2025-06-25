import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
import '../assets/css/AppHeader.css' 

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0 app-header" ref={headerRef}>
      <CContainer className="border-bottom px-4 text-white" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          className="header-toggler"
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        
        <CHeaderNav style={{ color: 'white' }}>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 vr-divider"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false} className="dropdown-toggle">
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu className="dropdown-menu">
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center dropdown-item"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center dropdown-item"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center dropdown-item"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 vr-divider"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4 app-header" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader