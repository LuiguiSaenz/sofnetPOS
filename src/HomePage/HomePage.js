import React from 'react';
import { Link } from 'react-router-dom';


const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productos: [],
            carrito: JSON.parse(localStorage.getItem('carrito')),
            filter: "",
            descuento: 0,
            montofinal: 0,
            cola: JSON.parse(localStorage.getItem('cola')),
            efectivo: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
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
        if(this.state.carrito.length === 0){
            return <h4>Sin productos en carrito</h4>
        }

        return(
            <div className="carrito">
                
                {this.state.carrito.map((pro, i) => {
                    return <div key={i} className="productos-unitario">
                        <a onClick={() => this.removerDelCarrito(i)} href="javascript:void(0)"><i className="fas fa-minus-circle"></i></a> <p id={i}>1 {pro.nombre}  </p><b>{formatter.format(pro.precio)} </b>
                        </div>
                })}

                
            </div>
        )
    }

    removerDelCarrito(posicion){
        let carritoNew = this.state.carrito;

        var removed = carritoNew.splice(posicion,1);

        this.setState({carrito: carritoNew});
        localStorage.setItem('carrito', JSON.stringify(carritoNew));
        
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        this.getProductos(user.token);
    }

    handleChange = event => {
        this.setState({ filter: event.target.value });
      };

      handleVuelto = event => {
          let cashInput = 0;
          if(event.target.value !== ""){
            cashInput = event.target.value;
          }
        this.setState({ efectivo: cashInput });
      };


    handleSubmit = event => {

        event.preventDefault();
        let totalidad = this.state.carrito.reduce((prev, cur) => prev+parseInt(cur.precio), 0);
        let final = totalidad -  ( totalidad * parseInt(this.state.descuento) / 100);

        let enviarBoleta = {
            carrito: this.state.carrito,
            descuento: this.state.descuento,
            total: final
        }
        
        fetch('https://webhooks.mongodb-stitch.com/api/client/v2.0/app/restaurants-tkppo/service/POS/incoming_webhook/productos', {
            method: 'GET'
        })
        .then(pros => pros.json())
        .then(pros => {
            

        ///// REINICIAR CARRITO ///////

        this.setState({carrito: []});
        localStorage.setItem('carrito', JSON.stringify(this.state.carrito));


        })
        .catch(error => {
        
        ///// GUARDAR BOLETA EN LA COLA DEL NAVEGADOR ///////
        this.state.cola.push(enviarBoleta);
        this.setState({cola: this.state.cola});
        localStorage.setItem('cola', JSON.stringify(this.state.cola));

        ///// REINICIAR CARRITO ///////

        this.setState({carrito: []});
        localStorage.setItem('carrito', JSON.stringify(this.state.carrito));

        });
        
      }

    handleDescuento = event => {
        let descuentofinal = 0;
        if(event.target.value === ""){
            descuentofinal = 0;
        } else {
            descuentofinal = event.target.value;
        }
        this.setState({ descuento: descuentofinal });
      };

    render() {

        ////////// VALORES ///////////
    const { filter, productos } = this.state;
    const lowercasedFilter = filter.toLowerCase();
    const productosFiltrados = productos.filter(item => {
      return Object.keys(item).some(key =>
        item[key].toString().toLowerCase().includes(lowercasedFilter)
      );
    });
    let totalidad = this.state.carrito.reduce((prev, cur) => prev+parseInt(cur.precio), 0);
    let final = totalidad -  ( totalidad * parseInt(this.state.descuento) / 100);
    
    let vuelto = parseInt(this.state.efectivo) - final;
    
    
    return (
            <div className="row">
<form onSubmit={this.handleSubmit}>
<div className="col-md-6 col-md-6">
<h2 className="titulocart">CARRITO</h2>
<h4 className="contadorcart">{this.state.carrito.length} Productos</h4>
<p className="clear"></p>
                {this.mostrarCarrito()}
            </div>
            <div className="col-md-6 col-md-6">
                <h2>PRODUCTOS </h2>
                <input placeholder="BUSCAR PRODUCTOS" className="form-control" value={filter} onChange={this.handleChange} />
                <div className="contenedor-productos">
                {productosFiltrados.map((info, i) => {
            return <div className="boxproducto" key={i} onClick={() => this.agregarCarrito(info)} key={i}><h4 className="left" > {info.nombre} </h4> <h4 className="right">{formatter.format(info.precio)} </h4></div>;
        })}
        </div>

        <h3>TOTAL: {formatter.format(final)}</h3>
        <div className="form-group"> 
        <label className="form-label">TIPO DE PAGO</label>
        <select className="form-control">
                <option value="efectivo">EFECTIVO</option>
                <option value="debito">DEBITO</option>
                <option value="credito">CRÉDITO</option>
        </select>
        </div>

        <div className="form-group"> 
        <label className="form-label">TIPO DE DOCUMENTO</label>
        <select className="form-control">
                <option value="BOLETA SIMPLE">BOLETA SIMPLE</option>
                <option value="BOLETA DETALLE">BOLETA DETALLE</option>
                <option value="FACTURA">FACTURA</option>
        </select>
        </div>

        <div className="form-group"> 
        <label className="form-label">DESCUENTO - Porcentaje</label>
        <input placeholder="DESCUENTO" className="form-control" onChange={this.handleDescuento} />
        </div>


        <div className="col-medium">
            <label className="form-label">Monto a pagar</label>
            <input placeholder="MONTO" className="form-control" onChange={this.handleVuelto} />
        </div>

        <div className="col-medium">
            <label className="form-label">Vuelto</label>
            <input placeholder="VUELTO" className="form-control" value={formatter.format(vuelto)} />
        </div>
    
    
        <input className="btn btn-sucess" type="submit" value="FINALIZAR Y PAGAR" />
                <p>
                    <Link to="/login">Salir</Link>
                </p>
            </div>
            </form>
            </div>
        );
    }
}

export { HomePage };