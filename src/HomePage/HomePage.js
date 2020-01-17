import React from 'react';
import { Link } from 'react-router-dom';
import ReactToPrint from 'react-to-print';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
})


class ComponentToPrint extends React.Component {

    mostrarCarrito() {
        if (this.props.carrito.length === 0) {
            return <h4>Sin productos en carrito</h4>
        }

        return (

            this.props.carrito.map((pro, i) => {
                return <tr key={i} >
                    <td><p id={i}>1 {pro.nombre}  </p></td><td className="tdright"><p>{formatter.format(pro.precio)} </p></td>
                </tr>
            })

        )
    }

    render() {

        let totalidad = this.props.carrito.reduce((prev, cur) => prev + parseInt(cur.precio), 0);
        let final = totalidad - (totalidad * parseInt(this.props.descuento) / 100);
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
                    <tbody style={{ borderTop: '1px solid black' }}>
                        {this.mostrarCarrito()}
                        <tr style={{ borderTop: '1px solid black' }}>
                            <td><p>SUBTOTAL</p></td>
                            <td className="tdright">{formatter.format(totalidad)} </td>
                        </tr>
                        <tr>
                            <td><p>DESCUENTO</p></td>
                            <td className="tdright">{formatter.format(descuentofinal)} </td>
                        </tr>
                        <tr>
                            <td><p>TOTAL</p></td>
                            <td className="tdright">{formatter.format(final)}</td>
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
            tipopago: "Cargando",
            datosempresa: "",
            curtime: new Date().toLocaleString(),
            token: JSON.parse(localStorage.getItem('user')),
            bodega: [{ 'id': 0, 'nombre': 'Cargando' }],
            formapago: [{ 'id': 0, 'nombre': 'Cargando' }],
            vendedores: [{ 'id': 0, 'nombre': 'Cargando' }],
            inputPago: "",
            inputBodega: "",
            inputVendedor: "",
            inputAreaNegocio: "",
            areaNegocio: [{ 'id': 0, 'nombre': 'Cargando' }],
            loading: true
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getDatosEmpresa(token) {

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
        return fetch('http://localhost:8000/producto', {
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


    getBodega(token) {
        return fetch('http://localhost:8000/bodega', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': token
            }
        })
            .then(bod => bod.json())
            .then(bod => {
                this.setState({ bodega: bod, inputBodega: bod[0].id })
            })
            .catch(error => {
                console.log(error);
            });
    }

    getTipoPago(token) {
        return fetch('http://localhost:8000/formaPago', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': token
            }
        })
            .then(pago => pago.json())
            .then(pago => {
                this.setState({ formapago: pago, inputPago: pago[0].id })
            })
            .catch(error => {
                console.log(error);
            });
    }

    getVendedores(token) {
        return fetch('http://localhost:8000/vendedores', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': token
            }
        })
            .then(vend => vend.json())
            .then(vend => {
                this.setState({ vendedores: vend, inputVendedor: vend[0].rut_vendedor })
            })
            .catch(error => {
                console.log(error);
            });
    }

    getAreaNegocio(token) {
        return fetch('http://localhost:8000/areaNegocio', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': token
            }
        })
            .then(area => area.json())
            .then(area => {
                this.setState({ areaNegocio: area, inputAreaNegocio: area[0].id })
            })
            .catch(error => {
                console.log(error);
            });
    }

    agregarCarrito(producto) {
        this.state.carrito.push(producto);
        this.setState({ carrito: this.state.carrito });
        localStorage.setItem('carrito', JSON.stringify(this.state.carrito));
    }

    mostrarCarrito() {
        if (this.state.carrito.length === 0) {
            return <h4>Sin productos en carrito</h4>
        }

        return (
            <div className="carrito">

                {this.state.carrito.map((pro, i) => {
                    return <div key={i} className="productos-unitario">
                        <a onClick={() => this.removerDelCarrito(i)} href="javascript:void(0)"><i className="fas fa-minus-circle"></i></a> <p id={i}>1 {pro.nombre}  </p><b>{formatter.format(pro.precio)} </b>
                    </div>
                })}


            </div>
        )
    }

    removerDelCarrito(posicion) {
        let carritoNew = this.state.carrito;

        var removed = carritoNew.splice(posicion, 1);

        this.setState({ carrito: carritoNew });
        localStorage.setItem('carrito', JSON.stringify(carritoNew));

    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        let tokenReceived = user.token;
        this.getProductos(tokenReceived);
        this.getDatosEmpresa(tokenReceived);
        this.getTipoPago(tokenReceived);
        this.getBodega(tokenReceived);
        this.getVendedores(tokenReceived);
        setInterval(() => {
            this.setState({
                curtime: new Date().toLocaleString()
            })
        }, 1000);


    }

    handleChange = event => {
        this.setState({ filter: event.target.value });
    };

    handleBodega = event => {
        this.setState({ inputBodega: event.target.value });
    };

    handleVendedor = event => {
        this.setState({ inputVendedor: event.target.value });
    };

    handleTipoPago = event => {
        this.setState({ inputPago: event.target.value });
    };

    handleAreaNegocio = event => {
        this.setState({ inputAreaNegocio: event.target.value });
    };



    handleVuelto = event => {
        let cashInput = 0;
        if (event.target.value !== "") {
            cashInput = event.target.value;
        }
        this.setState({ efectivo: cashInput });
    };


    handleSubmit = event => {


        event.preventDefault();
        let totalidad = this.state.carrito.reduce((prev, cur) => prev + parseInt(cur.precio), 0);
        let final = totalidad - (totalidad * parseInt(this.state.descuento) / 100);
        let detalle = this.state.carrito;
        detalle.forEach((obj) => obj.Descuento = "0");
        detalle.forEach((obj) => obj.Cantidad = "1");
        detalle.forEach((obj) => obj.Bodega = this.state.inputBodega);
        detalle.forEach((obj) => obj.Afecto = false);
        detalle.forEach((obj) => obj.Codigo = obj.codigo);
        let enviarBoleta = [
            {
                "Encabezado": {
                    "Receptor": "66666666-6",
                    "MontoNeto": final,
                    "Descuento": this.state.descuento,
                    "TipoDocumento": "39",
                    "AreaNegocio": this.state.inputAreaNegocio,
                    "Observacion": "observacion",
                    "Direccion": "123"
                },
                "Detalle": detalle,
                "Adicional": {
                    "Uno": this.state.inputPago,
                    "Dos": this.state.inputVendedor,
                    "Treinta": "123"
                }
            }
        ];

        let token = this.state.token.token;

        fetch('http://localhost:8000/boleta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': token
            },
            body: JSON.stringify({ enviarBoleta })
        })
            .then(pros => pros.json())
            .then(pros => {

                ///// REINICIAR CARRITO ///////

                this.inputElement.click();
                this.setState({ carrito: [] });
                localStorage.setItem('carrito', JSON.stringify(this.state.carrito));
                npm
            })
            .catch(error => {

                ///// GUARDAR BOLETA EN LA COLA DEL NAVEGADOR ///////
                this.state.cola.push(enviarBoleta);
                this.setState({ cola: this.state.cola });
                localStorage.setItem('cola', JSON.stringify(this.state.cola));

                ///// REINICIAR CARRITO ///////

                this.inputElement.click();
                this.setState({ carrito: [] });
                localStorage.setItem('carrito', JSON.stringify(this.state.carrito));
            });

    }

    handleDescuento = event => {
        let descuentofinal = 0;
        if (event.target.value === "") {
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
        let totalidad = this.state.carrito.reduce((prev, cur) => prev + parseInt(cur.precio), 0);
        let final = totalidad - (totalidad * parseInt(this.state.descuento) / 100);

        let vuelto = parseInt(this.state.efectivo) - final;


        const Renderizar = () => {

            if (this.state.loading) {
                return <h1 className="cargando">CARGANDO...</h1>
            }
            return (
                <div className="row">
                    <form onSubmit={this.handleSubmit}>
                        <div className="col-md-6 col-md-6">
                            <h2 className="titulocart">CARRITO</h2><Link style={{ float: "right", marginTop: -35 }} to="/login">Salir</Link>

                            <h4 className="contadorcart">{this.state.carrito.length} Productos</h4>
                            <p className="clear"></p>
                            {this.mostrarCarrito()}
                        </div>
                        <div className="col-md-6 col-md-6">
                            <h2>PRODUCTOS {JSON.stringify(this.state.prueba)} </h2>
                            <input placeholder="BUSCAR PRODUCTOS" className="form-control" value={filter} onChange={this.handleChange} />
                            <div className="contenedor-productos">
                                {productosFiltrados.map((info, i) => {
                                    return <div className="boxproducto" key={i} onClick={() => this.agregarCarrito(info)} key={i}><h4 className="left" > {info.nombre} </h4><p className="hide">{info.codigo} </p> <h4 className="right">{formatter.format(info.precio)} </h4></div>;
                                })}
                            </div>

                            <h3>TOTAL: {formatter.format(final)}</h3>

                            <div className="row">
                                <div className="col-md-6 col-md-6">

                                    <div className="form-group">
                                        <label className="form-label">TIPO DE PAGO</label>
                                        <select className="form-control" onChange={this.handleTipoPago}>
                                            {this.state.formapago.map(tipo => {
                                                return <option value={tipo.id}>{tipo.nombre}</option>
                                            })}
                                        </select>

                                    </div>

                                </div>

                                <div className="col-md-6 col-md-6">

                                    <div className="form-group">
                                        <label className="form-label">BODEGA</label>
                                        <select className="form-control" onChange={this.handleBodega}>
                                            {this.state.bodega.map(tipo => {
                                                return <option value={tipo.id}>{tipo.nombre}</option>
                                            })}
                                        </select>

                                    </div>

                                </div>

                                <div className="col-md-6 col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">VENDEDOR</label>
                                        <select className="form-control" onChange={this.handleVendedor}>
                                            {this.state.vendedores.map(tipo => {
                                                return <option value={tipo.rut_vendedor}>{tipo.nombre}</option>
                                            })}
                                        </select>

                                    </div>
                                </div>


                                <div className="col-md-6 col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Area Negocio</label>
                                        <select className="form-control" onChange={this.handleAreaNegocio}>
                                            {this.state.areaNegocio.map(tipo => {
                                                return <option value={tipo.id}>{tipo.nombre}</option>
                                            })}
                                        </select>

                                    </div>
                                </div>
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

                        </div>
                    </form>

                    <ReactToPrint
                        trigger={() => <a ref={input => this.inputElement = input} className="hide" href="javascript:void(0)">IMPRIMIR</a>}
                        content={() => this.componentRef}
                    />
                    <ComponentToPrint tiempo={this.state.curtime} datosempresa={this.state.datosempresa} tipopago={this.state.inputPago} descuento={this.state.descuento} carrito={this.state.carrito} ref={el => (this.componentRef = el)} />
                </div>
            );

        }

        return (
            <Renderizar />
        );
    }
}

export { HomePage };