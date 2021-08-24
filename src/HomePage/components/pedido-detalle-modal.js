/* eslint-disable react/jsx-handler-names */
import { Button, Modal, Table } from 'react-bootstrap'
import propTypes from 'prop-types'
import './styles.scss'

const PedidoDetalleModal = ({
  onClose,
  open,
  pedido = {},
  onSendOrder: _handleSendOrder,
  state,
}) => {
  return (
    <Modal centered show={open} size='lg' onHide={onClose}>
      <Modal.Header>
        <Modal.Title>Productos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered hover size='sm' striped>
          <thead>
            <tr>
              <th>CODIGO</th>
              <th>NOMBRE</th>
              <th>CANTIDAD</th>
              <th>PRECIO</th>
            </tr>
          </thead>
          <tbody>
            {pedido?.Detalle?.map((detalle, ide) => {
              return (
                <tr key={ide}>
                  <td>{detalle.codigo}</td>
                  <td>
                    <p className='producto-nombre-label'>
                      {detalle.nombre} <span>({detalle.tipo})</span>
                    </p>
                    {detalle.tipo === 'variable' && (
                      <>
                        {detalle.opciones.map((subProducto, index) => (
                          <div key={`subProducto-${index}`}>
                            <p className='producto-option'>
                              - {subProducto.cantidad} {subProducto.titulo}
                              {subProducto.cantidad > 1 && 's'}:&nbsp;&nbsp;
                              {subProducto.opciones
                                .filter(({ cantidad }) => cantidad && cantidad > 0)
                                .map((option, indexOption) => (
                                  <span key={`option-${indexOption}`}>
                                    {indexOption !== 0 && ' / '}{option.cantidad} {option.titulo}
                                  </span>
                                ))}
                            </p>
                          </div>
                        ))}
                      </>
                    )}
                  </td>
                  <td>{detalle.Cantidad}</td>
                  <td>{detalle.precio}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={onClose}>
          Atrás
        </Button>
        {state === 'generado' && (
          <Button variant='success' onClick={_handleSendOrder}>
            Entregar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}
PedidoDetalleModal.propTypes = {
  open: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  products: propTypes.arrayOf(propTypes.shape({})),
}

export default PedidoDetalleModal
