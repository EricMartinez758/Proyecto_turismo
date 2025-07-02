import React from 'react'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CProgress,
  CRow,
  CWidgetStatsA,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilCalendar, cilDollar } from '@coreui/icons'

const WidgetsDropdown = () => {
  return (
    <CRow>
      {/* Widget: Usuarios en la página */}
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={
            <>
              1,248{' '}
              <span className="fs-6 fw-normal">
                (-12.4% <CIcon icon={cilPeople} />)
              </span>
            </>
          }
          title="Usuarios en línea"
        />
      </CCol>

      {/* Widget: Ingresos diarios */}
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-4"
          color="info"
          value={
            <>
              $1,240{' '}
              <span className="fs-6 fw-normal">
                (+24.8% <CIcon icon={cilDollar} />)
              </span>
            </>
          }
          title="Ingresos diarios"
          
          
        />
      </CCol>

      {/* Widget: Reservas diarias */}
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-4"
          color="danger"
          value={
            <>
              24{' '}
              <span className="fs-6 fw-normal">
                (+8.3% <CIcon icon={cilCalendar} />)
              </span>
            </>
          }
          title="Reservas hoy"
         
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown