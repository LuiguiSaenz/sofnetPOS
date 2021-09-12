const cuadraturaService = {
  getActual,
  getLast,
  create,
  close,
  getPedidos
}

async function getActual(rut) {
  const requestOptions = {
    method: 'GET',
  }

  return fetch(`https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/nupy-cfbnr/service/restaurant/incoming_webhook/web_GetActualCuadratura?propietario=${rut}`, requestOptions)
    .then(cuadratura => cuadratura.json())
    .then(cuadratura => {
      return cuadratura
    })
}

async function getLast(rut) {
  const requestOptions = {
    method: 'GET',
  }

  return fetch(`https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/nupy-cfbnr/service/restaurant/incoming_webhook/web_GetUltimaCuadratura?propietario=${rut}`, requestOptions)
    .then(cuadratura => cuadratura.json())
    .then(cuadratura => {
      return cuadratura
    })
}

async function create(body) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body)
  }

  return fetch(`https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/nupy-cfbnr/service/restaurant/incoming_webhook/web_CrearCuadratura`, requestOptions)
    .then(cuadratura => cuadratura.json())
    .then(cuadratura => {
      return cuadratura
    })
}

async function getPedidos(rut, fechaInicial, fechaFinal) {

  return fetch(
    `https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/nupy-cfbnr/service/restaurant/incoming_webhook/web_GetPedidosByRange?propietario=${rut}&fecha_inicial=${fechaInicial}&fecha_final=${fechaFinal}`
  )
    .then(res => res.json())
    .then(pedidos => {
      return pedidos
    })
    .catch(error => {})
}

async function close(body) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body)
  }

  return fetch(`https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/nupy-cfbnr/service/restaurant/incoming_webhook/web_CerrarCuadratura`, requestOptions)
    .then(cuadratura => cuadratura.json())
    .then(cuadratura => {
      return cuadratura
    })
}

export default cuadraturaService