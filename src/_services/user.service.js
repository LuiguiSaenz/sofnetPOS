// import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout
};

function login(username, password, rut) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({ username, password, rut })
    }; 

    return fetch(`http://apitest.softnet.cl/login`, requestOptions)
        .then(user => user.json())
        .then(user => {
            // login successful if there's a user in the response
            if (user.token) {
                // store user details and basic auth credentials in local storage 
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('carrito', JSON.stringify([]));
            }

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('carrito');
    localStorage.removeItem('productos');
}
