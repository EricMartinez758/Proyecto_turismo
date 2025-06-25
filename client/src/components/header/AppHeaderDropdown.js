import React from 'react';
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilUser,
  cilAccountLogout,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';

import avatar8 from './../../assets/images/avatars/8.jpg';


import { useAuth } from '../../../../src/contexts/authcontexts.js'; 
import { useNavigate } from 'react-router-dom';

const AppHeaderDropdown = () => {
  const { logout, isAuthenticated } = useAuth(); 
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await logout(); 
      navigate('/login'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
    }
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
          {isAuthenticated ? ( 
          <CDropdownItem onClick={handleLogout}>
            <CIcon icon={cilAccountLogout} className="me-2" />
            Logout
          </CDropdownItem>
        ) : ( // Opcional: mostrar Login si no está autenticado
          <CDropdownItem onClick={() => navigate('/login')}>
            <CIcon icon={cilUser} className="me-2" /> {}
            Login
          </CDropdownItem>
        )}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;