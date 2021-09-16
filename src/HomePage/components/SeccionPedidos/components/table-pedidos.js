/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import '../../styles.scss'
import '../../../../styles/app.scss'
import { Button, Table } from 'react-bootstrap'
import PedidoDetalleModal from '../../pedido-detalle-modal'
import { toast } from 'react-toastify'

const TablePedidos = props => {
  const { orders = [], onRefresh: _handleRefresh } = props
  const [orderSelected, setOrderSelected] = useState(null)
  const [paymentTypes, setPaymentTypes] = useState([])
  const toastStyle = { position: toast.POSITION.TOP_CENTER }

  const _handleSendOrder = async () => {
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
        _handleRefresh()
        return
      })
      .catch(error => {
        toast.error('Ocurrió un problema al entregar este pedido', toastStyle)
      })
  }

  useEffect(() => {
    if (orders) {
      const payments = orders.reduce((accPayments, order, index) => {
        const payIndex = accPayments.findIndex(({ name }) => name === order.Adicional.Nueve)
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
          name: order.Adicional.Nueve,
          ordersQuantity: 1,
          totalNeto: order.Encabezado.MontoNeto || 0,
        })
      }, [])
      setPaymentTypes(payments)
    }
  }, [orders])

  return (
    <div className='mt-4 div-table-pedidos'>
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
                  {/* <th>DTE</th> */}
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
                      {/*<td>{order.Adicional.Uno}</td> */}
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
      <PedidoDetalleModal
        open={Boolean(orderSelected)}
        pedido={orderSelected}
        state={orderSelected ? orderSelected.estado : ''}
        onClose={() => setOrderSelected(null)}
        onSendOrder={_handleSendOrder}
      />
    </div>
  )
}

export { TablePedidos }
