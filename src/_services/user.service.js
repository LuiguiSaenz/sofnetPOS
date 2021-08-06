// import { authHeader } from '../_helpers';

export const userService = {
  login,
  logout,
}

function login(username, password, rut) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: JSON.stringify({ username, password, rut }),
  }

  return fetch(`http://api.softnet.cl/login`, requestOptions)
    .then(user => user.json())
    .then(user => {
      if (user.token) {
        user.rut = rut
        user.authdata = window.btoa(username + ':' + password)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('carrito', JSON.stringify([]))
        if (!localStorage.getItem('cola')) {
          localStorage.setItem('cola', JSON.stringify([]))
        }

        return user
      }

      return false
    })
}

// async function logearsoftnet(url, requestOptions) {
//   console.log(requestOptions)

//   return fetch(url, requestOptions)
//     .then(user => user.json())
//     .then(user => {
//       console.log(user)
//       if (user.token) {
//         localStorage.setItem('user', JSON.stringify(user))
//         localStorage.setItem('carrito', JSON.stringify([]))
//         if (!localStorage.getItem('cola')) {
//           localStorage.setItem('cola', JSON.stringify([]))
//         }

//         return user
//       }

//       return false
//     })
//     .catch(error => {
//       console.log('error')
//       return false
//     })
// }
// async function loginx(username, password) {
//   return fetch(
//     `https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/nupy-cfbnr/service/restaurant/incoming_webhook/pos_login?email=${username}&password=${password}`
//   )
//     .then(res => res.json())
//     .then(async res => {
//       if (res.length < 1) {
//         return false
//       }

//       let usuario = res[0]
//       let rut = usuario.credenciales.rut
//       let username = usuario.credenciales.usuario
//       let password = usuario.credenciales.password

//       console.log(usuario)
//       const requestOptions = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: JSON.stringify({ username, password, rut }),
//       }

//       const logear = await this.logearsoftnet('http://api.softnet.cl/login', requestOptions)
//       console.log(logear)
//       return logear
//     })
//     .catch(error => {
//       return false
//     })
// }

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
  localStorage.removeItem('carrito')
  localStorage.removeItem('productos')
}
