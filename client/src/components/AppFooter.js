import React from 'react'
import { CFooter } from '@coreui/react'


const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div className="ms-auto">
        <span className="me-1">Derechos reservados a:</span>
        <a href="https://www.youtube.com/watch?v=JpdZyQa7FOw&list=RDJpdZyQa7FOw&start_radio=1&ab_channel=asimetric" target="_blank" rel="noopener noreferrer">
         El Grupo de los Incapaces
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)