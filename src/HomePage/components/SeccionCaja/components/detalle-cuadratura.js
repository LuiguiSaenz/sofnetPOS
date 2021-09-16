/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import cuadraturaService from '../../../../_services/cuadratura'
import '../../styles.scss'
import '../../../../styles/app.scss'
import { Button, Modal, Table } from 'react-bootstrap'
import moment from 'moment'
import PedidoDetalleModal from '../../pedido-detalle-modal'

const DetalleCuadratura = props => {
  const { tipoCuadratura = 'actual', cuadratura, onRefresh: _handleRefresh } = props
  const user = JSON.parse(localStorage.getItem('user'))
  const toastStyle = { position: toast.POSITION.TOP_CENTER }
  const [orders, setOrders] = useState([])
  const [orderSelected, setOrderSelected] = useState(null)
  const [paymentTypes, setPaymentTypes] = useState([])
  const [simpleProducts, setSimpleProducts] = useState([])
  const [variableProducts, setVariableProducts] = useState([])
  const [showModalAbrirCaja, setShowModalAbrirCaja] = useState(false)
  const [showModalCerrarCaja, setShowModalCerrarCaja] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loadingNew, setLoadingNew] = useState(false)
  const [newForm, setNewForm] = useState({
    responsable: '',
    monto_inicial: 0,
  })
  const [closeForm, setCloseForm] = useState({
    monto_final: 0,
    banco_deposito: false,
    monto_banco: 0,
  })

  useEffect(() => {
    if (cuadratura) {
      console.log(cuadratura, 'cuadratura')
      const fecha_inicial = moment(cuadratura.fecha_creacion).utc().format('YYYY-MM-DD HH:mm:ss')
      const fecha_final =
        cuadratura.estado === 'abierto'
          ? moment().utc().format('YYYY-MM-DD HH:mm:ss')
          : moment(cuadratura.fecha_cierre).utc().format('YYYY-MM-DD HH:mm:ss')

      cuadraturaService.getPedidos(user.rut, fecha_inicial, fecha_final).then(
        response => {
          console.log(response, 'response')
          setOrders(response)
        },
        error => {
          toast.error('Opps! No se pudo procesar la operación', toastStyle)
          setLoadingNew(false)
          this.setState({ error, loading: false })
        }
      )
    }
  }, [cuadratura])

  useEffect(() => {
    if (orders) {
      _handleGetPaymentTypes()
      _handleGetSimpleProducts()
      _handleGetVariableProducts()
    }
  }, [orders])

  const _handleGetVariableProducts = () => {
    const variableProductsFormatted = orders.reduce((accVariableProducts, order) => {
      const products = order.Detalle.filter(({ tipo }) => tipo === 'variable')
      if (products.length > 0) {
        products.forEach(product => {
          const productIndex = accVariableProducts.findIndex(({ _id }) => _id === product._id)
          if (productIndex !== -1) {
            const productSaved = accVariableProducts[productIndex]

            accVariableProducts.splice(productIndex, 1, {
              ...productSaved,
              quantity: productSaved.quantity + 1,
              subProductos: productSaved.subProductos.map((subProducto, subProductIndex) => {
                return {
                  ...subProducto,
                  opciones: subProducto.opciones.map((option, optionIndex) => {
                    return {
                      ...option,
                      cantidad:
                        option.cantidad +
                        (Number(product.opciones[subProductIndex].opciones[optionIndex].cantidad) ||
                          0),
                    }
                  }),
                }
              }),
            })
          } else {
            accVariableProducts.push({
              _id: product._id,
              name: product.titulo,
              codigo: product.codigo,
              quantity: 1,
              subProductos: product.opciones.map(subProducto => {
                return {
                  ...subProducto,
                  opciones: subProducto.opciones.map(option => ({
                    ...option,
                    cantidad: Number(option.cantidad) || 0,
                  })),
                }
              }),
            })
          }
        })
      }
      return accVariableProducts
    }, [])
    setVariableProducts(variableProductsFormatted)
  }

  const _handleGetSimpleProducts = () => {
    const simpleProductsFormatted = orders.reduce((accSimpleProducts, order) => {
      const products = order.Detalle.filter(({ tipo }) => tipo === 'simple')
      if (products.length > 0) {
        products.forEach(product => {
          const productIndex = accSimpleProducts.findIndex(({ _id }) => _id === product._id)
          if (productIndex !== -1) {
            accSimpleProducts.splice(productIndex, 1, {
              ...accSimpleProducts[productIndex],
              quantity: accSimpleProducts[productIndex].quantity + 1,
            })
          } else {
            accSimpleProducts.push({
              _id: product._id,
              name: product.titulo,
              codigo: product.codigo,
              quantity: 1,
            })
          }
        })
      }
      return accSimpleProducts
    }, [])
    setSimpleProducts(simpleProductsFormatted)
  }

  const _handleGetPaymentTypes = () => {
    const payments = orders.reduce((accPayments, order, index) => {
      const payIndex = accPayments.findIndex(({ name }) => name === order.Adicional.Nueve)
      if (payIndex !== -1) {
        const pay = accPayments[payIndex]
        accPayments.splice(payIndex, 1, {
          ...pay,
          ordersQuantity: pay.ordersQuantity + 1,
          totalNeto: pay.totalNeto + (Number(order.Encabezado.MontoNeto.$numberDouble) || 0),
        })
        return accPayments
      }

      return accPayments.concat({
        name: order.Adicional.Nueve,
        ordersQuantity: 1,
        totalNeto: Number(order.Encabezado.MontoNeto.$numberDouble) || 0,
      })
    }, [])
    setPaymentTypes(payments)
  }

  const _handleAbrirCuadratura = () => {
    setShowModalAbrirCaja(true)
  }

  const _handleShowCerrarCuadratura = () => {
    setShowModalCerrarCaja(true)
  }
  const _handleClose = () => {
    if (!loadingNew) {
      setNewForm({
        responsable: '',
        monto_inicial: 0,
      })
      setCloseForm({
        monto_final: 0,
        banco_deposito: false,
        monto_banco: 0,
      })
      setShowModalAbrirCaja(false)
      setShowModalCerrarCaja(false)
      setSubmitted(false)
    }
  }

  const _handleCrearCuadratura = () => {
    setSubmitted(true)
    if (!newForm.responsable || !newForm.monto_inicial) return
    setLoadingNew(true)
    cuadraturaService
      .create({
        ...newForm,
        propietario: user.rut,
        fecha_creacion: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
      .then(
        response => {
          setLoadingNew(false)
          _handleClose()
          _handleRefresh()
        },
        error => {
          toast.error('Opps! No se pudo procesar la operación', toastStyle)
          setLoadingNew(false)
          this.setState({ error, loading: false })
        }
      )
  }

  const _handleCerrarCuadratura = () => {
    setSubmitted(true)
    if (!closeForm.monto_final) return
    const amount = _handleCalculateMinimumAmount()
    if (Number(closeForm.monto_final) !== amount && !closeForm.banco_deposito) {
      toast.error(
        'Opps! El Monto Final es diferente a el Monto Inicial + Monto en Efectivo',
        toastStyle
      )
      return
    }
    if(closeForm.banco_deposito) {
      if (!closeForm.monto_banco) return
      if (Number(closeForm.monto_final) + Number(closeForm.monto_banco) !== amount) {
        toast.error(
          'Opps! El Monto Final + Monto Banco es diferente a el Monto Inicial + Monto en Efectivo',
          toastStyle
        )
        return
      }
    }

    setLoadingNew(true)
    cuadraturaService
      .close({
        ...closeForm,
        monto_banco: closeForm.banco_deposito ? closeForm.monto_banco : 0,
        fecha_cierre: moment().format('YYYY-MM-DD HH:mm:ss'),
        propietario: user.rut,
      })
      .then(
        response => {
          setLoadingNew(false)
          _handleClose()
          _handleRefresh()
        },
        error => {
          toast.error('Opps! No se pudo procesar la operación', toastStyle)
          setLoadingNew(false)
          this.setState({ error, loading: false })
        }
      )
  }

  const _handleCalculateMinimumAmount = () => {
    if (cuadratura) {
      const amount = orders.reduce((accAmount, order) => {
        if (order.Adicional.Nueve === 'Efectivo') {
          accAmount = accAmount + Number(order.Encabezado.MontoNeto.$numberDouble)
        }

        return accAmount
      }, 0)
      return Number(cuadratura.monto_inicial) + amount
    }
  }

  return (
    <div className='px-4 py-2'>
      <div className='row align-items-center'>
        <div className={`${tipoCuadratura === 'actual' ? 'col-lg-8' : 'col-lg-12'} col-md-12`}>
          {cuadratura && (
            <>
              <div className='d-lg-flex justify-content-between'>
                <h2>
                  <span className='text-bold'>Responsable:</span>&nbsp;&nbsp;{cuadratura.responsable}
                </h2>
                <h1>
                  <span className='text-bold'>Fecha de Creación:</span>&nbsp;&nbsp;
                  {moment(cuadratura.fecha_creacion).format('DD/MM/YYYY HH:mm')}
                </h1>
                {tipoCuadratura === 'last' && (
                  <h1>
                    <span className='text-bold'>Fecha de Cierre:</span> {moment(cuadratura.fecha_cierre).format('DD/MM/YYYY HH:mm')}
                  </h1>
                )}
                {tipoCuadratura === 'actual' && (
                  <h1>
                    <span className='text-bold'>Monto Inicial:</span>&nbsp;&nbsp;S/.
                    {Intl.NumberFormat(['ban', 'id']).format(cuadratura.monto_inicial)}
                  </h1>
                )}
              </div>
              {tipoCuadratura === 'last' && (
                <div className='d-lg-flex justify-content-between'>
                  <h1>
                    <span className='text-bold'>Monto Inicial:</span>&nbsp;&nbsp;S/.
                    {Intl.NumberFormat(['ban', 'id']).format(cuadratura.monto_inicial)}
                  </h1>
                  <h1>
                    <span className='text-bold'>Monto Final:</span> S/.{Intl.NumberFormat(['ban', 'id']).format(cuadratura.monto_final)}
                  </h1>
                  <h1>
                    <span className='text-bold'>Monto Banco:</span> S/.{Intl.NumberFormat(['ban', 'id']).format(cuadratura.monto_banco.$numberDouble)}
                  </h1>
                </div>
                
              )}
            </>
          )}
        </div>
        {tipoCuadratura === 'actual' && (
          <div className='col-lg-4 col-md-12'>
            {cuadratura ? (
              <Button
                size='sm'
                style={{ float: 'right' }}
                variant='primary'
                onClick={_handleShowCerrarCuadratura}
              >
                CERRAR CUADRATURA
              </Button>
            ) : (
              <Button
                size='sm'
                style={{ float: 'right' }}
                variant='primary'
                onClick={_handleAbrirCuadratura}
              >
                ABRIR CUADRATURA
              </Button>
            )}
          </div>
        )}
      </div>

      {!cuadratura && <h1 className='text-empty text-center'>NO EXISTE CUADRATURA</h1>}
      {!!cuadratura && (
        <div>
          <h1 className='subtitle text-bold'>Formas de pago:</h1>
          <Table bordered hover size='sm' striped>
            <thead>
              <tr>
                <th>FORMA DE PAGO</th>
                <th>CANTIDAD</th>
                <th>MONTO TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {paymentTypes.map((paymentType, index) => {
                return (
                  <tr key={`order-${index}`}>
                    <td>{paymentType.name}</td>
                    <td>{paymentType.ordersQuantity}</td>
                    <td>S/.{Intl.NumberFormat(['ban', 'id']).format(paymentType.totalNeto)}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      )}
      {!!cuadratura && (
        <div>
          <h1 className='subtitle text-bold'>Pedidos Vendidos:</h1>
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
                      S/.
                      {Intl.NumberFormat(['ban', 'id']).format(
                        order.Encabezado.MontoNeto.$numberDouble
                      )}
                    </td>
                    <td>
                      <Button onClick={() => setOrderSelected(order)}>Ver Detalle</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      )}
      {!!cuadratura && (
        <div className='row'>
          <div className='col-lg-6 col-md-12'>
            <h1 className='subtitle text-bold'>Productos Simples:</h1>
            <Table bordered hover size='sm' striped>
              <thead>
                <tr>
                  <th>CODIGO</th>
                  <th>NOMBRE</th>
                  <th>CANTIDAD</th>
                </tr>
              </thead>
              <tbody>
                {simpleProducts.map((product, index) => {
                  return (
                    <tr key={`product-simple-${index}`}>
                      <td>{product.codigo}</td>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
          <div className='col-lg-6 col-md-12'>
            <h1 className='subtitle text-bold'>Productos Variables:</h1>
            <Table bordered hover size='sm' striped>
              <thead>
                <tr>
                  <th>CODIGO</th>
                  <th>NOMBRE</th>
                  <th>CANTIDAD</th>
                </tr>
              </thead>
              <tbody>
                {variableProducts.map((product, index) => {
                  return (
                    <tr key={`product-variable-${index}`}>
                      <td>{product.codigo}</td>
                      <td>
                        <p className='producto-nombre-label'>{product.name}</p>
                        {product.subProductos.map((subProducto, subProductoIndex) => (
                          <div key={`subProducto-${subProductoIndex}`}>
                            <p className='producto-option'>- {subProducto.titulo}:&nbsp;&nbsp;</p>
                            {subProducto.opciones.map((option, indexOption) => (
                              <p
                                key={`option-${indexOption}`}
                                className='producto-option'
                                style={{ marginLeft: 20 }}
                              >
                                . {option.titulo}: {option.cantidad}
                              </p>
                            ))}
                          </div>
                        ))}
                      </td>
                      <td>{product.quantity}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </div>
      )}
      <Modal show={showModalAbrirCaja} onHide={_handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ABRIR CUADRATURA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Ingrese la siguiente información:</p>
          <form>
            <div className='form-group'>
              <label
                className={`${submitted && !newForm.responsable ? 'text-error' : ''}`}
                htmlFor='responsable'
              >
                Responsable
              </label>
              <input
                className={`form-control ${submitted && !newForm.responsable ? 'input-error' : ''}`}
                name='responsable'
                type='text'
                value={newForm.responsable}
                onChange={e =>
                  setNewForm(prevForm => {
                    return {
                      ...prevForm,
                      responsable: e.target.value,
                    }
                  })
                }
              />
              {submitted && !newForm.responsable && (
                <div className='text-error'>El campo Responsable es requerido</div>
              )}
            </div>
            <div className='form-group'>
              <label
                className={`${submitted && !newForm.monto_inicial ? 'text-error' : ''}`}
                htmlFor='monto_inicial'
              >
                Monto Inicial
              </label>
              <input
                className={`form-control ${
                  submitted && !newForm.monto_inicial ? 'input-error' : ''
                }`}
                name='monto_inicial'
                type='number'
                value={newForm.monto_inicial}
                onChange={e =>
                  setNewForm(prevForm => {
                    return {
                      ...prevForm,
                      monto_inicial: e.target.value,
                    }
                  })
                }
              />
              {submitted && !newForm.monto_inicial && (
                <div className='text-error'>El campo Monto Inicial es requerido</div>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loadingNew} variant='primary' onClick={_handleClose}>
            Cerrar
          </Button>
          <Button
            disabled={loadingNew}
            variant='success'
            // eslint-disable-next-line react/jsx-handler-names
            onClick={!loadingNew ? _handleCrearCuadratura : null}
          >
            {loadingNew ? 'Loading…' : 'Abrir'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalCerrarCaja} onHide={_handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>CERRAR CUADRATURA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Ingrese la siguiente información:</p>
          <form>
            <div className='form-group'>
              <label
                className={`${submitted && !closeForm.monto_final ? 'text-error' : ''}`}
                htmlFor='monto_final'
              >
                Monto Final
              </label>
              <input
                className={`form-control ${
                  submitted && !closeForm.monto_final ? 'input-error' : ''
                }`}
                name='Monto Final'
                type='number'
                value={closeForm.monto_final}
                onChange={e =>
                  setCloseForm(prevForm => {
                    return {
                      ...prevForm,
                      monto_final: e.target.value,
                    }
                  })
                }
              />
              <div className='text-error'>(Monto Inicial + Monto en Efectivo)</div>
            </div>
            <div className='form-group mt-2'>
              <input
                class='form-check-input'
                id='flexCheckDefault'
                type='checkbox'
                value={closeForm.banco_deposito}
                onChange={e =>
                  setCloseForm(prevForm => {
                    return {
                      ...prevForm,
                      banco_deposito: e.target.checked,
                    }
                  })
                }
              />
              <label class='form-check-label' htmlFor='flexCheckDefault'>
                &nbsp;&nbsp;Depósito en el banco
              </label>
            </div>
            {closeForm.banco_deposito && (
              <div className='form-group mt-2'>
                <label
                  className={`${submitted && !closeForm.monto_banco ? 'text-error' : ''}`}
                  htmlFor='monto_banco'
                >
                  Monto Banco
                </label>
                <input
                  className={`form-control ${
                    submitted && !closeForm.monto_banco ? 'input-error' : ''
                  }`}
                  name='Monto Banco'
                  type='number'
                  value={closeForm.monto_banco}
                  onChange={e =>
                    setCloseForm(prevForm => {
                      return {
                        ...prevForm,
                        monto_banco: e.target.value,
                      }
                    })
                  }
                />
                {submitted && !closeForm.monto_banco && closeForm.banco_deposito && (
                  <div className='text-error'>El campo Monto Banco es requerido</div>
                )}
              </div>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loadingNew} variant='primary' onClick={_handleClose}>
            Cerrar
          </Button>
          <Button
            disabled={loadingNew}
            variant='success'
            // eslint-disable-next-line react/jsx-handler-names
            onClick={!loadingNew ? _handleCerrarCuadratura : null}
          >
            {loadingNew ? 'Loading…' : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <PedidoDetalleModal
        open={Boolean(orderSelected)}
        pedido={orderSelected}
        state={''}
        onClose={() => setOrderSelected(null)}
      />
    </div>
  )
}

export { DetalleCuadratura }
