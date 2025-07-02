import React from 'react'
import classNames from 'classnames'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'
import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'

const Dashboard = () => {
  // Datos de ejemplo para el dashboard de reservas
  const progressExample = [
    { title: 'Reservas totales', value: '1,245 Reservas', percent: 100, color: 'success' },
    { title: 'Ocupación actual', value: '78%', percent: 78, color: 'info' },
    { title: 'Cancelaciones', value: '5.2%', percent: 5.2, color: 'warning' },
    { title: 'Nuevos clientes', value: '123 Usuarios', percent: 32, color: 'danger' },
    { title: 'Satisfacción', value: '4.8/5', percent: 96, color: 'primary' },
  ]

  const ratesExample = [
    { currency: 'Dólares (USD)', rate: '1 USD', change: '+0.0%' },
    { currency: 'Bolivares (Bs)', rate: '6.96 BS', change: '+0.1%' },
    { currency: 'Euros (EUR)', rate: '0.92 EUR', change: '-0.2%' },
  ]

  const revenueData = [
    { title: 'Ingresos totales', value: '$24,560', percent: 18, color: 'success' },
    { title: 'Ingresos mensuales', value: '$8,320', percent: 12, color: 'info' },
    { title: 'Ingresos diarios', value: '$1,240', percent: 8, color: 'primary' },
  ]

  const bookingsByDay = [
    { day: 'Lunes', bookings: 45 },
    { day: 'Martes', bookings: 68 },
    { day: 'Miércoles', bookings: 72 },
    { day: 'Jueves', bookings: 89 },
    { day: 'Viernes', bookings: 124 },
    { day: 'Sábado', bookings: 156 },
    { day: 'Domingo', bookings: 98 },
  ]

 const recurrentUsers = [
  {
    avatar: { src: avatar1, status: 'success' },
    user: {
      name: 'Juan Pérez',
      registered: 'Ene 15, 2023',
    },
    lastBooking: 'Ayer',
    totalSpent: '$1,245',
  },
  {
    avatar: { src: avatar2, status: 'danger' },
    user: {
      name: 'María Gómez',
      registered: 'Feb 3, 2023',
    },
    lastBooking: 'Hace 3 días',
    totalSpent: '$890',
  },
  {
    avatar: { src: avatar3, status: 'warning' },
    user: {
      name: 'Carlos López',
      registered: 'Mar 20, 2023',
    },
    lastBooking: 'Hace 1 semana',
    totalSpent: '$1,560',
  },
  {
    avatar: { src: avatar4, status: 'info' },
    user: {
      name: 'Ana Torres',
      registered: 'Abr 10, 2023',
    },
    lastBooking: 'Hace 2 semanas',
    totalSpent: '$2,300',
  },
  {
    avatar: { src: avatar5, status: 'secondary' },
    user: {
      name: 'Luis Martínez',
      registered: 'May 5, 2023',
    },
    lastBooking: 'Hace 1 mes',
    totalSpent: '$1,100',
  },
 
];

  return (
    <>
      {/* Widgets superiores */}
      <WidgetsDropdown className="mb-4" />
      
      {/* Tarjeta principal con gráfica de reservas */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="bookings" className="card-title mb-0">
                Reservas por día
              </h4>
              <div className="small text-body-secondary">Últimos 7 días</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Día', 'Semana', 'Mes'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Semana'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} {item.percent && `(${item.percent}%)`}
                </div>
                {item.percent && <CProgress thin className="mt-2" color={item.color} value={item.percent} />}
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>

      {/* Tarjeta de tasas de cambio */}
      <CCard className="mb-4">
        <CCardHeader>Tasas de cambio del día</CCardHeader>
        <CCardBody>
          <CRow>
            {ratesExample.map((rate, index) => (
              <CCol md={4} key={index}>
                <div className="border-start border-start-4 border-start-info py-1 px-3 mb-3">
                  <div className="text-body-secondary text-truncate small">{rate.currency}</div>
                  <div className="fs-5 fw-semibold">{rate.rate}</div>
                  <div className="small text-body-secondary">{rate.change}</div>
                </div>
              </CCol>
            ))}
          </CRow>
        </CCardBody>
      </CCard>

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Reservas {' & '} Ingresos</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">Reservas hoy</div>
                        <div className="fs-5 fw-semibold">24</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Ingresos hoy
                        </div>
                        <div className="fs-5 fw-semibold">$1,240</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                  <h6 className="mb-3">Reservas por día de la semana</h6>
                  {bookingsByDay.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-body-secondary small">{item.day}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={(item.bookings / 156) * 100} />
                      </div>
                      <div className="ms-auto fw-semibold">{item.bookings}</div>
                    </div>
                  ))}
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    {revenueData.map((item, index) => (
                      <CCol xs={index === 0 ? 12 : 6} key={index}>
                        <div className={`border-start border-start-4 border-start-${item.color} py-1 px-3 mb-3`}>
                          <div className="text-body-secondary text-truncate small">{item.title}</div>
                          <div className="fs-5 fw-semibold">{item.value}</div>
                          <div className="small text-body-secondary">+{item.percent}% respecto al mes pasado</div>
                        </div>
                      </CCol>
                    ))}
                  </CRow>
                  <hr className="mt-0" />
                  <h6 className="mb-3">Tendencias temporales</h6>
                  <div className="progress-group mb-4">
                    <div className="progress-group-header">
                      <span>Mañana</span>
                      <span className="ms-auto fw-semibold">18 reservas</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="warning" value={45} />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-header">
                      <span>Esta semana</span>
                      <span className="ms-auto fw-semibold">86 reservas</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="warning" value={70} />
                    </div>
                  </div>
                  <div className="progress-group">
                    <div className="progress-group-header">
                      <span>Próximo mes</span>
                      <span className="ms-auto fw-semibold">342 reservas</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="warning" value={85} />
                    </div>
                  </div>
                </CCol>
              </CRow>
              <br />
            

<h6 className="mb-3">Usuarios recurrentes</h6>
<CTable align="middle" className="mb-0 border" hover responsive>
  <CTableHead className="text-nowrap">
    <CTableRow>
      <CTableHeaderCell className="bg-body-tertiary text-center">
        <CIcon icon={cilPeople} />
      </CTableHeaderCell>
      <CTableHeaderCell className="bg-body-tertiary">Usuario</CTableHeaderCell>
      <CTableHeaderCell className="bg-body-tertiary">Última reserva</CTableHeaderCell>
      <CTableHeaderCell className="bg-body-tertiary text-center">
        Total gastado
      </CTableHeaderCell>
    </CTableRow>
  </CTableHead>
  <CTableBody>
    {recurrentUsers.map((item, index) => (
      <CTableRow key={index}>
        <CTableDataCell className="text-center">
          <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
        </CTableDataCell>
        <CTableDataCell>
          <div>{item.user.name}</div>
          <div className="small text-body-secondary text-nowrap">
            Registrado: {item.user.registered}
          </div>
        </CTableDataCell>
        <CTableDataCell>
          <div className="fw-semibold text-nowrap">{item.lastBooking}</div>
        </CTableDataCell>
        <CTableDataCell className="text-center">
          <div className="fw-semibold">{item.totalSpent}</div>
        </CTableDataCell>
      </CTableRow>
    ))}
  </CTableBody>
</CTable>


            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard