/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import cuadraturaService from '../../../_services/cuadratura'
import '../styles.scss'
import '../../../styles/app.scss'
import { Tab, Tabs } from 'react-bootstrap'
import { DetalleCuadratura } from './components/detalle-cuadratura'

const SeccionCaja = props => {
  const [tabSelected, setTabSelected] = useState('actual')
  const [actual, setActual] = useState(null)
  const [last, setLast] = useState(null)
  const { onChangeVisualization: _handleChangeVisualization } = props
  const user = JSON.parse(localStorage.getItem('user'))

  const _handleGetActualCuadratura = async () => {
    const response = await cuadraturaService.getActual(user.rut)
    setActual(response)
  }
  const _handleGetLastCuadratura = async () => {
    const response = await cuadraturaService.getLast(user.rut)
    setLast(response)
  }

  const _handleRefresh = () => {
    _handleGetActualCuadratura()
    _handleGetLastCuadratura()
  }

  useEffect(() => {
    _handleRefresh()
  }, [])

  return (
    <div className='contener mt-4'>
      <span onClick={() => _handleChangeVisualization('default')}>
        <i className='fas fa-arrow-left'></i> Atrás
      </span>
      <div className='bg-white mt-4'>
        <Tabs
          activeKey={tabSelected}
          className='mb-3 tabs-cuadratura'
          color='primary'
          id='controlled-tab-example'
          variant='tabs'
          onSelect={k => setTabSelected(k)}
        >
          <Tab eventKey='actual' title='ACTUAL CUADRATURA'>
            <DetalleCuadratura cuadratura={actual} tipoCuadratura='actual' onRefresh={_handleRefresh}/>
          </Tab>
          <Tab eventKey='last' title='ULTIMA CUADRATURA'>
            <DetalleCuadratura cuadratura={last} tipoCuadratura='last'/>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export { SeccionCaja }
