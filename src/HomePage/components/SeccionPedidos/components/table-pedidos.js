/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import moment from 'moment'
import '../../styles.scss'
import '../../../../styles/app.scss'
import { Button, Table } from 'react-bootstrap'
import PedidoDetalleModal from '../../pedido-detalle-modal'

const TablePedidos = props => {
  const { state = 'generado' } = props
  const toastStyle = { position: toast.POSITION.BOTTOM_RIGHT }
  const [orders, setOrders] = useState([])
  const [orderSelected, setOrderSelected] = useState(null)
  const [paymentTypes, setPaymentTypes] = useState([])
  const [ordersDate, setOrdersDate] = useState(moment().format('YYYY-MM-DD'))
  const [loadingOrders, setLoadingOrders] = useState(false)
  const user = JSON.parse(localStorage.getItem('user'))

  const _handleGetOrders = async dateSelected => {
    setOrdersDate(dateSelected || '')
    if (dateSelected) {
      setLoadingOrders(true)
      return fetch(
        `https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/nupy-cfbnr/service/restaurant/incoming_webhook/web_PedidosByPropietario?propietario=${user.rut}&fecha=${dateSelected}&estado=${state}`
      )
        .then(res => res.json())
        .then(res => {
          const newOrders = JSON.parse(res)
          if (newOrders === '[]') {
            setOrders([])
            setLoadingOrders(false)
            return
          }
          setOrders(newOrders)
          setLoadingOrders(false)
          return
        })
        .catch(error => {
          setLoadingOrders(false)
          toast.error('Ocurrió un problema al realizar esta operación', toastStyle)
        })
    }
  }

  useEffect(() => {
    _handleGetOrders(moment().format('YYYY-MM-DD'))
  }, [])

  useEffect(() => {
    if (orders.length > 0) {
      const payments = orders.reduce((accPayments, order, index) => {
        const payIndex = accPayments.findIndex(({ name }) => name === order.Adicional.Uno)
        if (payIndex !== -1) {
          const pay = accPayments[payIndex]
          accPayments.splice(payIndex, 1, {
            ...pay,
            ordersQuantity: pay.ordersQuantity + 1,
            totalNeto: pay.totalNeto + (order.Encabezado.MontoNeto || 0),
          })
          return accPayments
        }

        return accPayments.concat({
          name: order.Adicional.Uno,
          ordersQuantity: 1,
          totalNeto: order.Encabezado.MontoNeto || 0,
        })
      }, [])
      setPaymentTypes(payments)
    }
  }, [orders])

  const _handleSendOrder = async () => {
    setLoadingOrders(true)
    const orderId = orderSelected._id
    setOrderSelected(null)
    
    return fetch(
      `https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/nupy-cfbnr/service/restaurant/incoming_webhook/web_EntregarPedido`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({order_id: orderId}),
      }
    )
      .then(() => {
        setLoadingOrders(false)
        setOrders(orders.filter(({ _id }) => _id !== orderId))
        return
      })
      .catch(error => {
        setLoadingOrders(false)
        toast.error('Ocurrió un problema al entregar este pedido', toastStyle)
      })
  }

  return (
    <div className='mt-4 div-table-pedidos'>
      <div className='cuadrobuscador'>
        <label className='form-control-label mb-2 date-label'>FECHA DE VISUALIZACIÓN:</label>
        <input
          className='form-control'
          type='date'
          value={ordersDate}
          onChange={e =>
            _handleGetOrders(e.target.value ? moment(e.target.value).format('YYYY-MM-DD') : null)
          }
        />
      </div>
      {loadingOrders ? (
        <div className='loading3 row justify-content-center'>
          <img alt='loading' src='loading.gif' />
          <p className='text-center'>Cargando...</p>
        </div>
      ) : (
        <>
          {orders.length > 0 ? (
            <div>
              <h1 className='title'>
                {orders.length} Pedido{orders.length > 1 && 's'}
              </h1>
              <div>
                <div className='row'>
                  <div className='col-md-12'>
                    <h1 className='date-label'>Formas de pago</h1>
                  </div>
                  {paymentTypes.map(({ name, ordersQuantity, totalNeto }, index) => (
                    <div key={`tipopago-${index}`} className='col-md-3'>
                      <h3 className='nomargin subtitulo'>{name}</h3>
                      <h1 className='nomargin'>
                        {ordersQuantity} Pedido{ordersQuantity > 1 && 's'}
                      </h1>
                      <h1 className='nomargin'>Total neto:</h1>
                      <h1 className='monto'>
                        ${Intl.NumberFormat(['ban', 'id']).format(totalNeto)}
                      </h1>
                    </div>
                  ))}
                </div>

                <Table bordered hover size='sm' striped>
                  <thead>
                    <tr>
                      <th>FOLIO</th>
                      <th>PRODUCTOS</th>
                      <th>FECHA</th>
                      <th>DTE</th>
                      <th>NETO</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, ipe) => {
                      return (
                        <tr key={ipe}>
                          <td>{order.folio}</td>
                          <td>{order.Detalle.length}</td>
                          <td>{order.fecha}</td>
                          <td>{order.Adicional.Uno}</td>
                          <td>
                            {Intl.NumberFormat(['ban', 'id']).format(order.Encabezado.MontoNeto)}
                          </td>
                          <td>
                            <Button onClick={() => setOrderSelected(order)}>
                              Ver Detalle
                            </Button>
                            {/*
                              <Dropdown>
                                <Dropdown.Toggle
                                  className='no-caret'
                                  id='dropdown-basic'
                                  size='sm'
                                  variant='outline-primary'
                                >
                                  <i class='fas fa-ellipsis-v'></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item >
                                    Ver detalle
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => _handleSendOrder(order._id)}>
                                    Entregar
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            */}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          ) : (
            <h1 className='text-empty text-center'>SIN PEDIDOS ENCONTRADOS</h1>
          )}
        </>
      )}
      <PedidoDetalleModal
        open={Boolean(orderSelected)}
        pedido={orderSelected}
        state={state}
        onClose={() => setOrderSelected(null)}
        onSendOrder={_handleSendOrder}
      />
    </div>
  )
}

export { TablePedidos }
