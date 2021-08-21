import React from 'react'

class ComponentToPrint extends React.Component {
  showhide() {
    if (this.props.show) {
      return ''
    }

    return 'hide'
  }

  hideIfBoletaSimple() {
    if (this.props.tipodocumento.toUpperCase() === 'BOLETA SIMPLE') {
      return 'hide'
    }
    return ''
  }

  mostrarCarrito() {
    if (this.props.carrito.length === 0) {
      return (
        <tr>
          <td>
            <h4>Sin productos en carrito</h4>
          </td>
        </tr>
      )
    }

    return this.props.carrito.map((pro, i) => {
      return (
        <tr key={i} className={this.hideIfBoletaSimple()}>
          <td>
            <p id={i}>1 {pro.nombre} </p>
          </td>
          <td className='tdright'>
            <p>${Intl.NumberFormat(['ban', 'id']).format(pro.precio)} </p>
          </td>
        </tr>
      )
    })
  }

  render() {
    let totalidad = this.props.carrito.reduce((prev, cur) => prev + parseInt(cur.precio), 0)
    let final = totalidad - (totalidad * parseInt(this.props.descuento)) / 100
    let descuentofinal = (totalidad * this.props.descuento) / 100

    let tiempo = this.props.tiempo

    return (
      <div
        className={this.showhide()}
        id='boletaimprimir'
        style={{ background: 'white', marginBottom: 30 }}
      >
        <div className='encabezadoboleta'>
          <h4>{this.props.datosempresa.razon} </h4>
          <p>{this.props.datosempresa.direccion} </p>
          <p>
            <b>RUT:</b> {this.props.datosempresa.rut_empresa}{' '}
          </p>
          <p>
            <b>GIRO:</b> {this.props.datosempresa.giro1}{' '}
          </p>
          <p>
            <b>FECHA:</b> {tiempo}{' '}
          </p>
        </div>
        <h4>BOLETA ELECTRÓNICA · FOLIO {this.props.folio}</h4>
        <table>
          <thead>
            <tr className={this.hideIfBoletaSimple()}>
              <th style={{ textAlign: 'left' }}>PRODUCTO</th>
              <th className='tdright'>PRECIO UNIDAD</th>
            </tr>
          </thead>
          <tbody style={{ borderTop: '1px solid black' }}>
            {this.mostrarCarrito()}
            <tr style={{ borderTop: '1px solid black' }}>
              <td>
                <p>MONTO NETO</p>
              </td>
              <td className='tdright'>
                ${Intl.NumberFormat(['ban', 'id']).format((totalidad / 1.19).toFixed(0))}{' '}
              </td>
            </tr>
            <tr>
              <td>
                <p>IVA</p>
              </td>
              <td className='tdright'>
                $
                {Intl.NumberFormat(['ban', 'id']).format(
                  Math.round(((totalidad / 1.19) * 19) / 100)
                )}{' '}
              </td>
            </tr>
            <tr>
              <td>
                <p>DESCUENTO</p>
              </td>
              <td className='tdright'>
                ${Intl.NumberFormat(['ban', 'id']).format(descuentofinal)}{' '}
              </td>
            </tr>
            <tr>
              <td>
                <p>MONTO TOTAL</p>
              </td>
              <td className='tdright'>${Intl.NumberFormat(['ban', 'id']).format(final)}</td>
            </tr>
            {/*<tr>
                            <td><p>TIPO DE PAGO</p></td>
                            <td className="tdright"><p className="uppercase">{this.props.tipopago} </p></td>
                        </tr> */}
          </tbody>
        </table>
        <div>
          <img
            alt='Timbre Fiscal'
            className='timbrefiscal'
            src={`data:image/png;base64, ${this.props.timbre}`}
          />
          <p style={{ textAlign: 'center', fontSize: 12, margin: 0 }}>
            Timbre Electrónico S.I.I. · Verifique Documento: http://www.sii.cl
          </p>
          <hr />
          <hr />
        </div>
      </div>
    )
  }
}

export { ComponentToPrint }
