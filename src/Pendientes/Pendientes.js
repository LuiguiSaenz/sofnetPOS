import React from 'react'
import { Link } from 'react-router-dom'

class Pendientes extends React.Component {
  constructor() {
    super()
    this.state = {
      cola: JSON.parse(localStorage.getItem('cola')),
      loading: true,
    }
  }

  mostrar() {
    if (this.state.loading) {
      return <h3>Cargando</h3>
    }

    return this.state.cola.map((item, i) => {
      return <p key={i}>BOLETA</p>
    })
  }

  render() {
    return (
      <div>
        <Link className='btn btn-primary' to='/'>
          VOLVER
        </Link>
        {this.mostrar()}
      </div>
    )
  }
}

export { Pendientes }
