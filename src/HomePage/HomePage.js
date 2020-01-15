import React from 'react';
import { Link } from 'react-router-dom';
import ReactToPrint from 'react-to-print';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })


  class ComponentToPrint extends React.Component {

    mostrarCarrito(){
        if(this.props.carrito.length === 0){
            return <h4>Sin productos en carrito</h4>
        }

        return(
                
                this.props.carrito.map((pro, i) => {
                    return <tr key={i} >
                        <td><p id={i}>1 {pro.nombre}  </p></td><td className="tdright"><p>{formatter.format(pro.precio)} </p></td>
                        </tr>
                })

        )
    }

    render() {

        let totalidad = this.props.carrito.reduce((prev, cur) => prev+parseInt(cur.precio), 0);
        let final = totalidad -  ( totalidad * parseInt(this.props.descuento) / 100);
        let descuentofinal = totalidad * this.props.descuento / 100;

      let tiempo = this.props.tiempo;

      return (
          <div>

              <div className="encabezadoboleta">
                  
                  <h4>{this.props.datosempresa.razon} </h4>
                  <p>{this.props.datosempresa.direccion} </p>
                  <p><b>RUT:</b> {this.props.datosempresa.rut_empresa} </p>
                  <p><b>GIRO:</b> {this.props.datosempresa.giro1} </p>
                  <p><b>FECHA:</b> {tiempo} </p>
              </div>
              <h4>COMPROBANTE DE VENTA</h4>
        <table>
          <thead>
            <th>PRODUCTO</th>
            <th className="tdright">PRECIO UNIDAD</th>
     
          </thead>
          <tbody style={{borderTop: '1px solid black'}}>
            {this.mostrarCarrito()}
            <tr style={{borderTop: '1px solid black'}}>
                <td><p>SUBTOTAL</p></td>
                <td className="tdright">{ formatter.format(totalidad) } </td>
            </tr>
            <tr>
                <td><p>DESCUENTO</p></td>
                <td className="tdright">{formatter.format(descuentofinal)} </td>
            </tr>
            <tr>
                <td><p>TOTAL</p></td>
                <td className="tdright">{ formatter.format(final) }</td>
            </tr>
            <tr>
                <td><p>TIPO DE PAGO</p></td>
                <td className="tdright"><p className="uppercase">{this.props.tipopago} </p></td>
            </tr>
          </tbody>
        </table>
        </div>
      );
    }
  }

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
            efectivo: 0,
            tipopago: "efectivo",
            datosempresa: "",
            curtime: new Date().toLocaleString(),
            token: JSON.parse(localStorage.getItem('user'))
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getDatosEmpresa(token){

        return fetch('http://apitest.softnet.cl/datoEmpresa', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': token
            }
        })
        .then(datosempresa => datosempresa.json())
        .then(datosempresa => {

            localStorage.setItem('business', JSON.stringify(datosempresa[0]));
            this.setState({ datosempresa: datosempresa[0] })
        })
        .catch(error => {
            console.log(error);
        });
    }
    
    getProductos(token) {
        this.setState({loading: true})
        return fetch('http://api.softnet.cl/productos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': token
            }
        })
        .then(pros => pros.json())
        .then(pros => {
            console.log(pros)
            localStorage.setItem('productos', JSON.stringify(pros));
            this.setState({ productos: pros, loading: false })
        })
        .catch(error => {
           console.log(error);
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
        this.getDatosEmpresa(user.token);
        setInterval( () => {
            this.setState({
              curtime : new Date().toLocaleString()
            })
          },1000);

          
    }

    handleChange = event => {
        this.setState({ filter: event.target.value });
      };


      handleTipoPago = event => {
        let tipofinal = event.target.value;
        this.setState({ tipopago: tipofinal });
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
        let detalle = this.state.carrito;
        detalle.forEach((obj) => obj.Descuento = "0");
        detalle.forEach((obj) => obj.Cantidad = "1");
        detalle.forEach((obj) => obj.Bodega = "1989");
        detalle.forEach((obj) => obj.Afecto = false);
        let enviarBoleta = [
            {
            "Encabezado": {
            "Receptor": "66666666-6",
            "MontoNeto": final,
            "Descuento": this.state.descuento,
            "TipoDocumento": "39",
            "AreaNegocio": "3609",
            "Observacion": "observacion",
            "Direccion": "123"
            },
            "Detalle": detalle,
            "Adicional": {
            "Uno": "4131",
            "Dos": "11111111-1",
            "Treinta": "123"
            }
            }
            ];

            console.log(enviarBoleta);

            let token = this.state.token.token;

            console.log(token)

            /*
        let enviarBoleta = {
            carrito: this.state.carrito,
            descuento: this.state.descuento,
            total: final
        }
        */
        
        fetch('http://api.softnet.cl/boleta', {
            method: 'POST',
            headers: {    
            'Content-Type': 'application/x-www-form-urlencoded', 
            'token': token  
        },
            body: JSON.stringify({ enviarBoleta })
        })
        .then(pros => pros.json())
        .then(pros => {
            
        console.log(pros)
        ///// REINICIAR CARRITO ///////

        this.inputElement.click();
        this.setState({carrito: []});
        localStorage.setItem('carrito', JSON.stringify(this.state.carrito));

        })
        .catch(error => {
        
        ///// GUARDAR BOLETA EN LA COLA DEL NAVEGADOR ///////
        this.state.cola.push(enviarBoleta);
        this.setState({cola: this.state.cola});
        localStorage.setItem('cola', JSON.stringify(this.state.cola));

        ///// REINICIAR CARRITO ///////

        
        this.inputElement.click();
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
<h2 className="titulocart">CARRITO</h2><Link style={{ float: "right", marginTop: -35}} to="/login">Salir</Link>

<h4 className="contadorcart">{this.state.carrito.length} Productos</h4>
<p className="clear"></p>
                {this.mostrarCarrito()}
            </div>
            <div className="col-md-6 col-md-6">
                <h2>PRODUCTOS { JSON.stringify(this.state.prueba) } </h2>
                <input placeholder="BUSCAR PRODUCTOS" className="form-control" value={filter} onChange={this.handleChange} />
                <div className="contenedor-productos">
                {productosFiltrados.map((info, i) => {
            return <div className="boxproducto" key={i} onClick={() => this.agregarCarrito(info)} key={i}><h4 className="left" > {info.nombre} </h4><p className="hide">{info.codigo} </p> <h4 className="right">{formatter.format(info.precio)} </h4></div>;
        })}
        </div>

        <h3>TOTAL: {formatter.format(final)}</h3>
        <div className="form-group"> 
        <label className="form-label">TIPO DE PAGO</label>
        <select className="form-control" onChange={this.handleTipoPago}>
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
        <input placeholder= "DESCUENTO" className="form-control" onChange={this.handleDescuento} />
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
                
            </div>
            </form>

            <ReactToPrint
          trigger={() => <a ref={input => this.inputElement = input} className="hide" href="javascript:void(0)">IMPRIMIR</a>}
          content={() => this.componentRef}
        />
        <ComponentToPrint tiempo={this.state.curtime} datosempresa={this.state.datosempresa} tipopago={this.state.tipopago} descuento={this.state.descuento} carrito={this.state.carrito} ref={el => (this.componentRef = el)} />
            </div>
        );
    }
}

export { HomePage };