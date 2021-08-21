/* eslint-disable react/jsx-handler-names */
import { Button, Modal, Table } from 'react-bootstrap'
import propTypes from 'prop-types'

const PedidoDetalleModal = ({ onClose, open, pedido = {}, onSendOrder:_handleSendOrder, state }) => {
  return (
    <Modal centered show={open} onHide={onClose}>
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
                <>
                  <tr key={ide}>
                    <td>{detalle.codigo}</td>
                    <td>{detalle.nombre}</td>
                    <td>{detalle.Cantidad}</td>
                    <td>{detalle.precio}</td>
                  </tr>
                  <tr></tr>
                </>
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
