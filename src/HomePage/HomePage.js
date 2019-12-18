import React from 'react';
import { Link } from 'react-router-dom';




class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productos: [],
            carrito: JSON.parse(localStorage.getItem('carrito')),
            filter: ""
        };
    }

    getProductos(token) {
        this.setState({loading: true})
        return fetch('https://webhooks.mongodb-stitch.com/api/client/v2.0/app/restaurants-tkppo/service/POS/incoming_webhook/productos', {
            method: 'GET'
        })
        .then(pros => pros.json())
        .then(pros => {
            localStorage.setItem('productos', JSON.stringify(pros));
            this.setState({ productos: pros, loading: false })
        })
        .catch(error => {
           // console.log(error);
        });
    }

    agregarCarrito(producto){
        this.state.carrito.push(producto);
        this.setState({carrito: this.state.carrito});
        localStorage.setItem('carrito', JSON.stringify(this.state.carrito));
    }

    mostrarCarrito(){
        if(this.state.carrito.length == 0){
            return <h4>Sin productos en carrito</h4>
        }
        return(
            <div>
                
                {this.state.carrito.map((pro, i) => {
                    return <li key={i}>{pro.nombre}  </li>
                })}
            </div>
        )
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        this.getProductos(user.token);
    }

    handleChange = event => {
        this.setState({ filter: event.target.value });
      };

    render() {
        const { filter, productos } = this.state;
        const lowercasedFilter = filter.toLowerCase();
    const productosFiltrados = productos.filter(item => {
      return Object.keys(item).some(key =>
        item[key].toString().toLowerCase().includes(lowercasedFilter)
      );
    });

        return (
            <div className="row">

<div className="col-md-6 col-md-6">
<h1>Carrito</h1>
                {this.mostrarCarrito()}
            </div>
            <div className="col-md-6 col-md-6">
                <h1>Productos </h1>
                <input placeholder="BUSCAR PRODUCTOS" className="form-control" value={filter} onChange={this.handleChange} />
                {productosFiltrados.map((info, i) => {
            return <div className="boxproducto" key={i} onClick={() => this.agregarCarrito(info)} key={i}><h4 className="left" > {info.nombre} </h4> <h4 className="right">${info.precio} </h4></div>;
        })}
                <p>
                    <Link to="/login">Salir</Link>
                </p>
            </div>
            </div>
        );
    }
}

export { HomePage };