/* eslint-disable no-unused-vars */
import React from 'react'
import '../styles.scss'
import '../../../styles/app.scss'
import { TablePedidos } from './components/table-pedidos'

const SeccionPedidos = props => {
  const { onChangeVisualization: _handleChangeVisualization } = props

  return (
    <div className='contener mt-4'>
      <span onClick={() => _handleChangeVisualization('default')}>
        <i className='fas fa-arrow-left'></i> Atrás
      </span>
      <div>
        <p className='form-control-label table-label text-center'>PEDIDOS GENERADOS</p>
        <TablePedidos/>
      </div>
      <div className='pb-4'>
        <p className='form-control-label table-label text-center'>PEDIDOS ENTREGADOS</p>
        <TablePedidos state='entregado'/>
      </div>
    </div>
  )
}

export { SeccionPedidos }
