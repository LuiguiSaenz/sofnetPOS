/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import '../styles.scss'
import '../../../styles/app.scss'
import { toast } from 'react-toastify'
import { TablePedidos } from './components/table-pedidos'

const SeccionPedidos = props => {
  const { onChangeVisualization: _handleChangeVisualization } = props
  const toastStyle = { position: toast.POSITION.TOP_CENTER }
  const [generatedOrders, setGeneratedOrders] = useState([])
  const [deliveredOrders, setDeliveredOrders] = useState([])
  const [ordersDate, setOrdersDate] = useState(moment().format('YYYY-MM-DD'))
  const [loadingOrders, setLoadingOrders] = useState(false)
  const user = JSON.parse(localStorage.getItem('user'))

  const _handleRefresh = () => {
    _handleGetGeneratedOrders(ordersDate)
    _handleGetDeliveredOrders(ordersDate)
  }

  useEffect(() => {
    _handleRefresh()
  }, [ordersDate])
  
  const _handleGetGeneratedOrders = async dateSelected => {
    setOrdersDate(dateSelected || '')
    if (dateSelected) {
      setLoadingOrders(true)
      return fetch(
        `https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/nupy-cfbnr/service/restaurant/incoming_webhook/web_PedidosByPropietario?propietario=${user.rut}&fecha=${dateSelected}&estado=generado`
      )
        .then(res => res.json())
        .then(res => {
          const newOrders = JSON.parse(res)
          if (newOrders === '[]') {
            setGeneratedOrders([])
            setLoadingOrders(false)
            return
          }
          setGeneratedOrders(newOrders)
          setLoadingOrders(false)
          return
        })
        .catch(error => {
          setLoadingOrders(false)
          toast.error('Ocurrió un problema al realizar esta operación', toastStyle)
        })
    }
  }
  const _handleGetDeliveredOrders = async dateSelected => {
    setOrdersDate(dateSelected || '')
    if (dateSelected) {
      setLoadingOrders(true)
      return fetch(
        `https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/nupy-cfbnr/service/restaurant/incoming_webhook/web_PedidosByPropietario?propietario=${user.rut}&fecha=${dateSelected}&estado=entregado`
      )
        .then(res => res.json())
        .then(res => {
          const newOrders = JSON.parse(res)
          if (newOrders === '[]') {
            setDeliveredOrders([])
            setLoadingOrders(false)
            return
          }
          setDeliveredOrders(newOrders)
          setLoadingOrders(false)
          return
        })
        .catch(error => {
          setLoadingOrders(false)
          toast.error('Ocurrió un problema al realizar esta operación', toastStyle)
        })
    }
  }

  return (
    <div className='contener mt-4'>
      <span onClick={() => _handleChangeVisualization('default')}>
        <i className='fas fa-arrow-left'></i> Atrás
      </span>
      <div className='cuadrobuscador'>
        <label className='form-control-label mb-2 date-label'>FECHA DE VISUALIZACIÓN:</label>
        <input
          className='form-control'
          type='date'
          value={ordersDate}
          onChange={e =>
            setOrdersDate(moment(e.target.value).format('YYYY-MM-DD'))
          }
        />
      </div>
      <div>
        <p className='form-control-label table-label text-center'>PEDIDOS GENERADOS</p>
        {loadingOrders ? (
          <div className='loading3 row justify-content-center'>
            <img alt='loading' src='loading.gif' />
            <p className='text-center'>Cargando...</p>
          </div>
        ) : (
          <TablePedidos orders={generatedOrders} onRefresh={_handleRefresh}/>
        )}
      </div>
      <div className='pb-4'>
        <p className='form-control-label table-label text-center'>PEDIDOS ENTREGADOS</p>
        {loadingOrders ? (
          <div className='loading3 row justify-content-center'>
            <img alt='loading' src='loading.gif' />
            <p className='text-center'>Cargando...</p>
          </div>
        ) : (
          <TablePedidos orders={deliveredOrders}/>
        )}
      </div>
    </div>
  )
}

export { SeccionPedidos }
